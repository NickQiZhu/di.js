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
    version: "0.1.0",
    createContext: function () {
        var ctx = {
            map: {}
        };

        ctx.register = function (name, type) {
            var entry = di.entry().type(type);
            ctx.map[name] = entry;
            return entry;
        };

        ctx.find = function (name) {
            return ctx.map[name].value();
        };

        ctx.initialize = function () {
            var name;
            for (name in ctx.map) {
                var o = ctx.find(name);
                if (o.dependencies) {
                    var dependencyList = o.dependencies.split(" ");
                    dependencyList.forEach(function (dependencyName) {
                        var dependency = ctx.find(dependencyName);
                        o[dependencyName] = dependency;
                    });
                }
            }
        };

        return ctx;
    },

    entry: function () {
        var entry = {};
        var type;
        var value;
        var strategy;

        entry.value = function (v) {
            if (!arguments.length) {
                if (value == null)
                    value = new type();

                if(strategy === di.strategy.proto)
                    value = new type();

                return value;
            } else {
                value = v;
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

        return entry;
    },

    strategy: {
        proto: function () {},
        singleton: function(){}
    }
};