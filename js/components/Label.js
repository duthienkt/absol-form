import Fcore from "../core/FCore";

import '../../css/component.css';
import ContentScalelessComponent from "../core/ContentScalelessComponent";
import Text from "./Text";
import OOP from "absol/src/HTML5/OOP";
import TextStyleHandlers from "./handlers/TextStyleHandlers";
import inheritComponentClass from "../core/inheritComponentClass";
import {AssemblerInstance} from "../core/Assembler";

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends ContentScalelessComponent
 * @constructor
 */
function Label() {
    ContentScalelessComponent.call(this);
}

inheritComponentClass(Label, ContentScalelessComponent);
Object.assign(Label.prototype.styleHandlers, TextStyleHandlers);

Label.prototype.attributeHandlers.text = {
    set: function (value) {
        value = (value || '') + '';
        this.$content.clearChild().addChild(_({ text: value }));
        return value;
    },
    descriptor: {
        type: "text",
        long: false,
        sign: "innerText"
    }
}

Label.prototype.tag = "Label";
Label.prototype.menuIcon = 'span.mdi.mdi-label-outline';


Label.prototype.onCreate = function () {
    ContentScalelessComponent.prototype.onCreate.call(this);
    this.attributes.text = this.attributes.name;
    this.style.height = 'auto';
    this.style.font = undefined;
    this.style.fontStyle = undefined;
    this.style.textSize = 0;
    this.style.textColor = 'black';
    this.attributes.dataBinding = false;
};


Label.prototype.renderContent = function () {
    return _('label');
};


Label.prototype.createDataBindingDescriptor = function () {
    var thisC = this;
    return {
        get: function () {
            return thisC.getAttribute('text');
        },
        set: function (value) {
            thisC.setAttribute('text', value);
        }
    };
};

AssemblerInstance.addClass(Label);

export default Label;