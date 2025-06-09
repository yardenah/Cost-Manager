/**
 * @fileoverview Mongoose schema for representing cost entries in the database.
 * @module models/Cost
 */

// Load Mongoose module for MongoDB interaction
const mongoose = require('mongoose');

/**
 * @typedef {Object} Cost
 * @property {string} description - Describes the nature of the cost.
 * @property {string} category - The category of the cost (e.g., food, health).
 * @property {string} userid - The ID of the user who submitted the cost.
 * @property {number} sum - The monetary amount of the cost.
 * @property {Date} [date] - The date of the cost (defaults to current date).
 */

// Define the schema structure for storing cost entries
const costSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true // Description is mandatory
  },
  category: {
    type: String,
    required: true,
    enum: [
      'food',
      'health',
      'housing',
      'sport',
      'education',
      'fruit'
    ] // Allowed categories
  },
  userid: {
    type: String,
    required: true // Must be provided to identify the user
  },
  sum: {
    type: Number,
    required: true // Cost amount is required
  },
  date: {
    type: Date,
    default: Date.now // Defaults to current date if not provided
  }
});

/**
 * Mongoose model for cost entries.
 * @type {mongoose.Model<Cost>}
 */
module.exports = mongoose.model('Cost', costSchema);
