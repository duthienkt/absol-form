/**
 *  Left: branch, sync, error, warning 
 *  Right: position(Ln x, Col y) , font-size, indent mode , language, status ,alert  
 */

import '../../css/statusbar.css';
import Fcore from "../core/FCore";

var _ = Fcore._;
var $ = Fcore.$;


function StatusBar() {
    this.$leftCtn = $('.as-status-bar-left', this);
    this.$rightCtn = $('.as-status-bar-right', this);
}


StatusBar.render = function () {
    return _({
        class: 'as-status-bar',
        child: [
            '.as-status-bar-left',
            '.as-status-bar-right'
        ]
    });
};


Fcore.install('statusbar', StatusBar);


export default StatusBar;