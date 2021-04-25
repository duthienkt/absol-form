import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../../core/FCore";
import {AssemblerInstance} from "../../core/Assembler";

/***
 * @extends PEBaseType
 * @constructor
 */
function PEFragmentClass() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEFragmentClass, PEBaseType);

PEFragmentClass.prototype.attachInput = function () {
    var self = this;
    this.$input = _({
        tag: 'selectmenu',
        on: {
            change: function () {
                if (this.value === 'null')
                    self.setValue(null);
                else
                    self.setValue(this.value);
            }
        }
    });
    this.cellElt.addChild(this.$input);
};

PEFragmentClass.prototype.reload = function () {
    var constructors = AssemblerInstance.fragmentConstructors;
    var items = Object.keys(constructors).map(function (key) {
        var cst = constructors[key];
        var cstName = cst.prototype.displayName
            || (cst.prototype.contentViewData
                && cst.prototype.contentViewData.attributes
                && cst.prototype.contentViewData.attributes.name)
            || cst.prototype.name
            || cst.prototype.tag;
        return { text: cstName, value: key };
    });
    items.unshift({ text: "none", value: 'null', extendStyle: { "color": "#aaa" } });
    var value = this.getValue() || 'null';
    this.$input.items = items;
    this.$input.value = value;
};

export default PEFragmentClass;