import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import Dom from "absol/src/HTML5/Dom";
import OOP from "absol/src/HTML5/OOP";
import {AssemblerInstance} from "../core/Assembler";
import inheritComponentClass from "../core/inheritComponentClass";

var _ = Fcore._;

/**
 * @extends ScalableComponent
 * @constructor
 */
function Image() {
    ScalableComponent.call(this);
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.loadedSync = Promise.resolve([0, 0]);
}

inheritComponentClass(Image, ScalableComponent);

Image.prototype.tag = "Image";
Image.prototype.menuIcon = "span.mdi.mdi-image-outline";

Image.prototype.attributeHandlers.src = {
    set: function (value) {
        this.domElt.src = value;
    },
    get: function () {
        return this.domElt.src;
    },
    descriptor: {
        type: "text",
        long: true,
        sign: 'SimpleUrl'
    }
};

Image.prototype.attributeHandlers.naturalSize = {
    getDescriptor: function () {
        return {
            type: 'const',
            value: this.loadedSync.then(function (wh) {
                return wh.join(' x ')
            })
        };
    }
};

Image.prototype.pinHandlers.src = {
    receives: function (value) {
        this.attributes.src = value;
    }
};


Image.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.src = '';
}

Image.prototype.render = function () {
    return _('img');
};


Image.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['src', 'naturalSize']);
};


Image.prototype.createDataBindingDescriptor = function () {
    var thisC = this;
    return {
        configurable: true,
        set: function (value) {
            thisC.setAttribute('src', value);
        },
        get: function () {
            return thisC.getAttribute('src');
        }
    }
};

AssemblerInstance.addClass(Image);

export default Image;