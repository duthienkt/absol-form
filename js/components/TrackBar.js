import {_} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import OOP from "absol/src/HTML5/OOP";

function TrackBar() {
    ScalableComponent.call(this);
}

OOP.mixClass(TrackBar, ScalableComponent);

TrackBar.prototype.tag = 'Trackbar';
TrackBar.prototype.menuIcon = 'span.mdi.mdi-source-commit.mdi-rotate-90'

TrackBar.prototype.render = function () {
    return _('trackbar');
};

TrackBar.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.apply(this, arguments);
    this.style.height = 18;
};

TrackBar.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.apply(this, arguments);
    this.bindAttribute('value');
};

TrackBar.prototype.getAttributeStyleDescriptor = function () {
    return {
        type: 'number',
        max: 1,
        min: 0
    };
};

TrackBar.prototype.getAttributeNames = function (){
    return ScalableComponent.prototype.getAttributeNames.call(this).concat(['value']);
};


TrackBar.prototype.measureMinSize = function () {
    return { width: 40, height: 18 };
};


export default TrackBar;