require('../pointfree').expose(global)


var assert = require("assert")
  , quickCheckLaws = require('./helper').quickCheckLaws
  , curry = require('lodash.curry')
  , claire = require('claire')
  , _ = claire.data
  , asGenerator = claire.asGenerator
  , forAll = claire.forAll
  ;

var _stubFn = function() { return function() { return _.Str.next().value }; };
var FunGen = asGenerator(_stubFn)


describe('Function', function(){
  var f = function(x) { return x + 'hello'}
    , g = function(y) { return y + 'world'}
    ;

  describe("Monoid", function() {
    it('runs the functions then concats the values together', function() {
      assert.equal(mappend(f, g)(' bla '), ' bla hello bla world')
      assert.equal(mconcat([f, g])(' bla '), ' bla hello bla world')
    });
  });

  describe("Functor", function() {
    it('composes the functions', function() {
      assert.equal(map(g, f)(' bla '), ' bla helloworld')
    });
  });

  describe("Applicative", function() {
    it('runs each function with the arg then passes the results on', function() {
      var h = curry(function(x,y) { return x.toUpperCase() + y.toLowerCase(); })
      assert.equal(liftA2(h, f, g)(' bla '), ' BLA HELLO bla world')
    });

    it('runs each function with the arg then passes the results on (with 3)', function() {
      var h = curry(function(x,y,z) { return x.toUpperCase() + y.toLowerCase() + z })
      var i = function(z) { return z + 'last'};
      assert.equal(liftA3(h, f, g, i)(' bla '), ' BLA HELLO bla world bla last')
    });
  });
});


