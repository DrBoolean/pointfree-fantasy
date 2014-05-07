pointfree-fantasy
=================

Point free wrappers for fantasy land. Functions are curried using
lodash's curry function](http://lodash.com/docs#curry), and receive their
data last. Gives us aliases with our familar haskell names as well.

```js
require('./pointfree-fantasy').expose(global); // or if browser pointfree.expose(window)
var Maybe = require('./pointfree-fantasy/instances/maybe');

// setup an easy test fn
var toUpperCase = function(x) { return x.toUpperCase(); };

map(toUpperCase, Maybe('mystring')) // Just("MYSTRING")
fmap(toUpperCase, Maybe(null)) // Nothing

```

THE LIST
--------

* `I` combinator
* `K` combinator
* `compose`, taking arbitrarily many functions
* `map`, aliased `fmap`
* `ap`
* `liftA2`
* `liftA3`
* `chain`, takes chainable first, function last
* `flatMap`, flipped `chain`
* `mjoin`
* `concat`, aliased `mappend`
* `mconcat`, a monoidal reduction.
* `foldMap`
* `fold`
