[![build status](https://secure.travis-ci.org/NickQiZhu/di.js.png)](http://travis-ci.org/NickQiZhu/di.js)

di-lite.js
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

di-lite can also be used standalone as a light-weight alternative to RequireJs if your application is small enough.


Install with npm
--------------------
npm install di-lite


Install without npm
--------------------
Download
* [di-lite](https://github.com/NickQiZhu/di.js)

How-to Guide
------------

### Basic Wiring

```js
var A = function(){
    ...
    this.dependencies = "b c";
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
instaceOfA.b === ctx.get("b"); // true
instaceOfA.c === ctx.get("c"); // true

var instanceOfB = ctx.get("b");
instanceOfB.c === ctx.get("c"); // true
```

### Singleton By Default

All objects created and managed by di.js container are by default singleton.

```js
ctx.get("a") === ctx.get("a"); // true
```

### Prototype Strategy

If you want container to create a new instance of your class each time you invoke ```get``` method then you need
to configure your registration with ```di.strategy.proto``` cache strategy.

```js
ctx.register("prototype", A).strategy(di.strategy.proto);
ctx.get("prototype") === ctx.get("prototype"); // false
```

### Passing Constructor Arguments

You can pass arguments to constructor function by using the additional parameter in ```register``` call.

```js
ctx.register("str", String, "hello world"); // signle simple argument
ctx.register("profileView", ProfileView, {el: "#profile_div"}); // signle object literal argument
ctx.register("array", Array, ["Saab","Volvo","BMW"]); // multiple argument is passed in using an array
```

### Cyclical Dependency

di.js container supports solution of cyclical dependencies, so the following dependency relationship is valid.

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

What if your are using functional object pattern and do not have a constructor function for your object? di.js fully
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

How to build di-lite locally
---------------------------

### Prerequisite modules

Make sure the following packages are installed on your machine
* node.js
* npm
* apache ant

### Install dependencies

di-lite$ npm install

### Build and Test

di-lite$ ./make


License
--------------------

di-lite is an open source javascript library and licensed under
[Apache License v2](http://www.apache.org/licenses/LICENSE-2.0.html).
