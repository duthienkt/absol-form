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

ComboBox.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.list = [
        { text: '0', value:'0' },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        {text:'3', value: '3'}
    ];
    this.attributes.value = '0';
};


ComboBox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('minwidthchange', function (event) {
        if (!(self.style.width > event.value)) {
            self.setStyle('width', event.value);
        }
    }).on('change', function() {
        self.attributes.value = this.value;
    });
    this.attributes.value = this.view.value;
};



ComboBox.prototype.render = function () {
    return _('selectmenu');
};


ComboBox.prototype.setAttributeList = function (value) {
    this.view.items = value;
    return this.view.items;
};

ComboBox.prototype.setAttributeValue = function (value) {
    this.view.value = value;
    return this.view.value;
};


ComboBox.prototype.getAcceptsAttributeNames = function(){
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["list", 'value']);
};

ComboBox.prototype.getAttributeListDescriptor = function(){
    return {
        type:'list'
    };
};  
ComboBox.prototype.getAttributeValueDescriptor = function(){
    return {
        type:'text'
    };
};  



export default ComboBox;