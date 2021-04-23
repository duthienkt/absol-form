import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEText() {
    PEBaseType.apply(this, arguments);

}

OOP.mixClass(PEText, PEBaseType);

PEText.prototype.reload = function () {
    this.$input.value = this.getValue();
};

PEText.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
        tag: this.descriptor.long ? 'textarea' : 'input',
        attr: { type: 'text' },
        on: {
            keyup: function () {
                self.setValue(this.value);
                self.notifyChange();
            },
            change: function () {
                self.notifyStopChange();
            }
        }
    });
    this.cellElt.addChild(this.$input);
};


export default PEText;