di.utils = {};

di.utils.invokeStmt = function (args, op) {
    var exp = op ? op : "";
    exp += " type(";
    var i = 0;
    for (; i < args.length; ++i)
        exp += "args[" + i + "],";
    if (i > 0) exp = exp.slice(0, exp.length - 1);
    exp += ")";
    return exp;
};