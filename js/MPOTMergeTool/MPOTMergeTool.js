import '../../css/mpotmergtool.css';
import Fcore from "../core/FCore";
import BaseEditor from "../core/BaseEditor";
import FormEditor from "../editor/FormEditor";
import Hanger from "absol-acomp/js/Hanger";

var $ = Fcore.$;
var _ = Fcore._;

/***
 *
 * @constructor
 * @augments BaseEditor
 */
function MPOTMergeTool() {
    BaseEditor.call(this);
}

Object.defineProperties(MPOTMergeTool.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
MPOTMergeTool.prototype.constructor = MPOTMergeTool;

MPOTMergeTool.prototype.CONFIG_STORE_KEY = "AS_MPOT_CONFIG";

MPOTMergeTool.prototype.config = {
    previewWidth: 50
};


MPOTMergeTool.prototype.createView = function () {
    this.$view = _({
        class: 'as-mpot-merge-tool',
        style: {
            '--preview-width': this.config.previewWidth + '%'
        },
        child: [
            {
                class: 'as-mpot-merge-tool-preview-ctn'
            },
            {
                class: 'as-mpot-merge-tool-properties-ctn'
            },
            'hanger.as-mpot-merge-tool-center-resizer'
        ]
    });
    /***
     *
     * @type {Hanger}
     */
    this.$centerResizer = $('hanger.as-mpot-merge-tool-center-resizer', this.$view)
        .on('drag', this.ev_dragResizer.bind(this))
        .on('dragend', this.ev_dragResizerEnd.bind(this));
};

MPOTMergeTool.prototype.ev_dragResizer = function (event) {
    var d = event.currentPoint.sub(event.startingPoint);
    var dx = d.x;
    var bound = this.$view.getBoundingClientRect();
    var newWidth = Math.max(20, Math.min(80, this.config.previewWidth + dx * 100 / bound.width));
    this.$view.addStyle('--preview-width', newWidth + '%');


};

MPOTMergeTool.prototype.ev_dragResizerEnd = function (event) {
    var d = event.currentPoint.sub(event.startingPoint);
    var dx = d.x;
    var bound = this.$view.getBoundingClientRect();
    var newWidth = Math.max(20, Math.min(80, this.config.previewWidth + dx * 100 / bound.width));
    this.$view.addStyle('--preview-width', newWidth + '%');
    this.config.previewWidth = newWidth;
    this.saveConfig();
};


export default MPOTMergeTool;