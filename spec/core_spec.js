require("./env")

describe("common", function() {
  it("contains version", function() {
    expect(di.version).toMatch(/^[0-9]+\.[0-9]+\.[0-9]+$/);
  });
});

describe("context", function(){
    var ctx;

    beforeEach(function(){
       ctx = di.createContext();
    });

    it("can register object by key", function(){
        ctx.register("profile", Profile);
        expect(ctx.find("profile") instanceof Profile).toBeTruthy();
    });
});

describe("dependency resolution", function(){
});

