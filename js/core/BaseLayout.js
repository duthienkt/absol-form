import ScalableComponent from "./ScalableComponent";

function BaseLayout(){
    ScalableComponent.call(this);

}


Object.defineProperties(BaseLayout.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
BaseLayout.prototype.constructor = BaseLayout;

BaseLayout.prototype.isLayout = true;


BaseLayout.prototype.create = function () {
    ScalableComponent.prototype.create.call(this);
    this.style.vAlign = 'fixed';
    this.style.hAlign = 'fixed';
    this.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    this.style.backgroundImage = '';
};


/**
 * @param {BaseComponent} component
 * @returns {BaseComponent} auto set disable style 
 */
BaseLayout.prototype.reMeasureChild = function (component) {
    //not implement
};

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

BaseLayout.prototype.setStyleBackgroundColor = function (value) {
    this.view.addStyle('backgroundColor', value);
    return value;
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
        type: 'color'
    };
};

BaseLayout.prototype.getStyleBackgroundImageDescriptor = function () {
    return {
        type: 'text',
        long:true
    };
};

export default BaseLayout;