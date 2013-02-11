Backbone = require("backbone");

require("../di");

Profile = Backbone.Model.extend({
    id:"profile",
    dependencies: "address"
});

Address = Backbone.Model.extend({
    id:"address",
    dependencies: "creditCard"
});

CreditCard = Backbone.Model.extend({
    id:"credit_card"
});