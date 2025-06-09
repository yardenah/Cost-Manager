const express = require('express'); // Import the Express framework
const router = express.Router(); // Create an Express router instance
const Cost = require('../models/cost'); // Import the Cost model
const User = require('../models/user'); // Import the User model

/**
 * @function userExists
 * @description Utility function to check if a user exists in the database
 * @param {string} id - The user ID to search for
 * @returns {Promise<boolean>} Whether the user exists
 */
async function userExists(id) {
  const user = await User.findOne({ id });
  return !!user;
}

/**
 * @route POST /add
 * @description Add a new cost entry for a user.
 * @param {Object} req.body - Request payload
 * @param {string} req.body.userid - User ID
 * @param {number} req.body.sum - Cost amount
 * @param {string} req.body.category - Cost category (e.g., food, health)
 * @param {string} req.body.description - Description of the cost
 * @param {Date} [req.body.date] - Optional date of the cost
 * @returns {Object} Saved cost entry
 */
router.post('/add', async (req, res) => {
    try {
        const { userid, sum, category, description, date } = req.body;

        // Validate required fields
        if (!userid) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing 'userid' field."
            });
        }

        if (!sum || !category || !description) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing required fields: 'sum', 'category', or 'description'."
            });
        }

        // Check if the user exists
        if (!(await userExists(userid))) {
            return res.status(404).json({
                error: 'User Not Found'
            });
        }

        // Create and save the cost record
        const cost = new Cost({ userid, sum, category, description, date });
        const savedCost = await cost.save();

        // Respond with the saved cost
        return res.status(200).json(savedCost);

    } catch (err) {
        // Handle unexpected errors
        console.error('Error saving cost:', err);
        res.status(500).json({
            error: 'Internal Server Error',
            message: `An error occurred while saving the cost: ${err.message}`
        });
    }
});

/**
 * @route GET /report
 * @description Generate a monthly cost report for a user
 * @query {string} id - User ID
 * @query {string} year - Year of the report (e.g. "2025")
 * @query {string} month - Month of the report (1–12)
 * @returns {Object} Monthly report grouped by category
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        // Validate query parameters
        if (!id) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing 'id' query parameter."
            });
        }
        if (!year) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing 'year' query parameter."
            });
        }
        if (!month) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing 'month' query parameter."
            });
        }

        // Check if the user exists
        if (!(await userExists(id))) {
            return res.status(404).json({
                error: 'User Not Found'
            });
        }

        // Define the date range for the specified month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Aggregate costs by category and day
        const costs = await Cost.aggregate([
            {
                $match: {
                    userid: id,
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: { category: '$category' },
                    items: {
                        $push: {
                            sum: '$sum',
                            description: '$description',
                            day: { $dayOfMonth: '$date' }
                        }
                    }
                },
            },
            {
                $sort: { '_id.category': 1 },
            }
        ]);

        // Supported categories (even if no costs exist for some)
        const categories = ["food", "health", "housing", "sport", "education"];

        // Initialize the report structure with empty arrays
        let report = categories.map(category => ({
            [category]: []
        }));

        // Fill the report with aggregated data
        costs.forEach(cost => {
            const category = report.find(r => Object.keys(r)[0] === cost._id.category);
            if (category) {
                category[cost._id.category] = cost.items.map(item => ({
                    sum: item.sum,
                    description: item.description,
                    day: item.day
                }));
            }
        });

        // Move empty categories to the bottom
        report.sort((a, b) => {
            const aLength = Object.values(a)[0].length;
            const bLength = Object.values(b)[0].length;
            return aLength === 0 ? 1 : bLength === 0 ? -1 : 0;
        });

        // Send the final structured report
        res.status(200).json({
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month),
            costs: report
        });

    } catch (error) {
        // Handle unexpected errors
        console.error('Error fetching report:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: `An error occurred while fetching the report: ${error.message}`
        });
    }
});

// Export the router for use in the main application
module.exports = router;
