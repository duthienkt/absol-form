import Fcore from "../core/FCore"
import Context from "absol/src/AppPattern/Context";
import Assembler from "../core/Assembler";
import '../../css/formpreview.css';
import R from "../R";
import Dom from "absol/src/HTML5/Dom";


var _ = Fcore._;
var $ = Fcore.$;

function FormPreview() {
    this.data = null;
    Context.call(this);
    Assembler.call(this);
}

Object.defineProperties(FormPreview.prototype, Object.getOwnPropertyDescriptors(Assembler.prototype));
Object.defineProperties(FormPreview.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
FormPreview.prototype.constructor = FormPreview;



FormPreview.prototype.onPause = function () {
    this.getView().remove();
};


FormPreview.prototype.onResume = function () {
    this.getView().addTo(document.body);
    this.updateSize();
};

FormPreview.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        tag: 'onscreenwindow',
        class: 'as-form-preview',
        props: {
            windowTitle: 'Form Preview'
        },
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

    this.$refreshBtn = $('.as-form-preview-actions .as-form-preview-action-reload', this.$view)
        .on('click', this.refresh.bind(this));
    this.$eraserBtn = $('.as-form-preview-actions .as-form-preview-action-eraser', this.$view)
        .on('click', function () {
            self.$content.clearChild();
            self.$content.removeStyle('width');
            self.$content.removeStyle('height');
            self.updateSize();
        });
    this.refresh();
    return this.$view;
};


FormPreview.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    this.$content.clearChild();
    if (data && this.$view) {
        var rootComponent = this.build(data);
        this.$content.addChild(rootComponent.view);
        rootComponent.onAttach();
    }
    this.updateSize();

};


FormPreview.prototype.updateSize = function () {
    if (!this.$view) return;
    var bound = this.$view.getBoundingClientRect();
    var contentBound = (this.$content.children.length > 0 ? this.$content.children[0] : this.$content).getBoundingClientRect();
    this.$view.addStyle({
        width: Math.max(contentBound.width, 200) + 'px',
        height: contentBound.top - bound.top + contentBound.height + 'px'
    });
    this.$content.removeStyle('width');
    this.$content.removeStyle('height');
    this.$view.addStyle('min-height', contentBound.top - bound.top + 'px');
    this.$view.relocation();
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


export default FormPreview;