di-lite.coffee [![Build Status](https://travis-ci.org/squareteam/di.coffee.png?branch=master)](https://travis-ci.org/squareteam/di.coffee) [![Dependency Status](https://gemnasium.com/squareteam/di.coffee.png)](https://gemnasium.com/squareteam/di.coffee)
==========

di-lite is designed to act as a minimalistic dependency injection container in Javascript. It has no dependency on
any other framework such as CommonJs or RequireJs in contrary to some of other more heavy weight DI container
implementation on the web.

Use Cases
---------

di-lite was initially extracted from a Backbone.js based application. In this application, RequireJs was used to wire
dependencies at module level. Each module could contain multiple views and models. We found using RequireJs to wire
every individual view and model is a bit of overkill and verbose, however we still want the inversion of control to
keep our code nicely isolated and testable. That's the reason behind the creation of this lightweight container
implementation - to provide dependencies injection at sub-modular level.

That being said di-lite is designed to be used standalone there is no dependency on Backbone or RequireJs. Its a fully
functional dependency injection container by itself while extremely lightweight and works well both in browser or node.


Install with npm
--------------------
npm install di-lite


Install without npm
--------------------
Download
* [di-lite](https://github.com/NickQiZhu/di.js)

How-to Guide
------------

* [Basic Wiring](#basic-wiring)
* [Wiring with Assignment](#wiring-with-assignment)
* [Passive Dependency Resolution](#passive-dependency-resolution)
* [Singleton By Default](#singleton-by-default)
* [Prototype Strategy](#prototype-strategy)
* [Passing Constructor Arguments](#passing-constructor-arguments)
* [Cyclical Dependency](#cyclical-dependency)
* [Functional Object](#functional-object)
* [Lifecycle Hook](#lifecycle-hook)
* [Runtime Dependencies Override](runtime-dependencies-override)
* [Create Your Own](#create-your-own)

### Basic Wiring

```js
var A = function(){
    ...
    this.dependencies = "b, c";
    ...
};
var B = function(){
    ...
    this.dependencies = "c";
    ...
};
var C = funciton(){...};

// create di context
var ctx = di.createContext();

// register a class with an unique name
ctx.register("a", A);
ctx.register("b", B);
ctx.register("c", C);

// initialize di container so all singleton(default) objects will be wired at this stage
ctx.initialize();

var instanceOfA = ctx.get("a");
instanceOfA.b === ctx.get("b"); // true
instanceOfA.c === ctx.get("c"); // true

var instanceOfB = ctx.get("b");
instanceOfB.c === ctx.get("c"); // true
```
### Wiring with Assignment
By default dependencies are wired using their registered name respectively, however you can override this behavior by
including an explicit assignment in dependency definition. You can also mix both explicit and implicit assignment in
dependency definition.

```js
var A = function(){
    ...
    this.dependencies = "bee=b, c"; // mix explicit and implicit assignment
    ...
};

ctx.initialize();

var instanceOfA = ctx.get("a");
instanceOfA.bee === ctx.get("b"); // true - explicit assignment
instanceOfA.c   === ctx.get("c"); // true - implicit assignment
```

### Passive Dependency Resolution
di-lite container resolves dependency passively on demand when ```get()``` method is invoked. It only tries to resolve
dependency for this particular object thus only traverse its sub-dependency-tree. ```initialize()``` call does resolve
all dependencies for all registered objects however it is actually optional (though recommended to guarantee).

```js
ctx.register("a", A);
ctx.get("a"); // this triggers the dependency resolution for "a" alone
ctx.initialize(); // this triggers the dependency resolution for everyone registered
```

### Singleton By Default

All objects created and managed by di-lite.js container are by default singleton.

```js
ctx.get("a") === ctx.get("a"); // true
```

### Prototype Strategy

If you want container to create a new instance of your class each time you invoke ```get``` method then you need
to configure your registration with ```di.strategy.proto``` cache strategy.

```js
ctx.register("prototype", A).strategy(di.strategy.proto);
ctx.get("prototype") === ctx.get("prototype"); // false
ctx.create("prototype", 100); // create can be used if you want to explicitly pass in a new parameter
```

### Passing Constructor Arguments

You can pass arguments to constructor function by using the additional parameter in ```register``` call.

```js
ctx.register("str", String, "hello world"); // signle simple argument
ctx.register("profileView", ProfileView, {el: "#profile_div"}); // signle object literal argument
ctx.register("array", Array, ["Saab","Volvo","BMW"]); // multiple argument is passed in using an array
```

### Cyclical Dependency

di-lite.js container supports solution of cyclical dependencies, so the following dependency relationship is valid.

```js
var A = function(){
    ...
    this.dependencies = "b";
    ...
};
var B = function(){
    ...
    this.dependencies = "a";
    ...
};

ctx.register("a", A);
ctx.register("b", B);

ctx.initialize();

ctx.get("a").b === ctx.get("b"); // true
ctx.get("b").a === ctx.get("a"); // true
ctx.get("a").b.a === ctx.get("a"); // true
ctx.get("b").a.b === ctx.get("b"); // true
```

### Functional Object

What if your are using functional object pattern and do not have a constructor function for your object? di-lite.js fully
supports functional object pattern since we believe this is the best way to create javascript object anyway.

```js
var FuncObject = function(spec){
    var that = {};
    ...
    return that;
};

ctx.register("funcObjSingleton", FuncObject, spec).factory(di.factory.func);

// function chaining can be used to customize your object registration
ctx.register("funcObjProto", FuncObject, spec)
    .strategy(di.strategy.proto)
    .factory(di.factory.func);

ctx.initialize();

ctx.get("funcObjSingleton"); // will return you a signleton instance of FuncObject
ctx.get("funcObjProto"); // will return you a new instance of FuncObject each time
```

### Lifecycle Hook

di-lite container provides a lifecycle hook callback ```ready``` if the wired object provide a ```ready``` function
then the callback will be executed once all dependencies are satisfied.

```js
var MyView = Backbone.View.extend({
    ...
    dependencies: "otherView, myModel",
    ready: function(){this.render();} // called once all dependencies are satisfied
    ...
});
```

### Runtime Dependencies Override
What if I need to provide different dependencies different instances of the same class?

```js
ctx.register("a", A)
    .dependencies("bee=b"); // dependencies specified here will take precedence
...
ctx.get("a").bee === ctx.get("b"); // true
```

### Create Your Own

Sometimes you just don't have control over the object you want to wire or maybe you need to create the object
and initialize before anything else is create or even registered. You can manually insert object into di-lite
container and control the whole creation process this way.

```js
ctx.register("history").object(Backbone.history);
...
ctx.get("history").start(); // you can use it since it is already created and initialized
...
ctx.initialize(); // initialize the rest of the objects
```

How to build di-lite locally
---------------------------

### Prerequisite modules

Make sure the following packages are installed on your machine
* node.js
* npm

### Install dependencies

```bash
di-lite$ npm install
```

### Build

```bash
di-lite$ grunt build
```

### Tests

```bash
di-lite$ grunt test
```

License
--------------------

di-lite is an open source javascript library and licensed under
[Apache License v2](http://www.apache.org/licenses/LICENSE-2.0.html).
