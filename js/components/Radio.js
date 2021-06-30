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

// after fragment complete created, do not change groupName, it make the disembark work incorrectly
Radio.prototype.attributeHandlers.groupName = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        var prev = ref.get();
        value = (value || '') + '';
        if (this.fragment)
            this.$content.name = this.fragment.id + value;
        else this.$content.name = value;
        this._assignToFragment(prev, value);
        if (value !== prev) this.unbindDataInFragment();
        ref.set(value);
        if (value !== prev) this.bindDataToFragment();
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
            this.notifyChange();
        }
    }.bind(this));
};


Radio.prototype.renderContent = function () {
    return _('radiobutton');
};


Radio.prototype.notifyChange = function () {
    var bounded;
    if (this.attributes.dataBinding && this.fragment) {
        bounded = this.fragment.boundProps[this.attributes.name];
        if (bounded) {
            if (bounded === this || (bounded.indexOf && bounded.indexOf(this) >= 0)) {
                this.fragment.notifyPropsChange({ name: this.attributes.groupName });
            }
        }
    }
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


Radio.prototype.bindDataToFragment = function () {
    if (!this.fragment) return;
    var obj = this.fragment.props;
    var assigned = this.fragment.__radio_assigned__;
    if (!assigned) return;
    var groupName = this.attributes.groupName;
    var list = assigned[groupName];
    if (!list) return;// not assigned yet
    if (!obj.hasOwnProperty(groupName)) {
        Object.defineProperty(obj, groupName, {
            enumerable: !this.attributes.disembark,
            configurable: true,
            set: function (value) {
                var tempList = list.slice();
                var radio;
                for (var i = 0; i < list.length; ++i) {
                    radio = tempList[i];
                    if (radio.attributes.value === value) {
                        radio.attributes.checked = false;
                    }
                }
            },
            get: function () {
                var tempList = list.slice();
                var radio;
                for (var i = 0; i < list.length; ++i) {
                    radio = tempList[i];
                    if (radio.attributes.checked) {
                        return radio.attributes.value;
                    }
                }
            }
        })
    }
};

Radio.prototype.unbindDataInFragment = function () {
    if (!this.fragment) return;
    var obj = this.fragment.props;
    var assigned = this.fragment.__radio_assigned__;
    if (!assigned) return;
    var groupName = this.attributes.groupName;
    var list = assigned[groupName];
    if (!list) return;// not assigned yet
    if (list.length === 1 && list[0] === this) {
        delete obj[groupName];
    }
};

AssemblerInstance.addClass(Radio);


export default Radio;