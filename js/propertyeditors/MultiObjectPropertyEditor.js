import Context from "absol/src/AppPattern/Context";
import EventEmitter from "absol/src/HTML5/EventEmitter";
import Fcore from "../core/FCore";
import {camelCaseToPascalCase} from "absol/src/String/stringFormat";
import {FONT_ITEMS} from "../font/GoogleFont";
import QuickMenu from "absol-acomp/js/QuickMenu";
import {base64EncodeUnicode} from "absol/src/Converter/base64";
import R from "../R";
import {randomIdent} from "absol/src/String/stringGenerate";
import SelectListEditor from "../editor/SelectListEditor";
import TokenField from "absol-acomp/js/TokenField";
import {AssemblerInstance} from "../core/Assembler";
import PEText from "./types/PEText";
import PEUniqueText from "./types/PEUniqueText";
import PEColor from "./types/PEColor";
import PEConst from "./types/PEConst";
import PEEnum from "./types/PEEnum";

var _ = Fcore._;
var $ = Fcore.$;

function MultiObjectPropertyEditor() {
    Context.call(this);
    EventEmitter.call(this);
    this.dependents = {};
    this.propertyHolders = {};
    /**
     * @type {Array<import('../core/BaseComponent').default>}
     */
    this.objects = null;
    this.propertyNames = [];
    this.queuePools = {};
}


Object.defineProperties(MultiObjectPropertyEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(MultiObjectPropertyEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
MultiObjectPropertyEditor.prototype.constructor = MultiObjectPropertyEditor;
MultiObjectPropertyEditor.prototype.pools = {};

MultiObjectPropertyEditor.prototype.type2EditorClass = {
    text: PEText,
    uniqueText:PEUniqueText,
    color: PEColor,
    'const': PEConst,
    'enum': PEEnum
};

MultiObjectPropertyEditor.prototype.getPropertyNames = function (object) {
    return Object.keys(object);
};


MultiObjectPropertyEditor.prototype.getProperty = function (object, name) {
    return object[name];
};


MultiObjectPropertyEditor.prototype.setProperty = function (object, name, value) {
    return object[name] = value;
};


MultiObjectPropertyEditor.prototype.setPropertyAll = function () {
    for (var i = 0; i < this.objects.length; ++i)
        this.setProperty.apply(this, [this.objects[i]].concat(Array.prototype.slice.call(arguments)));
};


MultiObjectPropertyEditor.prototype.getPropertyDescriptor = function (object, name) {
    return {
        type: typeof object[name]
    };
};

MultiObjectPropertyEditor.prototype.edit = function () {
    this.objects = Array.prototype.slice.call(arguments);
    this.loadAttributes();
};

MultiObjectPropertyEditor.prototype.loadAttributes = function () {
    this.flushAllToPools();
    this.$body.clearChild();
    this.clearAllDependents();
    var self = this;
    var objects = this.objects;
    if (objects.length <= 0) return;
    var availablePropertyNames = objects.reduce(function (ac, obj) {
        var ret = {};
        var propNames = self.getPropertyNames(obj);
        var name;
        for (var i = 0; i < propNames.length; ++i) {
            name = propNames[i];
            if (ac === null || (typeof ac[name] == 'number')) {
                ret[name] = Math.max(i, ret[name] || 0);
            }
        }
        return ret;
    }, null);

    var names = Object.keys(availablePropertyNames);
    names.sort(function (a, b) {
        return availablePropertyNames[a] - availablePropertyNames[b];
    });

    var editabledNames = names.filter(function (name) {
        var descriptor;
        var lastSign = null;
        if (objects.length == 1) return true;
        for (var i = 0; i < objects.length; ++i) {
            descriptor = self.getPropertyDescriptor(objects[i], name);
            if (!descriptor.independence) return false;
            if (lastSign === null) {
                lastSign = descriptor.sign;
            }
            else if (lastSign != descriptor.sign) {
                return false;
            }
        }
        return true;
    });

    this.propertyNames = editabledNames;
    this.propertyHolders = {};
    var object = objects[objects.length - 1];
    this.propertyNames.forEach(function (name) {
        var descriptor = self.getPropertyDescriptor(object, name) || { type: "NoDescriptor" };
        var EditorClass = self.type2EditorClass[descriptor.type];
        var functionName = 'load' + camelCaseToPascalCase(descriptor.type) + 'Property';
        var cell = _('td');
        if (descriptor.dependency) {
            // self.addDepents(name, descriptor.dependency);
        }
        if (!self[functionName]) {
            // throw new Error('Not support type' + descriptor.type + '!')
            functionName = 'loadNotSupportedProperty';
        }

        var rowElt = _({
            tag: 'tr',
            child: [
                {
                    tag: 'td',
                    child: { text: name }
                },
                cell
            ]
        });

        rowElt.addTo(self.$body);
        if (descriptor.dependency) {
            self.addDepents(name, descriptor.dependency);
        }

        if (EditorClass) {
            self.propertyHolders[name] = new EditorClass(self, name, descriptor, cell)
        }
        else {
            self.propertyHolders[name] = self[functionName](name, descriptor, cell, cell);

        }
    });
};


MultiObjectPropertyEditor.prototype.flushAllToPools = function () {
    var self = this;
    Object.keys(this.queuePools).forEach(function (key) {
        self.pools[key] = self.pools[key] === undefined ? [] : self.pools[key];
        var all = self.queuePools[key].splice(0);
        self.pools[key].push.apply(self.pools[key], all);
    });
};


MultiObjectPropertyEditor.prototype.assignToPool = function (key, value) {
    this.queuePools[key] = this.queuePools[key] === undefined ? [] : this.queuePools[key];
    if (value.__pool_assign__) {
        console.warn("Pool: reassign object", key, value);
    }
    else {
        value.__pool_assign__ = true;
        this.queuePools[key].push(value);
    }
};


MultiObjectPropertyEditor.prototype.putOnceFromPool = function (key) {
    var res = null;
    if (this.pools[key] && this.pools[key].length > 0) {
        res = this.pools[key].pop();
    }
    if (res) res.__pool_assign__ = false;
    return res;
};


MultiObjectPropertyEditor.prototype.getView = function () {
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


MultiObjectPropertyEditor.prototype.loadNotSupportedProperty = function (name, descriptor, cell, cellElt) {
    cellElt.addChild(_({ text: 'Not supported ' }))
        .addChild(_({
            tag: 'strong',
            child: { text: descriptor.type }
        }));
    return {};
};




MultiObjectPropertyEditor.prototype.loadArrayOfTextProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    var object = this.objects[this.objects.length - 1];


    res.elt = _({
        tag: TokenField.tag,
        attr: { title: 'Each value is separated by ;' },
        props: {
            separator: ';',
            placeHolder: 'Enter item text, separated by ;'
        },
        on: {
            change: function () {
                self.setPropertyAll(name, this.items);
                self.notifyChange(name, this);
            }
        }
    });

    cell.addChild(res.elt);

    res.requestUpdate = function () {
        res.elt.autocomplete = self.getPropertyDescriptor(object, name).autocomplete;
        var value = self.getProperty(object, name);
        if (value != res.value) {
            res.value = value;
            res.elt.items = value;
        }
    };
    res.requestUpdate();
    return res;
};



MultiObjectPropertyEditor.prototype.loadMeasureSizeProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    var object = this.objects[this.objects.length - 1];
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
                { text: 'auto', value: 'auto' }
            ]
        }
    });

    cell.addChild(res.numberInputElt)
        .addChild(res.typeSelectElt);
    res.numberInputElt.on('change', function (event) {
        if (event.by == 'keyup') return;
        switch (res.typeSelectElt.value) {
            case '%':
                self.setPropertyAll(name, this.value + '%');
                break;
            case 'px':
                self.setPropertyAll(name, this.value);
                break;
        }
        self.notifyChange(name);
        if (event.by != 'long_press_button')
            self.notifyStopChange(name);
    })
        .on('stopchange', function () {
            switch (res.typeSelectElt.value) {
                case '%':
                    self.setPropertyAll(name, this.value + '%');
                    break;
                case 'px':
                    self.setPropertyAll(name, this.value);
                    break;
            }
            self.notifyStopChange(name);
        });

    res.typeSelectElt.on('change', function (event) {
        if (this.value == 'match_parent' || this.value == 'auto') {
            self.setPropertyAll(name, this.value);
            res.numberInputElt.disabled = true;
        }
        else {
            res.numberInputElt.disabled = false;
            var value = self.getProperty(object, name, this.value);
            res.numberInputElt.value = value;
            if (this.value == '%') {
                self.setPropertyAll(name, value + '%');
            }
            else {
                self.setPropertyAll(name, value);
            }
        }
        self.notifyChange(name);
        self.notifyStopChange(name);
    });


    res.requestUpdate = function () {
        var descriptor = self.getPropertyDescriptor(object, name);
        if (descriptor.disabled) res.numberInputElt.disabled = !!descriptor.disabled;
        var value = self.getProperty(object, name);

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
            else if (value == 'match_parent' || value == 'auto') {
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


MultiObjectPropertyEditor.prototype.loadMeasurePositionProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    var object = this.objects[this.objects.length - 1];
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
            case '%':
                self.setPropertyAll(name, this.value + '%');
                break;
            case 'px':
                self.setPropertyAll(name, this.value);
                break;
        }
        self.notifyChange(name);
        if (event.by != 'long_press_button')
            self.notifyStopChange(name);
    })
        .on('stopchange', function () {
            switch (res.typeSelectElt.value) {
                case '%':
                    self.setPropertyAll(name, this.value + '%');
                    break;
                case 'px':
                    self.setPropertyAll(name, this.value);
                    break;
            }
            self.notifyStopChange(name);
        });

    res.typeSelectElt.on('change', function (event) {
        if (this.value == 'match_parent' || this.value == 'auto') {
            self.setPropertyAll(name, this.value);
            res.numberInputElt.disabled = true;
        }
        else {
            res.numberInputElt.disabled = false;
            var value = self.getProperty(object, name, this.value);
            res.numberInputElt.value = value;
            if (this.value == '%') {
                self.setPropertyAll(name, value + '%');
            }
            else {
                self.setPropertyAll(name, value);
            }
        }
        self.notifyChange(name);
        self.notifyStopChange(name);
    });


    res.requestUpdate = function () {
        var descriptor = self.getPropertyDescriptor(object, name);
        res.numberInputElt.disabled = !!descriptor.disabled;
        var value;
        if (descriptor.disabled) {
            value = self.getProperty(object, name, res.typeSelectElt.value);
            res.numberInputElt.value = value;
            //set-back
            if (res.typeSelectElt.value == 'px') {
                self.setPropertyAll(name, value);
            }
            else if (res.typeSelectElt.value == '%') {
                self.setPropertyAll(name, value + '%');
            }
        }
        else {
            value = self.getProperty(object, name);
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


MultiObjectPropertyEditor.prototype.loadFontProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    var object = this.objects[this.objects.length - 1];
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
                    this.peditor.setPropertyAll(name, this.value);
                    this.peditor.notifyChange(name, this);
                    this.peditor.notifyStopChange(name);
                }
            }
        });
    }
    if (descriptor.sign)
        this.assignToPool(descriptor.sign, fontInput);
    fontInput.value = this.getProperty(object, name);
    fontInput.peditor = this;

    res.elt = fontInput;
    cell.addChild(res.elt);
    res.requestUpdate = function () {
        var value = self.getProperty(object, name);
        if (value != fontInput.value) {
            fontInput.value = value;
        }
    };

    return res;
};


MultiObjectPropertyEditor.prototype.loadTextAlignProperty = function (name, descriptor, cell) {
    var self = this;
    var object = this.objects[this.objects.length - 1];
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
    var lasIconClass = icons[this.getProperty(object, name)] || icons.left;
    $icon.addClass(lasIconClass);
    res.requestUpdate = function () {
        $icon.removeClass(lasIconClass);
        lasIconClass = icons[self.getProperty(object, name)] || icons.left;
        $icon.addClass(lasIconClass);
    };
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
            self.setPropertyAll(name, item.menuData);
            self.notifyStopChange(name);
        }
    });
    return res;
};


MultiObjectPropertyEditor.prototype.loadBoxAlignProperty = function (name, descriptor, cell) {
    var self = this;
    var object = this.objects[this.objects.length - 1];
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
                    <path d="' + path + '" style="stroke-width:0"/>\
                </svg>';
        return {
            tag: 'img',
            style: {
                'image-rendering': 'pixelated'
            },
            props: {
                src: 'data:image/svg+xml;base64,' + base64EncodeUnicode(data)
            }
        };
    }

    var res = {};
    res.elt = _('button.as-property-editor-text-align-input', res);
    cell.addChild(res.elt);
    res.elt.addChild(_(makeIcon(icons[this.getProperty(object, name)] || icons.lefttop)));
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
            self.setPropertyAll(name, item.menuData);
            self.notifyStopChange(name);
        }
    });

    res.requestUpdate = function () {
        res.elt.clearChild().addChild(_(makeIcon(icons[self.getProperty(object, name)] || icons.lefttop)));
    };
    return res;
};


MultiObjectPropertyEditor.prototype.loadNumberProperty = function (name, descriptor, cell) {
    var self = this;
    var object = this.objects[this.objects.length - 1];

    var numberInput = this.putOnceFromPool("NUMBER_INPUT");//same with all sign
    if (numberInput === null) {
        numberInput = _({
                tag: 'numberinput',
                class: 'as-need-update',
                props: {},
                on: {
                    change: function (event) {
                        if (event.by == 'kyup') return;
                        if (!descriptor.livePreview && event.by == 'long_press_button') return;
                        this.peditor.setPropertyAll(this._propertyName, this.value);
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
    if (typeof descriptor.floatFixed === "number")
        numberInput.floatFixed = descriptor.floatFixed;
    numberInput.min = typeof (descriptor.min) == 'number' ? descriptor.min : -Infinity;
    numberInput.max = typeof (descriptor.max) == 'number' ? descriptor.max : Infinity;
    numberInput.value = this.getProperty(object, name);
    numberInput.disabled = descriptor.disabled;
    numberInput._propertyName = name;
    numberInput.peditor = this;
    var res = { elt: numberInput };
    res.requestUpdate = function () {
        var descriptor = self.getPropertyDescriptor(object, name);
        if (typeof descriptor.floatFixed === "number")
            res.elt.floatFixed = descriptor.floatFixed;
        numberInput.min = typeof (descriptor.min) == 'number' ? descriptor.min : -Infinity;
        numberInput.max = typeof (descriptor.max) == 'number' ? descriptor.max : Infinity;
        var value = self.getProperty(object, name);
        if (value === null)
            res.elt.value = descriptor.defaultValue;
        else
            res.elt.value = value;
        res.elt.disabled = self.getPropertyDescriptor(object, name).disabled;
    }
    cell.addChild(res.elt);
    //todo NULL
    return res;
};


MultiObjectPropertyEditor.prototype.loadBoolProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    var object = this.objects[this.objects.length - 1];
    res.elt = _({
        tag: 'checkboxbutton',
        class: 'as-need-update',
        props: {
            checked: this.getProperty(object, name),
            notifyChange: function () {

            }
        },
        on: {
            change: function () {
                self.setPropertyAll(name, this.checked);
                self.notifyChange(name, this);
                self.notifyStopChange(name);
            }
        }
    });

    res.requestUpdate = function () {
        var value = self.getProperty(object, name);
        if (value != res.elt.checked) {
            res.elt.checked = value;
        }
    };

    cell.addChild(res.elt);
    return res;
};

MultiObjectPropertyEditor.prototype.loadSelectListProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    var object = this.objects[this.objects.length - 1];
    res.elt = _({
        tag: 'button',
        class: 'as-from-tool-button',
        child: 'span.mdi.mdi-table-edit',
        on: {
            click: function () {
                var listData = self.getProperty(object, name);
                /**
                 * @type {FormEditor}
                 */
                var formEditor = self.getContext(R.FORM_EDITOR);
                if (!formEditor) return;
                object.__objectIdent__ = object.__objectIdent__ || randomIdent(24);//different between state
                var selectListTabIdent = object.__objectIdent__ + '_selectList_' + name;
                var selectListEditor;
                var editorTabHolder = formEditor.getEditorHolderByIdent(selectListTabIdent);
                if (editorTabHolder)
                    selectListEditor = editorTabHolder.editor;
                if (!selectListEditor) {
                    selectListEditor = new SelectListEditor();
                    selectListEditor.attach(self);
                    var tabName = self.getProperty(object, 'name') + '(' + name + ')';
                    var desc = 'SelectList';
                    formEditor.openEditorTab(selectListTabIdent, tabName, desc, selectListEditor, { layoutEditor: this })
                }
                else {
                    editorTabHolder.tabframe.requestActive();
                }
                selectListEditor.setData(listData);
                selectListEditor.on('save', function () {
                    listData = this.getData();
                    self.setPropertyAll(name, listData);
                });
            }
        }
    });
    cell.addChild(res.elt);
    return res;
};


MultiObjectPropertyEditor.prototype.loadFragmentClassProperty = function (name, descriptor, cell) {
    var self = this;
    var res = {};
    var object = this.objects[this.objects.length - 1];
    var constructors = AssemblerInstance.fragmentConstructors;
    var items = Object.keys(constructors).map(function (key) {
        var cst = constructors[key];
        var cstName = cst.prototype.displayName
            || (cst.prototype.contentViewData
                && cst.prototype.contentViewData.attributes
                && cst.prototype.contentViewData.attributes.name)
            || cst.prototype.name
            || cst.prototype.tag;
        return { text: cstName, value: key };
    });
    items.unshift({ text: "none", value: 'null', extendStyle: { "color": "#aaa" } });

    res.elt = _({
        tag: 'selectmenu',
        props: {
            items: items,
            value: this.getProperty(object, name) || 'null'
        },
        on: {
            change: function () {
                if (this.value === 'null')
                    self.setPropertyAll(name, null);
                else
                    self.setPropertyAll(name, this.value);
            }
        }
    });
    cell.addChild(res.elt)
    return res;
};

MultiObjectPropertyEditor.prototype.clearAllDependents = function () {
    for (var key in this.dependents)
        delete this.dependents[key];
};


/**
 * @param {String} propertyName
 * @param {Array<String>} dependencyProperties
 */
MultiObjectPropertyEditor.prototype.addDepents = function (propertyName, dependencyProperties) {
    var dependencyProperty;
    for (var i = 0; i < dependencyProperties.length; ++i) {
        dependencyProperty = dependencyProperties[i];
        this.dependents[dependencyProperty] = this.dependents[dependencyProperty] || {};
        this.dependents[dependencyProperty][propertyName] = true;
    }
};

MultiObjectPropertyEditor.prototype.updateDependentsOf = function (name, excludes) {
    excludes = excludes || {};
    excludes[name] = true;
    for (var dependentPropertyName in this.dependents[name]) {
        if (!excludes[dependentPropertyName] && this.propertyHolders[dependentPropertyName]) {
            excludes[dependentPropertyName] = true;
            if (this.propertyHolders[dependentPropertyName].requestUpdate) {
                this.propertyHolders[dependentPropertyName].requestUpdate();
            }
            else if (this.propertyHolders[dependentPropertyName].reload) {
                this.propertyHolders[dependentPropertyName].reload();
            }
            this.updateDependentsOf(dependentPropertyName, excludes);
        }
    }
};

MultiObjectPropertyEditor.prototype.updatePropertyRecursive = function (name) {
    if (!this.propertyHolders[name]) return;
    if (this.propertyHolders[name].requestUpdate)
        this.propertyHolders[name].requestUpdate();
    this.updateDependentsOf(name);
}


MultiObjectPropertyEditor.prototype.notifyChange = function (name, from) {
    this.updateDependentsOf(name);
    this.emit('change', { type: 'change', target: this, from: from, name: name, objects: this.objects }, this);
};


MultiObjectPropertyEditor.prototype.notifyStopChange = function (name) {
    this.emit('stopchange', { type: 'stopchange', name: name, objects: this.objects }, this);
};


export default MultiObjectPropertyEditor;


