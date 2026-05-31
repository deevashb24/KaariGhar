import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const customer = await prisma.user.findFirst({ where: { email: 'testcustomer@kaari.com' } });

    await prisma.request.create({
        data: {
            customerId: customer.id,
            title: 'Custom Luxury Bed',
            description: 'I am looking for a beautifully crafted bed inspired by the reference images.',
            specs: JSON.stringify({ category: 'Bed', length: '78', width: '60', height: '36', wood: 'Sheesham Grade-A', storage: 'Hydraulic lift', budget: '₹50,000 – ₹1,00,000', notes: 'Need it ASAP.' }),
            budget: 60000,
            attachments: JSON.stringify([
                'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=80',
                'https://www.instagram.com/p/something'
            ]),
            aiInsights: '✨ **AI Crafting Insights:**\n- **Project Focus:** High-quality Bed using Sheesham Grade-A.\n- **Customer Priority:** Durability and exact dimensions.\n- **Storage Requirement:** Hydraulic lift.\n- **References Provided:** 3 references attached.\nMake sure to review the provided links or images if any!'
        }
    });
    console.log('Seeded rich request.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
