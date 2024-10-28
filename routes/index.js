const express = require('express');
const router = express.Router();
const pool = require('../db');
const ticketController = require('../controllers/ticket-controller');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM tickets');
        res.render('index', { ticketCount: result.rows[0].count, isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user });
    } catch (error) {
        console.error('Error fetching ticket count:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/generate-ticket', (req, res) => {
    res.render('generate-ticket');
});

router.post('/generate-ticket', ticketController.generateTicket);

module.exports = router;
