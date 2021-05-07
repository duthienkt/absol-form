import MultiSelectMenu from "absol-acomp/js/MultiSelectMenu";
import {_} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import ComboBox from "./ComboBox";
import {inheritComponentClass} from "../core/BaseComponent";


/***
 * @extends ScalableComponent
 * @constructor
 */
function MultiselectCombobox() {
    ScalableComponent.call(this);
}

inheritComponentClass(MultiselectCombobox, ScalableComponent);

MultiselectCombobox.prototype.tag = 'MultiselectCombobox';

MultiselectCombobox.prototype.menuIcon = 'span.mdi.mdi-chevron-down-box-outline';

MultiselectCombobox.prototype.render = function () {
    return _({
        tag: MultiSelectMenu.tag
    });
};

MultiselectCombobox.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.style.height = 'auto';
    this.attributes.list = [
        { text: '0', value: '0' },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' }
    ];
};

MultiselectCombobox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    this.bindAttribute('values');
    this.bindAttribute('searchable', 'enableSearch');
};

MultiselectCombobox.prototype.attributeHandlers.list = ComboBox.prototype.attributeHandlers.list;
MultiselectCombobox.prototype.attributeHandlers.searchable = ComboBox.prototype.attributeHandlers.searchable;
MultiselectCombobox.prototype.attributeHandlers.values = {
    set: function (value) {
        this.domElt.values = value;
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
}


MultiselectCombobox.prototype.measureMinSize = function () {
    var minWidthStyle = parseFloat(this.view.getComputedStyleValue('min-width').replace('px'));
    return { width: Math.max(minWidthStyle, 24), height: 30 };
};


MultiselectCombobox.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["list", 'values', 'searchable']);
};


MultiselectCombobox.prototype.getDataBindingDescriptor = function () {
    var thisC = this;
    var subObj = {};
    Object.defineProperties(subObj, {
        values: {
            set: function (value) {
                thisC.setAttribute('values', value);
            },
            get: function () {
                return thisC.getAttribute('values');
            }
        },
        list: {
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

export default MultiselectCombobox;