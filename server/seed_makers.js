import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const makers = [
    {
        name: 'Vikram Sahai', email: 'vikram@kaari.com', password: 'test1234',
        profileDetails: 'Master Woodworker — 15 years experience in teak & sheesham furniture',
        bio: 'Third-generation woodworker from Old Delhi. Learned the craft from my grandfather. I believe furniture should tell a story — every joint, every grain pattern is chosen with purpose.',
        phone: '+91 98111 23456', city: 'Delhi',
        shopName: 'Sahai & Sons Wood Craft', shopAddress: 'Shop 12, Nai Sarak, Chandni Chowk, Delhi 110006',
        licenseNumber: 'GST: 07AABCS1234F1Z5', yearsExperience: 15,
        materials: 'Teak,Sheesham,Walnut,Rosewood', workingHours: 'Mon–Sat, 9:00 AM – 7:00 PM',
        deliveryRadius: '30 km', latitude: 28.6329, longitude: 77.2195
    },
    {
        name: 'Suresh Carpenter', email: 'suresh@kaari.com', password: 'test1234',
        profileDetails: 'Modern minimalist furniture specialist — custom kitchens & wardrobes',
        bio: 'I work on clean lines and space-efficient designs. Specializing in modular kitchens, walk-in wardrobes, and contemporary living room sets.',
        phone: '+91 98112 34567', city: 'Delhi',
        shopName: 'Suresh Modern Interiors', shopAddress: 'A-45, Kirti Nagar Furniture Market, Delhi 110015',
        licenseNumber: 'GST: 07AABCS5678G1Z9', yearsExperience: 10,
        materials: 'MDF,Plywood,Engineered Wood,Laminate', workingHours: 'Mon–Sat, 10:00 AM – 8:00 PM',
        deliveryRadius: '25 km', latitude: 28.5921, longitude: 77.2307
    },
    {
        name: 'Anil Lohar', email: 'anil@kaari.com', password: 'test1234',
        profileDetails: 'Metal & wood fusion artisan — industrial style furniture',
        bio: 'Started as a blacksmith, now I combine wrought iron and reclaimed wood to create industrial-chic furniture. Coffee tables, bookshelves, and dining sets are my forte.',
        phone: '+91 99103 45678', city: 'Delhi',
        shopName: 'Lohar Iron & Wood Works', shopAddress: 'G-22, Panchkuian Road, Karol Bagh, Delhi 110001',
        licenseNumber: 'UDYAM-DL-08-0012345', yearsExperience: 12,
        materials: 'Wrought Iron,Reclaimed Wood,Steel,Copper Accents', workingHours: 'Mon–Fri, 9:30 AM – 6:30 PM',
        deliveryRadius: '40 km', latitude: 28.6517, longitude: 77.1850
    },
    {
        name: 'Ramesh Vishwakarma', email: 'ramesh@kaari.com', password: 'test1234',
        profileDetails: 'Traditional Indian carving expert — temple doors & antique restoration',
        bio: 'I carry forward the ancient Vishwakarma tradition of woodcarving. My speciality is intricate jharokha-style windows, temple mandapa carvings, and antique furniture restoration.',
        phone: '+91 98765 87654', city: 'Delhi',
        shopName: 'Vishwakarma Heritage Crafts', shopAddress: 'Shop 8, Lajpat Rai Market, Delhi 110006',
        licenseNumber: 'GST: 07AABCV9012H1Z3', yearsExperience: 25,
        materials: 'Sandalwood,Teak,Burma Teak,Deodar', workingHours: 'Mon–Sat, 8:00 AM – 6:00 PM',
        deliveryRadius: '50 km', latitude: 28.5745, longitude: 77.2490
    },
    {
        name: 'Deepak Kumar', email: 'deepak@kaari.com', password: 'test1234',
        profileDetails: 'Upholstery & sofa specialist — premium fabrics & leather',
        bio: 'From Chesterfield sofas to custom recliners, I specialize in seating comfort. I source fabrics from Panipat and leathers from Kanpur for authentic quality.',
        phone: '+91 88001 23456', city: 'Delhi',
        shopName: 'Kumar Premium Seating', shopAddress: 'B-12, South Extension Part II, Delhi 110049',
        licenseNumber: 'GST: 07AABCK3456I1Z7', yearsExperience: 8,
        materials: 'Italian Leather,Velvet,Linen,Foam,Jute Webbing', workingHours: 'Tue–Sun, 11:00 AM – 8:00 PM',
        deliveryRadius: '20 km', latitude: 28.6190, longitude: 77.1720
    },
    // --- Kanpur Makers ---
    {
        name: 'Rajendra Yadav', email: 'rajendra@kaari.com', password: 'test1234',
        profileDetails: 'Heritage furniture restorer — 20 years in colonial & vintage pieces',
        bio: 'I breathe life into old furniture. My workshop handles everything from Victorian era desks to Mughal-style cabinets. Every restoration respects the original design.',
        phone: '+91 94151 12345', city: 'Kanpur',
        shopName: 'Yadav Restoration House', shopAddress: 'Near Phool Bagh, Civil Lines, Kanpur 208001',
        licenseNumber: 'GST: 09AABCY1234J1Z1', yearsExperience: 20,
        materials: 'Burma Teak,Oak,Mahogany,Shellac Polish', workingHours: 'Mon–Sat, 9:00 AM – 6:00 PM',
        deliveryRadius: '35 km', latitude: 26.4499, longitude: 80.3319
    },
    {
        name: 'Mohd Irfan', email: 'irfan@kaari.com', password: 'test1234',
        profileDetails: 'Master cabinet maker — modular kitchens & built-in wardrobes',
        bio: 'Engineering precision meets carpentry. I design modular kitchens with soft-close hardware and water-resistant finishes. Free 3D design consultation included.',
        phone: '+91 94152 23456', city: 'Kanpur',
        shopName: 'Irfan Modular Kitchen Studio', shopAddress: '14/120, Mall Road, Kanpur 208004',
        licenseNumber: 'GST: 09AABCI5678K1Z5', yearsExperience: 11,
        materials: 'BWP Plywood,Acrylic,PVC Laminates,ACP Sheets', workingHours: 'Mon–Sat, 10:00 AM – 7:00 PM',
        deliveryRadius: '25 km', latitude: 26.4610, longitude: 80.3500
    },
    {
        name: 'Santosh Prajapati', email: 'santosh@kaari.com', password: 'test1234',
        profileDetails: 'Bamboo & cane furniture artisan — eco-friendly living solutions',
        bio: 'Sustainable furniture is the future. I work with bamboo, cane, and rattan to create beautiful living room and garden furniture that is kind to the planet.',
        phone: '+91 94153 34567', city: 'Kanpur',
        shopName: 'Green Living Bamboo Crafts', shopAddress: 'Shastri Nagar, GT Road, Kanpur 208005',
        licenseNumber: 'UDYAM-UP-09-0054321', yearsExperience: 14,
        materials: 'Bamboo,Rattan,Cane,Banana Fiber,Jute', workingHours: 'Mon–Sat, 8:30 AM – 5:30 PM',
        deliveryRadius: '40 km', latitude: 26.4380, longitude: 80.3120
    },
    {
        name: 'Pradeep Gupta', email: 'pradeep@kaari.com', password: 'test1234',
        profileDetails: 'Luxury bed & dining table specialist — solid wood & marble inlay',
        bio: 'I create furniture that becomes family heirlooms. My dining tables and four-poster beds use only AAA-grade timber with hand-cut marble inlay work.',
        phone: '+91 94154 45678', city: 'Kanpur',
        shopName: 'Gupta Premium Furnishings', shopAddress: 'Swaroop Nagar, Kanpur 208002',
        licenseNumber: 'GST: 09AABCG9012L1Z9', yearsExperience: 18,
        materials: 'Teak,Sheesham,Marble,Mother of Pearl,Brass', workingHours: 'Mon–Fri, 9:00 AM – 6:00 PM',
        deliveryRadius: '30 km', latitude: 26.4720, longitude: 80.3680
    },
    {
        name: 'Kailash Vishwakarma', email: 'kailash@kaari.com', password: 'test1234',
        profileDetails: 'Temple woodwork & pooja mandir expert — intricate jali & carving',
        bio: 'Dedicated to sacred craftsmanship. I design and build custom pooja mandirs, temple doors, and decorative jali panels. Every piece is hand-carved and blessed before delivery.',
        phone: '+91 94155 56789', city: 'Kanpur',
        shopName: 'Kailash Sacred Wood Art', shopAddress: 'Near Bithoor Road, Kanpur 208024',
        licenseNumber: 'GST: 09AABCK3456M1Z3', yearsExperience: 22,
        materials: 'Sandalwood,Teak,Deodar,Gold Leaf,Copper', workingHours: 'Mon–Sat, 7:00 AM – 5:00 PM',
        deliveryRadius: '60 km', latitude: 26.4550, longitude: 80.2950
    },
];

async function seed() {
    for (const m of makers) {
        const hashedPassword = await bcrypt.hash(m.password, 10);
        try {
            await prisma.user.upsert({
                where: { email: m.email },
                update: {
                    bio: m.bio,
                    phone: m.phone,
                    city: m.city,
                    shopName: m.shopName,
                    shopAddress: m.shopAddress,
                    licenseNumber: m.licenseNumber,
                    yearsExperience: m.yearsExperience,
                    materials: m.materials,
                    workingHours: m.workingHours,
                    deliveryRadius: m.deliveryRadius,
                    isProfileComplete: true,
                },
                create: {
                    name: m.name,
                    email: m.email,
                    passwordHash: hashedPassword,
                    role: 'MAKER',
                    profileDetails: m.profileDetails,
                    bio: m.bio,
                    phone: m.phone,
                    city: m.city,
                    shopName: m.shopName,
                    shopAddress: m.shopAddress,
                    licenseNumber: m.licenseNumber,
                    yearsExperience: m.yearsExperience,
                    materials: m.materials,
                    workingHours: m.workingHours,
                    deliveryRadius: m.deliveryRadius,
                    latitude: m.latitude,
                    longitude: m.longitude,
                    isProfileComplete: true,
                }
            });
            console.log(`Upserted maker: ${m.name}`);
        } catch (e) {
            console.error(`Error with ${m.name}:`, e.message);
        }
    }
    console.log('Done seeding makers!');
    await prisma.$disconnect();
}

seed();
