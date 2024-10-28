const express = require('express');
const path = require('path');
require('dotenv').config();
const { auth } = require('express-openid-connect');
const indexRoutes = require('./routes/index');
const ticketRoutes = require('./routes/ticket');
const { authConfig, authRoutes } = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth(authConfig));

app.use('/', indexRoutes);
app.use('/ticket', ticketRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
