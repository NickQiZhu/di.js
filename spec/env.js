Backbone = require("backbone");

require("../di");

Profile = Backbone.Model.extend({
    name:"profile",
    dependencies: "address"
});

Address = Backbone.Model.extend({
    name:"address"
});