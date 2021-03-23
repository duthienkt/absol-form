import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import Dom from "absol/src/HTML5/Dom";
import OOP from "absol/src/HTML5/OOP";

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

OOP.mixClass(Image, ScalableComponent);

Image.prototype.tag = "Image";
Image.prototype.menuIcon = "span.mdi.mdi-image-outline";

Image.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.src = '';
}

Image.prototype.render = function () {
    return _('img');
};


Image.prototype.setAttributeSrc = function (value) {
    var self = this;
    this.view.src = value;
    this.loadedSync = Dom.waitImageLoaded(this.view).then(function () {
        self.naturalWidth = self.view.naturalWidth || 0;
        self.naturalHeight = self.view.naturalHeight || 0;
        return [self.naturalWidth, self.naturalHeight]
    });

    return value;
};


Image.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['src', 'naturalSize']);
};


Image.prototype.getAttributeSrcDescriptor = function () {
    return {
        type: "text",
        long: true,
        sign: 'SimpleUrl'
    };
};

Image.prototype.getAttributeNaturalSizeDescriptor = function () {
    return {
        type: 'const',
        value: this.loadedSync.then(function (wh) {
            return wh.join(' x ')
        })
    };
};

Image.prototype.getDataBindingDescriptor = function () {
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


export default Image;