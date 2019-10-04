import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;


function SelectBox() {
    ScalableComponent.call(this);
}

Object.defineProperties(SelectBox.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
SelectBox.prototype.constructor = SelectBox;

SelectBox.prototype.tag = "SelectBox";
SelectBox.prototype.menuIcon = 'span.mdi.mdi-file-table-box-outline';

SelectBox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('minwidthchange', function (event) {
        if (!(self.style.width > event.value)) {
            self.setStyle('width', event.value);
        }
    });

    this.view.on('change', function (event) {
        self.attributes.values = event.values;
        self.emit('change', event.values, self);
    });
};


SelectBox.prototype.render = function () {
    return _('selectbox');
};


SelectBox.prototype.setAttributeList = function (value) {
    this.view.items = value;
    return this.view.items;
};

SelectBox.prototype.setAttributeValue = function (value) {
    this.view.values = value;
};


export default SelectBox;