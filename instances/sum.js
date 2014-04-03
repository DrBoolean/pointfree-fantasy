var Constructor = require('../util').Constructor;

var Sum = Constructor(function(val) {
	this.val = val;
});

var getSum = function(c) { return c.val; };

Sum.prototype.map = function(f) {
	return Sum(f(this.val));
};

Sum.prototype.empty = function() { return Sum(0); };

Sum.prototype.concat = function(s2) { return Sum(this.val + s2.val); };

Sum.prototype.of = function(x) {
	return Sum(x);
};

Sum.prototype.ap = function(s2) {
	return Sum(ap(this.val, s2.val));
};

Sum.prototype.chaim = function(f) {
	return f(this.val);
};

module.exports = {Sum: Sum, getSum: getSum}
