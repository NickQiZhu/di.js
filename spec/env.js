Backbone = require("backbone");

require("../di");

Profile = Backbone.Model.extend({
    id: "profile",
    dependencies: "address creditCard",
    checkDependencies: function(){
        if(this.address != null && this.creditCard != null)
            return true;

        return false;
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

Disposable = Backbone.Model.extend({
    id: "disposable",
    dependencies: "profile"
});