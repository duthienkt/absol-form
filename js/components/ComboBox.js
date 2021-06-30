import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import inheritComponentClass from "../core/inheritComponentClass";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";
import DomSignal from "absol/src/HTML5/DomSignal";

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

Object.assign(ComboBox.prototype.attributeHandlers, InputAttributeHandlers);

ComboBox.prototype.attributeHandlers.value = {
    set: function (value) {
        var prev = this.domElt.value;
        this.domElt.value = value;
        if (prev !== value && this.domSignal) {
            this.domSignal.emit('pinFireAll');
            this.notifyChange();
        }
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
        if (this.domSignal) {
            this.domSignal.emit('pinFireAll');
            this.notifyChange();
        }
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

ComboBox.prototype.pinHandlers.list = {
    receives: function (value) {
        this.attributes.list = value;
    },
    descriptor: {
        type: 'SelectList'
    }
};

ComboBox.prototype.pinHandlers.value = {
    receives: function (value) {
        this.attributes.value = value;
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: 'text|number'
    }
};


ComboBox.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
};


ComboBox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    if (!this.domElt.domSignal){
        this.domElt.$domSignal = _('attachhook').addTo(this.domElt);
        this.domElt.domSignal = new DomSignal(this.domElt.$domSignal);
    }
    /***
     * @type DomSignal
     */
    this.domSignal = this.domElt.domSignal;
    this.domSignal.on('pinFireAll', this.pinFireAll.bind(this));
    this.domElt.on('minwidthchange', function (event) {
        if (!(self.style.width > event.value)) {
            self.setStyle('width', event.value);
        }
    }).on('change', function () {
        // self.attributes.value = this.value;
        self.emit("change", { type: 'change', value: this.value }, self);
        self.pinFire('value');
        self.notifyChange();
    });
};


ComboBox.prototype.render = function () {
    return _('selectmenu');
};


ComboBox.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["list", 'value', 'text', 'searchable'])
        .concat(InputAttributeNames);
};


ComboBox.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


ComboBox.prototype.measureMinSize = function () {
    var minWidthStyle = parseFloat(this.view.getComputedStyleValue('min-width').replace('px'));
    return { width: Math.max(minWidthStyle, 24), height: 25 };
};

ComboBox.prototype.createDataBindingDescriptor = function () {
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
            enumerable: false,
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

AssemblerInstance.addClass(ComboBox);

export default ComboBox;