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

    beforeEach(function () {
        ctx = di.createContext();
        ctx.register(profileName, Profile);
        ctx.register(addressName, Address);
        ctx.register(creditCardName, CreditCard);
        ctx.initialize();
    });

    it("can register object by key", function () {
        expect(ctx.find(profileName) instanceof Profile).toBeTruthy();
    });

    describe("dependency resolution", function () {
        it("can resolve simple dependency", function () {
            expect(ctx.find(creditCardName).address instanceof Address).toBeTruthy();
        });

        it("can resolve composite dependencies", function () {
            expect(ctx.find(profileName).address instanceof Address).toBeTruthy();
            expect(ctx.find(profileName).creditCard instanceof CreditCard).toBeTruthy();
        });
    });
});



