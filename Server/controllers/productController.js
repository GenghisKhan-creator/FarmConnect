import prisma from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        farmer: {
          select: { name: true, verified: true, farmName: true, banned: true },
        },
      },
    });

    // Map Backend model -> Frontend expected variables
    const mappedProducts = products.map((p) => ({
      ...p,
      farmerName: p.farmer.name,
      farmerVerified: p.farmer.verified,
      farmName: p.farmer.farmName,
      farmerRating: p.farmer.rating || 5.0, // Assuming 5.0 if not rated
      // If farmer is banned, we could filter them out or pass the banned status
      farmerBanned: p.farmer.banned,
    }));

    res.json(mappedProducts);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ message: 'Server error fetching products.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        farmer: {
          select: { name: true, verified: true, farmName: true, banned: true },
        },
      },
    });

    if (product) {
      res.json({
        ...product,
        farmerName: product.farmer.name,
        farmerVerified: product.farmer.verified,
        farmName: product.farmer.farmName,
        farmerRating: product.farmer.rating || 5.0,
      });
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    console.error('Fetch Product Error:', error);
    res.status(500).json({ message: 'Server error fetching product.' });
  }
};

export const createProduct = async (req, res) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ message: 'Only farmers can list products.' });
  }

  const { title, category, description, price, unit, quantity, deliveryAvailable, location, premium } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        title,
        category,
        description,
        price: parseFloat(price),
        unit,
        quantity: parseInt(quantity),
        deliveryAvailable: Boolean(deliveryAvailable),
        location,
        premium: Boolean(premium),
        farmerId: req.user.id,
      },
      include: {
        farmer: {
          select: { name: true, verified: true, farmName: true, banned: true },
        },
      },
    });

    res.status(201).json({
        ...product,
        farmerName: product.farmer.name,
        farmerVerified: product.farmer.verified,
        farmName: product.farmer.farmName,
        farmerRating: product.farmer.rating || 5.0,
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: 'Server error creating product.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, price, unit, quantity, deliveryAvailable, location } = req.body;
    
    // Ensure product belongs to farmer
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.farmerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title, category, description, price: parseFloat(price), 
        unit, quantity: parseInt(quantity), deliveryAvailable: Boolean(deliveryAvailable), location
      },
      include: {
        farmer: { select: { name: true, verified: true, farmName: true, banned: true } },
      },
    });

    res.json({
      ...updated,
      farmerName: updated.farmer.name,
      farmerVerified: updated.farmer.verified,
      farmName: updated.farmer.farmName,
      farmerRating: updated.farmer.rating || 5.0,
    });
  } catch(error) { res.status(500).json({ message: 'Error updating' }); }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.farmerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }
    
    // Prisma delete cascade handles related orders safely if schema is set, else we delete them or just archive.
    // For simplicity, we just delete. Make sure orders on this product are handled if necessary, but we'll try straight delete.
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product removed' });
  } catch(error) { res.status(500).json({ message: 'Error deleting' }); }
};

export const incrementView = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    res.json({ message: 'View incremented' });
  } catch(error) { res.status(500).json({ message: 'Error updating views' }); }
};
