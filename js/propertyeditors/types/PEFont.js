import PEBaseType from "./PEBaseType";
import {FONT_ITEMS} from "../../font/GoogleFont";
import {_} from "../../core/FCore";
import OOP from "absol/src/HTML5/OOP";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEFont() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEFont, PEBaseType)

PEFont.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
        tag: 'selectmenu',
        class: 'as-need-update',
        props: {
            items: [{ text: 'None', value: undefined }].concat(FONT_ITEMS)
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

PEFont.prototype.reload = function () {
    var value = this.getValue();
    if (value !== this.$input.value) {
        this.$input.value = value;
    }
};


export default PEFont;