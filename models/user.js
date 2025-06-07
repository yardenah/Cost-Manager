/**
 * @fileoverview Mongoose schema for representing user data in the database.
 * @module models/User
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user.
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 * @property {Date} birthday - The user's date of birth.
 * @property {string} marital_status - The user's marital status.
 */

// Define schema for storing user data
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,   // Must be provided
    unique: true      // Must be unique
  },
  first_name: {
    type: String,
    required: true    // Mandatory field
  },
  last_name: {
    type: String,
    required: true    // Mandatory field
  },
  birthday: {
    type: Date,
    required: false    // Optional
  },
  marital_status: {
    type: String,
    required: false    // Optional
  }
});

/**
 * Mongoose model for user entries.
 * @type {mongoose.Model<User>}
 */
module.exports = mongoose.model('User', userSchema);
