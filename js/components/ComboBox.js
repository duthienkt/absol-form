import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;


function ComboBox() {
    ScalableComponent.call(this);
}

Object.defineProperties(ComboBox.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
ComboBox.prototype.constructor = ComboBox;

ComboBox.prototype.tag = "ComboBox";
ComboBox.prototype.menuIcon = 'span.mdi.mdi-arrow-down-drop-circle-outline';

ComboBox.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.list = [
        { text: '0', value: '0' },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' }
    ];
    this.attributes.value = '0';
    Object.defineProperty(this.attributes, 'text', {
        get: function () {
            if (this.list) {
                for (var i = 0; i < this.list.length; ++i)
                    if (this.list[i].value == this.value) return this.list[i].text;
                return '';
            }
            else {
                return "";
            }
        },
        set: function (value) {
            //do nothing

        }
    }
    )
};


ComboBox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('minwidthchange', function (event) {
        if (!(self.style.width > event.value)) {
            self.setStyle('width', event.value);
        }
    }).on('change', function () {
        self.attributes.value = this.value;
        if (self.events.change)
            console.log("TODO: exec",  self.events.change);     
        // self.emit("change", { type: 'change', value: this.value }, self);
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


ComboBox.prototype.setAttributeText = function (value) {
    return value;
};


ComboBox.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["list", 'value', 'text']);
};

ComboBox.prototype.getAttributeListDescriptor = function () {
    return {
        type: 'list'
    };
};
ComboBox.prototype.getAttributeValueDescriptor = function () {
    return {
        type: 'text'
    };
};

ComboBox.prototype.getAttributeTextDescriptor = function () {
    return {
        type: 'const',
        value: this.getAttribute('text')
    };
};


ComboBox.prototype.getAcceptsEventNames = function(){
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


ComboBox.prototype.measureMinSize = function () {
    var minWidthStyle = parseFloat(this.view.getComputedStyleValue('min-width').replace('px'));
    return { width: Math.max(minWidthStyle, 24), height: 25 };
};

export default ComboBox;