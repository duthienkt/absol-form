import ScalableComponent from "./ScalableComponent";
import inheritComponentClass from "./inheritComponentClass";
import BaseComponent from "./BaseComponent";

function BaseLayout() {
    ScalableComponent.call(this);
}

inheritComponentClass(BaseLayout, ScalableComponent);
BaseLayout.prototype.isLayout = true;


BaseLayout.prototype.styleHandlers.backgroundImage = {
    set: function (value) {
        if (value && value.length > 0) {
            this.domElt.addStyle('backgroundImage', 'url(' + value + ')');
            this.domElt.addStyle('backgroundSize', '100% 100%');
        }
        else {
            this.domElt.removeStyle('backgroundImage');
            this.domElt.removeStyle('backgroundSize');
        }
        return value;
    },
    export: function (ref) {
        return ref.get() || undefined;
    },
    descriptor: {
        type: 'text',
        long: true,
        sign: 'BackgroundImageSrc',
        independence: true
    }
};


BaseLayout.prototype.styleHandlers.backgroundColor = {
    set: function (value) {
        if (value) {
            this.domElt.addStyle('backgroundColor', value);
        }
        else {
            this.domElt.removeStyle('backgroundColor');
        }
        return value;
    },
    descriptor: {
        type: 'color',
        sign: 'BackgroundColor',
        independence: true
    }
};


BaseLayout.prototype.create = function () {
    ScalableComponent.prototype.create.call(this);
    this.style.vAlign = 'fixed';
    this.style.hAlign = 'fixed';
    this.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    this.style.backgroundImage = '';
};


BaseLayout.prototype.addChildByPosition = function (child, posX, posY) {
    throw new Error("Not implement!");
};


BaseLayout.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['backgroundColor', 'backgroundImage']);
};


BaseLayout.prototype.bindDataToFragment = function (parentDisembark, reset) {
    if (!this.fragment) return;
    if (!this.fragment.parent) return;
    /***
     *
     * @type {FmFragment}
     */
    var parentFragment = this.fragment.parent;
    var fragment = this.fragment;
    var name = this.attributes.name;
    if (!name) return;
    var boundProp = parentFragment.boundProps[name];
    if (!reset && boundProp === this) return;
    var descriptor = {
        set: function (obj) {
            fragment.props = obj;
        },
        get: function () {
            return fragment.props;
        }
    };
    if (!this.attributes.dataBinding) return;
    var obj = parentFragment.props;
    Object.assign(descriptor, {
        enumerable: !this.attributes.disembark && !parentDisembark,
        configurable: true
    });
    Object.defineProperty(obj, name, descriptor);
    this.fragment.boundProps[name] = this;
};

BaseLayout.prototype.unbindDataInFragment = function () {
    if (!this.fragment) return;
    if (!this.fragment.parent) return;
    var name = this.attributes.name;
    if (!name) return;
    /***
     *
     * @type {FmFragment}
     */
    var parentFragment = this.fragment.parent;
    console.log(parentFragment)
    var boundProp = parentFragment.boundProps[name];
    if (boundProp !== this) return;
    var obj = parentFragment.props;
    delete obj[name];
    delete parentFragment.boundProps[name];
};


export default BaseLayout;