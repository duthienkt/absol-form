import MultiSelectMenu from "absol-acomp/js/MultiSelectMenu";
import {_} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import ComboBox from "./ComboBox";
import inheritComponentClass from "../core/inheritComponentClass";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";
import DomSignal from "absol/src/HTML5/DomSignal";


function valueListCmp(a, b) {
    var dictA = a.reduce(function (ac, cr) {
        ac[cr] = cr;
        return ac;
    }, {});
    return a.length === b.length && b.every(function (it) {
        return dictA[it] === it;
    });
}

/***
 * @extends ScalableComponent
 * @constructor
 */
function MultiselectComboBox() {
    ScalableComponent.call(this);
}

inheritComponentClass(MultiselectComboBox, ScalableComponent);

MultiselectComboBox.prototype.tag = 'MultiselectComboBox';

MultiselectComboBox.prototype.menuIcon = 'span.mdi.mdi-chevron-down-box-outline';

MultiselectComboBox.prototype.render = function () {
    return _({
        tag: MultiSelectMenu.tag
    });
};

MultiselectComboBox.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.style.height = 30;
    this.style.width = 100;
};

MultiselectComboBox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    if (!this.domElt.domSignal) {
        this.domElt.$domSignal = _('attachhook').addTo(this.domElt);
        this.domElt.domSignal = new DomSignal(this.domElt.$domSignal);
    }
    /***
     * @type DomSignal
     */
    this.domSignal = this.domElt.domSignal;
    this.domSignal.on('pinFireAll', this.pinFireAll.bind(this));
    this.domElt.on('change', function () {
        self.pinFire('values');
        self.notifyChange();
    })
};


Object.assign(MultiselectComboBox.prototype.attributeHandlers, InputAttributeHandlers);


MultiselectComboBox.prototype.attributeHandlers.list = ComboBox.prototype.attributeHandlers.list;
MultiselectComboBox.prototype.attributeHandlers.searchable = ComboBox.prototype.attributeHandlers.searchable;
MultiselectComboBox.prototype.attributeHandlers.values = {
    set: function (value) {
        if (!value || !value.forEach) value = [];
        var prev = this.domElt.values.slice();
        this.domElt.values = value;
        if (this.domSignal && !valueListCmp(value, prev)) {
            this.domSignal.emit('pinFireAll');
            this.notifyChange();
        }
    },
    get: function () {
        return this.domElt.values;
    },
    getDescriptor: function () {
        return {
            type: 'arrayOfText',
            dependency: ['list'],
            autocomplete: this.getAttribute('list').map(function (it) {
                return it.value;
            })
        };
    }
};

MultiselectComboBox.prototype.pinHandlers.list = ComboBox.prototype.pinHandlers.list;

MultiselectComboBox.prototype.pinHandlers.values = {
    receives: function (value) {
        this.attributes.values = value;
    },
    get: function () {
        return this.domElt.values;
    },
    descriptor: {
        type: 'arrayOfText'
    }
};

MultiselectComboBox.prototype.measureMinSize = function () {
    var minWidthStyle = parseFloat(this.view.getComputedStyleValue('min-width').replace('px'));
    return { width: Math.max(minWidthStyle, 24), height: 30 };
};


MultiselectComboBox.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["list", 'values', 'searchable'])
        .concat(InputAttributeNames);
};


MultiselectComboBox.prototype.createDataBindingDescriptor = function () {
    var thisC = this;
    var subObj = {};
    Object.defineProperties(subObj, {
        values: {
            enumerable: true,
            set: function (value) {
                thisC.setAttribute('values', value);
            },
            get: function () {
                return thisC.getAttribute('values');
            }
        },
        list: {
            enumerable: false,
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

AssemblerInstance.addClass(MultiselectComboBox);
AssemblerInstance.addClass('MultiselectCombobox', MultiselectComboBox);

export default MultiselectComboBox;