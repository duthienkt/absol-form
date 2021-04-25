import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";
import TokenField from "absol-acomp/js/TokenField";


/***
 * @extends PEBaseType
 * @constructor
 */
function PEArrayOfText() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEArrayOfText, PEBaseType);


PEArrayOfText.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
        tag: TokenField.tag,
        attr: { title: 'Each value is separated by ;' },
        props: {
            separator: ';',
            placeHolder: 'Enter item text, separated by ;'
        },
        on: {
            change: function () {
                self.setValue(this.items);
                self.notifyChange();
            }
        }
    });
    this.cellElt.addChild(this.$input);
};

PEArrayOfText.prototype.reload = function () {
    this.renewDescriptor();
    this.$input.autocomplete = this.descriptor.autocomplete;
     this.$input.items = this.getValue();
};


export default PEArrayOfText;