const express = require('express');
const router = express.Router();
const { Trip, User, Booking, Review } = require('../database/models');

// GET all trips (with search/filter)
router.get('/trips', async (req, res) => {
    try {
        const query = {};
        if (req.query.category) query.category = req.query.category;
        const trips = await Trip.findAll({ where: query });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single trip
router.get('/trips/:id', async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id);
        if (trip) res.json(trip);
        else res.status(404).json({ error: 'Trip not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN: Add Trip
router.post('/trips', async (req, res) => {
    // For prototype simplicity, skipping strict auth check here, but normally would verify token
    try {
        const newTrip = await Trip.create(req.body);
        res.json(newTrip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN: Update Trip
router.put('/trips/:id', async (req, res) => {
    try {
        const [updated] = await Trip.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedTrip = await Trip.findByPk(req.params.id);
            res.json(updatedTrip);
        } else {
            res.status(404).json({ error: 'Trip not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN: Delete Trip
router.delete('/trips/:id', async (req, res) => {
    try {
        const result = await Trip.destroy({ where: { id: req.params.id } });
        if (result) res.json({ message: 'Trip deleted' });
        else res.status(404).json({ error: 'Trip not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REVIEWS: Get all for a trip
router.get('/reviews/:tripId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { tripId: req.params.tripId },
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REVIEWS: Add a review
router.post('/reviews', async (req, res) => {
    try {
        const { tripId, username, rating, comment } = req.body;
        const review = await Review.create({ tripId, username, rating, comment });
        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed Data Endpoint (For testing)
router.get('/seed', async (req, res) => {
    try {
        await Trip.bulkCreate([
            // PAST (Jan 2025)
            { title: 'Paris Getaway', price: 144000, category: 'package', image: 'images/img_1.jpg', description: 'Experience the city of lights.', location: 'France', startDate: '2025-01-01', endDate: '2025-01-07' },

            // CURRENT (Dec 2025 - Covers Dec 11)
            { title: 'Dhaka City Tour', price: 5000, category: 'package', image: 'images/img_2.jpg', description: 'Exploring the heritage of Old Dhaka.', location: 'Bangladesh', startDate: '2025-12-01', endDate: '2025-12-15' },
            { title: 'Cox\'s Bazar Relax', price: 15000, category: 'hotel', image: 'images/img_3.jpg', description: 'Longest sea beach in the world.', location: 'Bangladesh', startDate: '2025-12-10', endDate: '2025-12-20' },

            // UPCOMING (2026)
            { title: 'Sylhet Tea Gardens', price: 12000, category: 'package', image: 'images/img_4.jpg', description: 'Green calmness of the tea gardens.', location: 'Bangladesh', startDate: '2026-01-10', endDate: '2026-01-15' },
            { title: 'Sundarbans Adventure', price: 25000, category: 'package', image: 'images/img_5.jpg', description: 'Into the wild mangroves.', location: 'Bangladesh', startDate: '2026-02-01', endDate: '2026-02-05' },
            { title: 'Tokyo Future Trip', price: 240000, category: 'flight', image: 'images/img_6.jpg', description: 'A trip to the future.', location: 'Japan', startDate: '2026-03-01', endDate: '2026-03-10' }
        ]);
        res.json({ message: 'Seeded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
