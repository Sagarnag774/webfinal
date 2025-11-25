const path = require('path');
const fs = require('fs');

console.log('🔍 Debugging .env file...');
console.log('Current directory:', __dirname);

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
console.log('Looking for .env at:', envPath);
console.log('.env file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    console.log('📄 .env file content:');
    const content = fs.readFileSync(envPath, 'utf8');
    console.log(content);
} else {
    console.log('❌ .env file NOT found!');
}

// Now try to load dotenv
require('dotenv').config();

console.log('\n📊 After loading dotenv:');
console.log('MONGODB_URI:', process.env.MONGODB_URI || 'NOT SET');
console.log('PORT:', process.env.PORT || 'NOT SET');