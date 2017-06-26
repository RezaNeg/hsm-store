const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
// allows us to make a request from any domain name!
const cors = require('cors'); 
// compressin is used to increase performance
const compression = require('compression');
// a module to load initial data into sequelize models
const sequelize_fixtures = require('sequelize-fixtures');
// dotenv handles environment variables
const env = require('dotenv').load()

const port = process.env.PORT || 3000;
const app = express();
// to increase app efficiency
app.use(compression());
// CORS middleware to allow access from any domain
app.use(cors());

// note to this position: if I put this line below session declaration, deserializer invokes enerytime I am loading un image, css or js file! too bad!
app.use(express.static(path.join(__dirname, 'public'))); //static path declaration

// body-parser module extracts the entire body part of an incoming request and exposes it in a format that is easier to work with.
// in this case, JSON format is used.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// morgan prints all incoming traffic requests to the console
app.use(morgan('dev'));
app.use(cookieParser());

// importing models to sync database
const models = require("./models");


// calling the Sequelize sync function to sync database
models.sequelize.sync().then(() => {
	// console.log(models.user);
  console.log('You are connected to the database using sequelize module!');
  sequelize_fixtures.loadFile('./fixtures/*.json', models).then(() =>{
	console.log("database is updated!");
  });
  }).catch((err) => {
    console.log(err,"Some problems with database connection!!!");
});

// importing routes and passing passport as auth.js need it
const authRoute = require('./routes/routes.js')(app, models.user, models.auth_user, models.product);

// statring server
app.listen(port, (err) => {
	if(!err)
		console.log('Server running on port: ' + port + '...');
	else console.log(err)
});