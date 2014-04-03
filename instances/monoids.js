var Constructor = require('../util').Constructor;

var inspect = function(x) {
  if(x==null || x==undefined) return "null";
  return x.inspect ? x.inspect() : x;
}

var getResult = function(x) { return x.val; };

var Max = Constructor(function(val) {
	this.val = val;
});

Max.prototype.empty = function() { return Max(Number.MIN_VALUE); };

Max.prototype.concat = function(s2) { return Max(this.val > s2.val ? this.val : s2.val); };

Max.prototype.inspect = function(f) {
	return 'Max('+inspect(this.val)+')';
};

var Min = Constructor(function(val) {
	this.val = val;
});


Min.prototype.empty = function() { return Min(Number.MAX_VALUE); };

Min.prototype.concat = function(s2) { return Min(this.val < s2.val ? this.val : s2.val); };

Min.prototype.inspect = function(f) {
	return 'Min('+inspect(this.val)+')';
};

var Sum = Constructor(function(val) {
	this.val = val;
});

Sum.prototype.empty = function() { return Sum(0); };

Sum.prototype.concat = function(s2) { return Sum(this.val + s2.val); };

Sum.prototype.inspect = function(f) {
	return 'Sum('+inspect(this.val)+')';
};


var Product = Constructor(function(val) {
	this.val = val;
});

Product.prototype.empty = function() { return Product(1); };

Product.prototype.concat = function(s2) { return Product(this.val * s2.val); };

Product.prototype.inspect = function(f) {
	return 'Product('+inspect(this.val)+')';
};


var Any = Constructor(function(val) {
	this.val = val;
});

Any.prototype.empty = function() { return Any(false); };

Any.prototype.concat = function(s2) { return Any(this.val || s2.val); };

Any.prototype.inspect = function(f) {
	return 'Any('+inspect(this.val)+')';
};


var All = Constructor(function(val) {
	this.val = val;
});

All.prototype.empty = function() { return All(true); };

All.prototype.concat = function(s2) { return All(this.val && s2.val); };

All.prototype.inspect = function(f) {
	return 'All('+inspect(this.val)+')';
};


module.exports = {Max: Max, Min: Min, Sum: Sum, Product: Product, Any: Any, All: All, getResult: getResult}
