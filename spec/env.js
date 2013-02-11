Backbone = require("backbone");

require("../di");

Profile = Backbone.Model.extend({
    id: "profile",
    dependencies: "address creditCard"
});

Address = Backbone.Model.extend({
    id: "address",
    dependencies: ""
});

CreditCard = Backbone.Model.extend({
    id: "credit_card",
    dependencies: "address"
});