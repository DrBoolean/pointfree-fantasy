var Constructor = require('../util').Constructor;

var Id = Constructor(function(a) {
  this.value = a;
});

Id.prototype.concat = function(b) {
  return new Id(concat(this.value, b.value));
};

var runIdentity = function(i) { return i.value; };

Id.prototype.empty = function() {
  return new Id(this.value.empty());
};

Id.prototype.map = function(f) {
  return new Id(f(this.value));
};

Id.prototype.ap = function(b) {
  return new Id(this.value(b.value));
};

Id.prototype.chain = function(f) {
  return f(this.value);
};

Id.prototype.of = function(a) {
  return new Id(a);
};

module.exports = {Identity: Id, runIdentity: runIdentity};
