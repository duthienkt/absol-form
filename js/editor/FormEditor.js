import Context from 'absol/src/AppPattern/Context';

import Draggable from 'absol-acomp/js/Draggable';

import '../../css/formeditor.css';
import Fcore from '../core/FCore';
import LayoutEditor from './LayoutEditor';
import Dom from 'absol/src/HTML5/Dom';
import DateInput from '../components/DateInput';
import TextInput from '../components/TextInput';
import RelativeLayout from '../layouts/RelativeLayout';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
import NumberInput from '../components/NumberInput';
import Label from '../components/Label';
import TextArea from '../components/TextArea';
import CheckBox from '../components/Checkbox';
import Radio from '../components/Radio';
import ComboBox from '../components/ComboBox';
import Text from '../components/Text';
import SelectBox from '../components/SelectBox';
import ComponentPicker from './ComponentPicker';
import ContextManager from 'absol/src/AppPattern/ContextManager';
import R from '../R';
import AttributeEditor from './AttributeEditor';
import StyleEditor from './StyleEditor';
import Image from '../components/Image';
import AllPropertyEditor from './AllPropertyEditor';
import ComponentOutline from './ComponentOutline';
import Button from '../components/Button';
import Table from '../components/Table';
import UndoHistory from './UndoHistory';

var _ = Fcore._;
var $ = Fcore.$;

function FormEditor() {
    Context.call(this);
    EventEmitter.call(this);
    this.ctxMng = new ContextManager();
    var self = this;
    this.style = {
        leftSizeWidth: 16,//em
        leftSizeMinWidth: 10,

        rightSizeWidth: 23,//em
        rightSizeMinWidth: 15,

    };
    this.mLayoutEditor = new LayoutEditor();

    this.mLayoutEditor.addComponent(DateInput);
    this.mLayoutEditor.addComponent(TextInput);
    this.mLayoutEditor.addComponent(TextArea);
    this.mLayoutEditor.addComponent(RelativeLayout);
    this.mLayoutEditor.addComponent(NumberInput);
    this.mLayoutEditor.addComponent(Label);
    this.mLayoutEditor.addComponent(CheckBox);
    this.mLayoutEditor.addComponent(Radio);
    this.mLayoutEditor.addComponent(ComboBox);
    this.mLayoutEditor.addComponent(SelectBox);
    this.mLayoutEditor.addComponent(Text);
    this.mLayoutEditor.addComponent(Image);
    this.mLayoutEditor.addComponent(Button);
    this.mLayoutEditor.addComponent(Table);
    this.mUndoHistory = new UndoHistory();
    this.mComponentPicker = new ComponentPicker();
    this.mAttributeEditor = new AttributeEditor();
    this.mComponentOutline = new ComponentOutline();
    this.mAttributeEditor.on('change', function (event) {
        self.emit('change', Object.assign({ formEditor: this }, event), self);
    }).on('stopchange', function (event) {
        self.commitHistory('edit', event.object.getAttribute('name') + '.' + event.name + '')
    }
    );;

    this.mStyleEditor = new StyleEditor()
        .on('change', this.ev_styleEditorChange.bind(this))
        .on('stopchange', function (event) {
            self.commitHistory('edit', event.object.getAttribute('name') + '.' + event.name + '')
        }
        );

    this.mAllPropertyEditor = new AllPropertyEditor().on('stopchange', function (event) {
        self.commitHistory('edit', event.object.getAttribute('name') + '.' + event.name + '')
    }
    );;
    this.mAllPropertyEditor.on('change', function (event) {
        self.mLayoutEditor.autoExpandRootLayout();
        if (self._focusElement) self._focusElement.reMeasure();
        if (event.name == 'vAlign' || event.name == 'hAlign')
            self.mLayoutEditor.updateAnchor();
        else
            self.mLayoutEditor.updateAnchorPosition();
        self.mStyleEditor.notifyChange();
        self.mAttributeEditor.notifyChange();
        self.emit('change', Object.assign({ formEditor: this }, event), self);
        Dom.updateResizeSystem();
    }).on('stopchange', function (event) {
        self.commitHistory('edit', event.object.getAttribute('name') + '.' + event.name + '')
    }
    );

    this.mLayoutEditor.on('change', this.notifyAllChange.bind(this))
        .on('focuscomponent', this.ev_focusElement.bind(this))
        .on('removecomponent', this.ev_removeComponent.bind(this))
        .on('addcomponent', this.ev_addComponent.bind(this));

    this.mUndoHistory.on('checkout', function (event) {
        self.mLayoutEditor.applyData(event.item.data);
        self.mComponentOutline.updateComponetTree();
    });

    this.mLayoutEditor.on('movecomponent', this.notifyStyleChange.bind(this));
    this.ctxMng.set(R.LAYOUT_EDITOR, this.mLayoutEditor);
    this.ctxMng.set(R.COMPONENT_PICKER, this.mComponentPicker);
    this.ctxMng.set(R.UNDO_HISTORY, this.mUndoHistory);
    this.mLayoutEditor.attach(this);
    this.mComponentPicker.attach(this);
    this.mComponentOutline.attach(this);
    this.mUndoHistory.attach(this);
}

Object.defineProperties(FormEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(FormEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
FormEditor.prototype.constructor = FormEditor;

FormEditor.prototype.onStart = function () {
    this.mLayoutEditor.start();
    this.mComponentPicker.start();
    this.mAttributeEditor.start();
    this.mAllPropertyEditor.start();
    this.mComponentOutline.start();
    this.mUndoHistory.start();
};


FormEditor.prototype.onStop = function () {
    this.mLayoutEditor.stop();
    this.mComponentPicker.stop();
    this.mAttributeEditor.stop();
    this.mAllPropertyEditor.stop();
    this.mComponentOutline.stop();
    this.mUndoHistory.stop();
};


FormEditor.prototype.onPause = function () {
    this.mLayoutEditor.pause();
    this.mComponentPicker.pause();
    this.mAttributeEditor.pause();
    this.mAllPropertyEditor.pause();
    this.mComponentOutline.pause();
    this.mUndoHistory.pause();
};


FormEditor.prototype.onResume  = function(){
    this.mLayoutEditor.resume();
    this.mComponentPicker.resume();
    this.mAttributeEditor.resume();
    this.mAllPropertyEditor.resume();
    this.mComponentOutline.resume();
    this.mUndoHistory.resume ();
};

FormEditor.prototype.getContextManager = function () {
    return this.ctxMng;
};


FormEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        class: 'as-form-editor',
        attr: {
            tabindex: '1'
        },
        child: [
            {
                class: 'as-form-editor-left-site-container',
                child: {
                    tag: 'tabview',
                    class: ['xp-tiny', 'as-form-editor-left-site'],
                    child: [
                        {
                            tag: 'tabframe',
                            class: ['absol-bscroller', 'as-form-property-tab'],
                            attr: {
                                name: 'Form',
                                id: 'tab-form',
                            }
                        },
                        {
                            tag: 'tabframe',
                            class: ['absol-bscroller', 'as-form-property-tab'],
                            attr: {
                                name: 'Component',
                                id: 'tab-component',
                            },
                            child: this.mComponentPicker.getView()
                        },
                        {
                            tag: 'tabframe',
                            class: ['absol-bscroller', 'as-form-property-tab'],
                            attr: {
                                name: 'Outline',
                                id: 'tab-outline',
                            },
                            child: this.mComponentOutline.getView()
                        },
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
                            class: ['absol-bscroller', 'as-form-property-tab'],
                            attr: {
                                name: 'Attributes',
                                id: 'tab-attributes-new',
                            },
                            child: this.mAttributeEditor.getView()
                        },
                        {
                            tag: 'tabframe',
                            class: ['absol-bscroller', 'as-form-property-tab'],
                            attr: {
                                name: 'Style',
                                id: 'tab-style',
                            },
                            child: this.mStyleEditor.getView()
                        },
                        {
                            tag: 'tabframe',
                            class: ['absol-bscroller', 'as-form-property-tab'],
                            attr: {
                                name: 'Event',
                                id: 'tab-event',
                            }
                        },
                        {
                            tag: 'tabframe',
                            class: ['absol-bscroller', 'as-form-property-tab'],
                            attr: {
                                name: 'All',
                                id: 'tab-all',
                            },
                            child: this.mAllPropertyEditor.getView()
                        }
                    ]
                }
            },

            '.as-form-editor-resizer.vertical.left-site',
            '.as-form-editor-resizer.vertical.right-site'

        ],
        on: {
            keydown: this.ev_keydown.bind(this)
        }
    });

    this.$attachhook = _('attachook').addTo(this.$view).on('error', function () {
        Dom.addToResizeSystem(this);
        this.updateSize = this.updateSize || self.ev_resize.bind(this);
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


    this.$leftTabView = $('tabview', this.$leftSiteCtn);
    this.$leftTabView.activeTab('tab-component');


    this.$rightTabView = $('tabview', this.$rightSiteCtn);
    this.$rightTabView.activeTab('tab-style');
    this.$styleTabFrame = $('tabframe#tab-style', this.$rightTabView);
    this.$attributesTabFrame = $('tabframe#tab-attributes', this.$rightTabView);
    this.$contextCaptor = _('contextcaptor').addTo(this.$view).attachTo(this.$view);

    return this.$view;
};


FormEditor.prototype.ev_focusElement = function (event) {
    this._focusElement = event.component;
    this.mStyleEditor.edit(event.component);
    this.mAttributeEditor.edit(event.component);
    this.mAllPropertyEditor.edit(event.component);
    this.mComponentOutline.updateComponentStatus();
};

FormEditor.prototype.ev_removeComponent = function (event) {
    if (this._focusElement == event.component) {
        this._focusElement = undefined;
        this.mStyleEditor.edit(undefined);
        this.mAttributeEditor.edit(undefined);
        this.mAllPropertyEditor.edit(undefined);
    }
    this.mComponentOutline.updateComponetTree();
};

FormEditor.prototype.ev_addComponent = function () {
    this.mComponentOutline.updateComponetTree();
};

FormEditor.prototype.ev_styleEditorChange = function (event) {
    this.mLayoutEditor.autoExpandRootLayout();
    if (this._focusElement) this._focusElement.reMeasure();
    Dom.updateResizeSystem();
    if (event.name == 'vAlign' || event.name == 'hAlign')
        this.mLayoutEditor.updateAnchor();
    else
        this.mLayoutEditor.updateAnchorPosition();
    this.emit('change', Object.assign({ formEditor: this }, event), this);
};


FormEditor.prototype.setComponentProperty = function (name, value) {
    return this.component.setAttribute(name, value);
};


FormEditor.prototype.getComponentProperty = function (name) {
    return this.component.getAttribute(name);
};




FormEditor.prototype.ev_resize = function () {

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
        left: 'calc(' + this.style.leftSizeWidth + 'em - 0.2em)'
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
        right: 'calc(' + this.style.rightSizeWidth + 'em - 0.2em)'
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



FormEditor.prototype.ev_keydown = function (event) {
    this._lastKeydownTime = this._lastKeydownTime || 0;
    var now = new Date().getTime();
    if (now - this._lastKeydownTime > 100) {
        if (event.ctrlKey && event.key == 'z') {
            this._lastKeydownTime = now;
            this.mUndoHistory.undo();
        }
        else if (event.ctrlKey && event.key == 'y') {
            this._lastKeydownTime = now;
            this.mUndoHistory.redo();
        }
    }
};

FormEditor.prototype.ev_layoutEditorChange = function () {

};


FormEditor.prototype.setData = function (data) {
    this.mLayoutEditor.setData(data);
    this.mComponentOutline.updateComponetTree();
};


FormEditor.prototype.getData = function () {
    return this.mLayoutEditor.getData();
};


FormEditor.prototype.commitHistory = function (type, description) {
    this.mUndoHistory.commit(type, this.getData(), description, new Date());
};


FormEditor.prototype.addComponent = function (data) {
    if (this.mLayoutEditor.rootLayout) {
        var newComponent = this.mLayoutEditor.build(data);
        this.mLayoutEditor.rootLayout.addChild(newComponent);
        this.mLayoutEditor.activeComponent(newComponent);
        this.commitHistory('add', 'Add' + newComponent.tag);
    }
};

FormEditor.prototype.notifyAllChange = function () {
    this.mStyleEditor.notifyChange();
    this.mAttributeEditor.notifyChange();
    this.mAllPropertyEditor.notifyChange();
    this.emit('change', Object.assign({}, { formEditor: this }), this);
}

FormEditor.prototype.notifyStyleChange = function () {
    this.mStyleEditor.notifyChange();
    this.emit('change', Object.assign({}, { formEditor: this }), this);

};

FormEditor.prototype.notifyAttributeChange = function () {
    this.emit('change', Object.assign({}, { formEditor: this }), this);
};


export default FormEditor; 