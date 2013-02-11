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

    function profile() {
        return ctx.find(profileName);
    }

    function creditCard() {
        return ctx.find(creditCardName);
    }

    beforeEach(function () {
        ctx = di.createContext();
        ctx.register(profileName, Profile, {name: "Nick", job: "Less"});
        ctx.register(addressName, Address);
        ctx.register(creditCardName, CreditCard);
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
        expect(profile().attributes.name).toBe("Nick");
        expect(profile().attributes.job).toBe("Less");
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

    describe("dependency resolution", function () {
        it("can resolve simple dependency", function () {
            expect(creditCard().address instanceof Address).toBeTruthy();
        });

        it("can resolve composite dependencies", function () {
            expect(profile().address instanceof Address).toBeTruthy();
            expect(profile().creditCard instanceof CreditCard).toBeTruthy();
        });

        it("dependencies are set to correct scope", function () {
            expect(profile().checkDependencies()).toBeTruthy();
        });
    });
});



