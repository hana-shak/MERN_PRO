const express = require('express');
const router = express.Router();
//bringing in middleware
const auth = require('../../middleware/auth');
const User = require('../../models/User');
//bring encrypt 
const bcrypt = require('bcryptjs');
//bring tokens
const jwt = require('jsonwebtoken');
//my secrete token
const config = require('config');
//to validator
const { check, validationResult } = require('express-validator/check');


//@route         GET api/auth
//@description   Test route
//@access        Public 

//auth is a second parameter tomake it save auth
router.get('/', auth, async (req, res) =>
     //res.send('Auth route')
{
    try { 
        const user = await User.findById(req.user.id).select('-password');
        //let user = await User.findOne({ email });
        res.json(user);
        //res.send(user);
        //res.send("tried");
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


);

//@route         GET api/auth
//@description   Authenticate user & get token
//@access        Public 
router.post('/', [

    check('email',   'Please include a valid email').isEmail(),
    check('password', 'Please is required').
        exists(),
    
],   
    async (req, res) => {
        
        // console.log(req.body);


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
            
        const { email, password } = req.body;
        
        try {
            let user = await User.findOne({ email });
           
            //See if user exists
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credintials' }] })
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) { 
                return res.status(400).json({ errors: [{ msg: 'Invalid Credintials' }] });
            }
        
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
                   // res.json({ token });
                    res.json(user);
                 
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
