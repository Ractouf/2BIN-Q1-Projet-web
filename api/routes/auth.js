const express = require('express');
const path = require("node:path");
const { register, login } = require('../models/auth');
const { parse } = require("../utils/json");

const router = express.Router();
const jsonDbPath = path.join(__dirname, '/../data/users.json');

/**
 * Register a new user
 * @returns the json file of the newly registered user or an error
 */
router.post('/register', async (req, res) => {
    const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
    const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;

    if (!username || !password) return res.status(400).json({ error: 'Username or password missing !' }); // Bad Request

    const users = parse(jsonDbPath);

    if (password.length < 8) return res.status(400).json({ error: 'Password too short' });

    // eslint-disable-next-line consistent-return
    users.forEach((user) => {
        if (user.username === username) return res.status(409).json({ error: 'Username already exists !' }); // Conflict
    });

    const authenticatedUser = await register(username, password);

    if (!authenticatedUser) return res.sendStatus(401); // Unauthorized

    return res.json(authenticatedUser);
});

/**
 * Log a user in
 * @returns the json file of the logged user or an error
 */
router.post('/login', async (req, res) => {
    const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
    const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;

    if (!username || !password) return res.status(400).json({ error: 'Username or password missing !' }); // Bad Request

    const authenticatedUser = await login(username, password);

    if (!authenticatedUser) return res.status(401).json({ error: 'Wrong username or password !' }); // Unauthorized

    return res.json(authenticatedUser);
});

module.exports = router;
