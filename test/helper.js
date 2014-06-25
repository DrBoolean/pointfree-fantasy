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
    assert.deepEqual(mappend(m.empty(), m), mappend(m, m.empty()));
    return true;
  }).asTest({times: 100})
};

var functorIdentity = function(gen) {
  return forAll(gen).satisfy(function(m) {
    assert.deepEqual(map(I, m), I(m));
    return true;
  }).asTest({times: 100})
};

var functorComp = function(gen) {
  return forAll(gen).satisfy(function(m) {
    var f = add('one')
      , g = add('two');
    assert.deepEqual(map(compose(f, g), m), compose(map(f), map(g))(m));
    return true;
  }).asTest({times: 100})
};

var applicativeIdentity = function(gen) {
  return forAll(gen).satisfy(function(m) {
    assert.deepEqual(ap(m.of(I), m), m);
    return true;
  }).asTest({times: 100})
};

var applicativeComp = function(gen) {
  return forAll(gen, gen).satisfy(function(m, w) {
      var f = m.of(add('one'))
        , g = m.of(add('two'))
        , _compose = curry(function(f,g,x) { return f(g(x)); })
        ;
      assert.deepEqual(ap(ap(ap(m.of(_compose), f), g), w), ap(f, ap(g, w)));
      return true;
    }).asTest({times: 100})
};

var applicativeHomoMorph = function(gen) {
  return forAll(gen, _.Any).satisfy(function(m, x) {
    var f = function(y){ return [y]; }
    assert.deepEqual(ap(m.of(f), m.of(x)), m.of(f(x)));
    return true;
  }).asTest({times: 100})
};

var applicativeInterChange = function(gen) {
  return forAll(gen, _.Any).satisfy(function(m, x) {
    var u = m.of(function(x){ return [x]; });
    assert.deepEqual(ap(u, m.of(x)), ap(m.of(function(f) { return f(x); }), u));
    return true;
  }).asTest({times: 100});
};

var monadAssoc = function(gen) {
  return forAll(gen).satisfy(function(m) {
      var f = function(x){ return m.of(add('nest1', x))}
        , g = function(x){ return m.of(add('nest2', x))}
        , h = function(x){ return m.of(add('nest3', x))}
        , mcompose_ = curry(function(f, g, x) { return chain(f, g(x)); })
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
