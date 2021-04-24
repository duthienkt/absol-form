import PEBaseType from "./PEBaseType";
import {_} from "../../core/FCore";
import OOP from "absol/src/HTML5/OOP";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEColor() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEColor, PEBaseType);


PEColor.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
        tag: 'colorpickerbutton',
        on: {
            change: function (event) {
                self.setValue('#' + event.value.toHex8());
                self.notifyChange();
            },
            stopchange: function () {
                self.notifyStopChange();
            }
        },
        props: {
            value: 'transparent',
            mode: 'RGBA'
        }
    });

    this.cellElt.addChild(this.$input);
};

PEColor.prototype.reload = function () {
    this.$input.value = this.getValue() || 'transparent';
};

export default PEColor;