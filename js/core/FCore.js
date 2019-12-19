import AComp from "absol-acomp";
import Dom from "absol/src/HTML5/Dom";
import ColorPicker from "absol-colorpicker";

var Fcore = new Dom();

Fcore.install(AComp.core);
Fcore.install(ColorPicker.core);
export default Fcore;