var assert = require("assert")
  , curry = require('lodash.curry')
  , claire = require('claire')
  , _ = claire.data
  , forAll = claire.forAll
  ;

var add = curry(function(x, y) { return x + y; });

var semigroupAssocTest = function(gen) {
  return forAll(gen, gen, gen).satisfy(function(a, b, c) {
    assert.deepEqual(mappend(mappend(a, b), c), mappend(a, mappend(b, c)));
    return true;
  }).asTest({times: 100});
};

var monoidIdentityTest = function(gen) {
  return forAll(gen).satisfy(function(m) {
    assert.deepEqual(mappend(mempty(m), m), mappend(m, mempty(m)));
    return true;
  }).asTest({times: 100})
};

var functorIdentity = function(gen) {
  return forAll(gen).satisfy(function(m) {
    assert.deepEqual(fmap(id, m), id(m));
    return true;
  }).asTest({times: 100})
};

var functorComp = function(gen) {
  return forAll(gen).satisfy(function(m) {
    var f = add('one')
      , g = add('two');
    assert.deepEqual(fmap(compose(f, g), m), compose(fmap(f), fmap(g))(m));
    return true;
  }).asTest({times: 100})
};

var applicativeIdentity = function(gen) {
  return forAll(gen).satisfy(function(m) {
    assert.deepEqual(ap(of(id, m), m), m);
    return true;
  }).asTest({times: 100})
};

var applicativeComp = function(gen) {
  return forAll(gen, gen).satisfy(function(m, w) {
      var f = of(add('one'), m)
        , g = of(add('two'), m)
        , _compose = curry(function(f,g,x) { return f(g(x)); })
        ;
      assert.deepEqual(ap(ap(ap(of(_compose, m), f), g), w), ap(f, ap(g, w)));
      return true;
    }).asTest({times: 100})
};

var applicativeHomoMorph = function(gen) {
  return forAll(gen, _.Any).satisfy(function(m, x) {
    var f = function(y){ return [y]; }
    assert.deepEqual(ap(of(f, m), of(x, m)), of(f(x), m));
    return true;
  }).asTest({times: 100})
};

var applicativeInterChange = function(gen) {
  return forAll(gen, _.Any).satisfy(function(m, x) {
    var u = of(function(x){ return [x]; }, m);
    assert.deepEqual(ap(u, of(x, m)), ap(of(function(f) { return f(x); }, m), u));
    return true;
  }).asTest({times: 100});
};

var monadAssoc = function(gen) {
  return forAll(gen).satisfy(function(m) {
      var f = function(x){ return of(add('nest1', x), m)}
        , g = function(x){ return of(add('nest2', x), m)}
        , h = function(x){ return of(add('nest3', x), m)}
        , mcompose_ = curry(function(f, g, x) { return mbind(g(x), f); })
        ;
      assert.deepEqual(mcompose_(f, mcompose_(g, h))(m), mcompose_(mcompose_(f, g), h)(m));
      return true;
    }).asTest({times: 100});
};

var Laws = { 'Semigroup': [['associativity', semigroupAssocTest]]
           , 'Monoid': [['identity', monoidIdentityTest]]
           , 'Functor': [['identity', functorIdentity], ['composition', functorComp]]
           , 'Applicative': [ ['identity', applicativeIdentity]
                            , ['composition', applicativeComp]
                            , ['homomorphism', applicativeHomoMorph]
                            , ['interchange', applicativeInterChange]
                            ]
           , 'Monad': [['assoc', monadAssoc]]
           }

module.exports.quickCheckLaws = function(laws) {
  Object.keys(laws).map(function(typeclass) {
    describe(typeclass, function() {
      Laws[typeclass].map(function(law) {
        it(law[0], law[1](laws[typeclass]));
      });
    });
  });
};
