var Constructor = require('../util').Constructor;

var Const = Constructor(function(val) {
	this.val = val;
});

var getConst = function(c) { return c.val; };

Const.prototype.map = function(f) {
	return Const(this.val);
};

// is const a monoid?

// only if x is a monoid
Const.prototype.of = function(x) {
	return Const(empty(x));
};

Const.prototype.ap = function(c2) {
	return Const(mappend(this.val, c2.val));
};

// const is not a monad

module.exports = {Const: Const, getConst: getConst}
