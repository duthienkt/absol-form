import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEMeasurePosition() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEMeasurePosition, PEBaseType);

PEMeasurePosition.prototype.attachInput = function () {
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
                { text: '%', value: '%' }
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
        self.$numberInput.disabled = false;
        var value = self.getValue(this.value);
        self.$numberInput.value = value;
        if (this.value === '%') {
            self.setValue(value + '%');
        }
        else {
            self.setValue(value);
        }

        self.notifyChange();
        self.notifyStopChange();
    });
};

PEMeasurePosition.prototype.reload = function () {
    var descriptor = this.renewDescriptor();
    if (descriptor.disabled) this.$numberInput.disabled = !!descriptor.disabled;
    var value;
    if (descriptor.disabled) {
        value = this.getValue(this.$typeSelect.value);
        this.$numberInput.value = value;
        //set-back
        if (this.$typeSelect.value === 'px') {
            this.setValue(value);
        }
        else if (this.$typeSelect.value === '%') {
            this.setValue(value + '%');
        }
    }
    else {
        value = this.getValue();
        if (typeof value === 'number') {
            this.$numberInput.value = value;
            this.$typeSelect.value = 'px';
        }
        else if (typeof value == 'string') {
            if (value.match(/%$/)) {
                this.$typeSelect.value = '%';
                this.$numberInput.value = parseFloat(value.replace('%', ''));
            }
            else {
                console.error("Unknow typeof " + name, value);
            }
        }
    }
};

PEMeasurePosition.prototype.setValueFromInput = function () {
    switch (this.$typeSelect.value) {
        case '%':
            this.setValue(this.$numberInput.value + '%');
            break;
        case 'px':
            this.setValue(this.$numberInput.value);
            break;
    }
};


export default PEMeasurePosition;