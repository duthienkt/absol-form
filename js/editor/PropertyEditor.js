import Fcore from '../core/FCore';
import Context from 'absol/src/AppPattern/Context';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
import '../../css/attributeeditor.css';
import { camelCaseToPascalCase } from 'absol/src/String/stringFormat';
import { beginOfDay } from 'absol/src/Time/datetime';
import ListEditor from './ListEditor';

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
}
Object.defineProperties(PropertyEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(PropertyEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
PropertyEditor.prototype.constructor = PropertyEditor;


PropertyEditor.prototype.onStart = function () {

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

PropertyEditor.prototype.loadAttributes = function () {
    var self = this;
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
    var res = _({
        tag: 'tr',
        child: [
            {
                tag: 'td',
                child: { text: name }
            },
            {
                tag: 'td',
                child: {
                    tag: 'selectmenu',
                    class: 'as-need-update',
                    props: {
                        items: descriptor.values.map(function (value) { return { text: value + "", value: value } }),
                        notifyChange: function () {
                            var value = self.getProperty(name);
                            if (value != this.value) {
                                this.value = value;
                            }
                        }
                    },
                    on: {
                        change: function () {
                            self.setProperty(name, this.value);
                            self.notifyChange(name, this);
                        }
                    }
                }
            }
        ]
    });

    return res;
};


PropertyEditor.prototype.createConstInputRow = function (name, descriptor) {
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
                    child: {
                        text: descriptor.value + ""
                    }
                }
            }
        ]
    });
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
                    tag: 'input',
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
                        }
                    }
                }]
        }] : [])
    });
    return res;
};

PropertyEditor.prototype.createNumberInputRow = function (name, descriptor) {
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
                    tag: 'numberinput',
                    class: 'as-need-update',
                    props: {
                        min: typeof (descriptor.min) == 'number' ? descriptor.min : -Infinity,
                        max: typeof (descriptor.max) == 'number' ? descriptor.max : Infinity,
                        value: self.getProperty(name),
                        disabled: descriptor.disabled,
                        notifyChange: function () {
                            var value = self.getProperty(name);
                            if (value === null)
                                this.value = descriptor.defaultValue;
                            else
                                this.value = value;
                            this.disabled = self.getPropertyDescriptor(name).disabled;
                        }
                    },
                    on: descriptor.livePreview ? {
                        changing: function () {
                            self.setProperty(name, this.value);
                            self.notifyChange(name, this);
                        }
                    } : {
                            change: function () {
                                self.setProperty(name, this.value);
                                self.notifyChange(name, this);
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
    });
    listEditor.start();
    listEditor.setData(this.getProperty(name));
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
        tag: 'table',
        class: 'as-attribute-editor',
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
    });
    this.$body = $('tbody', this.$view);
    return this.$view;
}


PropertyEditor.prototype.notifyChange = function (name, from) {
    this.notifyChangeToProperties(name, from);
    this.emit('change', { type: 'change', target: this, from: from, name: name }, this);
};


export default PropertyEditor;