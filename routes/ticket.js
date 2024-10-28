const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const router = express.Router();
const pool = require('../db');
const ticketController = require('../controllers/ticket-controller');

router.get('/:id', requiresAuth(), async (req, res) => {
    const ticketId = req.params.id;
    try {
        const result = await pool.query('SELECT vatin, firstName, lastName, createdAt FROM tickets WHERE id = $1', [ticketId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Ticket not found');
        }
        res.render('ticket-details', { ticket: result.rows[0], user: req.oidc.user });
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/generate-ticket', ticketController.generateTicket);

module.exports = router;
