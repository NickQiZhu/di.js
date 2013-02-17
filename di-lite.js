/*
 *  Copyright 2013 the original author or authors.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
di = {
    version: "0.2.1",
    createContext: function () {
        var ctx = {
            map: {}
        };

        ctx.register = function (name, type, args) {
            var entry = di.entry(name, ctx)
                .type(type)
                .args(args);
            ctx.map[name] = entry;
            return entry;
        };

        ctx.has = function(name) {
            return ctx.map[name] != null;
        }

        ctx.get = function (name) {
            if(ctx.has(name))
                return ctx.map[name].object();
            else
                return null;
        };

        ctx.initialize = function () {
            for (var name in ctx.map) {
                ctx.ready(ctx.inject(name, ctx.get(name)));
            }
        };

        ctx.clear = function(){
            this.map = {};
        };

        ctx.inject = function (name, o) {
            if (o && o.dependencies) {
                var dependencyList = o.dependencies.split(" ");

                dependencyList.forEach(function (dependencyName) {
                    var dependency = ctx.get(dependencyName);

                    if(dependency == null)
                        throw "Dependency [" + name + "]->[" + dependencyName + "] can not be satisfied";

                    if(o[dependencyName] != null)
                        throw "Dependency [" + name + "]->[" + dependencyName + "] is overriding existing property";

                    o[dependencyName] = dependency;
                });
            }

            return o;
        }

        ctx.ready = function (o) {
            if (typeof o.ready === 'function')
                o.ready();

            return o;
        }

        return ctx;
    },

    entry: function (name, ctx) {
        var entry = {};
        var name;
        var type;
        var object;
        var strategy = di.strategy.singleton;
        var args;
        var factory = di.factory.constructor;

        entry.object = function (o) {
            if (!arguments.length) {
                object = strategy(name, object, factory, type, args, ctx);
                return object;
            } else {
                object = o;
                return entry;
            }
        };

        entry.strategy = function (s) {
            if (!arguments.length) return strategy;
            strategy = s;
            return entry;
        };

        entry.type = function (t) {
            if (!arguments.length) return type;
            type = t;
            return entry;
        };

        entry.args = function (a) {
            if (!arguments.length) return args;
            args = a;
            return entry;
        };

        entry.factory = function (f) {
            if (!arguments.length) return factory;
            factory = f;
            return entry;
        };

        return entry;
    },

    strategy: {
        proto:  function(name, object, factory, type, args, ctx){
            return ctx.ready(ctx.inject(name, factory(type, args)));
        },
        singleton: function(name, object, factory, type, args, ctx){
            if (!object)
                object = factory(type, args);

            return object;
        }
    },

    factory: {
        constructor: function (type, args) {
            if (args instanceof Array) {
                return eval(di.utils.invokeStmt(args, "new"));
            } else {
                return new type(args);
            }
        },

        func: function (type, args) {
            if (args instanceof Array) {
                return eval(di.utils.invokeStmt(args));
            } else {
                return type(args);
            }
        }
    }
};di.utils = {};

di.utils.invokeStmt = function (args, op) {
    var exp = op ? op : "";
    exp += " type(";
    var i = 0;
    for (; i < args.length; ++i)
        exp += "args[" + i + "],";
    if (i > 0) exp = exp.slice(0, exp.length - 1);
    exp += ")";
    return exp;
};