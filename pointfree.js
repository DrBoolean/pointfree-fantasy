var curry = require('lodash.curry');

var BUILT_INS = { 'array': require('./instances/array')
                , 'function': require('./instances/function')
                , 'string': require('./instances/string')
                }

var _groupsOf = curry(function(n, xs) {
  if(!xs.length) return [];
  return [xs.slice(0, n)].concat(_groupsOf(n, xs.slice(n, xs.length)));
});

var _compose = curry(function(f,g,x) { return f(g(x)) });

var I = function(x){ return x; }

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
var K = function(x) { return function(){ return x; } }

var fmap = curry(function(f, u) {
  return (u.fmap && u.fmap(f)) || u.map(f);
});

var of = curry(function(f, a) {
  return a.of(f);
});

var ap = curry(function(a1, a2) {
  return a1.ap(a2);
});

var liftA2 = curry(function(f, x, y) {
  return fmap(f,x).ap(y);
});

var liftA3 = curry(function(f, x, y, z) {
  return fmap(f, x).ap(y).ap(z);
});

var chain = curry(function(mv, f) {
  return mv.chain(f);
});

var flatMap = curry(function(f, mv) {
  return mv.chain(f);
});

var mjoin = function(mmv) {
	return chain(mmv, id);
};

var concat = curry(function(x, y) {
  return x.concat(y);
});

var empty = function(x) {
  return x.empty();
};

var mconcat = function(xs) {
	if(!xs[0]) return xs;
  var e = empty(xs[0]);
  return xs.reduce(concat, e);
};

var sequenceA = curry(function(fctr) {
  return fctr.traverse(id);
});

var traverse = curry(function(f, fctr) {
  return compose(sequenceA, fmap(f))(fctr);
});

var foldMap = curry(function(f, fldable) {
  return fldable.foldl(function(acc, x) {
    var r = f(x)
    acc = acc || r.empty();
    return acc.concat(r);
  })
});

var fold = foldMap(I)

var toList = function(x) {
  return x.foldl(function(acc, y) {
    return [y].concat(acc);
  }, []);
};

var expose = function(env) {
  var f;
  for (f in Pointy) {
    if (f !== 'expose' && Pointy.hasOwnProperty(f)) {
      env[f] = Pointy[f];
    }
  }
}

Pointy.I = id;
Pointy.K = K;
Pointy.compose = compose;
Pointy.fmap = fmap;
Pointy.of = of;
Pointy.ap = ap;
Pointy.liftA2 = liftA2;
Pointy.liftA3 = liftA3;
Pointy.chain = chain;
Pointy.flatMap = flatMap;
Pointy.mjoin = mjoin;
Pointy.empty = empty;
Pointy.mempty = empty;
Pointy.concat = concat;
Pointy.mappend = concat;
Pointy.mconcat = mconcat;
Pointy.sequenceA = sequenceA;
Pointy.traverse = traverse;
Pointy.foldMap = foldMap;
Pointy.fold = fold;
Pointy.toList = toList;
Pointy.expose = expose;


module.exports = Pointy;

if(typeof window == "object") {
  PointFree = Pointy;
}
