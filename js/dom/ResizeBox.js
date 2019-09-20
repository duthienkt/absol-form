import Fcore from "../core/FCore";
import '../../css/resizebox.css';

var _ = Fcore._;
var $ = Fcore.$;


function ResizeBox(){
    var res = _({
        class:'as-resize-box',
        child:{
            class:'as-resize-box-body',
            child:[
                '.as-resize-box-dot.left-top',
                '.as-resize-box-dot.top',
                '.as-resize-box-dot.right-top',
                '.as-resize-box-dot.right',
                '.as-resize-box-dot.right-bottom',
                '.as-resize-box-dot.bottom',
                '.as-resize-box-dot.left-bottom',
                '.as-resize-box-dot.left'
            ]
        }

    });

    return res;
}


Fcore.install('resizebox', ResizeBox);


export default ResizeBox;