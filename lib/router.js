var parse = require('url').parse;
var utils = require('./utils');

var quickRespose = utils.quickRespose;

/**
 * Return the router object which is initiated with some
 * options, i.e. methods and path templates which the router
 * should handle.
 */

exports.Router = function(routerOptions) {
  return function(req, res) {
    if (!routerOptions[req.method]) {
      quickRespose(res, 405);
      return;
    }
    var routes = routerOptions[req.method];
    var url = parse(req.url);
    for (var pathTemp in routes) {
      var fn = routes[pathTemp];
      var pathTemp = pathTemp
        .replace(/\//g, '\\/')
        .replace(/::(\w+)/g, '(.+)')
        .replace(/:(\w+)/g, '([^\\/]+)');
      var re = new RegExp('^' + pathTemp + '$');
      var captures = url.pathname.match(re);
      if (captures) {
        var args = [req, res].concat(captures.slice(1));
        fn.apply(null, args);
        return;
      }
    }
    quickRespose(res, 404);
  };
};
