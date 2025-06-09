/**
 * @fileoverview Express router for handling "About" route to return team member details.
 * @module routes/about
 */

const express = require('express');
const router = express.Router();

/**
 * GET /about
 * 
 * Returns a list of team members.
 * 
 * @name GET/about
 * @function
 * @memberof module:routes/about
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {void}
 */
router.get('/about', (req, res) => {
  res.json([
    {
      first_name: 'Yarden',
      last_name: 'Aharon'
    },
    {
      first_name: 'Dana',
      last_name: 'Oshri'
    }
  ]);
});

/**
 * Export the router to make it available for use in other parts of the application.
 */
module.exports = router;
