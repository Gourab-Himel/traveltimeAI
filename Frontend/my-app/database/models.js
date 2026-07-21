const Sequelize = require('sequelize');
const db = require('./config');

// USER MODEL
const User = db.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    role: { type: Sequelize.STRING, defaultValue: 'traveler' }, // admin, agent, hotel, transport, traveler
    email: { type: Sequelize.STRING },
    fullName: { type: Sequelize.STRING }
});

// TRIP MODEL
const Trip = db.define('trip', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT },
    price: { type: Sequelize.DECIMAL(10, 2) },
    image: { type: Sequelize.STRING }, // URL or path
    category: { type: Sequelize.STRING }, // package, hotel, flight
    startDate: { type: Sequelize.DATEONLY },
    endDate: { type: Sequelize.DATEONLY },
    duration: { type: Sequelize.STRING },
    location: { type: Sequelize.STRING }
});

// BOOKING MODEL
const Booking = db.define('booking', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: Sequelize.STRING, defaultValue: 'pending' },
    date: { type: Sequelize.DATEONLY }
});

// REVIEW MODEL
const Review = db.define('review', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    rating: { type: Sequelize.INTEGER, allowNull: false }, // 1-5
    comment: { type: Sequelize.TEXT },
    username: { type: Sequelize.STRING }
});

// Relationships
User.hasMany(Booking);
Booking.belongsTo(User);
Trip.hasMany(Booking);
Booking.belongsTo(Trip);

Trip.hasMany(Review);
Review.belongsTo(Trip);
User.hasMany(Review);
Review.belongsTo(User);

// Sync Models
db.sync();

module.exports = { User, Trip, Booking, Review };
