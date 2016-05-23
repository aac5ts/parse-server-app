// Example express application adding the parse-server module to expose Parse
// compatible API routes.
var Parse = require('parse');
var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId', //If you change your app Id, update it here, in your client code, and in your Heroku config vars
  masterKey: process.env.MASTER_KEY || 'myMasterKey', 
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  
  liveQuery: {
    classNames: [ 'ChatMessage', 'Profile' ] // List of classes to support for query subscriptions
  }
});

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send("Welcome to your Parse Server!");
});

// There will be a test page available on the /test path of your server 
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

//Group chat app home
app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('my-parse-app running on port ' + port + '.');
});
// This will enable the Live Query real-time server
var liveQueryServer = ParseServer.createLiveQueryServer(httpServer);

