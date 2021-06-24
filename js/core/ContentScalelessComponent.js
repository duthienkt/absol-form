import Fcore from "../core/FCore";

import '../../css/component.css';
import ScalableComponent from "../core/ScalableComponent";
import inheritComponentClass from "./inheritComponentClass";

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends ScalableComponent
 * @constructor
 */
function ContentScalelessComponent() {
    ScalableComponent.call(this);
}

inheritComponentClass(ContentScalelessComponent, ScalableComponent);

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

ContentScalelessComponent.prototype.styleHandlers.boxAlign = {
    set: function (value) {
        var accepts = Object.keys(this.BOX_ALIGN_CLASSES);
        if (accepts.indexOf(value) < 0) value = 'lefttop';
        var lastClass = this.BOX_ALIGN_CLASSES[this.style.boxAlign];
        if (lastClass) this.view.removeClass(lastClass);
        this.domElt.addClass(this.BOX_ALIGN_CLASSES[value]);
        return value;
    },
    descriptor: {
        type: 'boxAlign'
    }
}

ContentScalelessComponent.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.style.boxAlign = 'lefttop';
};


ContentScalelessComponent.prototype.render = function () {
    this.$content = this.renderContent();
    this.$cell = _({
        class: 'as-component-content-scaleless-cell',
        child:this.$content
    });
    return _({
        class: 'as-component-content-scaleless',
        child: this.$cell
    });
};


ContentScalelessComponent.prototype.renderContent = function () {
    throw new Error('Not Implement!');
};


ContentScalelessComponent.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['boxAlign']);
};


ContentScalelessComponent.prototype.measureMinSize = function () {
    var bound = this.$content.getBoundingClientRect();
    return { width: bound.width, height: bound.height };
};

export default ContentScalelessComponent;