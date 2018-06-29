module.exports = function (config) {

  var cloudwatchlogs = config.cloudwatchlogs,
      logGroupName = config.logGroupName || '/aws-cloudwatch-logs/default';

  return {

    log: function (eventName, message, done) {

      var logCallback = done || function () {},
          d = new Date(),
          logStreamName = config.logStreamName || ([d.getFullYear(), d.getMonth()+1, d.getDate()].join('/') + ' ' + eventName);

      cloudwatchlogs.describeLogStreams({
        logGroupName: logGroupName,
        logStreamNamePrefix: logStreamName
      }, function (err, data) {
        if (err || !data) return logCallback(err);

        if (data.logStreams && data.logStreams[0]) {

          cloudwatchlogs.putLogEvents({
            logEvents: [{
              message: JSON.stringify(message),
              timestamp: (new Date).getTime()
            }],
            logGroupName: logGroupName,
            logStreamName: logStreamName,
            sequenceToken: data.logStreams[0].uploadSequenceToken
          }, logCallback);

        } else {

          cloudwatchlogs.createLogStream({
            logGroupName: logGroupName,
            logStreamName: logStreamName
          }, function (err, data) {
            if (err) return logCallback(err);

            cloudwatchlogs.putLogEvents({
              logEvents: [{
                message: JSON.stringify(message),
                timestamp: (new Date).getTime()
              }],
              logGroupName: logGroupName,
              logStreamName: logStreamName
            }, logCallback);
          });

        }

      });

    }
  }

};
