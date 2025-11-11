# Database Setup Instructions - Tourbloginfo_prj2

This guide will help you set up a fresh database named `Tourbloginfo_prj2` for your tour blog application.

## Prerequisites

Make sure you have:
- MySQL server running on your local machine
- Node.js installed
- All npm dependencies installed (`npm install`)

## Quick Setup (Recommended)

Run the automated setup script that will create and seed your new database:

```bash
npm run db:setup
```

This will:
1. Create a new database named `Tourbloginfo_prj2`
2. Set up all database tables with proper relationships
3. Seed the database with initial data including:
   - 20 Sri Lankan districts
   - Sample destinations
   - Admin user account
   - Sample comments and ratings

## Manual Setup

If you prefer to run each step manually:

### 1. Create the Database
```bash
npm run db:create
```

### 2. Seed with Initial Data
```bash
npm run db:seed
```

## Database Configuration

The application is now configured to use:
- **Database Name**: `Tourbloginfo_prj2`
- **Host**: `localhost`
- **Port**: `3306`
- **User**: `root`
- **Password**: `root` (update in `.env` file if different)

## Admin Account

After setup, you can login with:
- **Email**: `admin@tourbloginfo.com`
- **Password**: `admin123`

## Environment Variables

The `.env` file has been updated with the new database name:
```
DB_NAME=Tourbloginfo_prj2
```

## Starting the Application

After database setup, start your server:
```bash
npm run dev
```

The server will automatically:
- Connect to the new database
- Sync all models
- Be ready to serve your tour blog application

## Database Structure

The new database includes these tables:
- **Users**: User accounts and authentication
- **Districts**: Sri Lankan districts/regions
- **Destinations**: Tourist destinations and places
- **Comments**: User comments on destinations
- **Ratings**: User ratings for destinations

## Troubleshooting

If you encounter issues:

1. **Connection Error**: Verify MySQL is running and credentials in `.env` are correct
2. **Permission Error**: Ensure your MySQL user has CREATE DATABASE privileges
3. **Port Conflict**: Check if port 3306 is available or update `DB_PORT` in `.env`

## Notes

- This setup creates a completely fresh database with no data from the previous `sri_lanka_travel` database
- All existing data in the old database remains untouched
- The application now points to the new `Tourbloginfo_prj2` database
- You can switch back by changing `DB_NAME` in the `.env` file
