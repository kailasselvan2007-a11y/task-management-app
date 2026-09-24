import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Task from './models/Task.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ Error: MONGODB_URI is required to run standalone seed script.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️ Cleared existing database records.');

    // Create demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'demo@taskflow.com',
      password: hashedPassword,
    });
    console.log(`👤 Created Demo User: ${demoUser.email} (Password: password123)`);

    const now = new Date();
    const addDays = (d: number) => new Date(now.getTime() + d * 86400000);

    const sampleTasks = [
      {
        title: 'Complete Full-Stack Project Documentation',
        description: 'Finalize the TaskFlow README, include installation guides, API endpoint specifications, and architecture diagrams.',
        status: 'In Progress',
        priority: 'High',
        dueDate: addDays(2),
        user: demoUser._id,
      },
      {
        title: 'Review MongoDB Indexes & Mongoose Schemas',
        description: 'Verify MongoDB Mongoose schemas for User and Task models to ensure relational integrity and fast queries.',
        status: 'Completed',
        priority: 'Medium',
        dueDate: addDays(-1),
        user: demoUser._id,
      },
      {
        title: 'Implement JWT Security & bcrypt Hashing',
        description: 'Double check bcrypt hashing salt rounds and ensure authorization headers handle expired tokens safely.',
        status: 'In Progress',
        priority: 'High',
        dueDate: addDays(4),
        user: demoUser._id,
      },
      {
        title: 'Design Mobile-Responsive Navigation',
        description: 'Ensure sidebar collapses gracefully into a drawer on mobile and tablet screens with touch accessibility.',
        status: 'Completed',
        priority: 'Low',
        dueDate: addDays(6),
        user: demoUser._id,
      },
      {
        title: 'Prepare Final College Project Presentation',
        description: 'Prepare demo walkthrough slides highlighting frontend React, Express REST endpoints, and MongoDB integration.',
        status: 'Pending',
        priority: 'Medium',
        dueDate: addDays(7),
        user: demoUser._id,
      },
    ];

    await Task.insertMany(sampleTasks);
    console.log(`📋 Successfully seeded ${sampleTasks.length} tasks!`);

    await mongoose.disconnect();
    console.log('✨ Seeding completed successfully. Disconnected from MongoDB.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
