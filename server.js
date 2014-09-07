/* ==========================================================================
   Simple RESTful API for: natural by NaturalNode.

   https://github.com/NaturalNode/natural
   ========================================================================== */


/**
 * Module Dependencies
 */
var express = require('express'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path');

/**
 * Configuration
 */
console.log('Starting Server and API service...');

var app = express();

app.use(express.static(path.join(__dirname + '/public')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', process.env.PORT || 3000);
var env = process.env.NODE_ENV || 'development';

// development environment only
if (env === 'development') {
  app.use(errorHandler());
}

require('./routes').init(app);

/**
 * Server Start
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Expressjs server running at http://localhost:' + app.get('port'));
});