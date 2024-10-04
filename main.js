require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get('/', (req, res) => {
    res.send("Hello World");
});


console.log("Using API Key:", process.env.API_KEY);

const generate = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return result.response.text(); // Ensure to return the generated text
    } catch (err) {
        console.error(err);
        throw new Error('Failed to generate content'); // Throw an error to be caught in the route
    }
};

app.post('/api/content', async (req, res) => {
    try {
        const data = req.body.question; 
        const result = await generate(data);
        res.send({
            "result": result
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'An error occurred while generating content.' });
    }
});

app.listen(3000, () => {
    console.log("Server is up and running on port 3000");
});
