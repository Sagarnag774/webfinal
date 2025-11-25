const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('🔍 Debugging MongoDB Connection...');
console.log('Current directory:', __dirname);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '*** SET ***' : 'NOT SET!');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route to check environment variables
app.get('/api/debug', (req, res) => {
    res.json({
        node_env: process.env.NODE_ENV,
        port: process.env.PORT,
        mongodb_uri_set: !!process.env.MONGODB_URI,
        mongodb_uri_length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0
    });
});

// Test MongoDB connection
app.get('/api/test-db', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({ error: 'MONGODB_URI not set' });
        }

        console.log('Attempting to connect to:', process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://***:***@'));
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        res.json({ 
            status: 'Connected to MongoDB successfully',
            database: mongoose.connection.db.databaseName
        });
    } catch (error) {
        console.error('Connection error:', error.message);
        res.status(500).json({ 
            error: 'Failed to connect to MongoDB',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Debug server running on http://localhost:${PORT}`);
    console.log(`📊 Check http://localhost:${PORT}/api/debug`);
});