# aws-cloudwatch-logs
Put logs into cloudwatch in one line, automatically check uploadSequenceToken



```javascript

var AWS = require('aws-sdk'),
    cloudwatchlogs = new AWS.CloudWatchLogs({
      apiVersion: '2014-03-28',
      region: 'eu-west-1'
    });

var createLogger = require('aws-cloudwatch-logs'),
    apiLogger = createLogger({
      cloudwatchlogs: cloudwatchlogs,
      logGroupName: '/API/endpoints'   // Don't forget to create LogGroups: /API/endpoints or it will fail!
    }),
    errorLogger = createLogger({
      cloudwatchlogs: cloudwatchlogs,
      logGroupName: '/api/errors'      // Don't forget to create LogGroups: /api/errors or it will fail!
    });


```



```javascript


// simple
errorLogger.log('ERROR', 'Not Found');
errorLogger.log('ERROR', {error: 'Not found'});

apiLogger.log('/user/712543 GET', {isGuest: true, referer: 'google'})

// with callback
errorLogger.log('ERROR', 'Not Found', function (e) {});
errorLogger.log('ERROR', {error: 'Not found'}, function (e) {});

apiLogger.log('/user/712543 GET', {isGuest: true, referer: 'google'}, function (e) {})


```



