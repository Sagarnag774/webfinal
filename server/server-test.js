const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// HARDCODED connection string - REPLACE WITH YOURS
const MONGODB_URI = 'mongodb+srv://kmsagarnag12_db_user:Sd4O5aE24ThfbYA5@cluster0.u8thkgt.mongodb.net/';

console.log('🔗 Testing connection to MongoDB Atlas...');

app.get('/api/test', async (req, res) => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000
        });
        
        res.json({ 
            status: '✅ SUCCESS! Connected to MongoDB Atlas',
            database: mongoose.connection.db.databaseName
        });
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        res.status(500).json({ 
            error: 'Connection failed',
            details: error.message,
            tip: 'Check your username/password and IP whitelist in MongoDB Atlas'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Test server running on http://localhost:${PORT}`);
    console.log(`📊 Test connection: http://localhost:${PORT}/api/test`);
});