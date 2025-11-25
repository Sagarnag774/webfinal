const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables with explicit path
const envPath = path.join(__dirname, '.env');
console.log('📁 Loading .env from:', envPath);

if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log('✅ .env file loaded successfully');
} else {
    console.log('❌ .env file not found at:', envPath);
    console.log('💡 Creating default .env file...');
    
    // Create default .env file
    const defaultEnv = `MONGODB_URI=mongodb+srv://kmsagarnag12_db_user:Sd4O5aE24ThfbYA5@cluster0.u8thkgt.mongodb.net/pawkind?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development`;
    
    fs.writeFileSync(envPath, defaultEnv);
    require('dotenv').config({ path: envPath });
    console.log('✅ Default .env file created and loaded');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Debug environment variables
console.log('\n🔍 Environment Variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '*** SET ***' : '❌ NOT SET!');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if MONGODB_URI is set
if (!process.env.MONGODB_URI) {
    console.log('\n❌ CRITICAL: MONGODB_URI is not set!');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

const connectDB = async () => {
    try {
        console.log('\n🔗 Connecting to MongoDB Atlas...');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ Connected to MongoDB Atlas successfully');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
        
        // Seed initial data
        await seedInitialData();
        
    } catch (error) {
        console.error('\n❌ MongoDB connection failed:', error.message);
        console.log('💡 Please check:');
        console.log('   1. IP whitelist in MongoDB Atlas');
        console.log('   2. Internet connection');
        console.log('   3. MongoDB Atlas cluster status');
        process.exit(1);
    }
};

// Import Models
const Pet = require('./models/Pet');
const CareTip = require('./models/CareTip');
const SuccessStory = require('./models/SuccessStory');
const Contact = require('./models/Contact');
const Adoption = require('./models/Adoption');

// Seed initial data
async function seedInitialData() {
    try {
        const petCount = await Pet.countDocuments();
        const tipCount = await CareTip.countDocuments();
        const storyCount = await SuccessStory.countDocuments();

        if (petCount === 0) {
            console.log('🌱 Seeding initial pets data...');
            await Pet.create([
                {
                    name: "Bella",
                    type: "dog",
                    age: "2 years",
                    bio: "Friendly and energetic, loves playing fetch.",
                    emoji: "🐕",
                    adopted: false
                },
                {
                    name: "Whiskers",
                    type: "cat", 
                    age: "1 year",
                    bio: "Gentle and affectionate, perfect lap cat.",
                    emoji: "🐈",
                    adopted: false
                },
                {
                    name: "Max",
                    type: "dog",
                    age: "3 years", 
                    bio: "Loyal companion, great with kids.",
                    emoji: "🐕",
                    adopted: false
                },
                {
                    name: "Luna",
                    type: "cat",
                    age: "6 months",
                    bio: "Playful kitten, full of curiosity.",
                    emoji: "🐈",
                    adopted: false
                },
                {
                    name: "Rocky",
                    type: "dog",
                    age: "4 years",
                    bio: "Calm and patient, loves long walks.",
                    emoji: "🐕",
                    adopted: false
                },
                {
                    name: "Mittens",
                    type: "cat",
                    age: "2 years",
                    bio: "Independent but sweet, enjoys quiet spaces.",
                    emoji: "🐈",
                    adopted: false
                }
            ]);
            console.log('✅ Pets data seeded');
        }

        if (tipCount === 0) {
            console.log('🌱 Seeding care tips data...');
            await CareTip.create([
                {
                    title: "Nutrition",
                    content: "Provide a balanced diet with high-quality pet food. Always ensure fresh water is available.",
                    icon: "fas fa-bowl-food",
                    category: "nutrition"
                },
                {
                    title: "Veterinary Care", 
                    content: "Regular check-ups and vaccinations are essential for your pet's health.",
                    icon: "fas fa-stethoscope",
                    category: "health"
                },
                {
                    title: "Safe Environment",
                    content: "Create a safe, comfortable space for your pet with toys and a cozy bed.",
                    icon: "fas fa-home",
                    category: "general"
                },
                {
                    title: "Exercise & Play",
                    content: "Daily exercise and playtime keep pets physically and mentally stimulated.",
                    icon: "fas fa-heart",
                    category: "health"
                },
                {
                    title: "Grooming",
                    content: "Regular grooming helps maintain your pet's coat and overall hygiene.",
                    icon: "fas fa-shield-heart",
                    category: "grooming"
                }
            ]);
            console.log('✅ Care tips data seeded');
        }

        if (storyCount === 0) {
            console.log('🌱 Seeding success stories data...');
            await SuccessStory.create([
                {
                    name: "Charlie & Daisy",
                    story: "Charlie was a shy rescue who blossomed into a confident, loving companion after joining our family.",
                    emoji: "🐕"
                },
                {
                    name: "Oliver & Lily",
                    story: "Oliver found his forever home with us and brings joy to our lives every single day.",
                    emoji: "🐈"
                },
                {
                    name: "The Johnson Family",
                    story: "Adopting two siblings was the best decision we ever made. They're inseparable!",
                    emoji: "🐕🐕"
                },
                {
                    name: "Mia's Journey",
                    story: "From a scared stray to the queen of our household, Mia's transformation has been incredible.",
                    emoji: "🐈"
                }
            ]);
            console.log('✅ Success stories data seeded');
        }

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
}

// Routes
app.get('/api/pets', async (req, res) => {
    try {
        const pets = await Pet.find({ adopted: false });
        res.json(pets);
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ error: 'Error fetching pets' });
    }
});

app.get('/api/care-tips', async (req, res) => {
    try {
        const tips = await CareTip.find();
        res.json(tips);
    } catch (error) {
        console.error('Error fetching care tips:', error);
        res.status(500).json({ error: 'Error fetching care tips' });
    }
});

app.get('/api/success-stories', async (req, res) => {
    try {
        const stories = await SuccessStory.find();
        res.json(stories);
    } catch (error) {
        console.error('Error fetching success stories:', error);
        res.status(500).json({ error: 'Error fetching success stories' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Message received successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Error saving contact message' });
    }
});

app.post('/api/adoptions', async (req, res) => {
    try {
        const adoption = new Adoption(req.body);
        await adoption.save();
        await Pet.findByIdAndUpdate(req.body.petId, { adopted: true });
        res.status(201).json({ message: 'Adoption request received' });
    } catch (error) {
        console.error('Error processing adoption:', error);
        res.status(500).json({ error: 'Error processing adoption request' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'PawKind API is running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Serve client for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log('\n🎉 PawKind Server Started Successfully!');
            console.log(`📍 Local: http://localhost:${PORT}`);
            console.log(`🔧 API: http://localhost:${PORT}/api`);
            console.log(`🔧 Health Check: http://localhost:${PORT}/api/health`);
            console.log(`❤️  Ready to help animals find loving homes!`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();