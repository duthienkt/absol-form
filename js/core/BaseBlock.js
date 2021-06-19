import EventEmitter from 'absol/src/HTML5/EventEmitter';
import FViewable from './FViewable';
import FNode from './FNode';
import FModel from './FModel';
import PluginManager from './PluginManager';
import FormEditorPreconfig from '../FormEditorPreconfig';
import noop from "absol/src/Code/noop";
import {randomIdent} from "absol/src/String/stringGenerate";
import {randomUniqueIdent} from "./utils";
import CCBlock from "absol/src/AppPattern/circuit/CCBlock";
import inheritComponentClass from "./inheritComponentClass";


/***
 * @constructor
 * @augments EventEmitter
 * @augments FViewable
 * @augments FNode
 * @augments FModel
 */
function BaseBlock() {
    EventEmitter.call(this);
    FModel.call(this);
    CCBlock.call(this, { id: randomUniqueIdent() });
    this.attributes.loadAttributeHandlers(this.attributeHandlers);
    this.onCreated();
}

inheritComponentClass(BaseBlock, EventEmitter, FModel, CCBlock);



BaseBlock.prototype.type = "BLOCK";
BaseBlock.prototype.tag = "BaseBlock";


BaseBlock.prototype.attributeHandlers.id = {
    set: function (value) {
        if (!value) value = randomIdent(16);
        this.id = value + '';
    },
    get: function () {
        return this.id;
    },
    getDescriptor: function () {
        return {
            type: 'const',
            value: this.id
        };
    }
};



BaseBlock.prototype.onCreate = function () {
    this.constructor.count = this.constructor.count || 0;
    this.attributes.name = this.tag + "_" + (this.constructor.count++);
};

BaseBlock.prototype.onCreated = noop;

BaseBlock.prototype.onAttached = noop;

BaseBlock.prototype.getData = function () {
    var data = {
        tag: this.tag
    }

    var key;

    var attributes = this.attributes.export();
    for (key in attributes) {
        data.attributes = attributes;
        break;
    }

    return data;
}


BaseBlock.prototype.setAttributes = function (attributes) {
    Object.assign(this.attributes, attributes)
};


/***
 * @returns {PropertyDescriptor||{}|null}
 */
BaseBlock.prototype.getDataBindingDescriptor = function () {
    return null;
};

BaseBlock.prototype.bindDataToObject = function (obj) {
    var name = this.getAttribute('name');
    var descriptor = this.getDataBindingDescriptor();
    if (descriptor) {
        Object.assign(descriptor, { enumerable: true, configurable: true });
        Object.defineProperty(obj, name, descriptor);
    }
    return !!descriptor;
};


export default BaseBlock;
