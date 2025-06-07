const request = require('supertest'); // Import Supertest for HTTP API testing
const app = require('../index'); // Import the main Express application

// Test Suite: Report API Endpoints
describe('Report API Endpoints', () => {

    /**
     * Test Case: Fetch a valid monthly report for a user
     * Description: Sends a GET request with valid user ID, year, and month, and expects a 200 response with costs array
     */
    it('should return a monthly report for a user', async () => {
        const response = await request(app)
            .get('/api/report')
            .query({ id: '1', year: '2025', month: '6' }); // Requesting a report for June 2025

        // Assertions
        expect(response.status).toBe(200); // Expect HTTP 200 OK
        expect(response.body).toHaveProperty('costs'); // Response should include 'costs' field
        expect(response.body.costs).toBeInstanceOf(Array); // 'costs' should be an array
    });

    /**
     * Test Case: Handle monthly report when no cost data exists
     * Description: Sends a GET request for a month/year where the user has no recorded costs, expecting empty categories
     */
    it('should return an empty costs array if no data is found', async () => {
        const response = await request(app)
            .get('/api/report')
            .query({ id: '1', year: '2024', month: '12' }); // Requesting report for December 2024

        // Assertions
        expect(response.status).toBe(200); // Expect HTTP 200 OK
        expect(response.body).toHaveProperty('costs'); // Ensure 'costs' field exists
        expect(response.body.costs.length).toBe(5); // Expect 5 predefined categories (even if empty)
        expect(response.body.costs.every(c => Object.values(c)[0].length === 0)).toBe(true); // All arrays should be empty
    });

    /**
     * Test Case: Missing query parameters
     * Description: Sends a GET request without required query parameters and expects a 400 Bad Request
     */
    it('should return 400 if parameters are missing', async () => {
        const response = await request(app)
            .get('/api/report'); // No query parameters provided

        // Assertions
        expect(response.status).toBe(400); // Expect HTTP 400 Bad Request
        expect(response.body.error).toBe('Bad Request'); // Confirm error message
    });

});
    