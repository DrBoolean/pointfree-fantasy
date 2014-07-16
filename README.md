pointfree-fantasy
=================

Point-free wrappers for [fantasy-land](https://github.com/fantasyland/fantasy-land). Functions are curried using
[lodash's curry function](http://lodash.com/docs#curry), and receive their
data last. Gives us aliases with our familar haskell names as well.

```js
require('./pointfree-fantasy').expose(global); // or if browser pointfree.expose(window)
var Maybe = require('./pointfree-fantasy/instances/maybe');

// setup an easy test fn
var toUpperCase = function(x) { return x.toUpperCase(); };

map(toUpperCase, Maybe('mystring')) // Just("MYSTRING")
map(toUpperCase, Maybe(null)) // Nothing

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








Tutorial
----------
pointfree-fantasy implements a point-free version of the fantasy-land spec, in order to promote a less cluttered, more Haskell-like approach to algebraic programming. We'll justify this approach using Functor as an example.

In Haskell the Functor typeclass is defined (http://www.haskell.org/haskellwiki/Functor) as:

```
class Functor f where
   fmap :: (a -> b) -> f a -> f b
```

We can read this as:

f is a Functor if it provides a function fmap
that takes a function from type a to type b
and returns a function from type f a to type f b.

and the Functor laws are

```
fmap id = id
fmap (p . q) = (fmap p) . (fmap q)
```

These are the requirements that fmap must satisfy:
fmap of the identity function returns the identity function, and
fmap distributes over function composition.

(We're usually going to call it map rather than fmap.)

We can think of a Functor as a container that implements a map function. So if we had a Functor named Container, we'd expect to be able to say

`Container("hello").map(concat(" world")).map(length);`

and wind up with `Container(10)`. As long as each function works on the *content* of the Container, mapping the function over the Container will return a Container with the transformed content.

Notice that the type of the content will change if the mapped function returns a different type, as with `length` above. So a Functor has to be able to contain any type.

Or as Julian Birch says:

> So what the heck is a functor? Well, really it's just something you can map over and it makes sense.

We haven't mentioned any specific Functors yet. It's the particular things that each different Functor can do that distinguish them from one another. Usually these particular things have to do with how you access the values in the container. The Functor laws, and the clean ways they help us to manipulate Functors, are what all Functors have in common.

Take a look at Birch's little list of [things you can map over](http://www.colourcoding.net/blog/archive/2014/06/27/not-a-haskell-monad-tutorial-functors.aspx).


-------------------------------


Our most common Functor in JavaScript is Array. Of course Array is normally written as a pair of square brackets around the value(s) it's operating on, but we can imagine it as an explicit function, namely the Array constructor, instead. (Also imagine that the Array constructor does not have special-case behavior when passed a single argument!)

Also note that we're considering Arrays whose contents are all of a single type. The VALUE of an Array is a sequence of values of that underlying type. MAPPING a function f (such as the function "+1") over an Array produces a new Array whose value is a sequence of underlying values, each value equal to f(x), or "+1" of the original. In code: `Array(2,3,4).map(function(n){ return n + 1; }) // Array(3,4,5)`

The fmap function for Array, conveniently, is the similarly-named Array.prototype.map.

Does it satisfy the Functor laws?


Let's see how fantasy-land expresses the Functor laws (https://github.com/fantasyland/fantasy-land#functor):

```
u.map(function(a) { return a; }) is equivalent to u (identity)
u.map(function(x) { return f(g(x)); }) is equivalent to u.map(g).map(f) (composition)
```

You can verify these pretty easily.

But notice that the laws have gotten a bit more prolix. Of course, once we define

```
var id = function(a) { return a; };
var compose = function(f, g) { return function(x) { return f(g(x)); }};
```

they become

```
u.map(id) == u
u.map(compose(f, g)) == u.map(g).map(f)
```

We want to avoid mentioning that u, too! We want to speak of standalone functions, not methods, and so we provide a map function that's NOT defined on Array.prototype. Here's why:

If you have a function that works on a single value and you want to transform it to work on some functor, say Array, you can call map on your function like this: `map(f)`

```
funnyFortune = function(x){
  return x + " in bed";
};
```

`var worksOnArrayFortune = map(funnyFortune)`

This saves you from having to type

```
var worksOnArrayFortune = function(xs){
  return xs.map(funnyFortune);
};
```

In fact you may not need to define `worksOnArrayFortune` at all,
since you can simply say map(funnyFortune) inline when you need it.

And this works for every Functor, not just Array! We'll be talking soon enough about other Functors you may already be using.

With this and compose, the laws become

`map(id) == id`
`map(compose(f, g)) == compose(map(f), map(g))`

Composing functions without explicitly mentioning their arguments is what we call "point-free style." The "points" in question are the actual values. In topology, where the term originated, the values are always points!




...............................

Now let's look at a more practical example.

We're fetching rows from a database, formatting what we want from each one, and displaying them on the screen.
Say we have three functions:

getRows, which takes an Int and returns an Array of Rows:

```
//+ getRows :: Int -> [Row]
getRows = function(i) { return db.getSomeRows(i); };
```

renderRow, which takes a Row and returns a snippet of Html:

```
//+ renderRow :: Row -> Html
renderRow = function(row) {
  return "<div>"+row.title+"</div>"
};
```

and drawOnScreen, which takes an Array of Html snippets and returns a Dom tree:

```
//+ drawOnScreen :: [Html] -> Dom
// you supply the code
```

From these bite-size pieces, each responsible for doing its own little job,
we use compose and map to build up our program:

```
//+ prog: Int -> Dom
prog = compose(drawOnScreen, map(renderRow), getRows);
```

Notice that when we compose functions, the data flows from right to left:
getRows takes in an Int and feeds an Array of Rows to the left,
where we use map to convert renderRow into a function that takes in that Array of Rows and feeds an Array of Html snippets to the left,
where drawOnScreen is ready to accept it and produce the Dom.
Here's how we think about it in terms of the type signatures, showing the same data flow from left to right:


```
//+ getRows ::        Int -> [Row]
//+ map(renderRow) ::        [Row] -> [Html]
//+ drawOnScreen ::                   [Html] -> Dom
//-------------------------------------------------
//+ prog ::           Int          ->           Dom
```

Haskell would be keeping track of the types for us and stopping us if we slip up,
but in JavaScript it's up to us to manage them. That's why we always try to annotate our functions with these comments.


----------------------------

Now shit's about to get realer because we need to fetch the rows asynchronously from a remote database! For this we're going to use our next Functor: Future. The VALUE of a Future is the actions that will produce the underlying value. That underlying value might an Array of Rows, or it might be the Dom. Once we have our Future, it provides a way to actually run those actions and resolve to the underlying value, but in the meantime we can compose and map until we're satisfied with how we've constructed the pure Future. MAPPING a function f over a Future that will resolve to a value x produces a new Future that will resolve to the value f(x).

*Continuations return null and kind of "disappear" into your app which makes it hard to see the control flow. It also leads to this "pyramid of doom" style or "callback hell" that so many people despise.


Often the callback gets passed to god knows where and is called god knows where.
```
getRows :: Int -> ([Row] -> a) -> void
prog :: Int -> void
prog = getRows(compose(map(drawOnScreen), map(map(renderRow))) //void
```

Since getRows returns void we can't compose it in a linear fashion or keep "extending the computation" like we do below
```
prog :: Int -> Dom
prog = compose(map(drawOnScreen), map(map(renderRow)), getRows)
```

(Future is defined in folktale's data.future repository (#!https://github.com/folktale/data.future).
fantasyland-pointfree incorporates functions that work the way we like
from several external libraries, and Future is one.)

We revise getRows to return a Future of an Array of Rows:

```
//+ getRows :: Int -> Future([Row])
getRows = function(i){
  return new Future(function(reject, resolve) {
    resolve(i + " rows from the database");
  });
};
```

and our program becomes:

```
//+ getRows ::             Int -> Future([Row])
//+ map(map(renderRow)) ::        Future([Row]) -> Future([Html])
//+ map(drawOnScreen) ::                           Future([Html]) -> Future(Dom)
//------------------------------------------------------------------------------
//+ prog ::                Int                  ->                   Future(Dom)
```

```
//+ prog :: Int -> Future(Dom)
prog = compose(map(drawOnScreen), map(map(renderRow)), getRows)
```

In a bit we'll cause the Future(Dom) to run its actions and resolve to that Dom object, but first let's unpack this a bit. We've mentioned that map(f) does the same thing conceptually over any Functor: transform the Functor into the corresponding Functor whose underlying value(s) are f(x). But when we say `map(map(renderRow))`, you might ask how HAL knows which map is which. (Besides from reading your lips.)  Map is polymorphic, and if we look at its definition, we'll see how that is implemented:

```
map = _.curry(function(f, obj){ return obj.map(f); })
```

Map simply delegates to the member function .map on whatever object it receives as its second argument. This allows us to partially apply it with the first argument f. The second argument, the one that determines which .map implementation will be called, is passed in from the right along the chain of composition. So the outer map of `map(map(renderRow))` will receive the Future from getRows, and the inner map will receive the Array of Rows inside the Future:

```
//+ map(map(renderRow), future_of_rows) :: Future([Row]) -> Future([Html])
//+ map(renderRow, rows) :: [Row] -> [Html]

```

(If you want to hear more about currying, see the talk [Hey Underscore, You're Doing It Wrong!](http://www.youtube.com/watch?v=m3svKOdZijA).


Future has a method `fork` that runs its actions and resolves to its underlying value, so we can invoke our prog like this:

```
prog(2).fork(function(err){}, function(result){}) // see folktale
```

and the page displaying two rows will be drawn when the Future's underlying value is realized.




Now let's see how the laws help us do a bit of refactoring.


- we remember compose is associative so we can simplify our prog with a helper
(This comes not from the Functor laws but from the fact that functions form a category; see below):


```
//+ makePage :: Future([Row]) -> Future(Dom)
makePage = compose(map(drawOnScreen), map(map(renderRow)));`

prog = compose(makePage, getRows);
```

- we remember our law: `compose(map(f), map(g)) == map(compose(f, g))`, so we factor out a map just like we do in oh, I don't know, ALGEBRA?:


```
//+ makePage :: Future([Row]) -> Future(Dom)
makePage = map(compose(drawOnScreen, map(renderRow)));

prog = compose(makePage, getRows);
```

- finally we notice we'd rather have makePage work on simpler types than Futures:


```
//+ makePage :: [Row] -> Dom
makePage = compose(drawOnScreen, map(renderRow));

prog = compose(map(makePage), getRows);
```



You will have noticed that as we manipulate functions with map and compose, we are exactly paralleling the way we manipulate variables with addition and multiplication; hence the term *algebra*.

```
(x + y) + z == x + (y + z) == add(x, y, z)
compose(compose(f, g), h) == compose(f, compose(g, h)) == compose(f, g, h)
```

```
add(mul(2, 4), mul(2,3)) == mul(add(4, 3), 2)
compose(map(f), map(g)) == map(compose(f, g))
```


