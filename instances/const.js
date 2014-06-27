var ConstType = function(val) {
  this.val = val;
}

var getConst = function(c) { return c.val; };

var Const = function(val) {
  return new ConstType(val);
};

Const.of = Const;
ConstType.prototype.of = Const;

Const.prototype.map = function(f) {
	return Const(this.val);
};

// is const an applicative?
// only if x is a monoid
Const.prototype.of = function(x) {
	return Const(x.empty());
};

Const.prototype.ap = function(c2) {
	return Const(this.val.concat(c2.val));
};

// const is not a monad

module.exports = {Const: Const, getConst: getConst}
