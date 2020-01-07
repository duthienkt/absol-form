import Fcore from '../core/FCore';
import Context from 'absol/src/AppPattern/Context';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
import '../../css/propertyeditor.css';
import { camelCaseToPascalCase } from 'absol/src/String/stringFormat';
import { beginOfDay } from 'absol/src/Time/datetime';
import ListEditor from './ListEditor';
import { FONT_ITEMS } from '../font/GoogleFont';
import '../dom/FontIconInput';
import QuickMenu from 'absol-acomp/js/QuickMenu';
import { base64EncodeUnicode } from 'absol/src/Converter/base64';

// FontIconPicker

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
    selectMenu.notifyChange = function () {
        var value = self.getProperty(name);
        if (value != this.value) {
            this.value = value;
        }
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
                items: [{ text: 'None', value: undefined }].concat(FONT_ITEMS)
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
    fontInput.notifyChange = function () {
        var value = self.getProperty(name);
        if (value != this.value) {
            this.value = value;
        }
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
                attr:{
                    colspan:"3"
                },
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

            },
            on: {
                change: function (event) {
                    if (event.by == 'keyup') return;
                    if (!descriptor.livePreview && event.by == 'long_press_button') return;
                    this.peditor.setProperty(this._propertyName, this.value);
                    this.peditor.notifyChange(this._propertyName, this);
                    if (event.by != 'long_press_button')
                        this.peditor.notifyStopChange(this._propertyName);
                }
            }
        }
        );
    }
    if (descriptor.sign)
        this.assignToPool(descriptor.sign, numberInput);
    numberInput.min = typeof (descriptor.min) == 'number' ? descriptor.min : -Infinity;
    numberInput.max = typeof (descriptor.max) == 'number' ? descriptor.max : Infinity;
    numberInput.value = this.getProperty(name);
    numberInput.disabled = descriptor.disabled;
    numberInput._propertyName = name;
    numberInput.peditor = this;
    numberInput.notifyChange = function () {
        var value = this.peditor.getProperty(name);
        if (value === null)
            this.value = descriptor.defaultValue;
        else
            this.value = value;
        this.disabled = this.peditor.getPropertyDescriptor(name).disabled;
    }

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


PropertyEditor.prototype.createBoxAlignInputRow = function (name, descriptor) {
    var self = this;
    var icons = {
        lefttop: 'm0 0v24h24v-24zm1 1h22v22h-22zm2 2h10.3v2h-10.3v-2m0 4h14v2h-14v-2m0 4h9.9v2h-9.9v-2',
        centertop: 'm24 24v-24h-24v24zm-1-1h-22v-22h22zm-6.05-18h-9.9v-2h9.9v2m2.05 4h-14v-2h14v2m-1.85 4h-10.3v-2h10.3v2',
        righttop: 'm24 0v24h-24v-24zm-1 1h-22v22h22zm-2 2h-10.3v2h10.3v-2m0 4h-14v2h14v-2m0 4h-9.9v2h9.9v-2',
        leftcenter: 'm0 24v-24h24v24zm1-1h22v-22h-22zm2-6h10.3v-2h-10.3v2m0-4h14v-2h-14v2m0-4h9.9v-2h-9.9v2',
        centercenter: 'm0 24v-24h24v24zm1-1h22v-22h-22zm6.05-14h9.9v-2h-9.9v2m-2.05 4h14v-2h-14v2m1.85 4h10.3v-2h-10.3v2',
        rightcenter: 'm24 24v-24h-24v24zm-1-1h-22v-22h22zm-2-6h-10.3v-2h10.3v2m0-4h-14v-2h14v2m0-4h-9.9v-2h9.9v2',
        leftbottom: 'm0 24v-24h24v24zm1-1h22v-22h-22zm2-2h10.3v-2h-10.3v2m0-4h14v-2h-14v2m0-4h9.9v-2h-9.9v2',
        centerbottom: 'm24 0v24h-24v-24zm-1 1h-22v22h22zm-6.05 18h-9.9v2h9.9v-2m2.05-4h-14v2h14v-2m-1.85-4h-10.3v2h10.3v-2',
        rightbottom: 'm24 24v-24h-24v24zm-1-1h-22v-22h22zm-2-2h-10.3v-2h10.3v2m0-4h-14v-2h14v2m0-4h-9.9v-2h9.9v2'
    };
    function makeIcon(path) {
        var data = '<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
                    <path d="'+ path + '" style="stroke-width:0"/>\
                </svg>';
        return {
            tag: 'img',
            style: {
                'image-rendering': 'pixelated'
            },
            props: {
                src: 'data:image/svg+xml;base64,' + base64EncodeUnicode(data)
            }
        }
    }
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
                }
            }
        ]
    });
    var $button = $('.as-property-editor-text-align-input', res);
    $button.addChild(_(makeIcon(icons[this.getProperty(name)] || icons.lefttop)));
    var self = this;
    QuickMenu.toggleWhenClick($button, {
        getMenuProps: function () {
            return {
                items: [
                    {
                        text: 'Left-Top',
                        icon: makeIcon(icons.lefttop),
                        menuData: 'lefttop'
                    },
                    {
                        text: 'Center-Top',
                        icon: makeIcon(icons.centertop),
                        menuData: 'centertop'
                    },
                    {
                        text: 'Right-Top',
                        icon: makeIcon(icons.righttop),
                        menuData: 'righttop'
                    },
                    {
                        text: 'Left-Center',
                        icon: makeIcon(icons.leftcenter),
                        menuData: 'leftcenter'
                    },
                    {
                        text: 'Center-Center',
                        icon: makeIcon(icons.centercenter),
                        menuData: 'centercenter'
                    },
                    {
                        text: 'Right-Center',
                        icon: makeIcon(icons.rightcenter),
                        menuData: 'rightcenter'
                    },
                    {
                        text: 'Left-Botttom',
                        icon: makeIcon(icons.leftbottom),
                        menuData: 'leftbottom'
                    },
                    {
                        text: 'Center-Botttom',
                        icon: makeIcon(icons.centerbottom),
                        menuData: 'centerbottom'
                    },
                    {
                        text: 'Right-Botttom',
                        icon: makeIcon(icons.rightbottom),
                        menuData: 'rightbottom'
                    }
                ]
            }
        },
        onSelect: function (item) {
            $button.clearChild().addChild(_(makeIcon(icons[item.menuData])));
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


PropertyEditor.prototype.createMeasureSizeInputRow = function (name, descriptor) {
    var self = this;
    var res = _({
        tag: 'tr',
        class: 'as-need-update',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '2' },
                child: [
                    {
                        tag: 'numberinput'
                    }
                ]
            },
            {
                tag: 'td',
                child: {
                    tag: 'selectmenu',
                    style: {
                        verticalAlign: 'middle'
                    },
                    props: {
                        items: [
                            { text: 'px', value: 'px' },
                            { text: '%', value: '%' },
                            { text: 'match_parent', value: 'match_parent' },
                            { text: 'wrap_content', value: 'wrap_content' }
                        ]
                    }
                }
            }
        ]
    });


    var numberElt = $('numberinput', res)
        .on('change', function () {
            switch (typeSelectElt.value) {
                case '%': self.setProperty(name, this.value + '%'); break;
                case 'px': self.setProperty(name, this.value); break;
            }
            self.notifyChange(name);
        })
        .on('stopchange', function () {
            switch (typeSelectElt.value) {
                case '%': self.setProperty(name, this.value + '%'); break;
                case 'px': self.setProperty(name, this.value); break;
            }
            self.notifyStopChange(name);
        });

    var typeSelectElt = $('selectmenu', res)
        .on('change', function (event) {
            if (this.value == 'match_parent' || this.value == 'wrap_content') {
                self.setProperty(name, this.value);
                numberElt.disabled = true;
            }
            else {
                numberElt.disabled = false;
                var value = self.getProperty(name, this.value);
                numberElt.value = value;
                if (this.value == '%') {
                    self.setProperty(name, value + '%');
                }
                else {
                    self.setProperty(name, value);
                }
            }
        });


    res.notifyChange = function () {
        var value = self.getProperty(name);
        if (typeof value == 'number') {
            numberElt.value = value;
            typeSelectElt.value = 'px';
        }
        else if (typeof value == 'string') {
            if (value.match(/\%$/)) {
                typeSelectElt.value = '%';
                numberElt.value = parseFloat(value.replace('%', ''));
            }
            else if (value == 'match_parent' || value != 'wrap_content') {
                typeSelectElt.value = value;
            }
            else {
                console.error("Unknow typeof " + name, value);
            }
        }
    }

    res.notifyChange();

    return res;
};


PropertyEditor.prototype.createMeasurePositionInputRow = function (name, descriptor) {
    var self = this;
    var res = _({
        tag: 'tr',
        class: 'as-need-update',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                attr: { colspan: '2' },
                child: [
                    {
                        tag: 'numberinput'
                    }
                ]
            },
            {
                tag: 'td',
                child: {
                    tag: 'selectmenu',
                    style: {
                        verticalAlign: 'middle'
                    },
                    props: {
                        items: [
                            { text: 'px', value: 'px' },
                            { text: '%', value: '%' },
                        ]
                    }
                }
            }
        ]
    });


    var numberElt = $('numberinput', res)
        .on('change', function () {
            switch (typeSelectElt.value) {
                case '%': self.setProperty(name, this.value + '%'); break;
                case 'px': self.setProperty(name, this.value); break;
            }
            self.notifyChange(name);
        })
        .on('stopchange', function () {
            switch (typeSelectElt.value) {
                case '%': self.setProperty(name, this.value + '%'); break;
                case 'px': self.setProperty(name, this.value); break;
            }
            self.notifyStopChange(name);
        });

    var typeSelectElt = $('selectmenu', res)
        .on('change', function (event) {
            var value = self.getProperty(name, this.value);
            numberElt.value = value;
            if (this.value == '%') {
                self.setProperty(name, value + '%');
            }
            else {
                self.setProperty(name, value);
            }
        });


    res.notifyChange = function () {
        var value = self.getProperty(name);
        if (typeof value == 'number') {
            numberElt.value = value;
            typeSelectElt.value = 'px';
        }
        else if (typeof value == 'string') {
            if (value.match(/\%$/)) {
                typeSelectElt.value = '%';
                numberElt.value = parseFloat(value.replace('%', ''));
            }
            else if (value == 'match_parent' || value != 'wrap_content') {
                typeSelectElt.value = value;
            }
            else {
                console.error("Unknow typeof " + name, value);
            }
        }
    }

    res.notifyChange();

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