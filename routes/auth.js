const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

const getAccessToken = async () => {
    const options = {
        method: 'POST',
        url: 'https://napredniweb.eu.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        data: {
            client_id: process.env.M2M_CLIENT_ID,
            client_secret: process.env.M2M_CLIENT_SECRET,
            audience: 'https://web2-api.com/ticketing',
            grant_type: 'client_credentials'
        }
    };

    try {
        const response = await axios(options);
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

router.get('/get-token', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get access token' });
    }
});

module.exports = { authConfig, getAccessToken, authRoutes: router };
