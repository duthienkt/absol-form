import RelativeLayout from "../layouts/RelativeLayout";
import DateInput from "../components/DateInput";
import TextInput from "../components/TextInput";
import TextArea from "../components/TextArea";
import NumberInput from "../components/NumberInput";
import ComboBox from "../components/ComboBox";
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
import Table from "../components/Table";
import LinearLayout from "../layouts/LinearLayout";
import PluginManager from "../core/PluginManager";
import Ellipse from "../shapes/Ellipse";
import Rectangle from "../shapes/Rectangle";
import ChainLayout from "../layouts/ChainLayout";
import MultiselectCombobox from "../components/MultiselectCombobox";
import TrackBar from "../components/TrackBar";
import TrackBarInput from "../components/TrackBarInput";
import TableInput from "../components/TableInput";
import ArrayOfFragment from "../components/ArrayOfFragment";
import EditableArrayOfFragment from "../components/EditableArrayOfFragment";
import TreeComboBox from "../components/TreeComboBox";
import ImageFileInput from "../components/ImageFileInput";

var _ = Fcore._;
var $ = Fcore.$;


function ComponentPicker() {
    Context.call(this);
    EventEmitter.call(this);
    this.$view = null;
    /**
     * @type {import('./LayoutEditor').default}
     */
    this.layoutEditor = null;
}

Object.defineProperties(ComponentPicker.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(ComponentPicker.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
ComponentPicker.prototype.constructor = ComponentPicker;


ComponentPicker.prototype.bindWithEditor = function (editor) {
    this.layoutEditor = editor;
}

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
                        status: 'close'
                    },
                    on: {
                        press: toggleGroup
                    },
                    child: [
                        {
                            tag: 'exptree',
                            props: {
                                name: "RelativeLayout",
                                icon: RelativeLayout.prototype.menuIcon,
                                componentConstructor: RelativeLayout

                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "LinearLayout",
                                icon: LinearLayout.prototype.menuIcon,
                                componentConstructor: LinearLayout
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "ChainLayout",
                                icon: ChainLayout.prototype.menuIcon,
                                componentConstructor: ChainLayout
                            }
                        }
                    ]
                },
                {
                    tag: 'exptree',
                    props: {
                        name: 'inputs',
                        status: 'close'
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
                                name: MultiselectCombobox.prototype.tag,
                                icon: MultiselectCombobox.prototype.menuIcon,
                                componentConstructor: MultiselectCombobox

                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: TreeComboBox.prototype.tag,
                                icon: TreeComboBox.prototype.menuIcon,
                                componentConstructor: TreeComboBox

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
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: TrackBar.prototype.tag,
                                icon: TrackBar.prototype.menuIcon,
                                componentConstructor: TrackBar
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: TrackBarInput.prototype.tag,
                                icon: TrackBarInput.prototype.menuIcon,
                                componentConstructor: TrackBarInput
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: TableInput.prototype.tag,
                                icon: TableInput.prototype.menuIcon,
                                componentConstructor: TableInput
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: ImageFileInput.prototype.tag,
                                icon: ImageFileInput.prototype.menuIcon,
                                componentConstructor: ImageFileInput
                            }
                        }
                    ]
                },
                {
                    tag: 'exptree',
                    props: {
                        name: "static",
                        status: 'close'
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
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "Table",
                                icon: Table.prototype.menuIcon,
                                componentConstructor: Table
                            }
                        }
                    ]
                },
                {
                    tag: 'exptree',
                    props: {
                        name: "trigger",
                        status: 'close'
                    },
                    on: {
                        press: toggleGroup
                    },
                    child: [
                        {
                            tag: 'exptree',
                            props: {
                                name: "Button",
                                icon: Button.prototype.menuIcon,
                                componentConstructor: Button
                            }
                        }
                    ]
                },
                {
                    tag: 'exptree',
                    props: {
                        name: 'mapping',
                        status: 'close'
                    },
                    child: [
                        {
                            tag: 'exptree',
                            props: {
                                name: ArrayOfFragment.prototype.tag,
                                icon: ArrayOfFragment.prototype.menuIcon,
                                componentConstructor: ArrayOfFragment
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: EditableArrayOfFragment.prototype.tag,
                                icon: EditableArrayOfFragment.prototype.menuIcon,
                                componentConstructor: EditableArrayOfFragment
                            }
                        }
                    ]
                },
                {
                    tag: 'exptree',
                    props: {
                        name: 'shapes',
                        status: 'close'
                    },
                    on: {
                        press: toggleGroup
                    },
                    child: [
                        {
                            tag: 'exptree',
                            props: {
                                name: "Ellipse",
                                icon: Ellipse.prototype.menuIcon,
                                componentConstructor: Ellipse
                            }
                        },
                        {
                            tag: 'exptree',
                            props: {
                                name: "Rectangle",
                                icon: Rectangle.prototype.menuIcon,
                                componentConstructor: Rectangle
                            }
                        }
                    ]
                }
            ]
        }
        ]
    });

    this.$all = $('exptree', this.$view);


    var context = { self: this, toggleGroup: toggleGroup, $view: this.$view };
    PluginManager.exec(this, R.PLUGINS.COMPONENT_PICKER_VIEW, context);

    //todo: find and call

    Draggable(this.$all).on('begindrag', self.ev_constructorBeginDrag.bind(self))
        .on('enddrag', self.ev_constructorEndDrag.bind(self))
        .on('drag', self.ev_constructorDrag.bind(self));

    return this.$view;
};

ComponentPicker.prototype._findComponentConstructor = function (elt) {
    while (elt) {
        if (elt.componentConstructor) return elt.componentConstructor;
        elt = elt.parentElement;
    }
    return null;
};


ComponentPicker.prototype.ev_constructorBeginDrag = function (event) {
    var constructor = this._findComponentConstructor(event.target);
    this._currentComponentConstructor = constructor;
    this.$modal = this.$modal || _('.as-compopnent-picker-forceground');
    this.$higne = this.$higne || _('.as-compopnent-picker-higne').addTo(this.$modal);
    this.$addBoxCtn = this.$addBoxCtn || _('.as-compopnent-picker-add-box-container').addTo(this.$higne);
    this.$addBox = this.$addBox || _({
        class: 'as-compopnent-picker-add-box',
        child: { class: 'as-compopnent-picker-add-box-plus', child: 'span.mdi.mdi-plus' }
    }).addTo(this.$addBoxCtn);
    if (this.$addBoxIcon) this.$addBoxIcon.remove();
    this.$addBoxIcon = _((constructor.prototype && constructor.prototype.menuIcon) || 'span.mdi.mdi-select-place').addTo(this.$addBox);
    this.$modal.addTo(document.body);
    if (this.layoutEditor.rootLayout) {
        this._dragRect = this.layoutEditor.rootLayout.domElt.getBoundingClientRect();
    }
    else {
        this._dragRect = undefined;
    }
};


ComponentPicker.prototype.ev_constructorEndDrag = function (event) {
    if (!this.$modal) return;//quick fix, must fix in Draggable
    this.$modal.remove();
    var constructor = this._currentComponentConstructor;
    var x = event.clientX;
    var y = event.clientY;
    var rect = this._dragRect;
    if (rect && rect.top <= y && rect.bottom >= y && rect.left <= x && rect.right >= x) {
        this.layoutEditor.addNewComponent(constructor, x - rect.left, y - rect.top);
    }
};

ComponentPicker.prototype.ev_constructorDrag = function (event) {
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