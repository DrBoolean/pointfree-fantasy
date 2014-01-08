var _flatten = function(xs) {
  return xs.reduce(function(a,b){return a.concat(b);}, []);
};

var fmap = function(f, xs) {
  return xs.map(function(x) { return f(x); }); //avoid index
};

var concat = function(xs,ys) { return xs.concat(ys); };

var empty = function() { return []; };

var chain = function(xs, f) { return _flatten(xs.map(f)); };

var of = function(x) { return [x]; };
var ap = function(a1, a2) {
  return _flatten(a1.map(function(f){
    return a2.map(function(a){ return f(a); })
  }));
};


module.exports = { fmap: fmap
                 , of: of
                 , ap: ap
                 , concat: concat
                 , empty: empty
                 , chain: chain
                 }
