const request = require('supertest'); // Import Supertest for HTTP request testing
const app = require('../index'); // Import the main Express application

// Test Suite: Cost API Endpoints
describe('Cost API Endpoints', () => {

    /**
     * Test Case: Create a new cost entry
     * Description: Sends a POST request with valid cost data and expects a 200 response with the saved data
     */
    it('should create a new cost entry', async () => {
        const newCost = {
            description: 'clean',     // Description of the cost
            category: 'housing',      // Category under which the cost falls
            userid: '1',              // Associated user ID
            sum: 200                  // Total cost amount
        };

        // Send POST request to /api/add
        const response = await request(app)
            .post('/api/add')
            .send(newCost)
            .set('Content-Type', 'application/json');

        // Assertions: Validate response structure and content
        expect(response.status).toBe(200); // Expect HTTP status 200 OK
        expect(response.body).toHaveProperty('_id'); // Expect an auto-generated MongoDB _id
        expect(response.body.description).toBe(newCost.description); // Ensure description is saved correctly
        expect(response.body.category).toBe(newCost.category); // Ensure category is saved correctly
    });

    /**
     * Test Case: Attempt to create a cost with missing required fields
     * Description: Sends a POST request missing the 'userid' field, expecting a 400 Bad Request
     */
    it('should return 400 if a required field is missing', async () => {
        const incompleteCost = {
            description: 'Dinner', // Cost description
            category: 'food',      // Category
            // Missing 'userid'
            sum: 100               // Amount
        };

        // Send POST request with missing data
        const response = await request(app)
            .post('/api/add')
            .send(incompleteCost)
            .set('Content-Type', 'application/json');

        // Assertions: Ensure validation error is returned
        expect(response.status).toBe(400); // Expect HTTP 400 Bad Request
        expect(response.body.error).toBe('Bad Request'); // Confirm error message
    });
});
