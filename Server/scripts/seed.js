import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

const CATEGORIES = [
  'Maize', 'Millet', 'Rice', 'Groundnuts', 'Soybeans',
  'Shea Nuts', 'Vegetables', 'Livestock', 'Fruits', 'Yams'
];

const generateDummyData = async () => {
  try {
    console.log('Clearing database...');
    // We must delete in correct foreign-key order
    await prisma.review.deleteMany();
    await prisma.report.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    console.log('Hashing passwords...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    console.log('Seeding farmers...');
    const farmers = await Promise.all([
      prisma.user.create({
        data: {
          name: 'Kwame Mensah',
          email: 'kwame@farmer.com',
          password,
          phone: '0541234567',
          role: 'farmer',
          farmName: 'Mensah Farms',
          farmSize: '50 Acres',
          location: 'Tumu',
          district: 'Sissala East',
          region: 'Upper West',
          verified: true,
          plan: 'premium',
        }
      }),
      prisma.user.create({
        data: {
          name: 'Fatima Abdul',
          email: 'fatima@farmer.com',
          password,
          phone: '0249876543',
          role: 'farmer',
          farmName: 'Northern Harvest Co.',
          farmSize: '120 Acres',
          location: 'Tamale',
          district: 'Sagnarigu',
          region: 'Northern',
          verified: true,
          plan: 'free',
        }
      })
    ]);

    console.log('Seeding buyer...');
    await prisma.user.create({
      data: {
        name: 'Amina Traders',
        email: 'amina@trader.com',
        password,
        phone: '0205554444',
        role: 'buyer',
        businessName: 'Amina Wholesale',
        location: 'Accra',
        verified: true,
      }
    });

    console.log('Seeding admin...');
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@farmconnect.gh',
        password,
        phone: '0200000001',
        role: 'admin',
        plan: 'admin',
        verified: true,
      }
    });

    console.log('Seeding products...');
    await prisma.product.createMany({
      data: [
        {
          title: 'Premium White Maize',
          category: 'Maize',
          description: 'High-quality, dried white maize suitable for kenkey, banku, and industrial processing. Moisture content below 13%.',
          price: 350,
          unit: '100kg Bag',
          status: 'available',
          quantity: 500,
          deliveryAvailable: true,
          location: 'Tumu',
          premium: true,
          farmerId: farmers[0].id,
          views: 1240,
        },
        {
          title: 'Organic Soybeans',
          category: 'Soybeans',
          description: 'Non-GMO organic soybeans directly harvested this season. Perfect for poultry feed or soy milk production.',
          price: 450,
          unit: '100kg Bag',
          status: 'available',
          quantity: 200,
          deliveryAvailable: true,
          location: 'Tamale',
          premium: false,
          farmerId: farmers[1].id,
          views: 852,
        },
        {
          title: 'Fresh Pona Yams',
          category: 'Yams',
          description: 'Export-grade Pona yams straight from the farm. Minimum rot guarantee.',
          price: 15,
          unit: 'Tuber',
          status: 'available',
          quantity: 1000,
          deliveryAvailable: false,
          location: 'Tumu',
          premium: false,
          farmerId: farmers[0].id,
          views: 204,
        }
      ]
    });

    console.log('✅ Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Failed to seed DB:', error);
    process.exit(1);
  }
};

generateDummyData();
