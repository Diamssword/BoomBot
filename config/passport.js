const LocalStrat = require('passport-local').Strategy,
bcrypt           = require('bcryptjs'),
USER = require('../models/users');

module.exports = function(passport) {
    passport.use('local',
        new LocalStrat({ usernameField: 'name', passReqToCallback: true } ,async(req,name , password, done) => {
            console.log("log")
            USER.findOne({
                NAME : name
            }).then(user => {
                console.log(name)
                if(!user) {
                    return done(null , false , { message : "Le mot de passe ou l'email est incorrect"});
                }
                bcrypt.compare(password , user.MDP , (err , isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        return done(null , user);
                    } else {
                        return done(null , false , { message : "Le mot de passe ou l'email est incorrect" });
                    }
                });
            });
        })
    );

    passport.serializeUser(function(user , done) {
        done(null , user.id);
    });
    passport.deserializeUser(async function(id , done) {
        USER.findById(id , function(err , user) {
            done(err , user);
        });
    });
};