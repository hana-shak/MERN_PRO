const express = require('express');
const router = express.Router();


// to call model - user table
const User = require('../../models/User');
//bring gravatar package 
const gravatar = require('gravatar');
//bring encrypt 
const bcrypt = require('bcryptjs');
//bring tokens
const jwt = require('jsonwebtoken');
//my secrete token
const config = require('config');



//to validator
const { check, validationResult } = require('express-validator/check');


//@route         GET api/users
//@description   Test route
//@access        Public 
router.post('/', [

    check('name',    'Name is required').not().isEmpty(),
    check('email',   'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').
        isLength({min:6}),
    
],   
    async (req, res) => {
        
        // console.log(req.body);


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // console.log(req.body);

        // req.body.name;
        // req.body.email;
        // req.body.password;  to pull these out I need constant
        
        const { name, email, password } = req.body;
        
        try {
            let user = await User.findOne({ email });
           
            //See if user exists
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
            }

            //Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',    //
                d: 'mm'     //default img
            })
            //create instance of user, new object 
            user = new User({
                name,
                email,
                avatar,
                password
            });
            //res.send(user);
            //Encrypt password
            const salt = await bcrypt.genSalt(10);  //check it 

            user.password = await bcrypt.hash(password, salt);

            await user.save();
          
            //res.send(user);
     
        
            const payload = {
                user: {
                    id: user.id  //it's ok to use it this way
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                 
                });
            // res.send('User route')
            //res.send('User registered')
        }
        
        catch (err) {
            console.error(err.message);
            res.status(500).send('Send server');
         }


        
});

module.exports = router;
