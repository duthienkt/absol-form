import PEBaseType from "./PEBaseType";
import {_} from "../../core/FCore";
import OOP from "absol/src/HTML5/OOP";


/***
 * @extends PEBaseType
 * @constructor
 */
function PEConst() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEConst, PEBaseType);

PEConst.prototype.attachInput = function () {
    var self = this;
    var value = this.descriptor.value;
    this.$input = _({
        tag: 'strong'
    });

    this.cellElt.addChild(this.$input);
    if (value && value.then) {
        value.then(function (value) {
            self.$input.addChild(_({ text: '' + value }))
        });
    }
    else {
        this.$input.addChild(_({ text: '' + value }))
    }
};


export default PEConst;