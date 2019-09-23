import Context from 'absol/src/AppPattern/Context';

import Draggable from 'absol-acomp/js/Draggable';

import '../../css/formeditor.css';
import Fcore from '../core/FCore';
import LayoutEditor from './LayoutEditor';

var _ = Fcore._;
var $ = Fcore.$;

function FormEditor() {
    Context.call(this);
    this.style = {
        leftSizeWidth: 16,//em
        leftSizeMinWidth: 10,

        rightSizeWidth: 16,//em
        rightSizeMinWidth: 10,

    };
    this.mLayoutEditor = new LayoutEditor();
}

Object.defineProperties(FormEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
FormEditor.prototype.constructor = FormEditor;



FormEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        class: 'as-form-editor',
        child: [
            {
                class: 'as-form-editor-left-site-container',
                child: {
                    tag: 'tabview',
                    class: ['xp-tiny', 'as-form-editor-left-site'],
                    child: [
                        {
                            tag: 'tabframe',
                            attr: {
                                name: 'Form',
                                id: 'tab-form',
                            }
                        },
                        {
                            tag: 'tabframe',
                            attr: {
                                name: 'Compnoent',
                                id: 'tab-component',
                            }
                        }
                    ]
                }
            },
            {
                class: 'as-form-editor-editor-space-container'
            },
            {
                class: 'as-form-editor-right-site-container',
                child: {
                    tag: 'tabview',
                    class: ['xp-tiny', 'as-form-editor-right-site'],
                    child: [
                        {
                            tag: 'tabframe',
                            attr: {
                                name: 'Format',
                                id: 'tab-format',
                            }
                        },
                        {
                            tag: 'tabframe',
                            attr: {
                                name: 'Event',
                                id: 'tab-event',
                            }
                        },
                        {
                            tag: 'tabframe',
                            attr: {
                                name: 'All',
                                id: 'tab-all',
                            }
                        }
                    ]
                }

            },

            '.as-form-editor-resizer.vertical.left-site',
            '.as-form-editor-resizer.vertical.right-site'

        ]
    });
    this.$leftSiteCtn = $('.as-form-editor-left-site-container', this.$view);
    this.$rightSiteCtn = $('.as-form-editor-right-site-container', this.$view);
    this.$editorSpaceCtn = $('.as-form-editor-editor-space-container', this.$view);
    this.$editorSpaceCtn.addChild(this.mLayoutEditor.getView());

    this.$leftSiteResizer = Draggable($('.as-form-editor-resizer.vertical.left-site', this.$view))
        .on('predrag', this.ev_preDragLeftResizer.bind(this))
        .on('enddrag', this.ev_endDragLeftResizer.bind(this))
        .on('drag', this.ev_dragLeftResizer.bind(this));

    this.$rightSiteResizer = Draggable($('.as-form-editor-resizer.vertical.right-site', this.$view))
        .on('predrag', this.ev_preDragRightResizer.bind(this))
        .on('enddrag', this.ev_endDragRightResizer.bind(this))
        .on('drag', this.ev_dragRightResizer.bind(this));

    return this.$view;
};


FormEditor.prototype.ev_preDragLeftResizer = function (event) {
    this.$leftSiteResizer.addStyle({
        width: '100px',
        left: 'calc(' + this.style.leftSizeWidth + 'em - 50px)'
    });

    this._dragLeftMovingDate = {
        width: this.style.leftSizeWidth,
        fontSize: this.$view.getFontSize(),
        bound: this.$view.getBoundingClientRect()
    };
};

FormEditor.prototype.ev_endDragLeftResizer = function (event) {
    this.$leftSiteResizer.addStyle({
        left: 'calc(' + this.style.leftSizeWidth + 'em - 7px)'
    }).removeStyle('width');
    this._dragLeftMovingDate = undefined;
    delete this._dragLeftMovingDate;
};

FormEditor.prototype.ev_dragLeftResizer = function (event) {
    var dxEm = event.moveDXem;
    var newWidth = this._dragLeftMovingDate.width + dxEm;
    this.$leftSiteResizer.addStyle({
        width: '100px',
        left: 'calc(' + newWidth + 'em - 50px)'
    });

    this.style.leftSizeWidth = Math.max(this.style.leftSizeMinWidth, Math.min(this._dragLeftMovingDate.bound.width / 3 / this._dragLeftMovingDate.fontSize, newWidth));
    this.$leftSiteCtn.addStyle('width', this.style.leftSizeWidth + 'em');
    this.$editorSpaceCtn.addStyle('left', this.style.leftSizeWidth + 0.2 + 'em');
    window.dispatchEvent(new Event('resize'));
};



FormEditor.prototype.ev_preDragRightResizer = function (event) {
    this.$rightSiteResizer.addStyle({
        width: '100px',
        right: 'calc(' + this.style.rightSizeWidth + 'em - 50px)'
    });

    this._dragRightMovingDate = {
        width: this.style.rightSizeWidth,
        fontSize: this.$view.getFontSize(),
        bound: this.$view.getBoundingClientRect()
    };
};

FormEditor.prototype.ev_endDragRightResizer = function (event) {
    this.$rightSiteResizer.addStyle({
        right: 'calc(' + this.style.rightSizeWidth + 'em - 7px)'
    }).removeStyle('width');
    this._dragRightMovingDate = undefined;
    delete this._dragRightMovingDate;
};

FormEditor.prototype.ev_dragRightResizer = function (event) {
    var dxEm = event.moveDXem;
    var newWidth = this._dragRightMovingDate.width - dxEm;
    this.$rightSiteResizer.addStyle({
        width: '100px',
        right: 'calc(' + newWidth + 'em - 50px)'
    });

    this.style.rightSizeWidth = Math.max(this.style.rightSizeMinWidth, Math.min(this._dragRightMovingDate.bound.width / 3 / this._dragRightMovingDate.fontSize, newWidth));
    this.$rightSiteCtn.addStyle('width', this.style.rightSizeWidth + 'em');
    this.$editorSpaceCtn.addStyle('right', this.style.rightSizeWidth + 0.2 + 'em');
    window.dispatchEvent(new Event('resize'));
};




export default FormEditor;