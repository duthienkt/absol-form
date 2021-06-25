import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";
import FontIconInput from "../../dom/FontIconInput";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEIcon() {
    PEBaseType.apply(this, arguments);

}

OOP.mixClass(PEIcon, PEBaseType);


PEIcon.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
        tag: FontIconInput.tag,
        props: {

        },
        on: {
            change: function () {
                self.setValue(this.value);
                self.notifyChange();
                self.notifyStopChange();
            }
        }
    });
    this.cellElt.addChild(this.$input);
};

PEIcon.prototype.reload = function () {
    var value = this.getValue();
    if (value !== this.$input.value) {
        this.$input.value = value;
    }
}


export default PEIcon;