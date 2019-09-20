import BaseComponent from "../core/BaseComponent";
import RelativeAnchor from "../anchors/RelativeAnchor";
import Fcore from "../core/FCore";

var _ = Fcore._;



function RelativeLayout() {
    BaseComponent.call(this);
    
}

Object.defineProperties(RelativeLayout.prototype, Object.getOwnPropertyDescriptors(BaseComponent.prototype));
RelativeLayout.prototype.constructor = RelativeLayout;

RelativeLayout.prototype.TOP_CLASS_NAME = 'as-relative-layout';
RelativeLayout.prototype.SUPPORT_STYLE_NAMES = ['width', 'height'];//, 'left', 'right', 'top', 'bottom'];

RelativeLayout.prototype.preInit = function(){
    this.style.vAlign = 'fixed';
    this.style.hAlign = 'fixed';
    this.style.left = 0;
    this.style.right = 0;
    this.style.top = 0;
    this.style.bottom = 0;
};

RelativeLayout.prototype.getAnchorBoxConstructor = function () {
    return RelativeAnchor;
};

RelativeLayout.prototype.render = function () {
    return _({ class: this.TOP_CLASS_NAME });
};


RelativeLayout.prototype.handleStyleWidth = function(value){
    this.view.addStyle('width', value +'px');
};

RelativeLayout.prototype.handleStyleHeight = function(value){
    this.view.addStyle('height', value +'px');
};

RelativeLayout.prototype.handleAddChild = function(child, index){
    var anchor = new RelativeAnchor();
    this.view.addChild(anchor.view);
    anchor.attachChild(child);
};

export default RelativeLayout;