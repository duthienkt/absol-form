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

ContentScalelessComponent.prototype.renderContent = function(){
    throw new Error('Not Implement!');
}

ContentScalelessComponent.prototype.setStyleTextHAlign = function (value) {
    this.view.addStyle('text-align', value);
    return value;
};

ContentScalelessComponent.prototype.setStyleTextVAlign = function (value) {
    if (value == 'center') value = 'middle';
    this.$cell.addStyle('vertical-align', value);
    return value;
};

ContentScalelessComponent.prototype.measureMinSize = function () {
    var bound = this.$content.getBoundingClientRect();
    return { width: bound.width, height: bound.height };
};

export default ContentScalelessComponent;