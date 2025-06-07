const request = require('supertest'); // Import Supertest for HTTP API testing
const app = require('../index'); // Import the main Express application

// Test Suite: User API Endpoints
describe('User API Endpoints', () => {

    /**
     * Test Case: Fetch user details by ID
     * Description: Sends a GET request with a valid user ID and expects user details and total cost
     */
    it('should return user details by id', async () => {
        const response = await request(app)
            .get('/api/users/1'); // Fetching details for user with ID 1

        // Assertions
        expect(response.status).toBe(200); // Expect HTTP 200 OK
        expect(response.body).toHaveProperty('first_name'); // Should include 'first_name'
        expect(response.body.first_name).toBe('John'); // 'first_name' should be 'John'
        expect(response.body).toHaveProperty('total'); // Should include 'total' cost field
        expect(typeof response.body).toBe('object'); // Response should be an object
    });

    /**
     * Test Case: Handle user not found
     * Description: Sends a GET request for a non-existent user ID and expects a 404 response
     */
    it('should return 404 if user not found', async () => {
        const response = await request(app)
            .get('/api/users/99999'); // Attempt to fetch user with non-existent ID

        // Assertions
        expect(response.status).toBe(404); // Expect HTTP 404 Not Found
        expect(response.body.error).toBe('User not found'); // Error message should indicate user not found
    });

});
