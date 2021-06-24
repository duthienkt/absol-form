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
            props: {
                value: 0
            },
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
    this.$null = _({
        tag: 'checkbox',
        style: {
            marginLeft: '5px'
        },
        props: {
            checked: false,
            text: 'null'
        },
        on: {
            change: function () {
                self.renewDescriptor();
                if (this.checked) {
                    self.$input.disabled = true;
                    self.setValue(null);
                }
                else {
                    self.$input.disabled = false;
                    self.$input.value = self.descriptor.defaultValue;
                    self.setValue(self.descriptor.defaultValue);

                }
                self.notifyChange();
                self.notifyStopChange();
            }
        }
    });
    this.cellElt.addChild(this.$input)
        .addChild(this.$null);
};


PENumber.prototype.reload = function () {
    this.renewDescriptor();
    if (typeof this.descriptor.floatFixed === "number")
        this.$input.floatFixed = this.descriptor.floatFixed;
    this.$input.min = typeof (this.descriptor.min) == 'number' ? this.descriptor.min : -Infinity;
    this.$input.max = typeof (this.descriptor.max) == 'number' ? this.descriptor.max : Infinity;
    var value = this.getValue();
    if (this.descriptor.nullable) {
        this.$null.removeStyle('display');
        if (!isFinite(value) || value === null || value === undefined || isNaN(value)){
            this.$input.value = 0;
            this.$input.disabled = true;
            this.$null.checked = true;
        }
        else{
            this.$input.disabled = !!this.descriptor.disabled;
            this.$null.checked = false;
            this.$input.value = value;
        }
    }
    else {
        this.$null.addStyle('display', 'none');
        if (!isFinite(value) || value === null || value === undefined || isNaN(value)){
            this.$input.value = 0;
        }
        else {
            this.$input.value = value;
        }
        this.$input.disabled = this.descriptor.disabled;
    }
};

export default PENumber;
