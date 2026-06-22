import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'kaarighar-super-secret-key-change-me-in-prod';

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'KaariGhar API is running' });
});

// Middleware to verify JWT tokens
export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// --- AUTH API ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role, phone, city } = req.body;

        let assignedRole = role;
        if (email && email.toLowerCase() === 'admin@kaarighar.com') {
            assignedRole = 'ADMIN';
        }

        if (!['CUSTOMER', 'MAKER', 'ADMIN'].includes(assignedRole)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: { email, passwordHash, name, role: assignedRole, phone: phone || null, city: city || null }
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, isProfileComplete: user.isProfileComplete } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, isProfileComplete: user.isProfileComplete } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- CUSTOMER API ---
app.post('/api/customer/requests', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Only customers can create requests' });
    try {
        const { title, description, specs, budget, attachments, aiInsights, category, roomType, styleMood, spaceSize, budgetRange } = req.body;
        const request = await prisma.request.create({
            data: {
                customerId: req.user.id,
                title,
                description,
                category,
                roomType,
                styleMood,
                spaceSize,
                budgetRange,
                specs: specs ? JSON.stringify(specs) : null,
                budget,
                attachments: attachments ? JSON.stringify(attachments) : null,
                aiInsights
            }
        });
        res.status(201).json(request);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/customer/requests', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const requests = await prisma.request.findMany({
            where: { customerId: req.user.id },
            include: { quotes: { include: { maker: { select: { id: true, name: true, email: true } } } } }
        });
        res.json(requests);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/customer/quotes/:id/accept', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const quote = await prisma.quote.findUnique({ where: { id: req.params.id }, include: { request: true } });
        if (!quote || quote.request.customerId !== req.user.id) return res.status(404).json({ error: 'Quote not found' });

        const amt1 = Math.round(quote.price * 0.3);
        const amt2 = Math.round(quote.price * 0.4);
        const amt3 = quote.price - amt1 - amt2;

        const order = await prisma.order.create({
            data: {
                quoteId: quote.id,
                totalPrice: quote.price,
                status: 'IN_PROGRESS',
                milestones: {
                    create: [
                        { title: 'Raw Material Arrival', description: 'Photo-verified proof of material procurement', amount: amt1, status: 'PENDING' },
                        { title: 'Frame Completion', description: 'Structural assembly verified with photos', amount: amt2, status: 'PENDING' },
                        { title: 'Finishing & Delivery', description: 'Polish, finishing touches, and delivery scheduling', amount: amt3, status: 'PENDING' }
                    ]
                }
            },
            include: { milestones: true }
        });

        await prisma.quote.update({ where: { id: quote.id }, data: { status: 'ACCEPTED' } });
        await prisma.request.update({ where: { id: quote.requestId }, data: { status: 'IN_PROGRESS' } });

        await prisma.notification.create({
            data: { userId: quote.makerId, type: 'ORDER_UPDATE', title: 'Quote Accepted!', message: `Your quote for "${quote.request.title}" of ₹${quote.price} has been accepted.` }
        });

        res.json(order);
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: 'Server error' }); 
    }
});

// GET customer orders
app.get('/api/customer/orders', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const orders = await prisma.order.findMany({
            where: { quote: { request: { customerId: req.user.id } } },
            include: {
                quote: {
                    include: {
                        request: true,
                        maker: {
                            select: { id: true, name: true, email: true, shopName: true, verificationLevel: true, isGstVerified: true, isIdVerified: true, isShopVerified: true }
                        }
                    }
                },
                milestones: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Maker Upload Milestone Photo Proof
app.post('/api/maker/orders/:orderId/milestones/:milestoneId/upload', verifyToken, async (req, res) => {
    if (req.user.role !== 'MAKER') return res.status(403).json({ error: 'Forbidden' });
    const { photoUrl } = req.body;
    if (!photoUrl) return res.status(400).json({ error: 'photoUrl is required' });

    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.orderId },
            include: { quote: true }
        });
        if (!order || order.quote.makerId !== req.user.id) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const updatedMilestone = await prisma.milestone.update({
            where: { id: req.params.milestoneId },
            data: {
                photoUrl,
                photoUploadedAt: new Date(),
                photoVerified: false,
                isDisputed: false,
                disputeReason: null
            }
        });

        const reqDetail = await prisma.request.findFirst({
            where: { quotes: { some: { order: { id: req.params.orderId } } } }
        });

        await prisma.notification.create({
            data: {
                userId: reqDetail.customerId,
                type: 'ORDER_UPDATE',
                title: 'Progress Photo Uploaded',
                message: `Maker uploaded progress proof for "${updatedMilestone.title}" on your order.`
            }
        });

        res.json(updatedMilestone);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Customer Verify Milestone Photo
app.post('/api/customer/orders/:orderId/milestones/:milestoneId/verify', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const milestone = await prisma.milestone.findUnique({
            where: { id: req.params.milestoneId },
            include: { order: { include: { quote: { include: { request: true } } } } }
        });
        if (!milestone || milestone.order.quote.request.customerId !== req.user.id) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const updatedMilestone = await prisma.milestone.update({
            where: { id: req.params.milestoneId },
            data: {
                photoVerified: true,
                status: 'COMPLETED',
                isDisputed: false,
                disputeReason: null
            }
        });

        await prisma.notification.create({
            data: {
                userId: milestone.order.quote.makerId,
                type: 'ORDER_UPDATE',
                title: 'Photo Proof Approved',
                message: `Customer approved the progress photo for "${milestone.title}"!`
            }
        });

        res.json(updatedMilestone);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Customer Dispute Milestone
app.post('/api/customer/orders/:orderId/milestones/:milestoneId/dispute', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: 'Reason is required' });

    try {
        const milestone = await prisma.milestone.findUnique({
            where: { id: req.params.milestoneId },
            include: { order: { include: { quote: { include: { request: true } } } } }
        });
        if (!milestone || milestone.order.quote.request.customerId !== req.user.id) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const updatedMilestone = await prisma.milestone.update({
            where: { id: req.params.milestoneId },
            data: {
                isDisputed: true,
                disputeReason: reason,
                photoVerified: false
            }
        });

        await prisma.notification.create({
            data: {
                userId: milestone.order.quote.makerId,
                type: 'ORDER_UPDATE',
                title: 'Milestone Disputed',
                message: `Customer raised a dispute on "${milestone.title}". Reason: ${reason}`
            }
        });

        res.json(updatedMilestone);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Customer Release Milestone Payment
app.post('/api/customer/orders/:orderId/milestones/:milestoneId/release', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const milestone = await prisma.milestone.findUnique({
            where: { id: req.params.milestoneId },
            include: { order: { include: { quote: { include: { request: true } } } } }
        });
        if (!milestone || milestone.order.quote.request.customerId !== req.user.id) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const updatedMilestone = await prisma.milestone.update({
            where: { id: req.params.milestoneId },
            data: {
                status: 'PAID',
                isDisputed: false,
                disputeReason: null
            }
        });

        const order = await prisma.order.findUnique({
            where: { id: milestone.orderId },
            include: { milestones: true, quote: true }
        });
        const allPaid = order.milestones.every(m => m.status === 'PAID');
        if (allPaid) {
            await prisma.order.update({
                where: { id: order.id },
                data: { status: 'COMPLETED' }
            });
            await prisma.request.update({
                where: { id: order.quote.requestId },
                data: { status: 'COMPLETED' }
            });

            const makerId = order.quote.makerId;
            const completedOrders = await prisma.order.findMany({
                where: { quote: { makerId }, status: 'COMPLETED' }
            });
            const allOrders = await prisma.order.findMany({
                where: { quote: { makerId } }
            });
            const totalJobs = completedOrders.length;
            const compRate = allOrders.length > 0 ? (totalJobs / allOrders.length) * 100 : 100;

            await prisma.user.update({
                where: { id: makerId },
                data: {
                    totalJobsCompleted: totalJobs,
                    completionRate: Math.round(compRate * 10) / 10
                }
            });

            await prisma.notification.create({
                data: {
                    userId: makerId,
                    type: 'ORDER_UPDATE',
                    title: 'Order Completed! 🎉',
                    message: `Congratulations! Your order for "${order.quote.request.title}" is fully completed and paid.`
                }
            });
        }

        await prisma.notification.create({
            data: {
                userId: milestone.order.quote.makerId,
                type: 'ORDER_UPDATE',
                title: 'Payment Released',
                message: `Milestone payment of ₹${milestone.amount.toLocaleString('en-IN')} has been released.`
            }
        });

        res.json(updatedMilestone);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- MAKER API ---
app.get('/api/maker/requests', verifyToken, async (req, res) => {
    if (req.user.role !== 'MAKER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const requests = await prisma.request.findMany({
            where: { status: 'OPEN' },
            include: { customer: { select: { id: true, name: true } } }
        });
        res.json(requests);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/maker/quotes', verifyToken, async (req, res) => {
    if (req.user.role !== 'MAKER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const { requestId, price, materialsCost, laborCost, hardwareCost, deliveryCost, gstAmount, warrantyTerms, message, proposedTimeline } = req.body;
        const request = await prisma.request.findUnique({ where: { id: requestId } });
        const quote = await prisma.quote.create({
            data: { makerId: req.user.id, requestId, price, materialsCost, laborCost, hardwareCost, deliveryCost, gstAmount, warrantyTerms, message, proposedTimeline }
        });
        await prisma.request.update({ where: { id: requestId }, data: { status: 'QUOTED' } });

        if (request) {
            await prisma.notification.create({
                data: { userId: request.customerId, type: 'QUOTE_RECEIVED', title: 'New Quote', message: `You received a new quote of ₹${price} for "${request.title}".` }
            });
        }

        res.status(201).json(quote);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/maker/orders', verifyToken, async (req, res) => {
    if (req.user.role !== 'MAKER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const orders = await prisma.order.findMany({
            where: { quote: { makerId: req.user.id } },
            include: {
                quote: {
                    include: {
                        request: {
                            include: {
                                customer: { select: { id: true, name: true, email: true, phone: true } }
                            }
                        }
                    }
                },
                milestones: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- MESSAGING API ---
app.post('/api/messages', verifyToken, async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const message = await prisma.message.create({
            data: { senderId: req.user.id, receiverId, content }
        });
        res.status(201).json(message);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/messages/:otherUserId', verifyToken, async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: req.user.id, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: req.user.id }
                ]
            },
            orderBy: { timestamp: 'asc' }
        });
        res.json(messages);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// --- MAP / DISCOVER API ---
app.get('/api/makers/nearby', verifyToken, async (req, res) => {
    try {
        const makers = await prisma.user.findMany({
            where: { role: 'MAKER' },
            select: { id: true, name: true, email: true, profileDetails: true, latitude: true, longitude: true, phone: true, city: true, shopName: true, materials: true, yearsExperience: true, availability: true, bio: true }
        });

        // Mock locations for demo purposes if they are missing
        // Base coordinate somewhere near New Delhi for example
        const baseLat = 28.6139;
        const baseLng = 77.2090;

        const makersWithLoc = await Promise.all(makers.map(async (m) => {
            if (!m.latitude || !m.longitude) {
                // Randomly disperse within roughly 50km radius
                const mockLat = baseLat + (Math.random() - 0.5) * 0.5;
                const mockLng = baseLng + (Math.random() - 0.5) * 0.5;

                // Save it back to DB so it persists
                await prisma.user.update({
                    where: { id: m.id },
                    data: { latitude: mockLat, longitude: mockLng }
                });

                return { ...m, latitude: mockLat, longitude: mockLng };
            }
            return m;
        }));

        res.json(makersWithLoc);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- PROFILE API ---
app.get('/api/profile', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, role: true, phone: true, city: true, bio: true, profileDetails: true, isProfileComplete: true, createdAt: true, shopName: true, shopAddress: true, licenseNumber: true, yearsExperience: true, materials: true, workingHours: true, deliveryRadius: true }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/profile', verifyToken, async (req, res) => {
    try {
        const { name, phone, city, bio, profileDetails, shopName, shopAddress, licenseNumber, yearsExperience, materials, workingHours, deliveryRadius } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(name && { name }),
                ...(phone !== undefined && { phone }),
                ...(city !== undefined && { city }),
                ...(bio !== undefined && { bio }),
                ...(profileDetails !== undefined && { profileDetails }),
                ...(shopName !== undefined && { shopName }),
                ...(shopAddress !== undefined && { shopAddress }),
                ...(licenseNumber !== undefined && { licenseNumber }),
                ...(yearsExperience !== undefined && { yearsExperience: yearsExperience ? parseInt(yearsExperience) : null }),
                ...(materials !== undefined && { materials }),
                ...(workingHours !== undefined && { workingHours }),
                ...(deliveryRadius !== undefined && { deliveryRadius }),
                isProfileComplete: true
            },
            select: { id: true, email: true, name: true, role: true, phone: true, city: true, bio: true, profileDetails: true, isProfileComplete: true, shopName: true, shopAddress: true, licenseNumber: true, yearsExperience: true, materials: true, workingHours: true, deliveryRadius: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- MAKER DETAIL ---
app.get('/api/makers/:id', async (req, res) => {
    try {
        const maker = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, name: true, email: true, phone: true, city: true, bio: true, profileDetails: true, createdAt: true, latitude: true, longitude: true, shopName: true, shopAddress: true, licenseNumber: true, yearsExperience: true, materials: true, workingHours: true, deliveryRadius: true }
        });
        if (!maker) return res.status(404).json({ error: 'Maker not found' });
        res.json(maker);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- CUSTOMER STATS ---
app.get('/api/customer/stats', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const totalRequests = await prisma.request.count({ where: { customerId: req.user.id } });
        const activeOrders = await prisma.request.count({ where: { customerId: req.user.id, status: 'IN_PROGRESS' } });
        const quoteCount = await prisma.quote.count({ where: { request: { customerId: req.user.id } } });
        const completedOrders = await prisma.request.findMany({
            where: { customerId: req.user.id, status: 'COMPLETED' },
            select: { budget: true }
        });
        const totalSpent = completedOrders.reduce((sum, r) => sum + (r.budget || 0), 0);
        res.json({ totalRequests, activeOrders, quotesReceived: quoteCount, totalSpent });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- ADMIN API ---
app.get('/api/admin/makers', verifyToken, async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    try {
        const makers = await prisma.user.findMany({
            where: { role: 'MAKER' },
            orderBy: { createdAt: 'desc' }
        });
        res.json(makers);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/makers/:id/verify', verifyToken, async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const { isGstVerified, isIdVerified, isShopVerified, verificationLevel } = req.body;
    try {
        const updated = await prisma.user.update({
            where: { id: req.params.id },
            data: {
                isGstVerified: isGstVerified !== undefined ? isGstVerified : undefined,
                isIdVerified: isIdVerified !== undefined ? isIdVerified : undefined,
                isShopVerified: isShopVerified !== undefined ? isShopVerified : undefined,
                verificationLevel: verificationLevel !== undefined ? verificationLevel : undefined
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/admin/disputes', verifyToken, async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    try {
        const disputes = await prisma.milestone.findMany({
            where: { isDisputed: true },
            include: {
                order: {
                    include: {
                        quote: {
                            include: {
                                maker: { select: { id: true, name: true, email: true } },
                                request: { include: { customer: { select: { id: true, name: true, email: true } } } }
                            }
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(disputes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/disputes/:milestoneId/resolve', verifyToken, async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const { resolution } = req.body;
    if (!['CUSTOMER', 'MAKER'].includes(resolution)) {
        return res.status(400).json({ error: 'Invalid resolution choice' });
    }

    try {
        const milestone = await prisma.milestone.findUnique({
            where: { id: req.params.milestoneId },
            include: { order: { include: { quote: true } } }
        });
        if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

        let updatedMilestone;
        if (resolution === 'MAKER') {
            updatedMilestone = await prisma.milestone.update({
                where: { id: req.params.milestoneId },
                data: {
                    status: 'PAID',
                    isDisputed: false,
                    disputeReason: null,
                    photoVerified: true
                }
            });

            const order = await prisma.order.findUnique({
                where: { id: milestone.orderId },
                include: { milestones: true, quote: true }
            });
            const allPaid = order.milestones.every(m => m.status === 'PAID');
            if (allPaid) {
                await prisma.order.update({ where: { id: order.id }, data: { status: 'COMPLETED' } });
                await prisma.request.update({ where: { id: order.quote.requestId }, data: { status: 'COMPLETED' } });
            }

            await prisma.notification.create({
                data: {
                    userId: milestone.order.quote.makerId,
                    type: 'ORDER_UPDATE',
                    title: 'Dispute Resolved',
                    message: `Admin resolved dispute on "${milestone.title}" in your favor. Payout of ₹${milestone.amount.toLocaleString('en-IN')} has been released.`
                }
            });
        } else {
            updatedMilestone = await prisma.milestone.update({
                where: { id: req.params.milestoneId },
                data: {
                    status: 'PENDING',
                    isDisputed: false,
                    disputeReason: null,
                    photoVerified: false,
                    photoUrl: null,
                    photoUploadedAt: null
                }
            });

            await prisma.notification.create({
                data: {
                    userId: milestone.order.quote.makerId,
                    type: 'ORDER_UPDATE',
                    title: 'Dispute Resolved',
                    message: `Admin resolved dispute on "${milestone.title}" in the customer's favor. Please upload a correct proof of progress.`
                }
            });
        }

        res.json(updatedMilestone);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- MAKER ANALYTICS ---
app.get('/api/maker/analytics', verifyToken, async (req, res) => {
    if (req.user.role !== 'MAKER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const paidMilestones = await prisma.milestone.findMany({
            where: { status: 'PAID', order: { quote: { makerId: req.user.id } } },
            select: { amount: true }
        });
        const totalEarnings = paidMilestones.reduce((sum, m) => sum + m.amount, 0);

        const lockedMilestones = await prisma.milestone.findMany({
            where: { status: { in: ['PENDING', 'COMPLETED'] }, order: { quote: { makerId: req.user.id } } },
            select: { amount: true }
        });
        const escrowPipeline = lockedMilestones.reduce((sum, m) => sum + m.amount, 0);

        const totalQuotes = await prisma.quote.count({ where: { makerId: req.user.id } });
        const acceptedQuotes = await prisma.quote.count({ where: { makerId: req.user.id, status: 'ACCEPTED' } });
        const rejectedQuotes = await prisma.quote.count({ where: { makerId: req.user.id, status: 'REJECTED' } });
        const pendingQuotes = await prisma.quote.count({ where: { makerId: req.user.id, status: 'PENDING' } });

        const completedOrders = await prisma.order.count({ where: { quote: { makerId: req.user.id }, status: 'COMPLETED' } });

        res.json({
            totalEarnings,
            escrowPipeline,
            quotesSent: totalQuotes,
            quotesAccepted: acceptedQuotes,
            quotesRejected: rejectedQuotes,
            quotesPending: pendingQuotes,
            completedOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- SEARCH MAKERS ---
app.get('/api/makers/search', async (req, res) => {
    try {
        const { q, city } = req.query;
        const where = { role: 'MAKER' };
        if (city) where.city = city;
        const makers = await prisma.user.findMany({
            where,
            select: { id: true, name: true, profileDetails: true, city: true, phone: true, shopName: true, materials: true, yearsExperience: true, latitude: true, longitude: true, availability: true, bio: true, email: true }
        });
        let results = makers;
        if (q) {
            const query = q.toLowerCase();
            results = makers.filter(m =>
                m.name.toLowerCase().includes(query) ||
                (m.profileDetails || '').toLowerCase().includes(query) ||
                (m.materials || '').toLowerCase().includes(query) ||
                (m.shopName || '').toLowerCase().includes(query)
            );
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- REVIEWS API ---
app.post('/api/reviews', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const { orderId, makerId, rating, comment } = req.body;
        if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
        const existing = await prisma.review.findUnique({ where: { orderId } });
        if (existing) return res.status(400).json({ error: 'Already reviewed' });
        const review = await prisma.review.create({
            data: { orderId, customerId: req.user.id, makerId, rating, comment }
        });
        // Auto-create notification for maker
        await prisma.notification.create({
            data: { userId: makerId, type: 'REVIEW', title: 'New Review', message: `You received a ${rating}-star review!`, link: '/maker' }
        });
        res.status(201).json(review);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/makers/:id/reviews', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { makerId: req.params.id },
            include: { customer: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
        res.json({ reviews, averageRating: Math.round(avg * 10) / 10, totalReviews: reviews.length });
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// --- FAVORITES API ---
app.post('/api/favorites/:makerId', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const { makerId } = req.params;
        const existing = await prisma.favorite.findUnique({
            where: { customerId_makerId: { customerId: req.user.id, makerId } }
        });
        if (existing) {
            await prisma.favorite.delete({ where: { id: existing.id } });
            res.json({ favorited: false });
        } else {
            await prisma.favorite.create({ data: { customerId: req.user.id, makerId } });
            res.json({ favorited: true });
        }
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/favorites', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const favorites = await prisma.favorite.findMany({
            where: { customerId: req.user.id },
            include: { maker: { select: { id: true, name: true, profileDetails: true, city: true, shopName: true, materials: true, yearsExperience: true, availability: true, bio: true, email: true, phone: true } } }
        });
        res.json(favorites.map(f => f.maker));
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// --- PORTFOLIO API ---
app.post('/api/portfolio', verifyToken, async (req, res) => {
    if (req.user.role !== 'MAKER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const { imageUrl, caption, category } = req.body;
        const item = await prisma.portfolioItem.create({
            data: { makerId: req.user.id, imageUrl, caption, category }
        });
        res.status(201).json(item);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/makers/:id/portfolio', async (req, res) => {
    try {
        const items = await prisma.portfolioItem.findMany({
            where: { makerId: req.params.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/portfolio/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'MAKER') return res.status(403).json({ error: 'Forbidden' });
    try {
        await prisma.portfolioItem.delete({ where: { id: req.params.id } });
        res.json({ deleted: true });
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// --- NOTIFICATIONS API ---
app.get('/api/notifications', verifyToken, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 30
        });
        const unreadCount = await prisma.notification.count({ where: { userId: req.user.id, read: false } });
        res.json({ notifications, unreadCount });
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/notifications/:id/read', verifyToken, async (req, res) => {
    try {
        await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/notifications/read-all', verifyToken, async (req, res) => {
    try {
        await prisma.notification.updateMany({ where: { userId: req.user.id, read: false }, data: { read: true } });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// --- MAKER AVAILABILITY ---
app.put('/api/maker/availability', verifyToken, async (req, res) => {
    if (req.user.role !== 'MAKER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const { availability } = req.body;
        if (!['AVAILABLE', 'BUSY', 'ON_VACATION'].includes(availability)) return res.status(400).json({ error: 'Invalid status' });
        const user = await prisma.user.update({ where: { id: req.user.id }, data: { availability } });
        res.json(user);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
