import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";

/***
 * @extends PEBaseType
 * @constructor
 */
function PELengthInPixel() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PELengthInPixel, PEBaseType);

PELengthInPixel.prototype.attachInput = function () {
    var self = this;
    this.cellElt.addStyle('white-space', 'nowrap');
    this.$numberInput = _('numberinput').addStyle('margin-right', '5px');
    this.$unsetCBx = _({
        tag: 'checkbox',
        props: {
            text: 'unset'
        },
        style: {
            verticalAlign: 'middle'
        }
    });

    this.cellElt.addChild([this.$numberInput, this.$unsetCBx]);


    this.$numberInput.on('change', function (event) {
        if (event.by === 'keyup') return;
        self.setValue(this.value);
        self.notifyChange();
        if (event.by !== 'long_press_button')
            self.notifyStopChange();
    }).on('stopchange', function () {
        self.setValueFromInput();
        self.notifyStopChange();
    });

    this.$unsetCBx.on('change', function () {
        if (this.checked) {
            self.setValue(null);
        }
        else {
            self.setValue(512);
        }
    });
};

PELengthInPixel.prototype.reload = function () {
    var descriptor = this.renewDescriptor();
    this.$numberInput.disabled = !!descriptor.disabled;
    var value = this.getValue();
    if (value > 0 && value < Infinity) {
        this.$numberInput.value = value;
        this.$unsetCBx.checked = false;
    }
    else {
        this.$numberInput.value = 512;
        this.$unsetCBx.checked = true;
    }
};

export default PELengthInPixel;