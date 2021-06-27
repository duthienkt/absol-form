import Fcore from "../core/FCore";
import '../../css/component.css';
import ContentScalelessComponent from "../core/ContentScalelessComponent";
import inheritComponentClass from "../core/inheritComponentClass";
import CheckBox from "./Checkbox";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";

var _ = Fcore._;
var $ = Fcore.$;


function Radio() {
    ContentScalelessComponent.call(this);
}

inheritComponentClass(Radio, ContentScalelessComponent);

Radio.prototype.tag = "Radio";
Radio.prototype.menuIcon = "span.mdi.mdi-radiobox-marked";

Object.assign(Radio.prototype.attributeHandlers, InputAttributeHandlers);

Radio.prototype.attributeHandlers.checked = {
    set: function (value) {
        var prev = this.$content.checked;
        this.$content.checked = !!value;
        if (prev !== this.$content.checked && this.fragment) {
            this.fragment.emittor.emit('radio.' + this.attributes.name, {
                target: this,
                checked: this.$content.checked,
                value: this.attributes.value
            });
        }
    },
    get: function () {
        return this.$content.checked;
    },
    descriptor: {
        type: "bool"
    }
};


Radio.prototype.attributeHandlers.groupName = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        value = (value || '') + '';
        if (this.fragment)
            this.$content.name = this.fragment + value;
        else this.$content.name = value;
        this._assignToFragment(ref.get(), value);
        return value;
    },
    descriptor: {
        type: "text",
        regex: /[a-zA-Z0-9_\-]+/,
        sign: "RadioGroupIndent",
        independence: true
    },
    export: function () {
        var value = this.attributes.groupName || '';
        if (value === '') return undefined;
        return value;
    }
};

Radio.prototype.attributeHandlers.value = {
    set: function (value) {
        this.$content.value = value;
    },
    get: function () {
        return this.$content.value;
    },
    descriptor: {
        type: "text",
        sign: "RadioValue",
        independence: true
    }
};

Radio.prototype.attributeHandlers.disabled = CheckBox.prototype.attributeHandlers.disabled;

Radio.prototype.onCreate = function () {
    ContentScalelessComponent.prototype.onCreate.call(this);
    this.style.width = 18;
    this.style.height = 18;
    this.style.vAlign = 'top';
    this.style.hAlign = 'left';
    this.style.textHAlign = 'center';
    this.style.textVAlign = 'center';
    this.attributes.checked = false;
    this.attributes.value = '';
    this.attributes.groupName = 'Radio_group_' + this.constructor.count;
};


Radio.prototype.onCreated = function () {
    ContentScalelessComponent.prototype.onCreated.call(this);
    this.$content.on('change', function () {
        if (this.fragment) {
            this.fragment.emittor.emit('radio.' + this.attributes.groupName, {
                target: this,
                checked: this.$content.checked,
                value: this.attributes.value
            });
        }
    }.bind(this));
};


Radio.prototype.renderContent = function () {
    return _('radiobutton');
};


Radio.prototype.setStyleWidth = function (value) {
    value = value >= 18 ? value : 18;
    return ContentScalelessComponent.prototype.setStyleWidth.call(this, value);
};


Radio.prototype.setStyleHeight = function (value) {
    value = value >= 18 ? value : 18;
    return ContentScalelessComponent.prototype.setStyleHeight.call(this, value);
};


Radio.prototype.setAttributeGroupName = function (value) {
    this.$content.attr('name', value);
    return value;
};


Radio.prototype.getAcceptsEventNames = function () {
    return ContentScalelessComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


Radio.prototype.measureMinSize = function () {
    return { width: 18, height: 18 };
};


Radio.prototype._assignToFragment = function (oldGName, newGName) {
    if (!this.fragment) return;
    this.fragment.__radio_assigned__ = this.fragment.__radio_assigned__ || {};
    var assigned = this.fragment.__radio_assigned__;
    var list = assigned[oldGName];
    var idx = -1;
    if (list) {
        idx = list.indexOf(this);
    }
    if (idx >= 0) {
        list.splice(idx, 1);
    }
    list = assigned[newGName];
    if (!list) {
        list = [];
        assigned[newGName] = list;
    }

    list.push(this);
};

Radio.prototype.bindDataToObject = function (obj) {
    var groupName = this.getAttribute('groupName');
    var groupPropertyName = '__radioGroup_' + groupName + '__';
    if (obj[groupPropertyName] === undefined) {
        Object.defineProperty(obj, groupPropertyName, {
            enumerable: false,
            configurable: true,
            value: []
        });
        Object.defineProperty(obj, groupName, {
            set: function (value) {
                for (var i = 0; i < obj[groupPropertyName].length; ++i) {
                    if (obj[groupPropertyName][i].getAttribute('value') == value) {
                        obj[groupPropertyName][i].setAttribute('checked', true);
                        console.log(obj[groupPropertyName][i].domElt)
                    }
                    else {
                        obj[groupPropertyName][i].setAttribute('checked', false);
                    }
                }
            },
            get: function () {
                for (var i = 0; i < obj[groupPropertyName].length; ++i) {
                    if (obj[groupPropertyName][i].getAttribute('checked')) {
                        return obj[groupPropertyName][i].getAttribute('value');
                    }
                }
                return undefined;
            }
        });
    }
    if (obj[groupPropertyName].indexOf(this) < 0) {
        obj[groupPropertyName].push(this);
    }


};

AssemblerInstance.addClass(Radio);


export default Radio;