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
    version: "0.3.3",
    createContext: function () {
        var ctx = {
            map: {}
        };

        ctx.entry = function (name) {
            return ctx.map[name];
        };

        ctx.register = function (name, type, args) {
            var entry = di.entry(name, ctx)
                .type(type)
                .args(args);
            ctx.map[name] = entry;
            return entry;
        };

        ctx.has = function (name) {
            return ctx.entry(name) != null;
        }

        ctx.get = function (name) {
            if (ctx.has(name))
                return ctx.entry(name).object();
            else
                throw "Object[" + name + "] is not registered";
        };

        ctx.create = function (name, args) {
            if (ctx.entry(name).strategy() != di.strategy.proto)
                throw "Attempt to create singleton object";

            if (ctx.has(name))
                return ctx.entry(name).create(args);
            else
                throw "Object[" + name + "] is not registered";
        };

        ctx.initialize = function () {
            for (var name in ctx.map) {
                var entry = ctx.entry(name);
                ctx.ready(ctx.inject(name, ctx.get(name), entry.dependencies()));
            }
        };

        ctx.clear = function () {
            this.map = {};
        };

        function removeSpaces(s) {
            while (s.indexOf(" ") >= 0) s = s.replace(" ", "")
            return s;
        }

        ctx.inject = function (name, o, dependencies) {
            dependencies = dependencies ? dependencies : o.dependencies;

            if (o && dependencies) {
                var depExpList = removeSpaces(dependencies).split(",");

                depExpList.forEach(function (depExp) {
                    if (depExp) {
                        var exp = di.dependencyExpression(depExp);

                        var dep = ctx.get(exp.name);

                        if (dep == null)
                            throw "Dependency [" + name + "." + exp.property + "]->[" + exp.name + "] can not be satisfied";

                        o[exp.property] = dep;
                    }
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

    dependencyExpression: function (depExp) {
        var expression = {};

        var property = depExp;
        var name = depExp;

        if (depExp.indexOf("=") > 0) {
            var depExpParts = depExp.split("=");
            property = depExpParts[0];
            name = depExpParts[1];
        }

        expression.name = name;
        expression.property = property;

        return expression;
    },

    entry: function (name, ctx) {
        var entry = {};
        var name;
        var type;
        var object;
        var strategy = di.strategy.singleton;
        var args;
        var factory = di.factory.constructor;
        var dependencies;

        entry.create = function (newArgs) {
            return strategy(name, object, factory, type, newArgs ? newArgs : args, ctx, dependencies);
        };

        entry.object = function (o) {
            if (!arguments.length) {
                object = entry.create();
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

        entry.dependencies = function (d) {
            if (!arguments.length) return dependencies;
            dependencies = d;
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
        proto: function (name, object, factory, type, args, ctx, dependencies) {
            object = factory(type, args);
            return ctx.ready(ctx.inject(name, object, dependencies));
        },
        singleton: function (name, object, factory, type, args, ctx, dependencies) {
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