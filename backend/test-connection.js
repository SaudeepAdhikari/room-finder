require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder';
        console.log('Attempting to connect to MongoDB...');
        console.log('URI:', mongoUri);
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB connected successfully!');
        
        // Test creating a simple document
        const TestSchema = new mongoose.Schema({ test: String });
        const Test = mongoose.model('Test', TestSchema);
        await Test.create({ test: 'connection test' });
        console.log('✅ Database write test successful!');
        
        await mongoose.connection.close();
        console.log('✅ Connection closed successfully!');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.error('Full error:', error);
    }
}

testConnection(); 