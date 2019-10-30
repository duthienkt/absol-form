import RelativeLayout from "../layouts/RelativeLayout";
import DateInput from "../components/DateInput";
import TextInput from "../components/TextInput";
import TextArea from "../components/TextArea";
import NumberInput from "../components/NumberInput";
import ComboBox from "../components/ComboBox";
import SelectBox from "../components/SelectBox";
import Radio from "../components/Radio";
import CheckBox from "../components/Checkbox";
import Label from "../components/Label";
import Fcore from "../core/FCore";
import Context from "absol/src/AppPattern/Context";
import EventEmitter from "absol/src/HTML5/EventEmitter";

import '../../css/componentpicker.css';
import Text from "../components/Text";
import Draggable from "absol-acomp/js/Draggable";
import R from "../R";
import Image from "../components/Image";
import Button from "../components/Button";

var _ = Fcore._;
var $ = Fcore.$;


function ComponentPicker() {
    Context.call(this);
    EventEmitter.call(this);
    this.$view = null;
    this.mLayoutEditor = null;
}
Object.defineProperties(ComponentPicker.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(ComponentPicker.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
ComponentPicker.prototype.constructor = ComponentPicker;


ComponentPicker.prototype.onStart = function () {
    /**
     * @type {import('./LayoutEditor').default}
     */
    this.mLayoutEditor = this.getContext(R.LAYOUT_EDITOR);
};

ComponentPicker.prototype.getView = function () {
    if (this.$view) return this.$view;
    if (this.$view) return this.$compExpTree;
    var self = this;
    function toggleGroup() {
        this.status = { open: 'close', close: 'open' }[this.status]
    }


    this.$view = _({
        class: 'as-compopnent-picker',
        child: [{
            tag: 'exptree',
            props: {
                name: 'all',
                status: 'open'
            },
            on: {
                press: toggleGroup
            },
            child: [
                {
                    tag: 'exptree',
                    props: {
                        name: 'layouts',
                        status: 'open'
                    },
                    on: {
                        press: toggleGroup
                    },
                    child: [
                        {
                            tag: 'exptree',
                            props: {
                                name: "RelativeLayout",
                                icon: RelativeLayout.prototype.menuIcon
                            }
                        }
                    ]
                },
                {
                    tag: 'exptree',
                    props: {
                        name: 'inputs',
                        status: 'open'
                    },
                    on: {
                        press: toggleGroup
                    },
                    child: [
                        {
                            tag: 'exptree',
                            props: {
                                name: "DateInput",
                                icon: DateInput.prototype.menuIcon,
                                componentConstructor: DateInput
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "TextInput",
                                icon: TextInput.prototype.menuIcon,
                                componentConstructor: TextInput
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "TextArea",
                                icon: TextArea.prototype.menuIcon,
                                componentConstructor: TextArea
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "NumberInput",
                                icon: NumberInput.prototype.menuIcon,
                                componentConstructor: NumberInput
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "ComboBox",
                                icon: ComboBox.prototype.menuIcon,
                                componentConstructor: ComboBox

                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "SelectBox",
                                icon: SelectBox.prototype.menuIcon,
                                componentConstructor: SelectBox
                            },
                            on: {
                                press: function () {
                                    // this.addComponent({ tag: 'SelectBox', attributes: { value: [0], list: [{ text: 'Item 0', value: 0 }, { text: 'Item 1', value: 1 }] } });
                                }.bind(this)
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "Radio",
                                icon: Radio.prototype.menuIcon,
                                componentConstructor: Radio
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "CheckBox",
                                icon: CheckBox.prototype.menuIcon,
                                componentConstructor: CheckBox
                            }
                        }
                    ]
                },
                {
                    tag: 'exptree',
                    props: {
                        name: "static",
                        status: 'open'
                    },
                    on: {
                        press: toggleGroup
                    },
                    child: [
                        {
                            tag: 'exptree',
                            props: {
                                name: "Label",
                                icon: Label.prototype.menuIcon,
                                componentConstructor: Label
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "Text",
                                icon: Text.prototype.menuIcon,
                                componentConstructor: Text
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "Image",
                                icon: Image.prototype.menuIcon,
                                componentConstructor: Image
                            }
                        }
                    ]
                },
                {
                    tag: 'exptree',
                    props: {
                        name: "trigger",
                        status: 'open'
                    },
                    on: {
                        press: toggleGroup
                    },
                    child:[
                        {
                            tag: 'exptree',
                            props: {
                                name: "Button",
                                icon: Button.prototype.menuIcon,
                                componentConstructor: Button
                            }
                        }
                    ]
                }
            ]
        }
        ]
    });

    $('exptree', this.$view, function (elt) {
        if (elt.componentConstructor) {
            Draggable(elt.$node).on('begindrag', self.ev_constructorBeginDrag.bind(self, elt))
                .on('enddrag', self.ev_constructorEndDrag.bind(self, elt))
                .on('drag', self.ev_constructorDrag.bind(self, elt))

        }
    });

    return this.$view;
};



ComponentPicker.prototype.ev_constructorBeginDrag = function (treeNode, event) {
    
    this.$modal = this.$modal || _('.as-compopnent-picker-forceground');
    this.$higne = this.$higne || _('.as-compopnent-picker-higne').addTo(this.$modal);
    this.$addBoxCtn = this.$addBoxCtn || _('.as-compopnent-picker-add-box-container').addTo(this.$higne);
    this.$addBox = this.$addBox || _({ class: 'as-compopnent-picker-add-box', child: { class: 'as-compopnent-picker-add-box-plus', child: 'span.mdi.mdi-plus' } }).addTo(this.$addBoxCtn);
    if (this.$addBoxIcon) this.$addBoxIcon.remove();
    this.$addBoxIcon = _(treeNode.componentConstructor.prototype.menuIcon).addTo(this.$addBox);
    this.$modal.addTo(document.body);
    if (this.mLayoutEditor.rootLayout) {
        this._dragRect = this.mLayoutEditor.rootLayout.view.getBoundingClientRect();
    }
    else {
        this._dragRect = undefined;
    }
};


ComponentPicker.prototype.ev_constructorEndDrag = function (treeNode, event) {
    if (!this.$modal) return;//quick fix, must fix in Draggable
    this.$modal.remove();
    var x = event.clientX;
    var y = event.clientY;
    var rect = this._dragRect;
    if (rect && rect.top <= y && rect.bottom >= y && rect.left <= x && rect.right >= x) {
        this.mLayoutEditor.addNewComponent(treeNode.componentConstructor.prototype.tag, x - rect.left, y - rect.top);
    }
};

ComponentPicker.prototype.ev_constructorDrag = function (treeNode, event) {
    this.$addBoxCtn.addStyle({
        left: event.clientX + 'px',
        top: event.clientY + 'px'
    });

    var x = event.clientX;
    var y = event.clientY;
    var rect = this._dragRect;
    if (rect && rect.top <= y && rect.bottom >= y && rect.left <= x && rect.right >= x) {
        this.$addBox.addClass('as-can-drop');
    }
    else {
        this.$addBox.removeClass('as-can-drop');
    }
};


export default ComponentPicker;