import OOP from "absol/src/HTML5/OOP";
import PEBaseType from "./PEBaseType";
import {_} from "../../core/FCore";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEBool() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEBool, PEBaseType);

PEBool.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
        tag: 'checkboxbutton',
        class: 'as-need-update',
        on: {
            change: function () {
                self.setValue(this.checked);
                self.notifyChange();
                self.notifyStopChange();
            }
        }
    });

    this.cellElt.addChild(this.$input);
};

PEBool.prototype.reload = function () {
    var value = this.getValue() || false;
    if (value !== this.$input.checked) {
        this.$input.checked = value;
    }
};


export default PEBool;