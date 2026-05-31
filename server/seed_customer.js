import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('test', 10);
    await prisma.user.upsert({
        where: { email: 'testcustomer@kaari.com' },
        update: { isProfileComplete: true },
        create: {
            email: 'testcustomer@kaari.com',
            name: 'Test Customer',
            passwordHash,
            role: 'CUSTOMER',
            isProfileComplete: true
        }
    });
    console.log('Test customer seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());
