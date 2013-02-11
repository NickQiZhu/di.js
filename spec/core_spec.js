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

    beforeEach(function () {
        ctx = di.createContext();
        ctx.register(profileName, Profile);
        ctx.register(addressName, Address);
        ctx.register("creditCard", CreditCard);
        ctx.initialize();
    });

    it("can register object by key", function () {
        expect(ctx.find(profileName) instanceof Profile).toBeTruthy();
    });

    describe("dependency resolution", function () {
        it("can resolve simple dependency", function () {
            expect(ctx.find(addressName).creditCard instanceof CreditCard).toBeTruthy();
        });
    });
});



