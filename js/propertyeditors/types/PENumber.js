import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";


/***
 * @extends PEBaseType
 * @constructor
 */
function PENumber() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PENumber, PEBaseType);


PENumber.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
            tag: 'numberinput',
            class: 'as-need-update',
            props: {},
            on: {
                change: function (event) {
                    if (event.by === 'keyup') return;
                    if (!self.descriptor.livePreview && event.by === 'long_press_button') return;
                    self.setValue(this.value);
                    self.notifyChange();
                    if (event.by !== 'long_press_button')
                        self.notifyStopChange();
                }
            }
        }
    );
    this.cellElt.addChild(this.$input);
};


PENumber.prototype.reload = function () {
    this.renewDescriptor();
    if (typeof this.descriptor.floatFixed === "number")
        this.$input.floatFixed = this.descriptor.floatFixed;
    this.$input.min = typeof (this.descriptor.min) == 'number' ? this.descriptor.min : -Infinity;
    this.$input.max = typeof (this.descriptor.max) == 'number' ? this.descriptor.max : Infinity;
    var value = this.getValue();
    if (typeof value !== 'number') {
        value = this.descriptor.defaultValue;
    }
    this.$input.value = value;
    this.$input.disabled = this.descriptor.disabled;
};

export default PENumber;
