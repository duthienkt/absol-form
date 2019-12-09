import Fcore from "../core/FCore"
import Assembler from "../core/Assembler";
import '../../css/formpreview.css';
import R from "../R";
import Dom from "absol/src/HTML5/Dom";
import BaseEditor from "../core/BaseEditor";
import FormPreviewCmd, { FormPreviewCmdDescriptors } from "../cmds/FormPreviewCmd";


var _ = Fcore._;
var $ = Fcore.$;

function FormPreview() {
    BaseEditor.call(this);
    Assembler.call(this);
    this.cmdRunner.assign(FormPreviewCmd);
    this.data = null;
    this.dataFlushed = true;
}

Object.defineProperties(FormPreview.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
Object.defineProperties(FormPreview.prototype, Object.getOwnPropertyDescriptors(Assembler.prototype));
FormPreview.prototype.constructor = FormPreview;


FormPreview.prototype.onResume = function () {
    this.flushDataToView();
    /**
     * @type {import('../fragment/CMDTool').default}
     */
    this.cmdTool = this.getContext(R.CMD_TOOL);
    if (this.cmdTool) {
        this.cmdTool.bindWithEditor(this);
        this.cmdTool.resume();
    }
};

FormPreview.prototype.onPause = function () {
    if (this.cmdTool) {
        this.cmdTool.bindWithEditor(undefined);
        this.cmdTool.pause();
    }
};

FormPreview.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        class: 'as-form-preview',
        child: [
            {
                class: 'as-form-preview-actions',
                child: [
                    {
                        tag: 'button',
                        class: 'as-form-preview-action-reload',
                        child: 'span.mdi.mdi-reload',
                        attr: {
                            title: "Reload"
                        }
                    },
                    {
                        tag: 'button',
                        class: 'as-form-preview-action-eraser',
                        child: 'span.mdi.mdi-eraser',
                        attr: {
                            title: "Clear"
                        }
                    }
                ]
            },
            {
                tag: 'bscroller',
                class: 'as-form-preview-content'
            }
        ],
        on: {
            sizechange: this.ev_sizeChange.bind(this)
        }
    });
    this.$content = $('.as-form-preview-content', this.$view);
    this.refresh();
    return this.$view;
};


FormPreview.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};


FormPreview.prototype.ev_sizeChange = function (event) {
    Dom.updateResizeSystem.bind(Dom);
    var bound = this.$view.getBoundingClientRect();
    var contentBound = (this.$content.children.length > 0 ? this.$content.children[0] : this.$content).getBoundingClientRect();
    this.$content.addStyle({
        width: bound.width + 'px',
        height: bound.height - (contentBound.top - bound.top) + 'px'
    });
};

FormPreview.prototype.flushDataToView = function () {
    if (this.dataFlushed) return;
    this.dataFlushed = true;
    //TODO: remove older view
    if (!this.data) return;
    this.$content.clearChild();
    if (this.data && this.$view) {
        var rootComponent = this.build(this.data);
        this.$content.addChild(rootComponent.view);
        rootComponent.onAttach();
    }
};

FormPreview.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

FormPreview.prototype.getCmdNames = function(){
    return Object.keys(FormPreviewCmd);
};

FormPreview.prototype.getCmdDescriptor = function (name) {
    var res = Object.assign({
        type: 'trigger',
        desc: 'command: ' + name,
        icon: 'span.mdi.mdi-apple-keyboard-command'
    }, FormPreviewCmdDescriptors[name]);
   

    return res;
};

FormPreview.prototype.getCmdGroupTree = function () {
    return ['reload'];
};

export default FormPreview;