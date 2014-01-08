require('../pointfree').expose(global)


var assert = require("assert")
  , quickCheckLaws = require('./helper').quickCheckLaws
  , curry = require('lodash.curry')
  , claire = require('claire')
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
});


