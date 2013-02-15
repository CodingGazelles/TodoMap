/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    templates = require('./routes/templates.js'),
    maps = require('./routes/api/maps'),
    http = require('http'),
    path = require('path');



var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/public/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('less-middleware')({
        src: __dirname + '/public'
    }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


// Routes

app.get('/', routes.index);
app.get('/partials/navbar', templates.navbar);
app.get('/views/todomap/index', templates.todomap);


// JSON API

app.get('/api/maps/:id', maps.findById);
app.put('/api/maps/:id', maps.updateById);

// Start server

console.log(app.routes);
console.log(routes);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});