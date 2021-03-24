import Fcore from "../core/FCore";
import TextInput from "./TextInput";
import OOP from "absol/src/HTML5/OOP";

var _ = Fcore._;


/***
 * @extends TextInput
 * @constructor
 */
function TextArea() {
    TextInput.call(this);
}

OOP.mixClass(TextArea, TextInput);

TextArea.prototype.tag = "TextArea";
TextArea.prototype.menuIcon = "span.mdi.mdi-textarea";


TextArea.prototype.render = function () {
    return _('textarea.absol-bscroller');
};

TextArea.prototype.getAttributeValueDescriptor = function () {
    return {
        type: "text",
        long: true,
        sign: "SimpleTextLong"
    }
};

TextArea.prototype.getAttributePlaceHolderDescriptor = function () {
    return {
        type: "text",
        long: true,
        sign: "SimpleTextLong"
    }
};



export default TextArea;