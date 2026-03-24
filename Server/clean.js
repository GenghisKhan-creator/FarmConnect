import prisma from './config/db.js';

async function main() {
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  console.log('Cleaned orphans');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
