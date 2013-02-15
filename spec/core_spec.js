require("./env")

describe("core", function() {
  it("contains version", function() {
    expect(di.version).toMatch(/^[0-9]+\.[0-9]+\.[0-9]+$/);
  });
});

