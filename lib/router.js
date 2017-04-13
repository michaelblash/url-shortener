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
    var pathTemp,
        routes = routerOptions[req.method],
        fn,
        url = parse(req.url),
        re,
        captures,
        args;

    for (pathTemp in routes) {
      fn = routes[pathTemp];
      pathTemp = pathTemp
        .replace(/\//g, '\\/')
        .replace(/::(\w+)/g, '(.+)')
        .replace(/:(\w+)/g, '([^\\/]+)');
      re = new RegExp('^' + pathTemp + '$');
      captures = url.pathname.match(re);
      if (captures) {
        args = [req, res].concat(captures.slice(1));
        fn.apply(null, args);
        return;
      }
    }
    quickRespose(res, 404);
  };
};
