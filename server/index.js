import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
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
        const { email, password, name, role } = req.body;

        if (!['CUSTOMER', 'MAKER'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: { email, passwordHash, name, role }
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
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
        res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- CUSTOMER API ---
app.post('/api/customer/requests', verifyToken, async (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Only customers can create requests' });
    try {
        const { title, description, budget, images } = req.body;
        const request = await prisma.request.create({
            data: { customerId: req.user.id, title, description, budget, images: JSON.stringify(images) }
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

        const order = await prisma.order.create({
            data: { quoteId: quote.id, totalPrice: quote.price, status: 'IN_PROGRESS' }
        });
        await prisma.quote.update({ where: { id: quote.id }, data: { status: 'ACCEPTED' } });
        await prisma.request.update({ where: { id: quote.requestId }, data: { status: 'IN_PROGRESS' } });
        res.json(order);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
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
        const { requestId, price, message, proposedTimeline } = req.body;
        const quote = await prisma.quote.create({
            data: { makerId: req.user.id, requestId, price, message, proposedTimeline }
        });
        await prisma.request.update({ where: { id: requestId }, data: { status: 'QUOTED' } });
        res.status(201).json(quote);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/maker/orders', verifyToken, async (req, res) => {
    if (req.user.role !== 'MAKER') return res.status(403).json({ error: 'Forbidden' });
    try {
        const orders = await prisma.order.findMany({
            where: { quote: { makerId: req.user.id } },
            include: { quote: { include: { request: true } }, milestones: true }
        });
        res.json(orders);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
