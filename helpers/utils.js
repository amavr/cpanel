'use strict';

const jwt = require('jsonwebtoken');
const menus = require('../data/menus.json');

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

    static makeSidebar(role, url){
        const res = {};
        for(const page_key of Object.keys(menus.pages)){
            const page = menus.pages[page_key];
            if(page.roles.includes(role)){
                for(const sec of page.sections){
                    if(res[sec] === undefined){
                        res[sec] = { 
                            active: false,
                            title: menus.sections[sec].title,
                            pages: []
                        };
                    }
                    res[sec].pages.push(page);
                    if(page.url === url) {
                        res[sec].active = true;
                        page.active = true;
                    }
                }
            }
        }
        for(const sec_key of Object.keys(res)){
            if(res[sec_key].pages.length === 0){
                delete res[sec_key];
            }
        }
        return res;
    }
}