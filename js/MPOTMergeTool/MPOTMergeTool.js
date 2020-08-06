import '../../css/mpotmergtool.css';
import Fcore from "../core/FCore";
import BaseEditor from "../core/BaseEditor";
import FormEditor from "../editor/FormEditor";
import Hanger from "absol-acomp/js/Hanger";
import MPOTPreview from "./MPOTPreview";
import Dom from "absol/src/HTML5/Dom";
import PropertyEditor from "../editor/PropertyEditor";
import MPOTPropertyEditor from "./MPOTPropertyEditor";

var $ = Fcore.$;
var _ = Fcore._;

/***
 *
 * @constructor
 * @augments BaseEditor
 */
function MPOTMergeTool() {
    BaseEditor.call(this);
    this._data = null;
    this.preview = new MPOTPreview();
    this.editor = new MPOTPropertyEditor();
    this.preview.attach(this);
    this.editor.attach(this);
}

Object.defineProperties(MPOTMergeTool.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
MPOTMergeTool.prototype.constructor = MPOTMergeTool;

MPOTMergeTool.prototype.CONFIG_STORE_KEY = "AS_MPOT_CONFIG";

MPOTMergeTool.prototype.config = {
    previewWidth: 50
};



MPOTMergeTool.prototype.createView = function () {
    this.$view = _({
        class: 'mpot-merge-tool',
        style: {
            '--preview-width': this.config.previewWidth + '%'
        },
        child: [
            {
                tag: 'bscroller',
                class: 'mpot-merge-tool-preview-ctn',
                child: [
                    this.preview.getView()
                ]
            },
            {
                class: 'mpot-merge-tool-properties-ctn',
                child: [
                    this.editor.getView()
                ]
            },
            'hanger.mpot-merge-tool-center-resizer'
        ]
    });
    /***
     *
     * @type {Hanger}
     */
    this.$centerResizer = $('hanger.mpot-merge-tool-center-resizer', this.$view)
        .on('dragstart', this.ev_dragResizerStart.bind(this))
        .on('drag', this.ev_dragResizer.bind(this))
        .on('dragend', this.ev_dragResizerEnd.bind(this));
};

MPOTMergeTool.prototype.ev_dragResizerStart = function () {
    console.log('start');
    this.$centerResizer.addClass('as-active');
};

MPOTMergeTool.prototype.ev_dragResizer = function (event) {
    var d = event.currentPoint.sub(event.startingPoint);
    var dx = d.x;
    var bound = this.$view.getBoundingClientRect();
    var newWidth = Math.max(20, Math.min(80, this.config.previewWidth + dx * 100 / bound.width));
    this.$view.addStyle('--preview-width', newWidth + '%');
    Dom.updateResizeSystem();
};

MPOTMergeTool.prototype.ev_dragResizerEnd = function (event) {
    var d = event.currentPoint.sub(event.startingPoint);
    var dx = d.x;
    var bound = this.$view.getBoundingClientRect();
    var newWidth = Math.max(20, Math.min(80, this.config.previewWidth + dx * 100 / bound.width));
    this.$view.addStyle('--preview-width', newWidth + '%');
    this.config.previewWidth = newWidth;
    this.saveConfig();
    this.$centerResizer.removeClass('as-active');
};

MPOTMergeTool.prototype.setData = function (data){
    this._data = data;
    this.editor.setData(data.editor);
};

MPOTMergeTool.prototype.getData = function (){
    return this._data;
}


export default MPOTMergeTool;