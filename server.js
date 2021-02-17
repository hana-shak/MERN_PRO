const express = require('express');

const connectDB = require('./config/db');

const app = express();

//connect database
connectDB();

//body parser is included in the express already
app.use(express.json(express.json({ extended: false})));

app.get('/',(req, res) => res.send('API Running'));


//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/auth', require('./routes/api/auth'));

// app.use('/api/auth', require('./routes/api/auth'));
    
        
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))