import Fcore from "../core/FCore";
import TextInput from "./TextInput";
import OOP from "absol/src/HTML5/OOP";
import {inheritComponentClass} from "../core/BaseComponent";
import InputAttributeHandlers from "./handlers/InputAttributeHandlers";

var _ = Fcore._;


/***
 * @extends TextInput
 * @constructor
 */
function TextArea() {
    TextInput.call(this);
}

inheritComponentClass(TextArea, TextInput);

TextArea.prototype.tag = "TextArea";
TextArea.prototype.menuIcon = "span.mdi.mdi-form-textarea";


TextArea.prototype.render = function () {
    return _('textarea.absol-bscroller');
};



TextArea.prototype.attributeHandlers.value = Object.assign({}, TextArea.prototype.attributeHandlers.value);
TextArea.prototype.attributeHandlers.placeHolder = Object.assign({}, TextArea.prototype.attributeHandlers.placeHolder);
TextArea.prototype.attributeHandlers.value.descriptor = {
    type: "text",
    long: true,
    sign: "SimpleTextLong"
};

TextArea.prototype.attributeHandlers.placeHolder.descriptor = {
    type: "text",
    long: true,
    sign: "SimpleTextLong"
};


export default TextArea;