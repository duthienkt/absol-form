import OOP from "absol/src/HTML5/OOP";

export default function inheritComponentClass(constructor) {
    OOP.mixClass.apply(OOP, arguments);
    var cClass;
    var attributeHandlers = undefined;
    var styleHandlers = undefined;
    var compStyleHandlers = undefined;
    var pinHandlers = undefined;
    for (var i = 1; i < arguments.length; ++i) {
        cClass = arguments[i];
        if (cClass.prototype.attributeHandlers) {
            attributeHandlers = attributeHandlers || {};
            Object.assign(attributeHandlers, cClass.prototype.attributeHandlers || {});
        }
        if (cClass.prototype.styleHandlers) {
            styleHandlers = styleHandlers || {};
            Object.assign(styleHandlers, cClass.prototype.styleHandlers || {});

        }
        if (cClass.prototype.compStyleHandlers) {
            compStyleHandlers = compStyleHandlers || {};
            Object.assign(compStyleHandlers, cClass.prototype.compStyleHandlers || {});

        }

        if (cClass.prototype.pinHandlers) {
            pinHandlers = pinHandlers || {};
            Object.assign(pinHandlers, cClass.prototype.pinHandlers || {});

        }
    }
    if (attributeHandlers)
        constructor.prototype.attributeHandlers = attributeHandlers;
    if (styleHandlers)
        constructor.prototype.styleHandlers = styleHandlers;
    if (compStyleHandlers)
        constructor.prototype.compStyleHandlers = compStyleHandlers;
    if (pinHandlers)
        constructor.prototype.pinHandlers = pinHandlers;
}