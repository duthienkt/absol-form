import ScalableComponent from "./ScalableComponent";
import {inheritComponentClass} from "./BaseComponent";

function BaseLayout(){
    ScalableComponent.call(this);

}

inheritComponentClass(BaseLayout,ScalableComponent );
BaseLayout.prototype.isLayout = true;


BaseLayout.prototype.create = function () {
    ScalableComponent.prototype.create.call(this);
    this.style.vAlign = 'fixed';
    this.style.hAlign = 'fixed';
    this.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    this.style.backgroundImage = '';
};

BaseLayout.prototype.styleHandlers.backgroundColor = {
    set: function (value){
        this.domElt.addStyle('backgroundColor', value);
    }
}


BaseLayout.prototype.addChildByPosition = function (child, posX, posY) {
    throw new Error("Not implement!");
};


BaseLayout.prototype.getAcceptsAttributeNames = function () {
    var res = ScalableComponent.prototype.getAcceptsAttributeNames.call(this);
    if (this.attributes.formType) {
        res = ['formType'].concat(res);
    }
    return res;
};

BaseLayout.prototype.getAttributeFormTypeDescriptor = function () {
    return {
        type: 'const',
        value: this.attributes.formType
    }
};


BaseLayout.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['backgroundColor', 'backgroundImage']);
};


BaseLayout.prototype.setStyleBackgroundImage = function (value) {
    if (value && value.length > 0){
        this.view.addStyle('backgroundImage', 'url(' + value + ')');
        this.view.addStyle('backgroundSize', '100% 100%');
    }
    else{
        this.view.removeStyle('backgroundImage');
        this.view.removeStyle('backgroundSize');
    }
    return value;
};

BaseLayout.prototype.getStyleBackgroundColorDescriptor = function () {
    return {
        type: 'color',
        sign:'BackgroundColor',
        independence: true
    };
};

BaseLayout.prototype.getStyleBackgroundImageDescriptor = function () {
    return {
        type: 'text',
        long:true, 
        sign:'BackgroundImageSrc',
        independence: true
    };
};

export default BaseLayout;