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
        return ctx.find(profileName);
    }

    function creditCard() {
        return ctx.find(creditCardName);
    }

    function profileCollection() {
        return ctx.find(profileCollectionName);
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

    it("can support prototype strategy", function () {
        var name = "disposable";
        ctx.register(name, String).strategy(di.strategy.proto);
        ctx.initialize();
        expect(ctx.find(name) != ctx.find(name)).toBeTruthy();
    });

    it("can support prototype strategy", function () {
        var name = "singleton";
        ctx.register(name, String).strategy(di.strategy.singleton);
        ctx.initialize();
        expect(ctx.find(name) === ctx.find(name)).toBeTruthy();
    });

    it("can support constructor arguments in object literal", function () {
        expect(profile().get("name")).toBe("Nick");
        expect(profile().get("job")).toBe("Less");
    });

    it("can support constructor arguments in single value", function () {
        var name = "string";
        ctx.register(name, String, "test");
        ctx.initialize();
        expect(ctx.find(name) == "test").toBeTruthy();
    });

    it("can support constructor arguments in single value", function () {
        var name = "string";
        ctx.register(name, String, "test");
        ctx.initialize();
        expect(ctx.find(name) == "test").toBeTruthy();
    });

    it("can support constructor arguments in array", function () {
        expect(profileCollection().pop().get("name")).toBe("Joe");
        expect(profileCollection().comparator).toBe(comparator);
    });

    it("can support function invocation wo/ args", function () {
        var name = "func";
        ctx.register(name,function () {
            return "test"
        }).factory(di.factory.func);
        ctx.initialize();
        expect(ctx.find(name) == "test").toBeTruthy();
    });

    it("can support function invocation w/ single arg", function () {
        var name = "func";
        ctx.register(name,function (s) {
            return new String(s);
        }, "test").factory(di.factory.func);
        ctx.initialize();
        expect(ctx.find(name) == "test").toBeTruthy();
    });

    it("can support function invocation w/ multiple args", function () {
        var name = "func";
        ctx.register(name,function (a, b) {
            return new String(a + " " + b);
        }, ["test", "me"]).factory(di.factory.func);
        ctx.initialize();
        expect(ctx.find(name) == "test me").toBeTruthy();
    });

    describe("dependency resolution", function () {

        function validateProfileDependencies(profile) {
            expect(profile.address instanceof Address).toBeTruthy();
            expect(profile.creditCard instanceof CreditCard).toBeTruthy();
            expect(profile.checkDependencies()).toBeTruthy();
            validateCreditCardDependencies(profile.creditCard);
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

        it("can resolve dependencies for prototype object", function(){
            var name = "obj";
            ctx.register(name, Profile).strategy(di.strategy.proto);
            ctx.initialize();
            validateProfileDependencies(ctx.find(name));
        });
    });

    describe("lifecycle", function () {
        it("should invoke ready after wiring", function () {
            expect(profile().out).toBe("ready");
        });
    });
});



