define([], function () {
    exports = {};

    exports.el = function (type, cls) {
        var el = document.createElement(type);
        el.className = cls;
        return el;
    };

    return exports;
});
