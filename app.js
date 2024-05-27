require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookiParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const connectDB = require('../server/config/db')

const app = express();
const port = process.env.PORT || 3000;

//connectt to db
connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookiParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyoard cat',
    resave : false,
    saveUninitialized : true,
    store: MongoStore.create({
        mongoUrl : process.env.MONGODB_URI
    })
}))

app.use(express.static('public'));


//templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine' , 'ejs');

app.use('/', require('../server/routes/main'));
app.use('/', require('../server/routes/admin'));



app.listen(port , ()=>{
    console.log(`server is running on port ${port}`);
})