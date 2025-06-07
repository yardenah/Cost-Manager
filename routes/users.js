const express = require('express'); // Import the Express framework
const router = express.Router(); // Create an Express router instance
const User = require('../models/user'); // Import the User model
const Cost = require('../models/cost'); // Import the Cost model

/**
 * @route GET /:id
 * @description Retrieve user details and their total spending
 * @param {string} id - User ID passed as a URL parameter
 * @returns {Object} User information and total cost
 */
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id.trim(); // Clean up the user ID by trimming whitespace

        // Find the user by their ID
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Aggregate the total cost for this user from the Cost collection
        const totalCosts = await Cost.aggregate([
            {
                $match: { userid: userId } // Match costs by user ID
            },
            {
                $group: {
                    _id: null, // Group all matched documents into one group
                    total: { $sum: '$sum' } // Sum up the 'sum' field
                }
            }
        ]);

        // Extract the total from aggregation result or default to 0 if no records found
        const total = totalCosts.length > 0 ? totalCosts[0].total : 0;

        // Respond with the user's information and the total cost
        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });

    } catch (err) {
        // Handle unexpected errors
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'An error occurred while fetching the user details' });
    }
});

// Export the router for use in other parts of the application
module.exports = router;
