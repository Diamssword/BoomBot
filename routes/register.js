const { forwardAuthenticated } = require('../config/auth');
const ADMIN = require('../models/admins')
const bcrypt = require('bcryptjs');
async function router(router) {
    router.get('/register' , forwardAuthenticated , async (req , res) => {
        res.render('register.ejs');
    });

    router.post('/register' , async (req , res ) => {
        const {name,password,confirm} =req.body;
        if(name,password,confirm)
        {
            if(password == confirm)
                {
                new ADMIN({NAME:name,MDP: bcrypt.hashSync(password, 10)}).save();
                    req.flash('success',"Compte crée!");
                    res.redirect("/login");
                    return;
                }
                else
                req.flash('error',"Les 2 champs de mot de passe sont differents");
            
        }
        else
        {
            req.flash('error',"Champs incomplets");
        }
        res.redirect("/register")
    });
}

module.exports = router;