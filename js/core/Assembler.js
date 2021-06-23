import PluginManager from "./PluginManager";
import R from "../R";

import {traversal} from "./FNode";
import BaseComponent from "./BaseComponent";
import FmFragment from "./FmFragment";
import CCLine from "absol/src/AppPattern/circuit/CCLine";

function Assembler() {
}

Assembler.prototype.classes = {};
Assembler.prototype.componentConstructors = {};
Assembler.prototype.fragmentConstructors = {};//share data

Assembler.prototype.addClass = function () {
    var type;
    var tag;
    var clazz;
    if (arguments.length === 1) {
        clazz = arguments[0];
        if (typeof clazz !== 'function') return this;
        tag = clazz.prototype.tag;
    }
    else if (arguments.length === 2) {
        clazz = arguments[1];
        if (typeof clazz !== 'function') return this;
        tag = arguments[0];
    }
    if (!clazz) return this;
    type = clazz.prototype.type;
    this.classes[type] = this.classes[type] || {};
    this.classes[type][tag] = clazz;
};

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

Assembler.prototype.buildFragment = function (data, parentFrag) {
    var constructor;
    if (typeof data.class === 'string') {
        constructor = this.classes[FmFragment.prototype.type][data.class] || data.class.split('.').reduce(function (ac, cr) {
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
    if (data.style) frag.view.setStyles(data.style);
    if (data.attributes) frag.view.setAttributes(data.attributes);
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
    else construction = this.classes[BaseComponent.prototype.type][data.tag];
    if (!construction) throw new Error("Invalid tag " + data.tag);

    var result = new construction();
    result.fragment = frag;
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

Assembler.prototype.buildBlock = function (data, frag) {
    var clazz;
    if (typeof data.tag === 'function') {
        clazz = data.tag;
    }
    else if (typeof data.tag === 'string') {
        clazz = this.classes['BLOCK'][data.tag];
    }
    if (!clazz) throw  new Error('Invalid block tag ' + data.tag);
    var result = new clazz();
    result.fragment = frag;//todo: onAttach
    if (typeof data.attributes === "object") {
        Object.assign(result.attributes, data.attributes);
    }

    if (typeof data.onCreated === "function") {
        data.onCreated.apply(result, []);
    }
    else if (typeof data.onCreated === "string") {
        new Function(data.onCreated).call(result);
    }

    return result;
};

Assembler.prototype.buildLine = function (data, blocks) {
    var u = blocks[data.u];
    var v = blocks[data.v];
    if (u && v) {
        return new CCLine(u, data.uPin, v, data.vPin, !!data.twoWay);
    }
};

Assembler.prototype.addConstructor = function () {
    return this.addClass.apply(this, arguments);
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

export function findComponentById(root, id) {
    var res = null;
    traversal(root, function (ac) {
        if (ac.node.attributes.id === id) {
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
        if (ac.node !== root && !opt.depth && ac.node.isFragmentView) {
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
