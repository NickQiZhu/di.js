Backbone = require("backbone");

require("../di-lite");

Profile = Backbone.Model.extend({
    id: "profile",
    dependencies: "address, personalCreditCard = creditCard",
    checkDependencies: function(){
        if(this.address != null && this.personalCreditCard != null)
            return true;

        return false;
    },
    ready: function(){
        this.out = "ready";
    }
});

Address = Backbone.Model.extend({
    id: "address",
    dependencies: ""
});

CreditCard = Backbone.Model.extend({
    id: "credit_card",
    dependencies: "address"
});

Profiles = Backbone.Collection.extend({
    model: Profile
});