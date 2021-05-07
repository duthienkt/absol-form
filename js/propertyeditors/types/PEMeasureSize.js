import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEMeasureSize() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEMeasureSize, PEBaseType);

PEMeasureSize.prototype.attachInput = function () {
    var self = this;
    this.cellElt.addStyle('white-space', 'nowrap');
    this.$numberInput = _('numberinput').addStyle('margin-right', '5px');
    this.$typeSelect = _({
        tag: 'selectmenu',
        style: {
            verticalAlign: 'middle'
        },
        props: {
            items: [
                { text: 'px', value: 'px' },
                { text: '%', value: '%' },
                { text: 'match_parent', value: 'match_parent' },
                { text: 'auto', value: 'auto' }
            ]
        }
    });

    this.cellElt.addChild([this.$numberInput, this.$typeSelect]);


    this.$numberInput.on('change', function (event) {
        if (event.by === 'keyup') return;
        self.setValueFromInput();
        self.notifyChange();
        if (event.by !== 'long_press_button')
            self.notifyStopChange();
    }).on('stopchange', function () {
        self.setValueFromInput();
        self.notifyStopChange();
    });

    this.$typeSelect.on('change', function (event) {
        var cValue;
        switch (this.value) {
            case "px":
                cValue = self.getValue('px');
                self.$numberInput.value = cValue;
                console.log(cValue)
                break;
            case 'match_parent':
                cValue = '100%';
                self.$numberInput.value = 100;
                break;
            case '%':
                cValue = self.getValue('%');
                self.$numberInput.value = cValue;
                cValue += '%';
                break;
            case 'auto':
                self.$numberInput.value = self.getValue('px');
                cValue = 'auto';
                break;
        }
        self.setValue(cValue);
        if (this.value === 'match_parent' || this.value === 'auto') {
            self.$numberInput.disabled = true;

        }
        else {
            self.$numberInput.disabled = false;
        }
        self.notifyChange();
        self.notifyStopChange();
    });
};

PEMeasureSize.prototype.reload = function () {
    var descriptor = this.renewDescriptor();
    if (descriptor.disabled) this.$numberInput.disabled = !!descriptor.disabled;
    var value = this.getValue();
    if (typeof value === 'number') {
        this.$numberInput.value = value;
        this.$typeSelect.value = 'px';
    }
    else if (typeof value == 'string') {
        if (value.match(/%$/)) {
            this.$typeSelect.value = '%';
            this.$numberInput.value = parseFloat(value.replace('%', ''));
            this.$numberInput.disabled = false;
        }
        else if (value === 'match_parent' || value === 'auto') {
            this.$numberInput.disabled = true;
            this.$typeSelect.value = value;
        }
        else {
            console.error("Unknow typeof " + name, value);
        }
    }
};

PEMeasureSize.prototype.setValueFromInput = function () {
    switch (this.$typeSelect.value) {
        case '%':
            this.setValue(this.$numberInput.value + '%');
            break;
        case 'px':
            this.setValue(this.$numberInput.value);
            break;
    }
};


export default PEMeasureSize;