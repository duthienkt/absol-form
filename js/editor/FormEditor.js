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
import { compareDate } from 'absol/src/Time/datetime';
import ListEditor from './ListEditor';
import ComponentPicker from './ComponentPicker';
import ContextManager from 'absol/src/AppPattern/ContextManager';
import R from '../R';

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

    this.mComponentPicker = new ComponentPicker();


    this._styleInputsNeedUpdate = []; // to know which element need to update
    this._attributeInputsNeedUpdate = []; // to know which element need to update

    this.mLayoutEditor.on('change', function (event) {
        self.notifyStyleChange();
    }).on('activecomponent', this.ev_activeComponent.bind(this));

    this.mLayoutEditor.on('movecomponent', this.notifyStyleChange.bind(this));
    this.ctxMng.set(R.LAYOUT_EDITOR, this.mLayoutEditor);
    this.ctxMng.set(R.COMPONENT_PICKER, this.mComponentPicker);
    this.mLayoutEditor.attach(this);
    this.mComponentPicker.attach(this);
}

Object.defineProperties(FormEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(FormEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
FormEditor.prototype.constructor = FormEditor;

FormEditor.prototype.onStart = function () {
    this.mLayoutEditor.start(this);
    this.mComponentPicker.start(this);
};

FormEditor.prototype.getContextManager = function () {
    return this.ctxMng;
};


FormEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
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
                            }
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
                                id: 'tab-attributes',
                            }
                        },
                        {
                            tag: 'tabframe',
                            class: ['absol-bscroller', 'as-form-property-tab'],
                            attr: {
                                name: 'Style',
                                id: 'tab-style',
                            }
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
                            }
                        }
                    ]
                }
            },

            '.as-form-editor-resizer.vertical.left-site',
            '.as-form-editor-resizer.vertical.right-site'

        ]
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


FormEditor.prototype.ev_activeComponent = function (event) {
    this._activatedCompnent = event.component;
    this.loadStyleTab();
    this.loadAttribiutesTab();
};


FormEditor.prototype.loadStyleTab = function () {
        this._styleInputsNeedUpdate = [];
        this.$styleTabFrame.clearChild();
    if (this._activatedCompnent) {
        var component = this._activatedCompnent;
        var acceptsStyleNames = component.getAcceptsStyleNames();
        var styleDescriptors = component.getStyleDescriptors();
        var styleTable = _({
            tag: 'table',
            class: 'as-form-params',
            child: [
                {
                    tag: 'thead',
                    child: [
                        {
                            tag: 'tr',
                            child: [
                                {
                                    tag: 'td',
                                    child: { text: "key" }
                                },
                                {
                                    tag: 'td',
                                    child: { text: 'value' }
                                }
                            ]
                        }
                    ]
                },
                {
                    tag: 'tbody',
                    child: acceptsStyleNames.map(function (styleName) {
                        var descriptor = styleDescriptors[styleName];

                        var input = 'input';

                        switch (descriptor.type) {
                            case "enum": input = {
                                tag: 'selectmenu',
                                class: 'style-input-need-update',
                                props: {
                                    items: descriptor.values.map(function (value) { return { text: value + "", value: value } }),
                                    value: component.style[styleName],
                                    disabled: descriptor.disabled,
                                    notifyStyleUpdate: function () {
                                        this.value = component.style[styleName];
                                        this.disabled = component.getStyleDescriptor(styleName).disabled;
                                    }
                                },
                                on: {
                                    change: function () {
                                        component.setStyle(styleName, this.value);
                                        component.reMeasure();
                                        self.mLayoutEditor.updateAnchor();
                                        self.mLayoutEditor.updateAnchorPosition();
                                        self.notifyStyleChange();
                                    }
                                }
                            }; break;
                            case "number": input = {
                                tag: 'numberinput',
                                class: 'style-input-need-update',
                                props: {
                                    min: descriptor.min,
                                    max: descriptor.max,
                                    disabled: descriptor.disabled,
                                    value: component.style[styleName],
                                    notifyStyleUpdate: function () {
                                        this.value = component.style[styleName];
                                        this.disabled = component.getStyleDescriptor(styleName).disabled;
                                    }
                                },
                                on: {
                                    changing: function () {
                                        component.setStyle(styleName, this.value);
                                        self.mLayoutEditor.updateAnchorPosition();
                                        component.reMeasure();
                                        self.notifyStyleChange();
                                    }
                                }
                            }; break;
                        }

                        return {
                            tag: 'tr',
                            child: [
                                {
                                    tag: "td",
                                    child: { text: styleName }
                                }, {
                                    tag: 'td',
                                    child: input
                                }
                            ]
                        }
                    })
                }
            ]
        }).addTo(this.$styleTabFrame);
        var self = this;
        $('.style-input-need-update', styleTable, function (e) {
            self._styleInputsNeedUpdate.push(e);
        });
    }
};


FormEditor.prototype.loadAttribiutesTab = function () {
    this.$attributesTabFrame.clearChild();
    this._attributeInputsNeedUpdate = [];

    if (this._activatedCompnent) {
        var component = this._activatedCompnent;
        var component = this._activatedCompnent;
        var acceptsAttributeNames = component.getAcceptsAttributeNames();
        var attributeDescriptors = component.getAttributeDescriptors();

        var attributeTable = _({
            tag: 'table',
            class: 'as-form-params',
            child: [
                {
                    tag: 'thead',
                    child: [

                        {
                            tag: 'tr',
                            child: [
                                {
                                    tag: 'td',
                                    child: { text: "key" }
                                },
                                {
                                    tag: 'td',
                                    child: { text: 'value' }
                                }
                            ]
                        }
                    ]
                },
                {
                    tag: 'tbody',
                    child: acceptsAttributeNames.map(function (attributeName) {
                        var descriptor = attributeDescriptors[attributeName];

                        var input = 'input';
                        var extendCells = [];

                        switch (descriptor.type) {
                            case "enum": input = {
                                tag: 'selectmenu',
                                class: 'attribute-input-need-update',
                                props: {
                                    items: descriptor.values.map(function (value) { return { text: value + "", value: value } }),
                                    value: component.attributes[attributeName],
                                    disabled: descriptor.disabled,
                                    notifyAttributeUpdate: function () {
                                        // this.value = component.style[attributeName];
                                        // this.disabled = component.getStyleDescriptor(attributeName).disabled;
                                    }
                                },
                                on: {
                                    change: function () {
                                        // component.setStyle(attributeName, this.value);
                                        // self.mLayoutEditor.updateAnchor();
                                        // self.mLayoutEditor.updateAnchorPosition();
                                        self.notifyAttributeChange();
                                    }
                                }
                            }; break;
                            case "number":

                                input = {
                                    tag: 'numberinput',
                                    class: 'attribute-input-need-update',
                                    props: {
                                        disabled: descriptor.disabled,
                                        value: (component.attributes[attributeName] === null || component.attributes[attributeName] === undefined) ? descriptor.defaultValue : component.attributes[attributeName],
                                        notifyAttributeUpdate: function () {
                                            // console.log("attr",);
                                            this.value = (component.attributes[attributeName] === null || component.attributes[attributeName] === undefined) ? descriptor.defaultValue : component.attributes[attributeName];
                                        }
                                    },
                                    on: {
                                        change: function () {
                                            component.setAttribute(attributeName, this.value);
                                            self.notifyAttributeChange();
                                        }
                                    }
                                };

                                if (descriptor.nullable) {
                                    extendCells.push({
                                        tag: 'checkbox',
                                        class: ['right', 'attribute-input-need-update'],
                                        props: {
                                            checked: component.attributes[attributeName] === null,
                                            text: "NULL",
                                            notifyAttributeUpdate: function () {
                                                this.checked = component.attributes[attributeName] === null;
                                            }
                                        },
                                        on: {
                                            change: function () {
                                                if (this.checked) {
                                                    component.setAttribute(attributeName, null);
                                                }
                                                else {
                                                    component.setAttribute(attributeName, descriptor.defaultValue);
                                                }
                                                self.notifyAttributeChange();
                                            }
                                        }
                                    })
                                }

                                break;
                            case "const":
                                input = { tag: 'strong', child: { text: descriptor.value } }
                                break;
                            case "text":
                                input = {
                                    tag: descriptor.long ? 'textarea' : 'input',
                                    attr: { type: 'text' },
                                    class: 'attribute-input-need-update',
                                    props: {
                                        value: component.attributes[attributeName] || "",
                                        notifyAttributeUpdate: function () {
                                            this.value = component.attributes[attributeName];
                                        }
                                    },
                                    on: {
                                        keyup: function () {
                                            var value = this.value;
                                            component.setAttribute(attributeName, value);
                                            self.notifyAttributeChange();
                                        }
                                    }
                                };
                                break;
                            case "bool":
                                input = {
                                    tag: "checkboxbutton",
                                    props: {
                                        checked: component.attributes[attributeName],
                                        notifyAttributeUpdate: function () {
                                            this.checked = component.attributes[attributeName];
                                        }
                                    },
                                    on: {
                                        change: function () {
                                            component.setAttribute(attributeName, this.checked);
                                            self.notifyAttributeChange();
                                        }
                                    }
                                };
                                break;
                            case "date":
                                input = {
                                    tag: 'calendarinput',
                                    class: 'attribute-input-need-update',
                                    props: {
                                        value: component.attributes[attributeName],
                                        notifyAttributeUpdate: function () {
                                            if (component.attributes[attributeName] != null && this.value != null && compareDate(component.attributes[attributeName], this.value) != 0) {
                                                this.value = component.attributes[attributeName];
                                            }
                                            else {
                                                this.value = component.attributes[attributeName];
                                            }
                                        }
                                    },
                                    on: {
                                        change: function () {
                                            component.setAttribute(attributeName, this.value);
                                            self.notifyAttributeChange();
                                        }
                                    }
                                };
                                if (descriptor.nullable) {
                                    extendCells.push({
                                        tag: 'checkbox',
                                        class: ['right', 'attribute-input-need-update'],
                                        props: {
                                            text: "NULL",
                                            checked: component.attributes[attributeName] == null,
                                            notifyAttributeUpdate: function () {
                                                this.checked = component.attributes[attributeName] == null;
                                            }
                                        },
                                        on: {
                                            change: function () {
                                                if (this.checked) {
                                                    component.setAttribute('value', null);
                                                }
                                                else {
                                                    component.setAttribute('value', descriptor.defaultValue);
                                                }
                                                self.notifyAttributeChange();
                                            }
                                        }
                                    })
                                }
                                break;
                            case "list":
                                var listEditor = new ListEditor();
                                input = listEditor.getView();
                                listEditor.setData(component.attributes[attributeName]);
                                listEditor.on('change', function () {
                                    var data = this.getData();
                                    component.setAttribute(attributeName, data);
                                    self.notifyAttributeChange();
                                });
                                break;
                        }


                        return {
                            tag: 'tr',
                            child: [
                                {
                                    tag: "td",
                                    child: { text: attributeName != 'name' ? attributeName : 'na\u200Bme' }
                                },
                                {
                                    tag: 'td',
                                    attr: {
                                        colspan: 3 - extendCells.length + ''
                                    },
                                    child: input
                                }
                            ].concat(extendCells.map(function (cell) {
                                return {
                                    tag: 'td',
                                    child: cell
                                }
                            }))
                        }
                    })
                }
            ]
        }).addTo(this.$attributesTabFrame);
        var self = this;
        $('.attribute-input-need-update', attributeTable, function (e) {
            self._attributeInputsNeedUpdate.push(e);
        });
    }
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


FormEditor.prototype.setData = function (data) {
    this.mLayoutEditor.setData(data);
};


FormEditor.prototype.getData = function () {
    return this.mLayoutEditor.getData();
};


FormEditor.prototype.addComponent = function (data) {
    if (this.mLayoutEditor.rootLayout) {
        var newComponent = this.mLayoutEditor.build(data);
        this.mLayoutEditor.rootLayout.addChild(newComponent);
        this.mLayoutEditor.activeComponent(newComponent);
    }
};


FormEditor.prototype.notifyStyleChange = function () {
    this._styleInputsNeedUpdate.forEach(function (e) {
        if (e.notifyStyleUpdate)
            e.notifyStyleUpdate();
    });
    this.mLayoutEditor.autoExpandRootLayout();

    this.emit('change', Object.assign({}, { formEditor: this }), this);

};


FormEditor.prototype.notifyAttributeChange = function () {
    this._attributeInputsNeedUpdate.forEach(function (e) {
        if (e.notifyAttributeUpdate)
            e.notifyAttributeUpdate();
    });
    this.emit('change', Object.assign({}, { formEditor: this }), this);

};


export default FormEditor; 