require("./env")

describe("common", function() {
  it("contains version", function() {
    expect(di.version).toMatch(/^[0-9]+\.[0-9]+\.[0-9]+$/);
  });
});

describe("context", function(){
    it("can be created", function(){
        var ctx = di.createContext();
        expect(ctx).isPrototypeOf(di.Context);
    });
});

