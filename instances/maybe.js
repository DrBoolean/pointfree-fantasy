var util = require('../util')
  , makeType = util.makeType
  , subClass = util.subClass
  , map = require('../pointfree').map
  ;

var MaybeType = makeType()
  , Just = subClass(MaybeType)
  , Nothing = subClass(MaybeType)
  ;

//+ notThere :: a -> Bool
var notThere = function(val) {
  return (val === undefined || val === null);
}

var Maybe = function(x) {
  return notThere(x) ? Nothing() : Just(x);
};

Maybe.Just = Just;
Maybe.Nothing = Nothing;

Nothing.prototype.concat = function(b) {
  return b;
}
Just.prototype.concat = function(b) {
  if(notThere(b.val)) return this;
  return Maybe(this.val.concat(b.val));
};

MaybeType.prototype.empty = function() { return Nothing(); }

Nothing.prototype.map = function(f) {
  return Nothing();
}
Just.prototype.map = function(f) {
  return Just(f(this.val));
}
Maybe.of = Maybe;
Nothing.prototype.of = function(x) { return Nothing(x) };
Just.prototype.of = function(x) { return Just(x) };

Nothing.prototype.ap = function(m) {
  return Nothing();
}
Just.prototype.ap = function(m) {
  return map(this.val, m);
}

Nothing.prototype.chain = function(f) {
  return this;
}
Just.prototype.chain = function(f) {
  return f(this.val);
}
Nothing.prototype.traverse = function(f, point) {
  return point(Nothing());
}
Just.prototype.traverse = function(f, point) {
  return f(this.val).map(Just);
};
Nothing.prototype.reduce = function(f) {
  return f(null);
};
Just.prototype.reduce = function(f, acc) {
  return f(acc, this.val);
};

module.exports = Maybe;
