'use strict';

const log = require('log4js').getLogger('api');
const express = require('express');
const jwt = require('jsonwebtoken');
const Utils = require('../../helpers/utils');
const stubs = require('../../helpers/stubs');

const router = express.Router();


const expiration = '6h';

router.all('*', function (req, res, next) {
    console.log(`point #1 ${req.url}`);
    next();
});


router.post('/v1/auth', function (req, res, next) {
    const user_data = stubs.findUser(req.body.username, req.body.password);
    if (user_data) {
        const token = jwt.sign({
            // exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {
                user: user_data
            }
        },
            process.env.SECRET,
            { expiresIn: expiration });
        res.send({
            success: true, grant: {
                accessToken: Utils.makeAccessToken({ username: req.body.username, role: 'manager' }),
                refreshToken: Utils.makeRefreshToken({ username: req.body.username, role: 'manager' }),
            }
        });
    }
    else{
        res.status(404).end();
    }
});

router.get('/v1/test', function (req, res) {
    try {
        const hAuth = req.headers.authorization;
        if (hAuth) {
            const token = hAuth.replace('Bearer ', '');
            const res = jwt.verify(token, process.env.SECRET);
            log.debug(res);
        }
        res.send({ version: 0.1 });
    }
    catch (ex) {
        res.status(400).send({ success: false, msg: ex.message });
    }
});

router.all('*', function (req, res, next) {
    res.status(404).end();
});


module.exports = router;