import EventEmitter from 'absol/src/HTML5/EventEmitter';
import FModel from './FModel';
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
    /***
     *
     * @type {null|FmFragment}
     */
    this.fragment = null;
    this.attributes.loadAttributeHandlers(this.attributeHandlers);
    this.onCreated();
}

inheritComponentClass(BaseBlock, EventEmitter, FModel, CCBlock);


BaseBlock.prototype.type = "BLOCK";
BaseBlock.prototype.tag = "BaseBlock";
BaseBlock.prototype.menuIcon = 'span.mdi.mdi-cube-outline';


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

BaseBlock.prototype.attributeHandlers.displayName = {
    set: function (value) {
        value = value || '';
        value += '';
        return value;
    },
    descriptor: {
        type: 'text',
        displayName: "name"
    },
    export: function (ref) {
        return ref.get() || undefined;
    }
};

BaseBlock.prototype.attributeHandlers.permissions = {
    descriptor: {
        type: 'object',
        hidden: true
    }
};


BaseBlock.prototype.onCreate = function () {
    this.constructor.count = this.constructor.count || 0;
    this.attributes.displayName = '';
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


export default BaseBlock;
