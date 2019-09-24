import Fcore from "../core/FCore";
import TextInput from "./TextInput";

var _ = Fcore._;

function TextArea() {
    TextInput.call(this);
}

Object.defineProperties(TextArea.prototype, Object.getOwnPropertyDescriptors(TextInput.prototype));
TextArea.prototype.constructor = TextArea;

TextArea.prototype.tag = "TextArea";
TextArea.prototype.menuIcon = "span.mdi.mdi-textarea";


TextArea.prototype.render = function () {
    return _('textarea.absol-bscroller');
};


export default TextArea;