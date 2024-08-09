const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const KeyPoint = require('../models/KeyPoint');
const authMiddleware = require('../middleware/authMiddleware'); // Importovanje authMiddleware-a

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
    const { name, description, difficulty, tags } = req.body;
    const author = req.user.userId; // ID korisnika koji kreira turu

    const newTour = new Tour({
      name,
      description,
      difficulty,
      tags,
      author // Postavite autora
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

module.exports = router;
