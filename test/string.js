require('../pointfree').expose(global)


var assert = require("assert")
  , quickCheckLaws = require('./helper').quickCheckLaws
  , curry = require('lodash.curry')
  , claire = require('claire')
  , _ = claire.data
  , forAll = claire.forAll
  ;

describe('String', function(){
  quickCheckLaws({ 'Semigroup': _.Str
                 , 'Monoid': _.Str
                 });
});


