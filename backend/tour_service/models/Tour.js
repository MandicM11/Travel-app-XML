const mongoose = require('mongoose');
const TransportMode = require('./TransportMode');

const timeForTourSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: Object.values(TransportMode),
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  keyPoints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KeyPoint',
    },
  ],
  length:{
    type: Number,
    required: false,
  },
  timeForTour: [timeForTourSchema],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
  },
  archivedAt: {
    type: Date,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

tourSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
};

tourSchema.methods.archive = function() {
  this.status = 'archived';
  this.archivedAt = new Date();
};

tourSchema.methods.activate = function() {
  this.status = 'published';
  this.archivedAt = null;
};

tourSchema.methods.updateTimeForTour = function() {
  const walkingSpeed = 5; // km/h
  const cyclingSpeed = 15; // km/h
  const drivingSpeed = 60; // km/h

  const distance = this.length; // U kilometrima
  console.log('distanca iz modela: ',distance);

  if (isNaN(distance) || distance <= 0) {
    console.error('Invalid distance:', distance);
    this.timeForTour = [];
    return;
  }

  const timeForWalking = (distance / walkingSpeed) * 60; // u minutima
  const timeForCycling = (distance / cyclingSpeed) * 60; // u minutima
  const timeForDriving = (distance / drivingSpeed) * 60; // u minutima

  this.timeForTour = [
    { mode: 'WALKING', duration: Math.round(timeForWalking) },
    { mode: 'CYCLING', duration: Math.round(timeForCycling) },
    { mode: 'DRIVING', duration: Math.round(timeForDriving) },
  ];
};

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
