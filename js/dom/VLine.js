import Fcore from "../core/FCore";
import '../../css/vline.css';

var $ = Fcore.$;
var _ = Fcore._;

function VLine() {
}

VLine.render = function(){
    return _({
        class: 'as-vline',
        child:{
            class:'as-vline-body',
            child:[
                '.as-vline-dot.top',
                '.as-vline-dot.bottom'
            ]
        }
    });
}

Fcore.install('vline', VLine);

export default VLine;