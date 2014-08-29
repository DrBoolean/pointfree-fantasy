var ConstType = function(val) {
  this.val = val;
}

var getConst = function(c) { return c.val; };

var Const = function(val) {
  return new ConstType(val);
};


ConstType.prototype.map = function(f) {
	return Const(this.val);
};

// is const an applicative?
// only if x is a monoid
ConstType.prototype.of = function(x) {
	return Const(x.empty());
};

ConstType.prototype.ap = function(c2) {
	return Const(this.val.concat(c2.val));
};

Const.of = ConstType.prototype.of;

// const is not a monad

module.exports = {Const: Const, getConst: getConst}
