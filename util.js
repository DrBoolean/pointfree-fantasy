"use strict";

var Constructor = function(f) {
  var x = function(){
    if(!(this instanceof x)){
      var inst = new x();
      f.apply(inst, arguments);
      return inst;
    }
    f.apply(this, arguments);
  };

  return x;
};
exports.Constructor = Constructor;
var makeType = function(f) {
  f = f || function(v){ this.val = v; }
  return Constructor(f);
};
exports.makeType = makeType;

var subClass = function(superclass, constructr) {
  var x = makeType();
  x.prototype = new superclass();
  x.prototype.constructor=constructr; 
  return x;
}
exports.subClass = subClass;

var K = function(x){return function(){return x;};};
exports.K = K;var I = function(x){return x;};
exports.I = I;