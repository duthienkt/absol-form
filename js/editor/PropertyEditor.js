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
    this.dependents = {};
    this.$view = null;
    this.propertyHolders = {};
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
    this.clearAllDependents();
    this.propertyNames = [];
    this.$rows = [];
    this.$needUpdate = [];
    if (!this.object) return;
    this.propertyNames = this.getPropertyNames();
    this.propertyHolders = {};
    this.propertyNames.forEach(function (name) {
        var descriptor = self.getPropertyDescriptor(name)||{type:"NoDescriptor"};
        if (descriptor.dependency) {
            self.addDepents(name, descriptor.dependency);
        }
        var functionName = 'load' + camelCaseToPascalCase(descriptor.type) + 'Property';
        var cell = _('td');
        if (!self[functionName]) {
            // throw new Error('Not support type' + descriptor.type + '!')
            functionName = 'loadNotSupportedProperty';
        };
        var rowElt = _({
            tag: 'tr',
            child: [
                { tag: 'td', child: { text: name } },
                cell
            ]
        })
        rowElt.addTo(self.$body);
        self.propertyHolders[name] = self[functionName](name, descriptor, cell, cell);
    });
};


PropertyEditor.prototype.loadNotSupportedProperty = function (name, descriptor, cell, cellElt) {
    cellElt.addChild(_({ text: 'Not supported ' }))
        .addChild(_({
            tag: 'strong',
            child: { text: descriptor.type }
        }));
    return {};
};




PropertyEditor.prototype.loadEnumProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    var selectMenu = descriptor.sign ? this.putOnceFromPool(descriptor.sign) : null;
    if (selectMenu === null) {
        selectMenu = _({
            tag: 'selectmenu',
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
    res.requestUpdate = function () {
        var value = self.getProperty(name);
        if (value != this.value) {
            selectMenu.value = value;
        }
    };
    cell.addChild(selectMenu);

    return res;
};


PropertyEditor.prototype.loadFontProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
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

    res.elt = fontInput;
    cell.addChild(res.elt);
    res.requestUpdate = function () {
        var value = self.getProperty(name);
        if (value != fontInput.value) {
            fontInput.value = value;
        }
    };

    return res;
};


PropertyEditor.prototype.loadConstProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    res.elt = _({
        tag: 'strong',
        child: { text: '' + descriptor.value }
    });
    cell.addChild(res.elt);
    return res;
};

PropertyEditor.prototype.loadTextProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    res.elt = _({
        tag: descriptor.long ? 'textarea' : 'input',
        attr: { type: 'text' },
        on: {
            keyup: function () {
                self.setProperty(name, this.value);
                self.notifyChange(name, this);
            },
            change: function () {
                self.notifyStopChange(name);
            }
        }
    });
    cell.addChild(res.elt);
    res.requestUpdate = function () {
        var value = self.getProperty(name);
        if (value != this.value) {
            res.elt.value = value;
        }
    };
    res.requestUpdate();
    return res;
};


PropertyEditor.prototype.loadBoolProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    res.elt = _({
        tag: 'checkboxbutton',
        class: 'as-need-update',
        props: {
            checked: this.getProperty(name),
            notifyChange: function () {

            }
        },
        on: {
            change: function () {
                self.setProperty(name, this.checked);
                self.notifyChange(name, this);
                self.notifyStopChange(name);
            }
        }
    });

    res.requestUpdate = function () {
        var value = self.getProperty(name);
        if (value != res.elt.checked) {
            res.elt.checked = value;
        }
    };

    cell.addChild(res.elt);
    return res;
};


PropertyEditor.prototype.loadDateProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    res.calendarInput = _({
        tag: 'calendarinput',
        props: {
            disabled: descriptor.disabled,
            value: self.getProperty(name),
        },
        on: {
            change: function () {
                self.setProperty(name, this.value);
                self.notifyChange(name, this);
                res.nullCheckElt.checked = false;
                self.notifyStopChange(name);
            }
        }
    });
    cell.addChild(res.calendarInput);
    res.nullCheckElt = _({
        tag: 'checkbox',
        style: { marginLeft: '10px' },
        props: {
            text: 'NULL'
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
    });
    cell.addChild(res.nullCheckElt);

    res.requestUpdate = function () {
        var value = self.getProperty(name);
        if (!value) {
            res.calendarInput.value = null;
            res.nullCheckElt.checked = true;
        }
        else {
            res.calendarInput.value = value; res.nullCheckElt.checked = false;
        }
        res.calendarInput.disabled = self.getPropertyDescriptor(name).disabled;
    };
    return res;
};

PropertyEditor.prototype.loadNumberProperty = function (name, descriptor, cell) {
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
    var res = { elt: numberInput };
    res.requestUpdate = function () {
        var value = self.getProperty(name);
        if (value === null)
            res.elt.value = descriptor.defaultValue;
        else
            res.elt.value = value;
        res.elt.disabled = self.getPropertyDescriptor(name).disabled;
    }
    cell.addChild(res.elt);
    //todo NULL
    return res;
};


PropertyEditor.prototype.loadIconProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    //todo: disabled
    res.elt = _({
        tag: 'fonticoninput',
        class: 'as-need-update',
        props: {
            value: self.getProperty(name),
            disabled: descriptor.disabled
        },
        on: {
            change: function (event) {
                self.setProperty(name, this.value);
                self.notifyStopChange(name, this);
            }
        }
    });
    cell.addChild(res.elt);
    res.requestUpdate = function () {
        res.elt.value = self.getProperty(name);
    };
    return res;
};


PropertyEditor.prototype.loadListProperty = function (name, descriptor, cell) {
    var self = this;
    var listEditor = new ListEditor();
    var res = {};
    res.elt = listEditor.getView();
    cell.addChild(res.elt);
    listEditor.on('change', function () {
        self.setProperty(name, this.getData());
        self.notifyStopChange(name);
    });
    listEditor.start();
    // res.
    listEditor.setData(this.getProperty(name));
    return res;
};


PropertyEditor.prototype.loadTextAlignProperty = function (name, descriptor, cell) {
    var self = this;
    var icons = {
        left: 'mdi-format-align-left',
        right: 'mdi-format-align-right',
        center: 'mdi-format-align-center'
    };
    var res = {};
    res.elt = _({
        tag: 'button',
        class: 'as-property-editor-text-align-input',
        child: 'span.mdi'
    });
    cell.addChild(res.elt);

    var $button = res.elt;
    var $icon = $('span.mdi', $button);
    var lasIconClass = icons[this.getProperty(name)] || icons.left;
    $icon.addClass(lasIconClass);
    res.requestUpdate = function () {
        $icon.removeClass(lasIconClass);
        lasIconClass = icons[self.getProperty(name)] || icons.left;
        $icon.addClass(lasIconClass);
    };
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


PropertyEditor.prototype.loadBoxAlignProperty = function (name, descriptor, cell) {
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

    var res = {};
    res.elt = _('button.as-property-editor-text-align-input', res);
    cell.addChild(res.elt);
    res.elt.addChild(_(makeIcon(icons[this.getProperty(name)] || icons.lefttop)));
    QuickMenu.toggleWhenClick(res.elt, {
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
            res.elt.clearChild().addChild(_(makeIcon(icons[item.menuData])));
            self.setProperty(name, item.menuData);
            self.notifyStopChange(name);
        }
    });

    res.requestUpdate = function () {
        res.elt.clearChild().addChild(_(makeIcon(icons[self.getProperty(name)] || icons.lefttop)));
    };
    return res;
};


PropertyEditor.prototype.loadColorProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    res.elt = _({
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
            value: 'transparent',
            mode: 'RGBA'
        }
    });

    cell.addChild(res.elt);

    res.requestUpdate = function () {
        res.elt.value = self.getProperty(name);
    };

    res.requestUpdate();
    return res;
};


PropertyEditor.prototype.loadMeasureSizeProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    cell.addStyle('white-space', 'nowrap');
    res.numberInputElt = _('numberinput').addStyle('margin-right', '5px');
    res.typeSelectElt = _({
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
    });

    cell.addChild(res.numberInputElt)
        .addChild(res.typeSelectElt);
    res.numberInputElt.on('change', function (event) {
        if (event.by == 'keyup') return;
        switch (res.typeSelectElt.value) {
            case '%': self.setProperty(name, this.value + '%'); break;
            case 'px': self.setProperty(name, this.value); break;
        }
        self.notifyChange(name);
        if (event.by != 'long_press_button')
            self.notifyStopChange(name);
    })
        .on('stopchange', function () {
            switch (res.typeSelectElt.value) {
                case '%': self.setProperty(name, this.value + '%'); break;
                case 'px': self.setProperty(name, this.value); break;
            }
            self.notifyStopChange(name);
        });

    res.typeSelectElt.on('change', function (event) {
        if (this.value == 'match_parent' || this.value == 'wrap_content') {
            self.setProperty(name, this.value);
            res.numberInputElt.disabled = true;
        }
        else {
            res.numberInputElt.disabled = false;
            var value = self.getProperty(name, this.value);
            res.numberInputElt.value = value;
            if (this.value == '%') {
                self.setProperty(name, value + '%');
            }
            else {
                self.setProperty(name, value);
            }
        }
    });


    res.requestUpdate = function () {
        var descriptor = self.getPropertyDescriptor(name);
        if (descriptor.disabled) res.numberInputElt.disabled = !!descriptor.disabled;
        var value = self.getProperty(name);
        if (typeof value == 'number') {
            res.numberInputElt.value = value;
            res.typeSelectElt.value = 'px';
        }
        else if (typeof value == 'string') {
            if (value.match(/\%$/)) {
                res.typeSelectElt.value = '%';
                res.numberInputElt.value = parseFloat(value.replace('%', ''));
                res.numberInputElt.disabled = false;
            }
            else if (value == 'match_parent' || value != 'wrap_content') {
                res.numberInputElt.disabled = true;
                res.typeSelectElt.value = value;
            }
            else {
                console.error("Unknow typeof " + name, value);
            }
        }
    }

    res.requestUpdate();
    return res;
};


PropertyEditor.prototype.loadMeasurePositionProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    cell.addStyle('white-space', 'nowrap');
    res.numberInputElt = _('numberinput').addStyle('margin-right', '5px');
    res.typeSelectElt = _({
        tag: 'selectmenu',
        style: {
            verticalAlign: 'middle'
        },
        props: {
            items: [
                { text: 'px', value: 'px' },
                { text: '%', value: '%' }
            ]
        }
    });

    cell.addChild(res.numberInputElt)
        .addChild(res.typeSelectElt);
    res.numberInputElt.on('change', function (event) {
        if (event.by == 'keyup') return;
        switch (res.typeSelectElt.value) {
            case '%': self.setProperty(name, this.value + '%'); break;
            case 'px': self.setProperty(name, this.value); break;
        }
        self.notifyChange(name);
        if (event.by != 'long_press_button')
            self.notifyStopChange(name);
    })
        .on('stopchange', function () {
            switch (res.typeSelectElt.value) {
                case '%': self.setProperty(name, this.value + '%'); break;
                case 'px': self.setProperty(name, this.value); break;
            }
            self.notifyStopChange(name);
        });

    res.typeSelectElt.on('change', function (event) {
        if (this.value == 'match_parent' || this.value == 'wrap_content') {
            self.setProperty(name, this.value);
            res.numberInputElt.disabled = true;
        }
        else {
            res.numberInputElt.disabled = false;
            var value = self.getProperty(name, this.value);
            res.numberInputElt.value = value;
            if (this.value == '%') {
                self.setProperty(name, value + '%');
            }
            else {
                self.setProperty(name, value);
            }
        }
    });


    res.requestUpdate = function () {
        var descriptor = self.getPropertyDescriptor(name);
        res.numberInputElt.disabled = !!descriptor.disabled;
        var value;
        if (descriptor.disabled) {
            value = self.getProperty(name, res.typeSelectElt.value);
            res.numberInputElt.value = value;
            //set-back
            if (res.typeSelectElt.value == 'px') {
                self.setProperty(name, value);
            }
            else if (res.typeSelectElt.value == '%') {
                self.setProperty(name, value + '%');
            }
        }
        else {
            value = self.getProperty(name);
            if (typeof value == 'number') {
                res.numberInputElt.value = value;
                res.typeSelectElt.value = 'px';
            }
            else if (typeof value == 'string') {
                if (value.match(/\%$/)) {
                    res.typeSelectElt.value = '%';
                    res.numberInputElt.value = parseFloat(value.replace('%', ''));
                }
                else {
                    console.error("Unknow typeof " + name, value);
                }
            }
        }
    }

    res.requestUpdate();
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
};


PropertyEditor.prototype.clearAllDependents = function () {
    for (var key in this.dependents)
        delete this.dependents[key];
};


/**
 * @param {String} propertyName
 * @param {Array<String>} dependencyProperties
 */
PropertyEditor.prototype.addDepents = function (propertyName, dependencyProperties) {
    var dependencyProperty;
    for (var i = 0; i < dependencyProperties.length; ++i) {
        dependencyProperty = dependencyProperties[i];
        this.dependents[dependencyProperty] = this.dependents[dependencyProperty] || {};
        this.dependents[dependencyProperty][propertyName] = true;
    }
};

PropertyEditor.prototype.updateDependentsOf = function (name, excludes) {
    excludes = excludes || {};
    excludes[name] = true;
    for (var dependentPropertyName in this.dependents[name]) {
        if (!excludes[dependentPropertyName] && this.propertyHolders[dependentPropertyName]) {
            excludes[dependentPropertyName] = true;
            if (this.propertyHolders[dependentPropertyName].requestUpdate) {
                this.propertyHolders[dependentPropertyName].requestUpdate();
            }
            this.updateDependentsOf(dependentPropertyName, excludes);
        }
    }
};

PropertyEditor.prototype.updatePropertyRecursive = function (name) {
    if (!this.propertyHolders[name]) return;
    if (this.propertyHolders[name].requestUpdate)
        this.propertyHolders[name].requestUpdate();
    this.updateDependentsOf(name);
}


PropertyEditor.prototype.notifyChange = function (name, from) {
    this.updateDependentsOf(name);
    this.emit('change', { type: 'change', target: this, from: from, name: name, object: this.object }, this);
};


PropertyEditor.prototype.notifyStopChange = function (name) {
    this.emit('stopchange', { type: 'stopchange', name: name, object: this.object }, this);
};


export default PropertyEditor;