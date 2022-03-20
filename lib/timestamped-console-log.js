// From https://medium.com/@vivek.bharatha/console-log-timestamp-hack-a90d1ca83600

module.exports = function () {
  originalLog = console.log;
  // Overwriting the original console.log function:
  console.log = function () {
    let args = [].slice.call(arguments);
    originalLog.apply(console.log, [getCurrentDateString()].concat(args));
  };
  // Returns current timestamp
  function getCurrentDateString() {
    return (new Date()).toISOString() + ' :: ';
  }
}

// Alternative from https://gist.github.com/mikelehen/5398652#file-timestamped-console-log-js

// console.log = (function() {
//   var console_log = console.log;
//   var timeStart = new Date().getTime();
//
//   return function() {
//     var delta = new Date().getTime() - timeStart;
//     var args = [];
//     args.push((delta / 1000).toFixed(2) + ':');
//     for(var i = 0; i < arguments.length; i++) {
//       args.push(arguments[i]);
//     }
//     console_log.apply(console, args);
//   };
// })();
