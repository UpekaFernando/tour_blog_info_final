#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up new database: Tourbloginfo_prj2');
console.log('===============================================');

async function setupDatabase() {
  try {
    console.log('\n1. Creating new database...');
    execSync('node createDatabase.js', { stdio: 'inherit' });
    
    console.log('\n2. Seeding database with initial data...');
    execSync('node seedNewDatabase.js', { stdio: 'inherit' });
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('===============================================');
    console.log('📋 Setup Summary:');
    console.log('• Database Name: Tourbloginfo_prj2');
    console.log('• Admin Email: admin@tourbloginfo.com');
    console.log('• Admin Password: admin123');
    console.log('• Districts: 20 created');
    console.log('• Sample Destinations: 5 created');
    console.log('• Sample Comments & Ratings: Created');
    console.log('\n🎉 You can now start your server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Error during database setup:', error.message);
    process.exit(1);
  }
}

setupDatabase();
