import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEUniqueText() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEUniqueText, PEBaseType);

PEUniqueText.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
        tag: this.descriptor.long ? 'textarea' : 'input',
        attr: { type: 'text' },
        on: {
            keyup: function () {
                self._verifyDuplicate();
                self.setValue(this.value);
                self.notifyChange();
            },
            change: function () {
                self._verifyDuplicate();
                self.notifyStopChange();
            }
        }
    });
    this.cellElt.addChild(this.$input);
};

PEUniqueText.prototype.reload = function () {
    this.renewDescriptor();
    this.$input.value = this.getValue();
    this._verifyDuplicate();
};

PEUniqueText.prototype._verifyDuplicate = function (){
    if (this.descriptor.others[this.$input.value]) {
        this.$input.addStyle('border-color', '#f99');
        this.$input.attr('title', 'This name is used!')
    }
    else {
        this.$input.attr('title', null)
        this.$input.removeStyle('border-color');
    }
};


export default PEUniqueText;