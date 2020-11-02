'use strict';

class Stubs{

    constructor(){
        this.users = {
            demo: {
                password: 'demo',
                roles: ['manager']
            },
            admin: {
                password: 'admin',
                roles: ['admin', 'manager']
            },
            tester: {
                password: 'tester',
                roles: ['tester']
            }
        };
    }

    findUser(username, password){
        if(username){
            const user = this.users[username.toLowerCase()];
            if(user && user.password === password){
                return user;
            }
        }
        return undefined;
    }

}

module.exports = new Stubs();