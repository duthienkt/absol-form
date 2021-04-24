import AComp from "absol-acomp";
import Dom from "absol/src/HTML5/Dom";
import ColorPicker from "absol-colorpicker";
import install from "absol-acomp/js/dom/install";
import ColorPickerButton from "absol-colorpicker/components/ColorPickerButton";

var Fcore = new Dom();
install(Fcore);
export var _ = Fcore._;
export var $ = Fcore.$;

Fcore.install(ColorPicker.core);
Fcore.install(ColorPickerButton);
export default Fcore;