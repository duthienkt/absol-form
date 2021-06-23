import BaseBlock from "../core/BaseBlock";
import inheritComponentClass from "../core/inheritComponentClass";
import {AssemblerInstance} from "../core/Assembler";
import SnackBar from "absol-acomp/js/Snackbar";


/***
 * @extends BaseBlock
 * @constructor
 */
function CBSnackBar() {
    BaseBlock.call(this);
}


inheritComponentClass(CBSnackBar, BaseBlock);

CBSnackBar.prototype.tag = "CBSnackBar";


CBSnackBar.prototype.pinHandlers.message = {
    receives: function (value) {
        var text;
        var typeV = typeof value;
        if (typeV === 'string' || typeV === 'number' || typeV === 'boolean' || value === undefined) {
            text = value + '';
        }
        else text = JSON.stringify(value);
        SnackBar.show(text);
    },
    descriptor: {
        type: 'text'
    }
};

AssemblerInstance.addClass(CBSnackBar);

export default CBSnackBar;