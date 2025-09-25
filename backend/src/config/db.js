// src/config/db.js
const mongoose = require('mongoose');

async function connect(mongoUri) {
  mongoose.set('strictQuery', false);
  await mongoose.connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  console.log('MongoDB connected');
}

module.exports = { connect };
