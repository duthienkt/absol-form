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

var _ = Fcore._;
var $ = Fcore.$;


function ComponentPicker() {
    Context.call(this);
    EventEmitter.call(this);
    this.$view = null;
}
Object.defineProperties(ComponentPicker.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(ComponentPicker.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
ComponentPicker.prototype.constructor = ComponentPicker;


ComponentPicker.prototype.getView = function () {
    if (this.$view) return this.$view;
    if (this.$view) return this.$compExpTree;
    var self = this;
    function toggleGroup() {
        this.status = { open: 'close', close: 'open' }[this.status]
    }

    this.$view = _({
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
                            icon: DateInput.prototype.menuIcon
                        },
                        on: {
                            // press: this.addComponent.bind(this, { tag: 'DateInput' })
                        }
                    },
                    {
                        tag: 'exptree',
                        props: {
                            name: "TextInput",
                            icon: TextInput.prototype.menuIcon
                        },
                        on: {
                            // press: this.addComponent.bind(this, { tag: 'TextInput' })
                        }
                    },
                    {
                        tag: 'exptree',
                        props: {
                            name: "TextArea",
                            icon: TextArea.prototype.menuIcon
                        },
                        on: {
                            // press: this.addComponent.bind(this, { tag: 'TextArea' })
                        }
                    },
                    {
                        tag: 'exptree',
                        props: {
                            name: "NumberInput",
                            icon: NumberInput.prototype.menuIcon
                        },
                        on: {
                            // press: this.addComponent.bind(this, { tag: 'NumberInput', attributes: { value: 0 } })
                        }
                    },
                    {
                        tag: 'exptree',
                        props: {
                            name: "ComboBox",
                            icon: ComboBox.prototype.menuIcon,
                        },
                        on: {
                            press: function () {
                                // this.addComponent({ tag: 'ComboBox', attributes: { value: 0, list: [{ text: 'Item 0', value: 0 }, { text: 'Item 1', value: 1 }] } });
                            }.bind(this)
                        }
                    },
                    {
                        tag: 'exptree',
                        props: {
                            name: "SelectBox",
                            icon: SelectBox.prototype.menuIcon
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
                            icon: Radio.prototype.menuIcon
                        },
                        on: {
                            // press: this.addComponent.bind(this, { tag: 'Radio', attributes: { checked: false } })
                        }
                    },
                    {
                        tag: 'exptree',
                        props: {
                            name: "CheckBox",
                            icon: CheckBox.prototype.menuIcon
                        },
                        on: {
                            // press: this.addComponent.bind(this, { tag: 'CheckBox', attributes: { checked: false } })
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
                            icon: Label.prototype.menuIcon
                        },
                        on: {
                            // press: this.addComponent.bind(this, { tag: 'Label', attributes: { text: 'label-text' } })
                        }
                    },
                    {
                        tag: 'exptree',
                        props: {
                            name: "Text",
                            icon: 'span.mdi.mdi-format-color-text'
                        },
                        on: {
                            // press: this.addComponent.bind(this, { tag: 'Text', attributes: { text: 'Lorem ipsum dolor sit amet' }, style: { width: 200 } })
                        }
                    }
                ]
            }
        ]
    });

    $('exptree', this.$view, function (elt) {

    });

    return this.$view;
};

export default ComponentPicker;