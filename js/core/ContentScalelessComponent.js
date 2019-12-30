import Fcore from "../core/FCore";

import '../../css/component.css';
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;
var $ = Fcore.$;

function ContentScalelessComponent() {
    ScalableComponent.call(this);
}

Object.defineProperties(ContentScalelessComponent.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
ContentScalelessComponent.prototype.constructor = ContentScalelessComponent;

ContentScalelessComponent.prototype.tag = "ContentScalelessComponent";

ContentScalelessComponent.prototype.BOX_ALIGN_CLASSES = {
    lefttop: 'as-align-left-top',
    centertop: 'as-align-center-top',
    righttop: 'as-align-right-top',

    leftcenter: 'as-align-left-center',
    centercenter: 'as-align-center-center',
    rightcenter: 'as-align-right-center',

    leftbottom: 'as-align-left-bottom',
    centerbottom: 'as-align-center-bottom',
    rightbottom: 'as-align-right-bottom'
};

ContentScalelessComponent.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.style.boxAlign = 'lefttop';
};


ContentScalelessComponent.prototype.onCreated = function () {
    this.$cell = $('.as-component-content-scaleless-cell', this.view);
    this.$content = this.$cell.childNodes[0];
    ScalableComponent.prototype.onCreated.call(this);
};


ContentScalelessComponent.prototype.render = function () {
    return _({
        class: 'as-component-content-scaleless',
        child: {
            class: 'as-component-content-scaleless-cell',
            child: this.renderContent()
        }
    });
};


ContentScalelessComponent.prototype.renderContent = function () {
    throw new Error('Not Implement!');
};


ContentScalelessComponent.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['boxAlign']);
};


ContentScalelessComponent.prototype.getStyleBoxAlignDescriptor = function () {
    return {
        type: 'boxAlign'
    }
};

ContentScalelessComponent.prototype.setStyleBoxAlign = function (value) {
    var accepts = Object.keys(this.BOX_ALIGN_CLASSES);
    if (accepts.indexOf(value) < 0) value = 'lefttop';
    var lastClass = this.BOX_ALIGN_CLASSES[this.style.boxAlign];
    if (lastClass) this.view.removeClass(lastClass);
    console.log(value, this.BOX_ALIGN_CLASSES[value]);

    this.view.addClass(this.BOX_ALIGN_CLASSES[value]);
    return value;
};


ContentScalelessComponent.prototype.measureMinSize = function () {
    var bound = this.$content.getBoundingClientRect();
    return { width: bound.width, height: bound.height };
};

export default ContentScalelessComponent;