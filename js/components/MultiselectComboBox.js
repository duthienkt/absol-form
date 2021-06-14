import MultiSelectMenu from "absol-acomp/js/MultiSelectMenu";
import {_} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import ComboBox from "./ComboBox";
import {inheritComponentClass} from "../core/BaseComponent";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";


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

    this.attributes.list = [
        { text: '0', value: '0' },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' }
    ];
};

MultiselectComboBox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    this.bindAttribute('values');
    this.bindAttribute('searchable', 'enableSearch');
};


Object.assign(MultiselectComboBox.prototype.attributeHandlers, InputAttributeHandlers);


MultiselectComboBox.prototype.attributeHandlers.list = ComboBox.prototype.attributeHandlers.list;
MultiselectComboBox.prototype.attributeHandlers.searchable = ComboBox.prototype.attributeHandlers.searchable;
MultiselectComboBox.prototype.attributeHandlers.values = {
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


MultiselectComboBox.prototype.measureMinSize = function () {
    var minWidthStyle = parseFloat(this.view.getComputedStyleValue('min-width').replace('px'));
    return { width: Math.max(minWidthStyle, 24), height: 30 };
};


MultiselectComboBox.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["list", 'values', 'searchable'])
        .concat(InputAttributeNames);
};


MultiselectComboBox.prototype.getDataBindingDescriptor = function () {
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

AssemblerInstance.addClass(MultiselectComboBox);
AssemblerInstance.addClass('MultiselectCombobox',MultiselectComboBox);

export default MultiselectComboBox;