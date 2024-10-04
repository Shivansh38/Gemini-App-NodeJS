// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import the GoogleGenerativeAI class from the generative-ai package
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Import the express module for creating web servers
const express = require('express');

// Create an instance of an Express application
const app = express();
// Use middleware to parse JSON payloads in incoming requests
app.use(express.json());

// Initialize the Google Generative AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// Get the specific generative model (gemini-1.5-flash) for generating content
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define a basic GET route at the root URL
app.get('/', (req, res) => {
    // Respond with a simple message
    res.send("Hello World");
});

// Log the API key to the console (use cautiously; avoid in production)
console.log("Using API Key:", process.env.API_KEY);

// Function to generate content based on a given prompt
const generate = async (prompt) => {
    try {
        // Call the model to generate content using the provided prompt
        const result = await model.generateContent(prompt);
        // Log the generated text to the console
        console.log(result.response.text());
        // Return the generated text for further use
        return result.response.text();
    } catch (err) {
        // Log any errors that occur during content generation
        console.error(err);
        // Throw a new error to be handled in the route
        throw new Error('Failed to generate content');
    }
};

// Define a POST route for content generation
app.post('/api/content', async (req, res) => {
    try {
        // Extract the 'question' from the request body
        const data = req.body.question; 
        // Call the generate function to produce content based on the question
        const result = await generate(data);
        // Send the generated content back in the response
        res.send({
            "result": result
        });
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Respond with a 500 status code and an error message
        res.status(500).send({ error: 'An error occurred while generating content.' });
    }
});

// Start the Express server and listen for incoming requests on port 3000
app.listen(3000, () => {
    // Log a message indicating the server is running
    console.log("Server is up and running on port 3000");
});
