import prisma from '../config/db.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { buyer: { select: { name: true } } }
    });
    res.json(reviews.map(r => ({ ...r, buyerName: r.buyer.name })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

export const createReview = async (req, res) => {
  try {
    const { farmerId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: {
        buyerId: req.user.id,
        farmerId,
        rating: Number(rating),
        comment,
      },
      include: { buyer: { select: { name: true } } }
    });

    // Notify farmer
    await prisma.notification.create({
      data: {
        userId: farmerId,
        type: 'general',
        text: `You received a new ${rating}-star review`,
      }
    });

    res.status(201).json({ ...review, buyerName: review.buyer.name });
  } catch (err) {
    res.status(500).json({ message: 'Error creating review' });
  }
};
