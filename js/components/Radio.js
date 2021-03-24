import Fcore from "../core/FCore";

import '../../css/component.css';
import ContentScalelessComponent from "../core/ContentScalelessComponent";

var _ = Fcore._;
var $ = Fcore.$;


function Radio() {
    ContentScalelessComponent.call(this);
}

Object.defineProperties(Radio.prototype, Object.getOwnPropertyDescriptors(ContentScalelessComponent.prototype));

Radio.prototype.constructor = Radio;
Radio.prototype.tag = "Radio";
Radio.prototype.menuIcon = "span.mdi.mdi-radiobox-marked";


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
    var self = this;
    this.$content.on('change', function () {
        self.attributes.checked = this.checked;
        if (self.events.change)
            console.log("TODO: exec", self.events.change);
    });
};


Radio.prototype.renderContent = function () {
    return _('radiobutton');
};


Radio.prototype.setAttributeChecked = function (value) {
    this.$content.checked = !!value;
    return this.$content.checked;
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

Radio.prototype.getAttributeGroupNameDescriptor = function () {
    return {
        type: "text",
        regex: /[a-zA-Z0-9\_\-]+/,
        sign: "RadioGroupIndent",
        independence: true
    };
};

Radio.prototype.setAttributValue = function (value) {
    this.$content.attr('value', value + '');
    return value;
};


Radio.prototype.getAttributeValueDescriptor = function () {
    return {
        type: "text",
        sign: "RadioValue",
        independence: true
    };
};


Radio.prototype.getAttributeCheckedDescriptor = function () {
    return {
        type: "bool"
    };
};


Radio.prototype.getAcceptsAttributeNames = function () {
    return ContentScalelessComponent.prototype.getAcceptsAttributeNames.call(this).concat(["groupName", "checked", 'value'])
};


Radio.prototype.getAcceptsEventNames = function () {
    return ContentScalelessComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


Radio.prototype.measureMinSize = function () {
    return { width: 18, height: 18 };
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
                    }
                    else {
                        obj[groupPropertyName][i].setAttribute('checked', false);
                    }
                    return null;
                }
            },
            get: function () {
                for (var i = 0; i < obj[groupPropertyName].length; ++i) {
                    if (obj[groupPropertyName][i].getAttribute('checked')) {
                        return obj[groupPropertyName][i].getAttribute('value');
                    }
                    return null;
                }
            }
        });
    }
    if (!obj[groupPropertyName].indexOf(this)) {
        obj[groupPropertyName].push(this);
    }

};


export default Radio;