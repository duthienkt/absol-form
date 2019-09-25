import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;


function ComboBox() {
    ScalableComponent.call(this);
}

Object.defineProperties(ComboBox.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
ComboBox.prototype.constructor = ComboBox;

ComboBox.prototype.tag = "ComboBox";
ComboBox.prototype.menuIcon = [
    '<svg width="24" height="24" viewBox="0 0 24 24">',
    '<path fill="#000000" d="M18,9V10.5L12,16.5L6,10.5V9H18M12,13.67L14.67,11H9.33L12,13.67Z" />',
    '<path fill="#000000" d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M5,5V19H19V5H5Z" />',
    '</svg>'
].join('');

ComboBox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('minwidthchange', function (event) {
        if (!(self.style.width > event.value)) {
            self.setStyle('width', event.value);
        }
    });
};



ComboBox.prototype.render = function () {
    return _('selectmenu');
};


ComboBox.prototype.handleAttributeList = function (value) {
    this.view.items = value;
};

ComboBox.prototype.handleAttributeValue = function (value) {
    this.view.value = value;
};


export default ComboBox;