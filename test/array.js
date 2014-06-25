require('../pointfree').expose(global)


var assert = require("assert")
  , quickCheckLaws = require('./helper').quickCheckLaws
  , curry = require('lodash.curry')
  , monoids = require('../instances/monoids')
  , claire = require('claire')
  , Maybe = require('../instances/maybe')
  , _ = claire.data
  , forAll = claire.forAll
  ;

describe('Array', function(){
  quickCheckLaws({ 'Semigroup': _.Array(_.Int)
                 , 'Monoid': _.Array(_.Int)
                 , 'Functor': _.Array(_.Int)
                 , 'Applicative': _.Array(_.Int)
                 , 'Monad': _.Array(_.Int)
                 });

  it('is traversable', function() {
    var f = function(x){ return Maybe(x); }
    var xs = [1,2];
    assert.deepEqual(traverse(f, Maybe.of, xs), Maybe([1,2]));
  })

  it('is foldable', function() {
    assert.deepEqual(foldMap(monoids.Sum, [1,2,3]), monoids.Sum(6))
  });
});
