const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const KeyPoint = require('../models/KeyPoint');
const Cart = require('../models/Cart');
const OrderItem = require('../models/OrderItem');
const TourPurchaseToken = require('../models/TourPurchaseToken'); 
const authMiddleware = require('../middleware/authMiddleware'); 
const mongoose = require('mongoose');
const crypto = require('crypto');


function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Dohvat jedne ture po ID-u
router.get('/tour/:tourId', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId).populate('keyPoints');
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.status(200).json(tour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Dohvat svih tura
router.get('/tour', async (req, res) => {
  console.log('GET /tour route hit');
  try {
    const tours = await Tour.find().populate({
      path: 'keyPoints',
      select: 'name'
    });
    console.log('Tours:', tours);
    res.status(200).json(tours);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Kreiranje ture u stanju "draft"
router.post('/tour/create-tour', authMiddleware, async (req, res) => {
  try {
    const { name, description, difficulty, tags, price } = req.body;
    const author = req.user.userId; // ID korisnika koji kreira turu

    const newTour = new Tour({
      name,
      description,
      difficulty,
      tags,
      price,
      author
    });

    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Dodavanje ključne tačke
router.post('/tour/:tourId/keypoint', authMiddleware, async (req, res) => {
  try {
    const { tourId } = req.params;
    const { keyPointId } = req.body;
    const tour = await Tour.findById(tourId);
    console.log('Tour ID:', tourId); // Logovanje tourId
    console.log('KeyPoint ID:', keyPointId); // Logovanje keyPointId
    console.log('Tura je:', tour);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Provera da li je trenutni korisnik autor ture
    if (tour.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: You are not the author of this tour' });
    }

    const keyPoint = await KeyPoint.findById(keyPointId);
    console.log('Ovo je ta ključna tačka:', keyPoint);
    if (!keyPoint) {
      return res.status(404).json({ error: 'KeyPoint not found' });
    }

    tour.keyPoints.push(keyPointId);
    if (tour.keyPoints.length > 1) {
      // Izračunavanje dužine ture
      const prevPoint = await KeyPoint.findById(tour.keyPoints[tour.keyPoints.length - 2]);
      const currentPoint = keyPoint;
      tour.length += calculateDistance(prevPoint.latitude, prevPoint.longitude, currentPoint.latitude, currentPoint.longitude);
    }

    
    await tour.save();
    res.status(201).json(tour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Funkcija za izračunavanje udaljenosti između dve tačke
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Poluprečnik Zemlje u kilometrima
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

router.post('/tour/:tourId/published', authMiddleware, async (req, res) => {
  try {
    const { tourId } = req.params;
    console.log('tour id za publish je: ', tourId);
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    if (tour.keyPoints.length < 2) {
      return res.status(400).json({ message: 'Tour must have at least two key points to be published.' });
    }

    tour.updateTimeForTour();
    tour.publish();
    await tour.save();

    res.status(200).json({ message: 'Tour published successfully', tour });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta za arhiviranje ture
router.post('/tour/:tourId/archived', authMiddleware, async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    tour.archive();
    await tour.save();

    res.status(200).json({ message: 'Tour archived successfully', tour });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta za aktiviranje arhivirane ture
router.post('/tour/:tourId/activated', authMiddleware, async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    tour.activate();
    await tour.save();

    res.status(200).json({ message: 'Tour activated successfully', tour });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta za dohvatanje objavljenih tura
router.get('/published', async (req, res) => {
  try {
    const tours = await Tour.find({ status: 'published' })
      .select('name description tags keyPoints timeForTour')
      .populate('keyPoints', 'name') // Uzimamo samo ime ključne tačke
      .exec();

    const toursWithLimitedInfo = tours.map(tour => ({
      name: tour.name,
      description: tour.description,
      tags: tour.tags,
      firstKeyPoint: tour.keyPoints[0],
      timeForTour: tour.timeForTour,
    }));

    res.status(200).json(toursWithLimitedInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta za kreiranje korpe
router.post('/cart', async (req, res) => {
  const { userId } = req.body;

  try {
    console.log('Kreiranje korpe za korisnika:', userId); // Loguj userId
    const newCart = new Cart({
      userId,
      items: [],
      totalPrice: 0,
      status: 'pending',
      createdAt: new Date()
    });

    await newCart.save();
    console.log('Korpa kreirana:', newCart); // Loguj kreiranu korpu
    res.status(201).json({ cart: newCart });
  } catch (err) {
    console.error('Greška prilikom kreiranja korpe:', err.message); // Loguj grešku
    res.status(500).json({ message: 'Error creating cart.' });
  }
});





router.post('/cart/:cartId/items', async (req, res) => {
  const { cartId } = req.params;
  const { tourId, quantity } = req.body;

  try {
    console.log(`Received request to add item to cart. Cart ID: ${cartId}, Tour ID: ${tourId}, Quantity: ${quantity}`);

    // Pronađi korpu
    const cart = await Cart.findById(new mongoose.Types.ObjectId(cartId));

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // Pronađi ili kreiraj novu stavku
    let orderItem = await OrderItem.findOne({ cartId: new mongoose.Types.ObjectId(cartId), tourId: new mongoose.Types.ObjectId(tourId) });
    if (orderItem) {
      console.log(`Item already in cart. Updating quantity: Tour ID: ${tourId}, New Quantity: ${orderItem.quantity + quantity}`);
      orderItem.quantity += quantity;
    } else {
      console.log(`Item not in cart. Adding new item: Tour ID: ${tourId}, Quantity: ${quantity}`);
      const tour = await Tour.findById(new mongoose.Types.ObjectId(tourId));
      if (!tour) {
        return res.status(404).json({ message: 'Tour not found.' });
      }
      orderItem = new OrderItem({
        cartId: new mongoose.Types.ObjectId(cartId),
        tourId: new mongoose.Types.ObjectId(tourId),
        tourName: tour.name,
        price: tour.price,
        quantity: quantity
      });
    }

    // Sačuvaj ili ažuriraj stavku
    await orderItem.save();

    // Ažuriraj korpu
    if (!cart.items.includes(orderItem._id)) {
      cart.items.push(orderItem._id);
    }
    cart.status = 'pending';
    cart.totalPrice += orderItem.price * quantity;
    await cart.save();

    res.status(200).json({ cart });
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ message: 'Error updating cart.' });
  }
});



router.delete('/cart/:cartId/items/:itemId', async (req, res) => {
  const { cartId, itemId } = req.params;

  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(item => item.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    // Oduzmi cenu od ukupne cene
    const item = await OrderItem.findById(itemId);
    if (item) {
      cart.totalPrice -= item.price * item.quantity;
    }

    // Ukloni stavku iz korpe
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item from cart.' });
  }
});

// Ruta za checkout
router.post('/cart/checkout', async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId), status: 'pending' }).populate('items');

    console.log('Cart:', cart);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    const purchaseTokens = [];
    for (let item of cart.items) {
      const token = new TourPurchaseToken({
        userId,
        tourId: item.tourId,
        purchaseDate: new Date(),
        token: generateRandomToken(),
      });
      await token.save();
      purchaseTokens.push(token);
    }
    await OrderItem.deleteMany({ _id: { $in: cart.items.map(item => item._id) } });
    cart.status = 'pending';
    cart.items = []; // Isprazni stavke
    cart.totalPrice = 0; // Postavi cenu na 0
    await cart.save();
    res.status(200).json({ purchaseTokens });
  } catch (err) {
    console.error('Error during checkout:', err);
    res.status(500).json({ message: 'Error during checkout.' });
  }
});





module.exports = router;
