[![build status](https://secure.travis-ci.org/NickQiZhu/di.js.png)](http://travis-ci.org/NickQiZhu/di.js)

di.js
=====

di.js is designed to act as a minimalistic dependency injection container in Javascript. It has no dependency on
any other framework such as CommonJs or RequireJs in contrary to some of other more heavy weight DI container
implementation on the web.

Use Cases
---------

di.js is initially extracted from a Backbone.js based application. In this application, RequireJs is used to wire
dependencies at module level. Each module could contain multiple views and models. We found using RequireJs to wire
every individual view and model is a bit of overkill and verbose, however we still want the inversion of control to
keep our code nicely isolated and testable. That's the reason behind the creation of this lightweight container
implementation - to provide dependencies injection at sub-modular level. di.js can also be used standalone as a
light-weight alternative to RequireJs if your application is small enough.


How to build di.js locally
---------------------------

### Prerequisite modules

Make sure the following packages are installed on your machine
* node.js
* npm
* apache ant

### Install dependencies

di.js$ npm install

### Build and Test

di.js$ ./make


License
--------------------

di.js is an open source javascript library and licensed under
[Apache License v2](http://www.apache.org/licenses/LICENSE-2.0.html).
