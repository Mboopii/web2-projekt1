const { v4: uuidv4 } = require('uuid');
const qrcode = require('qrcode');
const pool = require('../db');
const { getAccessToken } = require('../routes/auth');

exports.generateTicket = async (req, res) => {
    const { vatin, firstName, lastName } = req.body;

    if (!vatin || !firstName || !lastName || vatin.trim() === '' || firstName.trim() === '' || lastName.trim() === '') {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await pool.query('SELECT COUNT(*) FROM tickets WHERE vatin = $1', [vatin]);
        const ticketCount = parseInt(result.rows[0].count, 10);

        if (ticketCount >= 3) {
            return res.status(400).json({ error: 'Ticket limit exceeded for this OIB' });
        }

        const ticketId = uuidv4();
        const createdAt = new Date();

        await pool.query(
            'INSERT INTO tickets (id, vatin, firstName, lastName, createdAt) VALUES ($1, $2, $3, $4, $5)',
            [ticketId, vatin, firstName, lastName, createdAt]
        );

        const ticketUrl = `https://web2-projekt1-hmsk.onrender.com/ticket/${ticketId}`;
        const qrCodeImage = await qrcode.toDataURL(ticketUrl);

        res.status(200).json({ qrCode: qrCodeImage });
    } catch (error) {
        console.error('Error generating ticket:', error);
        res.status(500).json({ error: 'Error generating ticket' });
    }
};
