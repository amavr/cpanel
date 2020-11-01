'use strict';

const jwt = require('jsonwebtoken');

module.exports = class Utils {

    static makeAccessToken(user) {
        return this.makeToken(user);
    }

    static makeRefreshToken(user) {
        return this.makeToken(user, true);
    }

    static makeToken(user, forRefresh) {
        const exp = forRefresh ? '14d' : '2h';
        return jwt.sign(
            {
                data: user
            },
            process.env.SECRET,
            { 
                expiresIn: exp 
            }
        );
    }
}