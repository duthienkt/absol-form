import Fcore from "../core/FCore"
import Assembler from "../core/Assembler";
import '../../css/formpreview.css';
import R from "../R";
import Dom from "absol/src/HTML5/Dom";
import BaseEditor from "../core/BaseEditor";
import FormPreviewCmd, { FormPreviewCmdDescriptors } from "../cmds/FormPreviewCmd";
import {makeFmFragmentClass} from "../core/FmFragment";


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
        tag: 'bscroller',
        class: 'as-form-preview',
        child: [
            {
                class: 'as-form-preview-size-setting',
                child: [
                    {
                        tag: 'span',
                        child: { text: 'Size : ' }
                    },
                    {
                        tag: 'input',
                        class: 'as-input-width',
                        props: {
                            type: 'number',
                            min: '0'
                        },
                        on: {
                            change: this.ev_sizeInputChange.bind(this)
                        }
                    },
                    { tag: 'span', child: { text: ' x ' } },
                    {
                        tag: 'input',
                        class: 'as-input-height',
                        props: {
                            type: 'number',
                            min: '0'
                        },
                        on: {
                            change: this.ev_sizeInputChange.bind(this)
                        }
                    }
                ]
            },
            {
                class: 'as-form-preview-content'
            }
        ],
        on: {
            sizechange: this.ev_sizeChange.bind(this)
        }
    });
    this.$content = $('.as-form-preview-content', this.$view);
    this.$widthIp = $('input.as-input-width', this.$view);
    this.$heightIp = $('input.as-input-height', this.$view);
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
        this.PreviewClass = makeFmFragmentClass({
            tag:'preview',
            contentViewData: this.data
        });
        this.previewFrg = new this.PreviewClass();
        this.rootComponent =  this.previewFrg.view;
        this.$content.addChild(this.rootComponent.domElt);
        this.$widthIp.value = this.rootComponent.getStyle('width', 'px');
        this.$heightIp.value = this.rootComponent.getStyle('height', 'px');
    }
};


FormPreview.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

FormPreview.prototype.getCmdNames = function () {
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


FormPreview.prototype.ev_sizeInputChange = function () {
    var width = this.$widthIp.value;
    var height = this.$heightIp.value;
    if (this.rootComponent) {
        this.rootComponent.setStyle('width', width);
        this.rootComponent.setStyle('height', height);
    }
};

export default FormPreview;