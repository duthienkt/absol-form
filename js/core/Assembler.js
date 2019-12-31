import PluginManager from "./PluginManager";
import R from "../R";
import RelativeLayout from "../layouts/RelativeLayout";
import Button from "../components/Button";
import CheckBox from "../components/Checkbox";
import ComboBox from "../components/ComboBox";
import DateInput from "../components/DateInput";
import Image from "../components/Image";
import Label from "../components/Label";
import NumberInput from "../components/NumberInput";
import Radio from "../components/Radio";
import Table from "../components/Table";
import Text from "../components/Text";
import TextArea from "../components/TextArea";
import TextInput from "../components/TextInput";
import LinearLayout from "../layouts/LinearLayout";
import Ellipse from "../shapes/Ellipse";
import Rectangle from "../shapes/Rectangle";

function Assembler() {
    this.constructors = {};
    this.addConstructor(Button);
    this.addConstructor(CheckBox);
    this.addConstructor(ComboBox);
    this.addConstructor(DateInput);
    this.addConstructor(Image);
    this.addConstructor(Label);
    this.addConstructor(NumberInput);
    this.addConstructor(Radio);
    this.addConstructor(Table);
    this.addConstructor(Text);
    this.addConstructor(TextArea);
    this.addConstructor(TextInput);
    this.addConstructor(LinearLayout);
    this.addConstructor(RelativeLayout);
    this.addConstructor(Ellipse);
    this.addConstructor(Rectangle);
};


Assembler.prototype.build = function (data) {
    var construction = this.constructors[data.tag];
    
    var result = null;
    if (typeof construction == 'function') {
        result = new construction();
        var style = data.style;
        if (typeof style == 'object')
            for (var styleName in style) {
                result.setStyle(styleName, style[styleName]);
            }

        var attributes = data.attributes;
        if (typeof attributes == 'object')
            for (var attributeName in attributes) {
                result.setAttribute(attributeName, attributes[attributeName]);
            }

        var events = data.events;
        if (typeof events == 'object')
            for (var eventName in events) {
                result.setEvent(eventName, events[eventName]);
            }

        var children = data.children;
        if (children && children.length > 0) {
            for (var i = 0; i < children.length; ++i) {
                var child = this.build(children[i]);
                result.addChild(child);
            }
        }
    }

    var context = { self: this, assembler: this, data: data, result: result };
    PluginManager.exec(this, R.PLUGINS.BUILD_COMPONENT, context);
    result = context.result;
    if (result == null) {
        console.error("Cannot handle ", data);
    }

    return result;

};

Assembler.prototype.addConstructor = function (arg0, arg1) {
    if (typeof arg0 == 'function') {
        var name = arg0.prototype.tag || arg0.name;
        this.constructors[name] = arg0;
    }
    else if (typeof arg0 == 'string') {
        this.constructors[arg0] = arg1;
    }
    else {
        throw new Error('Invalid params');
    }
};

Assembler.prototype.removeConstructor = function (arg0, arg1) {
    if (typeof arg0 == 'function') {
        var name = arg0.prototype.tag || arg0.name;
        this.constructors[name] = undefined;
        delete this.constructors[name];
    }
    else if (typeof arg0 == 'string' && (this.constructors[arg0] == arg1 || arg1 == undefined)) {
        delete this.constructors[arg0];
    }
};



Assembler.prototype.addComponent = function (name, construction) {
    this.addConstructor(name, construction);
};

Assembler.prototype.removeComponent = function (name, construction) {
    this.removeConstructor(name, construction);
};

export default Assembler;