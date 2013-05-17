/**
 * Module dependencies.
 */
var express = require('express'),
    connect = require('connect'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    nconf = require('nconf'),    
    http = require('http'),
    path = require('path'),
    google = require('./google'),
    routes = require('./routes'),
    sessions = require('./routes/sessions'),
    maps = require('./api/maps'),
    models = require('./models'),
    db;

var env = process.env.NODE_ENV || 'development';
nconf.argv()
    .env()
    .file({file: './config/configapp.' + env + '.json'})
    .file("defaults", {file: './config/configapp.json'});

var app = express();

app.configure('development', function() {
    app.set('db-uri', nconf.get('db:uri'));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.set('db-uri', nconf.get('db:uri'));
    app.use(express.errorHandler());
});

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(nconf.get('express:cookieParserSecret')));
    app.use(express.session({ secret: nconf.get('express:sessionSecret')}));
    // app.use(express.session({ store: new mongoStore(app.set('db-uri')), secret: '5269fb7d2520e345f43e' }));
    app.use(app.router);
    app.use(require('less-middleware')({
        src: __dirname + '/public'
    }));
    app.use(express.static(path.join(__dirname, 'public')));
});


models.defineModels(mongoose, function() {
    app.Map = mongoose.model('Map');
    app.User = mongoose.model('User');
    db = mongoose.connect(app.set('db-uri'));
});


google.loadApiClient();


// Authentication
/** Middleware for limited access */

function authenticateToken(req, res, next) {
    if (req.session.token) {
        if (req.signedCookies.token) {
            var token = req.signedCookies.token;
            if( req.session.token === token){
                next();
            } else {
                console.log("%s Invalid token in cookie %s", req.sessionID, token);
                res.redirect('/Session/New');
            }
        } else {
            console.log(req.sessionID + " Token cookie missing in request");
            res.redirect('/Session/New');
        }
    }else {
        console.log(req.sessionID + " Token missing in session");
        res.redirect('/Session/New');
    }
}

function loadUser(req, res, next) {
    if (req.session.userId) {
        User.findById(req.session.userId, function(err, user) { 
            if(err || !user){
                console.log("%s Invalid userId %s in session", req.sessionID, req.session.userId);
                res.redirect('/Session/New');
            }
            req.currentUser = user;
            next();
        });
    } else {
        console.log("%s UserId missing in session", req.sessionID);
        res.redirect('/Session/New');
    }
}


// Pages
app.get('/Session/New', sessions.newSession);
app.post('/Session/Open', [authenticateToken], sessions.openSession);

app.get('/', function(req, res) {
    res.redirect('/Map/View')
});

app.all('/Map/*', loadUser);
app.get('/Map/View', routes.viewMapPage);



// Templates
app.get('/partials/navbar', routes.navbar);
app.get('/partials/help', routes.help);
app.get('/views/map', routes.map);


// REST API
app.all('/api/*', loadUser);
app.get('/api/maps/:id', maps.findById);
app.put('/api/maps/:id', maps.updateById);


// Start server

// console.log(app.routes);
// console.log(routes);

 // *    http.createServer(app).listen(80);
 // *    https.createServer({ ... }, app).listen(443);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});