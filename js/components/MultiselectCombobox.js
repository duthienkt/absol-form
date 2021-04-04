import OOP from "absol/src/HTML5/OOP";
import MultiSelectMenu from "absol-acomp/js/MultiSelectMenu";
import {_} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import ComboBox from "./ComboBox";


/***
 * @extends ScalableComponent
 * @constructor
 */
function MultiselectCombobox() {
    ScalableComponent.call(this);
}

OOP.mixClass(MultiselectCombobox, ScalableComponent);

MultiselectCombobox.prototype.tag = 'MultiselectCombobox';

MultiselectCombobox.prototype.menuIcon = 'span.mdi.mdi-chevron-down-box-outline';

MultiselectCombobox.prototype.render = function () {
    return _({
        tag: MultiSelectMenu.tag
    });
};

MultiselectCombobox.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
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


MultiselectCombobox.prototype.setAttributeList = ComboBox.prototype.setAttributeList;
MultiselectCombobox.prototype.getAttributeList = ComboBox.prototype.getAttributeList;
MultiselectCombobox.prototype.measureMinSize = function () {
    var minWidthStyle = parseFloat(this.view.getComputedStyleValue('min-width').replace('px'));
    return { width: Math.max(minWidthStyle, 24), height: 30 };
};
MultiselectCombobox.prototype.getAttributeListDescriptor = ComboBox.prototype.getAttributeListDescriptor;
MultiselectCombobox.prototype.getAttributeSearchableDescriptor = ComboBox.prototype.getAttributeSearchableDescriptor;

MultiselectCombobox.prototype.getAttributeValuesDescriptor = function () {
    return {
        type: 'arrayOfText',
        dependency:['list'],
        autocomplete: this.getAttribute('list').map(function (it){
            return it.value;
        })
    };
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