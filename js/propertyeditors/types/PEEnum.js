import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEEnum() {
    PEBaseType.apply(this, arguments);

}

OOP.mixClass(PEEnum, PEBaseType);


PEEnum.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
        tag: 'selectmenu',
        props: {
            items: this.descriptor.values.map(function (value) {
                return { text: value + "", value: value }
            }),
            value: this.getValue()
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

PEEnum.prototype.reload = function () {
    var value = this.getValue();
    if (value !== this.$input.value) {
        this.$input.value = value;
    }
}


export default PEEnum;