require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 5500;

app.use(bodyParser.json()); 
app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public')));

const uri = "mongodb+srv://v7studiophoto:v7studio@cluster0.fr3oata.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;

async function connectToDb() {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db('Phone_number');
        console.log("Connected to database");
    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1); 
    }
}

connectToDb().then(() => {
    app.post('/api/sav', async (req, res) => {
        try {
            const { user, phn, addr, pin } = req.body;

            if (!user || !phn || !addr || !pin) {
                return res.status(400).json({ error: 'Name, phone number, address, and pin code are required' });
            }

            const namepattn = /^[a-zA-Z\s]+$/;
            if (!namepattn.test(user)) {
                return res.status(400).json({ error: 'Special character alert!' });
            }

            const numpattn = /^[0-9]{10}$/;
            if (!numpattn.test(phn)) {
                return res.status(400).json({ error: 'Phone number should contain 10 digits!' });
            }

            if (!db) {
                return res.status(500).json({ error: 'Database not connected' });
            }

            const collection = db.collection('phoneNumbers');
            const result = await collection.insertOne({ user, phn, addr, pin });
            if (!result || !result.insertedId) {
                throw new Error('Failed to insert document');
            }

            res.status(200).json({ message: 'User added successfully' });
        } catch (error) {
            console.error("Error occurred while saving the phone number:", error);
            res.status(500).json({ error: 'An error occurred while saving the phone number' });
        }
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'SignUp.html'));
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

