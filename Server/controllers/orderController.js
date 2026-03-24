import prisma from '../config/db.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: req.user.role === 'farmer' ? { farmerId: req.user.id } : { buyerId: req.user.id },
      include: {
        product: { select: { title: true } },
        buyer: { select: { name: true } },
        farmer: { select: { name: true } },
      },
    });

    const mappedOrders = orders.map(o => ({
      ...o,
      productTitle: o.product.title,
      buyerName: o.buyer.name,
      farmerName: o.farmer.name,
    }));

    res.json(mappedOrders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { farmerId, productId, quantity, offerPrice, note } = req.body;
    const order = await prisma.order.create({
      data: {
        buyerId: req.user.id,
        farmerId,
        productId,
        quantity: Number(quantity),
        offerPrice: Number(offerPrice),
        note,
      },
      include: {
        product: { select: { title: true } },
        buyer: { select: { name: true } },
        farmer: { select: { name: true } },
      }
    });

    // Create notification for farmer
    await prisma.notification.create({
      data: {
        userId: farmerId,
        type: 'order',
        text: `You received a new order for ${order.product.title}`,
      }
    });

    res.status(201).json({
      ...order,
      productTitle: order.product.title,
      buyerName: order.buyer.name,
      farmerName: order.farmer.name,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating order' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { product: { select: { title: true } } }
    });

    // Notify opposite party
    const notifyId = req.user.id === order.farmerId ? order.buyerId : order.farmerId;
    await prisma.notification.create({
      data: {
        userId: notifyId,
        type: 'order',
        text: `Order for ${order.product.title} was marked as ${status}`,
      }
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order' });
  }
};
