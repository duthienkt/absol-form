import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import Dom from "absol/src/HTML5/Dom";

var _ = Fcore._;

function Image() {
    ScalableComponent.call(this);
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.loadedSync = Promise.resolve([0, 0]);
}

Object.defineProperties(Image.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
Image.prototype.constructor = Image;

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
        long: true
    };
};

Image.prototype.getAttributeNaturalSizeDescriptor = function () {
    return {
        type: 'const',
        value: this.loadedSync.then(function(wh){ return wh.join(' x ')})
    }
};

// Image.prototype.getAttributeRealSizeDescriptor = function () {
//     return {
//         type: 'const',
//         value: this.naturalWidth + ' x ' + this.naturalHeight
//     }
// };

export default Image;