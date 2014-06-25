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


var pointy = {};

var id = function(x) { return x; }
var K = function(x) { return function(){ return x; } }

var map = curry(function(f, u) {
  return u.fmap ? u.fmap(f) : u.map(f); //sometimes map passes index so we use fmap if it has it.
});

var ap = curry(function(a1, a2) {
  return a1.ap(a2);
});

var liftA2 = curry(function(f, x, y) {
  return map(f,x).ap(y);
});

var liftA3 = curry(function(f, x, y, z) {
  return map(f, x).ap(y).ap(z);
});

var chain = curry(function(f, mv) {
  return mv.chain(f);
});

var mjoin = function(mmv) {
  return chain(id, mmv);
};

var concat = curry(function(x, y) {
  return x.concat(y);
});

var mconcat = function(xs, empty) {
  return xs.length ? xs.reduce(concat) : empty();
};

var sequenceA = curry(function(point, fctr) {
  return fctr.traverse(id, point);
});

var of = function(x) {
  return x.of;
};

var traverse = curry(function(f, point, fctr) {
  return compose(sequenceA(point), map(f))(fctr);
});

var foldMap = curry(function(f, fldable) {
  return fldable.reduce(function(acc, x) {
    var r = f(x);
    acc = acc || r.empty();
    return acc.concat(r);
  }, null);
});

var fold = foldMap(I);

var toList = function(x) {
  return x.reduce(function(acc, y) {
    return [y].concat(acc);
  }, []);
};

var expose = function(env) {
  var f;
  for (f in pointy) {
    if (f !== 'expose' && pointy.hasOwnProperty(f)) {
      env[f] = pointy[f];
    }
  }
}

pointy.I = id;
pointy.K = K;
pointy.compose = compose;
pointy.curry = curry; //lodash curry
pointy.of = of;
pointy.map = map;
pointy.ap = ap;
pointy.liftA2 = liftA2;
pointy.liftA3 = liftA3;
pointy.chain = chain;
pointy.mjoin = mjoin;
pointy.concat = concat;
pointy.mappend = concat;
pointy.mconcat = mconcat;
pointy.sequenceA = sequenceA;
pointy.traverse = traverse;
pointy.foldMap = foldMap;
pointy.fold = fold;
pointy.toList = toList;
pointy.expose = expose;

module.exports = pointy;

if(typeof window == "object") {
  pointfree = pointy;
}
