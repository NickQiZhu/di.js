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
    version: "0.3.2",
    createContext: function () {
        var ctx = {
            map: {}
        };

        function resolve(ctx, name) {
            var entry = ctx.map[name];
            var object;

            if (!entry.resolved()) {
                object = ctx.ready(ctx.inject(name, entry, entry.dependencies()));
            } else {
                object = entry.object();
            }

            return object;
        }

        function removeSpaces(s) {
            while (s.indexOf(" ") >= 0) s = s.replace(" ", "");
            return s;
        }

        ctx.register = function (name, type, args) {
            var entry = di.entry(name, ctx)
                .type(type)
                .args(args);
            ctx.map[name] = entry;
            return entry;
        };

        ctx.has = function (name) {
            return ctx.map[name] != null;
        };

        ctx.get = function (name) {
            if (ctx.has(name)) {
                return resolve(ctx, name);
            } else {
                return null;
            }
        };

        ctx.initialize = function () {
            for (var name in ctx.map) {
                resolve(ctx, name);
            }
        };

        ctx.clear = function () {
            this.map = {};
        };

        ctx.inject = function (name, entry, dependencies) {
            var o = entry.object();
            dependencies = dependencies?dependencies:o.dependencies;

            entry.resolved(true);

            if (o && dependencies) {
                var depExpList = removeSpaces(dependencies).split(",");

                depExpList.forEach(function (depExp) {
                    if (depExp) {
                        var exp = di.dependencyExpression(depExp);

                        var dep = ctx.get(exp.name);

                        if (dep == null)
                            throw "Dependency [" + name + "." + exp.property + "]->[" + exp.name + "] can not be satisfied";

                        if (o[exp.property] != null)
                            throw "Dependency [" + name + "." + exp.property + "]->[" + exp.name + "] is overriding existing property";

                        o[exp.property] = dep;
                    }
                });
            }

            return o;
        };

        ctx.ready = function (o) {
            if (typeof o.ready === 'function')
                o.ready();

            return o;
        };

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
        var type;
        var object;
        var strategy = di.strategy.singleton;
        var args;
        var factory = di.factory.constructor;
        var dependencies;
        var resolved;

        entry.object = function (o) {
            if (!arguments.length) {
                object = strategy(name, object, factory, type, args, ctx, dependencies);
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

        entry.resolved = function (r) {
            if (!arguments.length) return resolved;
            resolved = r;
            return entry;
        };

        return entry;
    },

    strategy: {
        proto: function (name, object, factory, type, args, ctx, dependencies) {
            return factory(type, args);
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
};