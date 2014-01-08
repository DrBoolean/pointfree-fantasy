var _K = function(x) { return function(y) { return x; } };

var fmap = function(f, g) {
  return function(x) { return f(g(x)) };
};

var _concat = function(f, g) {
  return function() {
    return concat( f.apply(this, arguments)
                 , g.apply(this, arguments)
                 );
  }
};

var empty = function() {
  return _K({ concat: function(f, g) { return concat(empty(g), g); } });
};

var chain = function(f, g) {
  return function(x) {
    return g(f(x), x);
  };
};

var of = _K;
var ap = function(f, g) {
  return function(x) {
    return f(x)(g(x));
  }
};

module.exports = { fmap: fmap
                 , of: of
                 , ap: ap
                 , concat: _concat
                 , empty: empty
                 , chain: chain
                 }
