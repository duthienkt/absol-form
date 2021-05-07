import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import OOP from "absol/src/HTML5/OOP";
import {inheritComponentClass} from "../core/BaseComponent";

var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function ComboBox() {
    ScalableComponent.call(this);
}

inheritComponentClass(ComboBox, ScalableComponent);

ComboBox.prototype.tag = "ComboBox";
ComboBox.prototype.menuIcon = 'span.mdi.mdi-arrow-down-drop-circle-outline';

ComboBox.prototype.attributeHandlers.value = {
    set: function (value) {
        this.domElt.value = value;
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: 'text'
    }
};

ComboBox.prototype.attributeHandlers.list = {
    set: function (value) {
        this.domElt.items = value;
    },
    get: function () {
        return this.domElt.items;
    },
    export: function () {
        return this.domElt.items.map(function (item) {
            return { text: item.text, value: item.value };
        });
    },
    descriptor: {
        type: 'SelectList'
    }
};


ComboBox.prototype.attributeHandlers.searchable = {
    set: function (value) {
        this.domElt.enableSearch = value;
    },
    get: function () {
        return this.domElt.enableSearch;
    },
    descriptor: {
        type: 'bool'
    }
};


ComboBox.prototype.attributeHandlers.text = {
    get: function () {
        var list = this.attributes.list;
        var value = this.attributes.value;
        if (list) {
            for (var i = 0; i < list.length; ++i)
                if (list[i].value == value) return list[i].text;
            return '';
        }
        else {
            return "";
        }
    },
    export: function () {
        return undefined;
    },
    descriptor: {
        type: 'string'
    }
};


ComboBox.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.list = [
        { text: '0', value: '0' },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' }
    ];
    this.attributes.value = '0';

};


ComboBox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('minwidthchange', function (event) {
        if (!(self.style.width > event.value)) {
            self.setStyle('width', event.value);
        }
    }).on('change', function () {
        // self.attributes.value = this.value;
        self.emit("change", { type: 'change', value: this.value }, self);
    });
};


ComboBox.prototype.render = function () {
    return _('selectmenu');
};


ComboBox.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["list", 'value', 'text', 'searchable']);
};


ComboBox.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


ComboBox.prototype.measureMinSize = function () {
    var minWidthStyle = parseFloat(this.view.getComputedStyleValue('min-width').replace('px'));
    return { width: Math.max(minWidthStyle, 24), height: 25 };
};

ComboBox.prototype.getDataBindingDescriptor = function () {
    var thisC = this;
    var subObj = {};
    Object.defineProperties(subObj, {
        value: {
            configurable: true,
            enumerable: true,
            set: function (value) {
                thisC.setAttribute('value', value);
            },
            get: function () {
                return thisC.getAttribute('value');
            }
        },
        list: {
            enumerable: true,
            configurable: true,
            get: function () {
                return thisC.getAttribute('list');
            },
            set: function (value) {
                thisC.setAttribute('list', value);
            }
        }
    });

    return {
        set: function (value) {
            Object.assign(subObj, value);
        },
        get: function () {
            return subObj;
        }
    };
};

export default ComboBox;