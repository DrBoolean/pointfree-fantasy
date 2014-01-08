var curry = require('lodash.curry');

var BUILT_INS = { 'array': require('./instances/array')
                , 'function': require('./instances/function')
                , 'string': require('./instances/string')
                }

var _getNamedType = function(x) {
  return Object.prototype.toString.call( x ).match(/\S+(.*?)]/)[1].substr(1).toLowerCase();
};

var _getInstance = function(fn_name, x) {
  var t = _getNamedType(x);
  return BUILT_INS[t] && BUILT_INS[t][fn_name];
};

var _groupsOf = curry(function(n, xs) {
  if(!xs.length) return [];
  return [xs.slice(0, n)].concat(_groupsOf(n, xs.slice(n, xs.length)));
});

var _compose = curry(function(f,g,x) { return f(g(x)) });

// f . g . h == compose(f, g, h)
var toAssociativeCommaInfix = function(fn) {
  return function() {
    var fns = [].slice.call(arguments)
    return function() {
      return _groupsOf(2, fns).reverse().map(function(g) {      
        return (g.length > 1) ? fn.apply(this,g) : g[0];
      }).reduce(function(x, f) {
        return [f.apply(f,x)];
      }, arguments)[0];
    };    
  };
};

var compose = toAssociativeCommaInfix(_compose);


var Pointy = {};

var id = function(x) { return x; }

var fmap = curry(function(f, u) {
  var builtIn = _getInstance('fmap', u);
  return builtIn ? builtIn(f, u) : (u.fmap && u.fmap(f)) || u.map(f);
});

var of = curry(function(f, a) {
  var builtIn = _getInstance('of', a);
  return builtIn ? builtIn(f, a) : a.of(f);
});

var ap = curry(function(a1, a2) {
  var builtIn = _getInstance('ap', a1)
  return builtIn ? builtIn(a1, a2) : a1.ap(a2);
});

var liftA2 = curry(function(f, x, y) {
	return ap(fmap(f, x), y);
});

var liftA3 = curry(function(f, x, y, z) {
  return ap(ap(fmap(f, x), y), z);
});

var chain = curry(function(mv, f) {
  var builtIn = _getInstance('chain', mv);
  return builtIn ? builtIn(mv, f) : mv.chain(f);
});

var mjoin = function(mmv) {
	return chain(mmv, id);
};

var concat = curry(function(x, y) {
  var builtIn = _getInstance('concat', x);
  return builtIn ? builtIn(x,y) : x.concat(y);
});

var empty = function(x) {
  var builtIn = _getInstance('empty', x);
  return builtIn ? builtIn(x) : x.empty();
};

var mconcat = function(xs) {
	if(!xs[0]) return xs;
  var e = empty(xs[0]);
  return xs.reduce(mappend, e);
};

var expose = function(env) {
  var f;
  for (f in Pointy) {
    if (f !== 'expose' && Pointy.hasOwnProperty(f)) {
      env[f] = Pointy[f];
    }
  }
}

Pointy.id = id;
Pointy.compose = compose;
Pointy.fmap = fmap;
Pointy.of = of;
Pointy.ap = ap;
Pointy.liftA2 = liftA2;
Pointy.liftA3 = liftA3;
Pointy.chain = chain;
Pointy.mbind = chain;
Pointy.mjoin = mjoin;
Pointy.empty = empty;
Pointy.mempty = empty;
Pointy.concat = concat;
Pointy.mappend = concat;
Pointy.mconcat = mconcat;
Pointy.expose = expose;


module.exports = Pointy;

if(typeof window == "object") {
  PointFree = Pointy;
}
