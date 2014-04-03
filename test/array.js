require('../pointfree').expose(global)


var assert = require("assert")
  , quickCheckLaws = require('./helper').quickCheckLaws
  , curry = require('lodash.curry')
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
    assert.deepEqual(traverse(f, xs), Maybe([1,2])) 
  })
});
