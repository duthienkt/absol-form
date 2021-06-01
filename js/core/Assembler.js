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
import ChainLayout from "../layouts/ChainLayout";
import MultiselectCombobox from "../components/MultiselectCombobox";
import TrackBar from "../components/TrackBar";
import TrackBarInput from "../components/TrackBarInput";
import TableInput from "../components/TableInput";
import {traversal} from "./FNode";
import ArrayOfFragment from "../components/ArrayOfFragment";
import EditableArrayOfFragment from "../components/EditableArrayOfFragment";
import TreeComboBox from "../components/TreeComboBox";
import ImageFileInput from "../components/ImageFileInput";
import TimeInput from "../components/TimeInput";

function Assembler() {
    this.addConstructor(Button);
    this.addConstructor(CheckBox);
    this.addConstructor(ComboBox);
    this.addConstructor(TreeComboBox);
    this.addConstructor(DateInput);
    this.addConstructor(TimeInput);
    this.addConstructor(Image);
    this.addConstructor(Label);
    this.addConstructor(NumberInput);
    this.addConstructor(Radio);
    this.addConstructor(Table);
    this.addConstructor(Text);
    this.addConstructor(TextArea);
    this.addConstructor(TextInput);
    this.addConstructor(ImageFileInput);
    this.addConstructor(LinearLayout);
    this.addConstructor(RelativeLayout);
    this.addConstructor(ChainLayout);
    this.addConstructor(Ellipse);
    this.addConstructor(Rectangle);
    this.addConstructor(MultiselectCombobox);
    this.addConstructor(TrackBar);
    this.addConstructor('Trackbar', TrackBar);
    this.addConstructor(TrackBarInput);
    this.addConstructor(TableInput);
    this.addComponent(ArrayOfFragment);
    this.addComponent(EditableArrayOfFragment);
}


Assembler.prototype.componentConstructors = {};
Assembler.prototype.fragmentConstructors = {};//share data
/***
 *
 * @param data
 * @param {FmFragment=} frag
 * @return {BaseComponent|FmFragment}
 */
Assembler.prototype.build = function (data, frag) {
    if (data.class) {
        return this.buildFragment(data);
    }
    else if (data.tag) {
        return this.buildComponent(data, frag);
    }
    else throw new Error("Can not detect data type!");
};

Assembler.prototype.buildFragment = function (data) {
    var constructor;
    if (typeof data.class === 'string') {
        constructor = this.fragmentConstructors[data.class] || data.class.split('.').reduce(function (ac, cr) {
            if (ac) {
                ac = ac[cr];
            }
            return ac;
        }, window);
    }
    else if (typeof data.class === "function" && data.class.prototype.type === "FRAGMENT") {
        constructor = data.class;
    }
    if (!constructor) {
        console.error(data);
        throw  new Error("Invalid FmFragment class!");
    }
    var frag = new constructor();
    frag.setContentView(this.buildComponent(frag.contentViewData, frag));
    if (data.style) frag.view.setStyles(data.style);
    if (data.attributes) frag.view.setAttributes(data.attributes);
    frag.onCreated();
    if (typeof data.onCreated === "function") {
        data.onCreated.apply(frag, frag.view);
    }
    else if (typeof data.onCreated === "string") {
        new Function('fragment', data.onCreated).call(frag, frag.view);
    }
    return frag;
};

/***
 *
 * @param data
 * @param {FmFragment=} frag
 * @return {BaseComponent}
 */
Assembler.prototype.buildComponent = function (data, frag) {
    var construction;
    if (typeof data.tag === "function")
        construction = data.tag;
    else construction = this.componentConstructors[data.tag];
    if (!construction) throw new Error("Invalid tag " + data.tag);

    var result = new construction();
    var style = data.style;
    if (typeof style == 'object')
        Object.assign(result.style, style);

    var attributes = data.attributes;
    if (typeof attributes == 'object')
        Object.assign(result.attributes, attributes)


    var events = data.events;
    if (typeof events == 'object')
        for (var eventName in events) {
            result.setEvent(eventName, events[eventName]);
        }

    if (typeof data.onCreated === "function") {
        data.onCreated.apply(result, []);
    }
    else if (typeof data.onCreated === "string") {
        new Function(data.onCreated).call(result);
    }
    var children = data.children;
    if (children && children.length > 0) {
        for (var i = 0; i < children.length; ++i) {
            var child = this.build(children[i], frag);
            if (child.type === "FRAGMENT") {
                result.addChild(child.view);
                if (frag)
                    frag.addChild(child);
            }
            else
                result.addChild(child);
        }
    }

    return result;
};

Assembler.prototype.addConstructor = function (arg0, arg1) {
    var name;
    var constructor;
    if (typeof arg0 == 'function') {
        var name = arg0.prototype.tag || arg0.name;
        constructor = arg0;
        this.componentConstructors[name] = arg0;
    }
    else if (typeof arg0 == 'string') {
        name = arg0;
        constructor = arg1;
        this.componentConstructors[arg0] = arg1;
    }
    else {
        throw new Error('Invalid params');
    }
    switch (constructor.prototype.type) {
        case 'COMPONENT':
            this.componentConstructors[name] = constructor;
            break;
        case 'FRAGMENT':
            this.fragmentConstructors[name] = constructor;
            break;
    }
};

Assembler.prototype.removeConstructor = function (arg0, arg1) {
    if (typeof arg0 == 'function') {
        var name = arg0.prototype.tag || arg0.name;
        switch (arg0.prototype.type) {
            case "FRAGMENT":
                delete this.fragmentConstructors[name];
                break;
            case "COMPONENT":
                delete this.componentConstructors[name];
                break;
        }
    }
    else if (typeof arg0 == 'string' && (this.componentConstructors[arg0] === arg1 || arg1 == undefined)) {
        delete this.componentConstructors[arg0];
        delete this.fragmentConstructors[arg0];
    }
};


Assembler.prototype.addComponent = function (name, construction) {
    this.addConstructor(name, construction);
};

Assembler.prototype.removeComponent = function (name, construction) {
    this.removeConstructor(name, construction);
};

export default Assembler;

export var AssemblerInstance = new Assembler();


export function findComponentByName(root, name) {
    var res = null;
    traversal(root, function (ac) {
        if (ac.node.getAttribute('name') === name) {
            ac.stop();
            res = ac.node;
        }
    });

    return res;
}

export function findComponent(root, opt) {
    var res = null;
    opt = opt || {};
    if (typeof opt === 'string') {
        opt = { name: opt };
    }

    function isMatch(comp) {
        if (opt.name && opt.name === comp.getAttribute('name')) return true;
        return false;
    }

    traversal(root, function (ac) {
        if (ac.node !== root && !opt.depth && ac.node.fragment) {
            ac.skipChildren();
            return;
        }
        if (isMatch(ac.node)) {
            ac.stop();
            res = ac.node;
        }
    });
    return res;
}
