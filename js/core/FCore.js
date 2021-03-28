import AComp from "absol-acomp";
import Dom from "absol/src/HTML5/Dom";
import ColorPicker from "absol-colorpicker";

var Fcore = new Dom();
export var _ = Fcore._;
export var $ = Fcore.$;

Fcore.install(AComp.core);
Fcore.install(ColorPicker.core);
export default Fcore;