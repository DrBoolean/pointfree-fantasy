var curry = require('lodash.curry');
var _flatten = function(xs) {
  return xs.reduce(function(a,b){return a.concat(b);}, []);
};

var _fmap = function(f) {
  var xs = this;
  return xs.map(function(x) { return f(x); }); //avoid index
};

Object.defineProperty(Array.prototype, 'fmap',{
    value: _fmap,
    writable: true,
    configurable: true,
    enumerable: false
});

var _empty = function() { return []; };

Object.defineProperty(Array.prototype, 'empty',{
    value: _empty,
    writable: true,
    configurable: true,
    enumerable: false
});

var _chain = function(f) { return _flatten(this.fmap(f)); };

Object.defineProperty(Array.prototype, 'chain',{
    value: _chain,
    writable: true,
    configurable: true,
    enumerable: false
});

var _of = function(x) { return [x]; };

Object.defineProperty(Array.prototype, 'of',{
    value: _of,
    writable: true,
    configurable: true,
    enumerable: false
});

var _ap = function(a2) {
  var a1 = this;
  return _flatten(a1.map(function(f){
    return a2.map(function(a){ return f(a); })
  }));
};

Object.defineProperty(Array.prototype, 'ap',{
    value: _ap,
    writable: true,
    configurable: true,
    enumerable: false
});

var _traverse = function(f) {
  var xs = this;
  var cons_f = function(ys, x){
    var z = f(x).map(curry(function(x,y){ return y.concat(x); }));
    ys = ys || z.of([]);
    return z.ap(ys);
  }
  return xs.reduce(cons_f, null);
};

Object.defineProperty(Array.prototype, 'traverse',{
    value: _traverse,
    writable: true,
    configurable: true,
    enumerable: false
});

var _foldl = function(f, acc) {
  return this.reduce(f, acc);
}

Object.defineProperty(Array.prototype, 'foldl',{
    value: _foldl,
    writable: true,
    configurable: true,
    enumerable: false
});

