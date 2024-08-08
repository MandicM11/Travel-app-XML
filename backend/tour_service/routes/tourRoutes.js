const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const KeyPoint = require('../models/KeyPoint');
const authMiddleware = require('../middleware/authMiddleware'); // Importovanje authMiddleware-a

// Dohvat jedne ture po ID-u
router.get('/:tourId', async (req, res) => {
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

router.get('/', async (req, res) => {
  console.log('GET /tours route hit');
  try {
    const tours = await Tour.find().populate( {path: 'keyPoints',
      select: 'name'}); 
    console.log('Tours:', tours);
    res.status(200).json(tours);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Kreiranje ture u stanju "draft"
router.post('/create-tour', authMiddleware, async (req, res) => {
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
router.post('/:tourId/keypoint', authMiddleware, async (req, res) => {
  try {
    const { tourId } = req.params;
    const { keyPointId } = req.body;
    const tour = await Tour.findById(tourId);
    console.log('Tour ID:', tourId); // Logovanje tourId
    console.log('KeyPoint ID:', keyPointId); // Logovanje keyPointId
    console.log('tura je: ',tour);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Provera da li je trenutni korisnik autor ture
    if (tour.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: You are not the author of this tour' });
    }

    const keyPoint = await KeyPoint.findById(keyPointId);
    console.log('ovo je ta kljucna tacka: ', keyPoint);
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

// Objavljivanje ture
router.post('/:tourId/publish', authMiddleware, async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId).populate('keyPoints');
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Provera da li je trenutni korisnik autor ture
    if (tour.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: You are not the author of this tour' });
    }

    if (!tour.name || !tour.description || !tour.difficulty || tour.keyPoints.length < 2) {
      return res.status(400).json({ error: 'Tour must have name, description, difficulty and at least two key points' });
    }

    tour.status = 'published';
    await tour.save();
    res.status(200).json(tour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
