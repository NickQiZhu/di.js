require("./env")

describe("common", function () {
    it("contains version", function () {
        expect(di.version).toMatch(/^[0-9]+\.[0-9]+\.[0-9]+$/);
    });
});

describe("context", function () {
    var ctx;
    var profileName = "profile";
    var addressName = "address";
    var creditCardName = "creditCard";
    var profileCollectionName = "profileCollection";
    var comparator = function (profile) {
        return profile.get("name");
    };

    function profile() {
        return ctx.get(profileName);
    }

    function creditCard() {
        return ctx.get(creditCardName);
    }

    function profileCollection() {
        return ctx.get(profileCollectionName);
    }

    beforeEach(function () {
        ctx = di.createContext();
        ctx.register(profileName, Profile, {name: "Nick", job: "Less"});
        ctx.register(addressName, Address);
        ctx.register(creditCardName, CreditCard);
        ctx.register(profileCollectionName, Profiles, [
            [new Profile({name: "Joe", job: "Dev"})],
            {comparator: comparator}
        ]);
        ctx.initialize();
    });

    it("can register object by key", function () {
        expect(profile() instanceof Profile).toBeTruthy();
    });

    it("by default use singleton strategy", function () {
        expect(profile() === profile()).toBeTruthy();
    });

    it("throw exception if object is not registered", function () {
        try {
            ctx.get("non-exist");
        } catch (e) {
            return;
        }

        throw "Failed";
    });

    it("can support prototype strategy", function () {
        ctx.clear();

        var name = "disposable";
        ctx.register(name, String).strategy(di.strategy.proto);
        ctx.initialize();
        expect(ctx.get(name) != ctx.get(name)).toBeTruthy();
    });

    it("can support prototype strategy", function () {
        ctx.clear();

        var name = "singleton";
        ctx.register(name, String).strategy(di.strategy.singleton);
        ctx.initialize();
        expect(ctx.get(name) === ctx.get(name)).toBeTruthy();
    });

    it("can support constructor arguments in object literal", function () {
        expect(profile().get("name")).toBe("Nick");
        expect(profile().get("job")).toBe("Less");
    });

    it("can support constructor arguments in single value", function () {
        ctx.clear();

        var name = "string";
        ctx.register(name, String, "test");
        ctx.initialize();
        expect(ctx.get(name) == "test").toBeTruthy();
    });

    it("can support constructor arguments in single value", function () {
        ctx.clear();

        var name = "string";
        ctx.register(name, String, "test");
        ctx.initialize();
        expect(ctx.get(name) == "test").toBeTruthy();
    });

    it("can support constructor arguments in array", function () {
        expect(profileCollection().pop().get("name")).toBe("Joe");
        expect(profileCollection().comparator).toBe(comparator);
    });

    it("can support function invocation wo/ args", function () {
        ctx.clear();

        var name = "func";
        ctx.register(name,function () {
            return "test"
        }).factory(di.factory.func);
        ctx.initialize();
        expect(ctx.get(name) == "test").toBeTruthy();
    });

    it("can support function invocation w/ single arg", function () {
        ctx.clear();

        var name = "func";
        ctx.register(name,function (s) {
            return new String(s);
        }, "test").factory(di.factory.func);
        ctx.initialize();
        expect(ctx.get(name) == "test").toBeTruthy();
    });

    describe("dependency resolution", function () {

        function validateProfileDependencies(profile) {
            expect(profile.address instanceof Address).toBeTruthy();
            expect(profile.personalCreditCard instanceof CreditCard).toBeTruthy();
            expect(profile.checkDependencies()).toBeTruthy();
            validateCreditCardDependencies(profile.personalCreditCard);
        }

        function validateCreditCardDependencies(card) {
            expect(card.address instanceof Address).toBeTruthy();
        }

        it("can resolve simple dependency", function () {
            validateCreditCardDependencies(creditCard());
        });

        it("can resolve composite dependencies", function () {
            validateProfileDependencies(profile());
        });

        it("can resolve dependencies for prototype object", function () {
            var name = "obj";
            ctx.register(name, Profile).strategy(di.strategy.proto);
            validateProfileDependencies(ctx.get(name));
        });

        describe("fine grain dependency wiring", function () {
            beforeEach(function () {
                ctx.clear();
            });

            it("can resolve cyclical dependencies", function () {
                ctx.register("a",function () {
                    return {dependencies: "b"};
                }).factory(di.factory.func);
                ctx.register("b",function () {
                    return {dependencies: "a"};
                }).factory(di.factory.func);

                ctx.initialize();

                expect(ctx.get("a").b === ctx.get("b")).toBeTruthy();
                expect(ctx.get("b").a === ctx.get("a")).toBeTruthy();
                expect(ctx.get("a").b.a === ctx.get("a")).toBeTruthy();
                expect(ctx.get("b").a.b === ctx.get("b")).toBeTruthy();
            });

            it("can resolve dependencies with assignment", function () {
                ctx.register("a",function () {
                    return {dependencies: " bee = b ,be=b "};
                }).factory(di.factory.func);
                ctx.register("b",function () {
                    return {};
                }).factory(di.factory.func);

                ctx.initialize();

                expect(ctx.get("a").bee === ctx.get("b")).toBeTruthy();
                expect(ctx.get("a").be === ctx.get("b")).toBeTruthy();
            });

            it("can resolve dependencies from prototype to prototype", function () {
                ctx.register("a",function () {
                    return {dependencies: "b"};
                }).factory(di.factory.func).strategy(di.strategy.proto);
                ctx.register("b",function () {
                    return {};
                }).factory(di.factory.func).strategy(di.strategy.proto);

                ctx.initialize();

                expect(ctx.get("a").b).not.toBe(null);
            });

            it("should throw exception if try to create non-exist object", function () {
                try {
                    ctx.create("a", 90);
                } catch (e) {
                    return;
                }

                throw "Failed";
            });

            it("should allow creating prototype instance with dependencies", function () {
                ctx.register("a",function (val) {
                    return {value: val, dependencies: "b"};
                }, 10).factory(di.factory.func).strategy(di.strategy.proto);
                ctx.register("b",function () {
                    return {};
                }).factory(di.factory.func);

                ctx.initialize();

                var a = ctx.create("a", 90);
                expect(a.value).toBe(90);
                expect(ctx.get("a").b === ctx.get("b")).toBe(true);

                a = ctx.create("a");
                expect(a.value).toBe(10);
                expect(ctx.get("a").b === ctx.get("b")).toBe(true);
            });

            it("should throw exception if try to create singleton object", function () {
                ctx.register("a",function () {
                    return {};
                }).factory(di.factory.func);

                try {
                    ctx.create("a");
                } catch (e) {
                    return;
                }

                throw "Failed";
            });

            it("should ignore empty dependencies", function () {
                ctx.register("a",function () {
                    return {dependencies: " "};
                }).factory(di.factory.func);

                ctx.initialize();
            });

            it("should ignore null dependencies", function () {
                ctx.register("a",function () {
                    return {dependencies: null};
                }).factory(di.factory.func);

                ctx.initialize();
            });

            it("will report error if dependency are not fully satisfied", function () {
                ctx.register("a",function () {
                    return {dependencies: "b"};
                }).factory(di.factory.func);

                try {
                    ctx.initialize();
                } catch (e) {
                    return;
                }

                throw "Failed";
            });

            it("should allow dependencies override", function () {
                ctx.register("a",function () {
                    return {};
                }).factory(di.factory.func).dependencies("b=b");

                ctx.register("b",function () {
                    return {};
                }).factory(di.factory.func);

                ctx.initialize();
                expect(ctx.get("a").b === ctx.get("b")).toBeTruthy();
            });

            it("should allow dependencies override", function () {
                ctx.register("a",function () {
                    return {};
                }).strategy(di.strategy.proto).factory(di.factory.func).dependencies("b=b");

                ctx.register("b",function () {
                    return {};
                }).factory(di.factory.func);

                ctx.initialize();
                expect(ctx.get("a").b === ctx.get("b")).toBeTruthy();
            });
        });
    });

    describe("lifecycle", function () {
        it("should invoke ready after wiring singleton object", function () {
            expect(profile().out).toBe("ready");
        });

        it("should invoke ready after wiring prototype object", function () {
            var name = "obj";
            ctx.register(name, Profile).strategy(di.strategy.proto);
            expect(ctx.get(name).out).toBe("ready");
        });
    });
});



