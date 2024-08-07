const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  tags: [{ type: String }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  keyPoints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KeyPoint' }], // Reference na model ključne tačke
  length: { type: Number, default: 0 }, // Dužina ture u kilometrima
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Dodajte ovo polje
});

module.exports = mongoose.model('Tour', tourSchema);
