pointfree-fantasy
=================

Point free wrappers for fantasy land. Doesn't extend prototype of built-ins.

Gives us our familar haskell names as well.

```js
require('./pointfree-fantasy').expose(global); // or if browser PointFree.expose(window)
var Maybe = require('./pointfree-fantasy/instances/maybe');

// setup an easy test fn
var toUpperCase = function(x) { return x.toUpperCase(); };

fmap(toUpperCase, Maybe('mystring')) // Just("MYSTRING")
fmap(toUpperCase, Maybe(null)) // Nothing

```

*THE LIST*

id
compose
fmap
of
ap
liftA2
liftA3
chain 
mbind 
mjoin 
empty 
mempty
concat
mappend
mconcat
