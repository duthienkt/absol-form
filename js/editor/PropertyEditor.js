import Fcore from '../core/FCore';
import Context from 'absol/src/AppPattern/Context';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
import '../../css/propertyeditor.css';
import { camelCaseToPascalCase } from 'absol/src/String/stringFormat';
import { beginOfDay } from 'absol/src/Time/datetime';
import ListEditor from './ListEditor';
import { FONT_ITEMS } from '../font/GoogleFont';
import { getMaterialDesignIconNames } from '../font/MaterialDesignIcons';
import '../dom/FontIconInput';
import QuickMenu from 'absol-acomp/js/QuickMenu';

// FontIconPicker

getMaterialDesignIconNames();

var _ = Fcore._;
var $ = Fcore.$;


function PropertyEditor() {
    Context.call(this);
    EventEmitter.call(this);
    this.$view = null;
    /**
     * @type {import('../core/BaseComponent').default}
     */
    this.object = null;
    this.propertyNames = [];
    this.$needUpdate = [];// all element which had .as-need-update
    this.queuePools = {};
}

Object.defineProperties(PropertyEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(PropertyEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
PropertyEditor.prototype.constructor = PropertyEditor;

PropertyEditor.prototype.pools = {};//share object


PropertyEditor.prototype.onDestroy = function () {
    this.flushAllToPools();
};


PropertyEditor.prototype.edit = function (object) {
    this.object = object;
    this.loadAttributes();
};



PropertyEditor.prototype.setProperty = function (name, value) {
    return this.object[name] = value;
};


PropertyEditor.prototype.getProperty = function (name) {
    return this.object[name];
};


PropertyEditor.prototype.getPropertyDescriptor = function (name) {
    return { type: typeof (this.object) };
};



PropertyEditor.prototype.getPropertyNames = function () {
    return Object.keys(this.object);
};

PropertyEditor.prototype.flushAllToPools = function () {
    var self = this;
    Object.keys(this.queuePools).forEach(function (key) {
        self.pools[key] = self.pools[key] === undefined ? [] : self.pools[key];
        var all = self.queuePools[key].splice(0);
        self.pools[key].push.apply(self.pools[key], all);
    });
};


PropertyEditor.prototype.assignToPool = function (key, value) {
    this.queuePools[key] = this.queuePools[key] === undefined ? [] : this.queuePools[key];
    if (value.__pool_assign__) {
        console.warn("Pool: reassign object", key, value);
    }
    else {
        value.__pool_assign__ = true;
        this.queuePools[key].push(value);
    }
};


PropertyEditor.prototype.putOnceFromPool = function (key) {
    var res = null;
    if (this.pools[key] && this.pools[key].length > 0) {
        res = this.pools[key].pop();
    }
    if (res) res.__pool_assign__ = false;
    return res;
};


PropertyEditor.prototype.loadAttributes = function () {
    var self = this;
    this.flushAllToPools();
    self.$body.clearChild();
    this.propertyNames = [];
    this.$rows = [];
    this.$needUpdate = [];
    if (!this.object) return;
    this.propertyNames = this.getPropertyNames();
    this.propertyNames.forEach(function (name) {
        var descriptor = self.getPropertyDescriptor(name);
        var functionName = 'create' + camelCaseToPascalCase(descriptor.type) + 'InputRow';
        if (!self[functionName]) {
            // throw new Error('Not support type' + descriptor.type + '!')
            functionName = 'createNotSupportInputRow';
        };
        var rowElt = self[functionName](name, descriptor);
        rowElt.addTo(self.$body);
        self.$rows.push(rowElt);
    });

    $('.as-need-update', this.$body, function (elt) {
        self.$needUpdate.push(elt);
    });
};

PropertyEditor.prototype.notifyChangeToProperties = function (name, from) {
    var e;
    for (var i = 0; i < this.$needUpdate.length; ++i) {
        e = this.$needUpdate[i];
        if (e.notifyChange)
            e.notifyChange(name, from);
    }
};


PropertyEditor.prototype.createEnumInputRow = function (name, descriptor) {
    var self = this;
    var selectMenu = descriptor.sign ? this.putOnceFromPool(descriptor.sign) : null;
    if (selectMenu === null) {
        selectMenu = _({
            tag: 'selectmenu',
            class: 'as-need-update',
            props: {
                items: descriptor.values.map(function (value) { return { text: value + "", value: value } }),
                notifyChange: function () {
                    var value = self.getProperty(name);
                    if (value != this.value) {
                        this.value = value;
                    }
                },
                value: this.getProperty(name)
            },
            on: {
                change: function () {
                    this.peditor.setProperty(name, this.value);
                    this.peditor.notifyChange(name, this);
                    this.peditor.notifyStopChange(name);
                }
            }
        });
    }
    if (descriptor.sign)
        this.assignToPool(descriptor.sign, selectMenu);
    selectMenu.value = this.getProperty(name);
    selectMenu.peditor = this;
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                child: selectMenu
            }
        ]
    });

    return res;
};


PropertyEditor.prototype.createFontInputRow = function (name, descriptor) {
    var self = this;

    var fontInput = descriptor.sign ? this.putOnceFromPool(descriptor.sign) : null;

    if (fontInput === null) {
        fontInput = _({
            tag: 'selectmenu',
            class: 'as-need-update',
            props: {
                items: [{ text: 'None', value: undefined }].concat(FONT_ITEMS),
                notifyChange: function () {
                    var value = self.getProperty(name);
                    if (value != this.value) {
                        this.value = value;
                    }
                }
            },
            on: {
                change: function () {
                    this.peditor.setProperty(name, this.value);
                    this.peditor.notifyChange(name, this);
                    this.peditor.notifyStopChange(name);
                }
            }
        });
    }
    if (descriptor.sign)
        this.assignToPool(descriptor.sign, fontInput);
    fontInput.value = this.getProperty(name);
    fontInput.peditor = this;
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                child: fontInput
            }
        ]
    });

    return res;
};


PropertyEditor.prototype.createConstInputRow = function (name, descriptor) {
    var self = this;
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '3' },
                child:
                {
                    tag: 'strong',
                    class: 'as-need-update',
                    props: {
                        notifyChange: function () {
                            var descriptor = self.getPropertyDescriptor(name);
                            if (typeof (descriptor.value) == 'object' && descriptor.value.then) {
                                descriptor.value.then(function (value) {
                                    res.$text.clearChild().addChild(_({ text: value + '' }));
                                });
                            }
                            else {
                                res.$text.clearChild().addChild(_({ text: descriptor.value + '' }));
                            }
                        }
                    }
                }
            }
        ]
    });

    res.$text = $('strong', res);
    if (typeof (descriptor.value) == 'object' && descriptor.value.then) {
        descriptor.value.then(function (value) {
            res.$text.clearChild().addChild(_({ text: value + '' }));
        });
    }
    else {
        res.$text.clearChild().addChild(_({ text: descriptor.value + '' }));
    }

    return res;
};

PropertyEditor.prototype.createTextInputRow = function (name, descriptor) {
    var self = this;
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '3' },
                child:
                {
                    tag: descriptor.long ? 'textarea' : 'input',
                    class: 'as-need-update',
                    attr: { type: 'text' },
                    props: {
                        value: this.getProperty(name),
                        notifyChange: function () {
                            var value = self.getProperty(name);
                            if (value != this.value) {
                                this.value = value;
                            }
                        }
                    },
                    on: {
                        keyup: function () {
                            self.setProperty(name, this.value);
                            self.notifyChange(name, this);
                        },
                        change: function () {
                            self.notifyStopChange(name);
                        }
                    }
                }
            }
        ]
    });
    return res;
};


PropertyEditor.prototype.createBoolInputRow = function (name, descriptor) {
    var self = this;
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '3' },
                child:
                {
                    tag: 'checkboxbutton',
                    class: 'as-need-update',
                    props: {
                        checked: this.getProperty(name),
                        notifyChange: function () {
                            var value = self.getProperty(name);
                            if (value != this.checked) {
                                this.checked = value;
                            }
                        }
                    },
                    on: {
                        change: function () {
                            self.setProperty(name, this.checked);
                            self.notifyChange(name, this);
                            self.notifyStopChange(name);
                        }
                    }
                }
            }
        ]
    });
    return res;
};


PropertyEditor.prototype.createDateInputRow = function (name, descriptor) {
    var self = this;
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: descriptor.nullable ? { colspan: '2' } : { colspan: '3' },
                child:
                {
                    tag: 'calendarinput',
                    class: 'as-need-update',

                    props: {
                        disabled: descriptor.disabled,
                        value: self.getProperty(name),
                        notifyChange: function () {
                            var value = self.getProperty(name);
                            if (!value) this.value = null;
                            else this.value = value;
                            this.disabled = self.getPropertyDescriptor(name).disabled;
                        }
                    },
                    on: {
                        change: function () {
                            self.setProperty(name, this.value);
                            self.notifyChange(name, this);
                            self.notifyStopChange(name);
                        }
                    }
                }
            }
        ].concat(descriptor.nullable ? [{
            tag: 'td',
            child: [
                { text: 'NULL ' },
                {
                    tag: 'checkboxbutton',
                    class: 'as-need-update',
                    props: {
                        checked: !self.getProperty(name),
                        notifyChange: function () {
                            this.checked = !self.getProperty(name);
                        }
                    },
                    on: {
                        change: function () {
                            if (this.checked) {
                                self.setProperty(name, null);
                            }
                            else {
                                self.setProperty(name, beginOfDay(new Date()));
                            }
                            self.notifyChange(name, this);
                            self.notifyStopChange(name);
                        }
                    }
                }]
        }] : [])
    });
    return res;
};

PropertyEditor.prototype.createNumberInputRow = function (name, descriptor) {
    var self = this;
    var numberInput = this.putOnceFromPool("NUMBER_INPUT");//same with all sign
    if (numberInput === null) {
        numberInput = _({
            tag: 'numberinput',
            class: 'as-need-update',
            props: {
                notifyChange: function () {
                    var value = this.peditor.getProperty(name);
                    if (value === null)
                        this.value = descriptor.defaultValue;
                    else
                        this.value = value;
                    this.disabled = this.peditor.getPropertyDescriptor(name).disabled;
                }
            },
            on: {
                change: function (event) {
                    if (event.by == 'keyup') return;
                    if (!descriptor.livePreview && event.by == 'long_press_button') return;
                    this.peditor.setProperty(name, this.value);
                    this.peditor.notifyChange(name, this);
                    if (event.by != 'long_press_button')
                    this.peditor.notifyStopChange(name);
                }
            }
        }
        );
    }
    if (descriptor.sign)
        this.assignToPool(descriptor.sign, fontInput);
    numberInput.min = typeof (descriptor.min) == 'number' ? descriptor.min : -Infinity;
    numberInput.max = typeof (descriptor.max) == 'number' ? descriptor.max : Infinity;
    numberInput.value = this.getProperty(name);
    numberInput.disabled = descriptor.disabled;
    numberInput.peditor = this;

    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: descriptor.nullable ? { colspan: '2' } : { colspan: '3' },
                child: numberInput
            }

        ].concat(descriptor.nullable ? [{
            tag: 'td',
            child: [
                { text: 'NULL ' },
                {
                    tag: 'checkboxbutton',
                    class: 'as-need-update',
                    props: {
                        checked: self.getProperty(name) === null,
                        notifyChange: function () {
                            this.checked = self.getProperty(name) === null;
                        }
                    },
                    on: {
                        change: function () {
                            if (this.checked) {
                                self.setProperty(name, null);
                            }
                            else {
                                self.setProperty(name, descriptor.defaultValue);
                            }
                            self.notifyChange(name, this);
                        }
                    }
                }]
        }] : [])
    });
    return res;
};


PropertyEditor.prototype.createIconInputRow = function (name, descriptor) {
    var self = this;
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '3' },
                child:
                {
                    tag: 'fonticoninput',
                    class: 'as-need-update',
                    props: {
                        min: typeof (descriptor.min) == 'number' ? descriptor.min : -Infinity,
                        max: typeof (descriptor.max) == 'number' ? descriptor.max : Infinity,
                        value: self.getProperty(name),
                        disabled: descriptor.disabled,
                        notifyChange: function () {
                            var value = self.getProperty(name);
                            this.value = value;
                        }
                    },
                    on: {
                        change: function (event) {
                            self.setProperty(name, this.value);
                            self.notifyStopChange(name, this);
                        }
                    }
                }
            }
        ]
    });
    return res;
};


PropertyEditor.prototype.createListInputRow = function (name, descriptor) {
    var self = this;
    var listEditor = new ListEditor();
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '3' },
                child: listEditor.getView()
            }
        ]
    });
    listEditor.on('change', function () {
        self.setProperty(name, this.getData());
        self.notifyStopChange(name);
    });
    listEditor.start();
    listEditor.setData(this.getProperty(name));
    return res;
};


PropertyEditor.prototype.createTextAlignInputRow = function (name, descriptor) {
    var self = this;
    var icons = {
        left: 'mdi-format-align-left',
        right: 'mdi-format-align-right',
        center: 'mdi-format-align-center'
    };
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '3' },
                child: {
                    tag: 'button',
                    class: 'as-property-editor-text-align-input',
                    child: 'span.mdi'
                }
            }
        ]
    });
    var $button = $('.as-property-editor-text-align-input', res);
    var $icon = $('span.mdi', $button);
    var lasIconClass = icons[this.getProperty(name)] || icons.left;
    $icon.addClass(lasIconClass);
    var self = this;
    QuickMenu.toggleWhenClick($button, {
        getMenuProps: function () {
            return {
                items: [
                    {
                        text: 'Left',
                        icon: 'span.mdi.mdi-format-align-left',
                        menuData: 'left'
                    },
                    {
                        text: 'Center',
                        icon: 'span.mdi.mdi-format-align-center',
                        menuData: 'center'
                    },
                    {
                        text: 'Right',
                        icon: 'span.mdi.mdi-format-align-right',
                        menuData: 'right'

                    }
                ]
            }
        },
        onSelect: function (item) {
            $icon.removeClass(lasIconClass);
            lasIconClass = icons[item.menuData];
            $icon.addClass(lasIconClass);
            self.setProperty(name, item.menuData);
            self.notifyStopChange(name);
        }
    });
    return res;
};

PropertyEditor.prototype.createColorInputRow = function (name, descriptor) {
    var self = this;
    var icons = {
        left: 'mdi-format-align-left',
        right: 'mdi-format-align-right',
        center: 'mdi-format-align-center'
    };
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '3' },
                child: {
                    tag: 'colorpickerbutton',
                    on: {
                        change: function (event) {
                            self.setProperty(name, '#' + event.value.toHex8());
                            self.notifyChange(name);
                        },
                        stopchange: function (event) {
                            self.notifyStopChange(name);
                        }
                    },
                    props: {
                        value: this.getProperty(name),
                        mode: 'RGBA'
                    }
                }

            }
        ]
    });

    return res;
};


PropertyEditor.prototype.createNotSupportInputRow = function (name, descriptor) {
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '3' },
                child: [{

                    text: 'Not support ',
                }, {
                    tag: 'strong',
                    child: { text: descriptor.type }
                }
                ]
            }
        ]
    });
    return res;
};

PropertyEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        class: 'as-property-editor',
        child: {
            tag: 'table',
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
                                    attr: { colspan: '3' },
                                    child: { text: 'value' }
                                }
                            ]
                        }
                    ]
                },
                {
                    tag: 'tbody'
                }
            ]
        }
    });
    this.$body = $('tbody', this.$view);
    return this.$view;
}


PropertyEditor.prototype.notifyChange = function (name, from) {
    this.notifyChangeToProperties(name, from);
    this.emit('change', { type: 'change', target: this, from: from, name: name, object: this.object }, this);
};

PropertyEditor.prototype.notifyStopChange = function (name) {
    this.emit('stopchange', { type: 'stopchange', name: name, object: this.object }, this);
}


export default PropertyEditor;