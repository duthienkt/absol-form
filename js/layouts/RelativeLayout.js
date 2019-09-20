import RelativeAnchor from "../anchors/RelativeAnchor";
import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;



function RelativeLayout() {
    ScalableComponent.call(this);
    
}

Object.defineProperties(RelativeLayout.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
RelativeLayout.prototype.constructor = RelativeLayout;

RelativeLayout.prototype.TOP_CLASS_NAME = 'as-relative-layout';
RelativeLayout.prototype.SUPPORT_STYLE_NAMES = ['width', 'height'];//, 'left', 'right', 'top', 'bottom'];

RelativeLayout.prototype.preInit = function(){
    ScalableComponent.prototype.preInit.call(this);
    this.style.vAlign = 'fixed';
    this.style.hAlign = 'fixed';
};

RelativeLayout.prototype.getAnchorBoxConstructor = function () {
    return RelativeAnchor;
};

RelativeLayout.prototype.render = function () {
    return _({ class: this.TOP_CLASS_NAME });
};


RelativeLayout.prototype.handleAddChild = function(child, index){
    var anchor = new RelativeAnchor();
    this.view.addChild(anchor.view);
    anchor.attachChild(child);
};

export default RelativeLayout;