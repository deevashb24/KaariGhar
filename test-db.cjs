const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || "postgresql://postgres:Kymde6-hinjeh-tihwid@db.ogwwlkhaiicjvpphjmdg.supabase.co:5432/postgres?schema=kaarighar"
    }
  }
});
async function main() {
  console.log("Connecting...");
  try {
    const user = await prisma.user.findFirst();
    console.log("Success:", user);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
