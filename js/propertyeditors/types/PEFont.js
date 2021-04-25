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
            items: [{ text: 'None', value: 'unset' }].concat(FONT_ITEMS),
            value: 'unset'
        },
        on: {
            change: function () {
                if (this.value === 'unset')
                    self.setValue(undefined);
                else self.setValue(this.value)
                self.notifyChange();
                self.notifyStopChange();
            }
        }
    });
    this.cellElt.addChild(this.$input);
};

PEFont.prototype.reload = function () {
    var value = this.getValue() || 'unset';
    if (value !== this.$input.value) {
        this.$input.value = value;
    }
};


export default PEFont;