require('../pointfree').expose(global)


var Constant = require('../instances/const')
  , quickCheckLaws = require('./helper').quickCheckLaws
  , Const = Constant.Const
  , getConst = Constant.getConst
  , assert = require("assert")
  , curry = require('lodash.curry')
  , claire = require('claire')
  , _ = claire.data
  , forAll = claire.forAll
  ;

var ConstGen = claire.transform(Const, _.Str);

describe('Const', function(){
  quickCheckLaws({ 'Functor': ConstGen });

  describe('Functor', function(){
    it('ignores map entirely', function(){
      var someFn = function(x) { return x + 'this will not happen'; };
      assert.deepEqual(map(someFn, Const('hi')), Const('hi'));
    });
  });

  describe('Applicative', function(){
    it('concats values if value is a monoid', function() {
      assert.deepEqual(Const('1').ap(Const('2')), Const('12'));
    });
  });
});


