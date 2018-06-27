var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// New Code
const {
    DynamoDbSchema,
    DynamoDbTable,
    DataMapper,
    embed,
} = require('@aws/dynamodb-data-mapper');

const DynamoDB = require('aws-sdk/clients/dynamodb');

const mapper = new DataMapper({
    client: new DynamoDB({ region: 'us-east-1' }), // the SDK client used to execute operations
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var AWS = require('aws-sdk');

var cloudwatchlogs = new AWS.CloudWatchLogs({
    region: 'us-east-1'
});

app.locals.title = 'Public Sector Summit 2018 ECS Fargate Demo App';
app.locals.description = 'A boilerplate for a simple web application with a Node.JS and Express backend, DynamoDB database and meant to be hosted in ECS Fargate';
app.locals.author = 'Len Henry';
app.locals.contact = 'awshenry@amazon.com';

var createLogger = require('aws-cloudwatch-logs'),
    apiLogger = createLogger({
        cloudwatchlogs: cloudwatchlogs,
        logGroupName: '/ecs/cicd-demo',
        logStreamName: 'app-logs'
    }),
    errorLogger = createLogger({
        cloudwatchlogs: cloudwatchlogs,
        logGroupName: '/ecs/cicd-demo',
        logStreamName: 'app-logs'
    });


//Overwrite console log for fun and profit.
(function() {
    var _log = console.log;
    var _error = console.error;
    var _warning = console.warning;
    var sequence_token = 0;

    console.error = function(errMessage) {
        var message = errMessage;
        if (arguments.length > 1)
            message = arguments[1];

        errorLogger.log("Error Message", message);
        _error.apply(console, arguments);
    };

    console.log = function(logMessage) {
        var message = logMessage;
        if (arguments.length > 1)
            message = arguments[1];

        apiLogger.log("Log Message", message);
        // Do something with the log message
        _log.apply(console, arguments);
    };

    console.warning = function(warnMessage) {
        var message = warnMessage;
        if (arguments.length > 1)
            message = arguments[1];

        apiLogger.log("Warning Message", message);
        // do something with the warn message
        _warning.apply(console, arguments);
    };

})();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req, res, next) {
    req.db = mapper;
    next();
});

app.use('/', routes);
app.use('/users', users);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
