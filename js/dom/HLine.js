import Fcore from "../core/FCore";
import '../../css/hline.css';

var $ = Fcore.$;
var _ = Fcore._;

function HLine() {
    var res = _({
        class: 'as-hline',
        child:{
            class:'as-hline-body',
            child:[
                '.as-hline-dot.left',
                '.as-hline-dot.right'
            ]
        }
    });


    return res;
}

Fcore.install('hline', HLine);

export default HLine;