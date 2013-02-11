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
        ctx.register(profileName, Profile);
        ctx.register(addressName, Address);
        ctx.register(creditCardName, CreditCard);
        ctx.initialize();
    });

    it("can register object by key", function () {
        expect(profile() instanceof Profile).toBeTruthy();
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



