import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedPhase4() {
    // Get all makers
    const makers = await prisma.user.findMany({ where: { role: 'MAKER' } });
    // Get all customers
    const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });

    if (makers.length === 0) {
        console.log('No makers found, skipping phase4 seed.');
        return;
    }

    // --- Seed Reviews ---
    console.log('Seeding reviews...');
    const reviewData = [
        { rating: 5, comment: "Absolutely stunning work! The teak dining table is a masterpiece. Highly recommend." },
        { rating: 4, comment: "Great craftsmanship, delivered on time. Minor finishing issue but was fixed promptly." },
        { rating: 5, comment: "Beautiful bookshelf, exactly as discussed. Very professional communication throughout." },
        { rating: 5, comment: "Outstanding quality! The custom wardrobe fits perfectly. Will order again." },
        { rating: 4, comment: "Solid work and fair pricing. The sheesham wood bed frame is gorgeous." },
        { rating: 3, comment: "Good quality but took longer than expected. Final product looks nice though." },
        { rating: 5, comment: "Incredible attention to detail. The carved headboard is a work of art!" },
        { rating: 4, comment: "Very happy with the TV unit. Modern design with traditional craftsmanship." },
    ];

    // Create fake orders first, then reviews
    for (let i = 0; i < Math.min(reviewData.length, makers.length * 2); i++) {
        const maker = makers[i % makers.length];
        const customer = customers.length > 0 ? customers[i % customers.length] : null;
        if (!customer) continue;

        const orderId = `seed-order-${i}-${Date.now()}`;
        try {
            await prisma.review.create({
                data: {
                    orderId,
                    customerId: customer.id,
                    makerId: maker.id,
                    rating: reviewData[i].rating,
                    comment: reviewData[i].comment,
                }
            });
        } catch (e) { /* skip duplicates */ }
    }
    console.log(`  Created up to ${reviewData.length} reviews.`);

    // --- Seed Portfolio Items ---
    console.log('Seeding portfolio items...');
    const portfolioData = [
        { caption: "Custom Teak Dining Table", category: "Living Room", imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop" },
        { caption: "Sheesham Wood Bed Frame", category: "Bedroom", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop" },
        { caption: "Modern Office Desk", category: "Office", imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=400&fit=crop" },
        { caption: "Hand-carved Bookshelf", category: "Living Room", imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=400&fit=crop" },
        { caption: "Rustic Kitchen Cabinet", category: "Kitchen", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop" },
        { caption: "Walnut Wardrobe", category: "Bedroom", imageUrl: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&h=400&fit=crop" },
        { caption: "Garden Bench Set", category: "Outdoor", imageUrl: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=600&h=400&fit=crop" },
        { caption: "TV Entertainment Unit", category: "Living Room", imageUrl: "https://images.unsplash.com/photo-1615874694520-474f5b9b6942?w=600&h=400&fit=crop" },
        { caption: "Executive Boardroom Table", category: "Office", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop" },
        { caption: "Carved Temple Door", category: "Custom", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop" },
    ];

    for (let i = 0; i < portfolioData.length; i++) {
        const maker = makers[i % makers.length];
        try {
            await prisma.portfolioItem.create({
                data: {
                    makerId: maker.id,
                    imageUrl: portfolioData[i].imageUrl,
                    caption: portfolioData[i].caption,
                    category: portfolioData[i].category,
                }
            });
        } catch (e) { /* skip */ }
    }
    console.log(`  Created ${portfolioData.length} portfolio items.`);

    // --- Seed Notifications ---
    console.log('Seeding notifications...');
    const notifData = [
        { type: 'QUOTE_RECEIVED', title: 'New Quote Received', message: 'Rajesh Kumar submitted a ₹18,000 quote for your dining table request.' },
        { type: 'ORDER_UPDATE', title: 'Order Update', message: 'Your bookshelf order has moved to "In Progress" stage.' },
        { type: 'REVIEW', title: 'New Review', message: 'A customer left you a 5-star review! 🌟' },
        { type: 'MESSAGE', title: 'New Message', message: 'You have a new message from Amit regarding your wardrobe order.' },
    ];

    for (const user of [...makers.slice(0, 3), ...customers.slice(0, 2)]) {
        for (const notif of notifData) {
            try {
                await prisma.notification.create({
                    data: { userId: user.id, type: notif.type, title: notif.title, message: notif.message }
                });
            } catch (e) { /* skip */ }
        }
    }
    console.log('  Created notifications for users.');

    // --- Update some makers' availability ---
    if (makers.length >= 3) {
        await prisma.user.update({ where: { id: makers[1].id }, data: { availability: 'BUSY' } });
        await prisma.user.update({ where: { id: makers[2].id }, data: { availability: 'ON_VACATION' } });
    }
    console.log('  Updated maker availability statuses.');

    console.log('\n✅ Phase 4 seed complete!');
}

seedPhase4().catch(console.error).finally(() => prisma.$disconnect());
