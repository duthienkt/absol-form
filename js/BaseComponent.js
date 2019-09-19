import EventEmitter from 'absol/src/HTML5/EventEmitter';

function BaseComponent() {
    EventEmitter.call(this);
    this.tag = "BaseComponent";
    this.attributes = {};
    this.children = [];// <> childData
    this.style = {};
    this.events = {};
    this.parent = null;
    this.anchor = null;
    this.view = this.render();
    this.view.classList.add(this.BASE_COMPONENT_CLASS_NAME);
    this.onCreated();
}

Object.defineProperties(BaseComponent.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));

BaseComponent.prototype.BASE_COMPONENT_CLASS_NAME = 'as-base-component';

BaseComponent.prototype.constructor = BaseComponent;

BaseComponent.prototype.SUPPORT_STYLE_NAMES = [];

BaseComponent.prototype.onCreated = function () { };

BaseComponent.prototype.onAttached = function (parent) { 
    //reset style after attach anchor
    for (var key in this.style){
        this.handleStyle(key, this.style[key]);
    }
};


BaseComponent.prototype.onDetached = function (parent) { };


BaseComponent.prototype.render = function () {
    throw new Error("Not implement!");
};


BaseComponent.prototype.getData = function () {
    var self = this;
    var data = {
        tag: this.tag
    }

    var attributeKeys = Object.keys(this.attributes).filter(function (key) {
        return self.attributes[key] !== undefined || self.attributes[key] !== null;
    });

    if (attributeKeys.length > 0) {
        data.attributes = attributeKeys.reduce(function (ac, key) {
            ac[key] = elf.attributes[key];
            return ac;
        }, {});
    }

    var styleKeys = Object.keys(this.style).filter(function (key) {
        return self.style[key] !== undefined || self.style[key] !== null;
    });

    if (styleKeys.length > 0) {
        data.style = styleKeys.reduce(function (ac, key) {
            ac[key] = elf.style[key];
            return ac;
        }, {});
    }

    if (children.length > 0) {
        data.children = this.children.map(function (child) {
            return children.getData();
        });
    }

    return data;
}

BaseComponent.prototype.setAttribute = function (key, value) {
    this.attributes[key] = value;
    this.handleAttribute(key, value);
};

BaseComponent.prototype.getAttribute = function (key) {
    return this.attributes[key];
};

BaseComponent.prototype.removeAttribute = function (key) {
    this.attributes[key] = undefined;
    delete this.attributes[key];
    this.handleAttribute(key, undefined);
};

BaseComponent.prototype.handleAttribute = function (key, value) {
    var functionName = 'handleAttribute' + key.substr(0, 1).toUpperCase() + key.substr(1);
    
    if (this[functionName]) this[functionName](value);
    else
        throw new Error("Not implement this." + functionName + '(value)!');
};

BaseComponent.prototype.setStyle = function (key, value) {
    this.style[key] = value;
    this.handleStyle(key, value);
};

BaseComponent.prototype.getStyle = function (key) {
    return this.style[key];
};

BaseComponent.prototype.removeStyle = function (key) {
    delete this.style[key];
    this.handleStyle(key, undefined);
};

/**
 * @param {String} key
 * @param {string|Number} value 
 */
BaseComponent.prototype.handleStyle = function (key, value) {
    var functionName = 'handleStyle' + key.substr(0, 1).toUpperCase() + key.substr(1);
    
    if (this[functionName]) this[functionName](value);
    else
        throw new Error("Not implement this." + functionName + '(value)!');
};


BaseComponent.prototype.handleStyleVAlign = function (value) {
    if (this.anchor)
        this.anchor.setVAlign(value);
};


BaseComponent.prototype.handleStyleHAlign = function (value) {
    if (this.anchor)
        this.anchor.setHAlign(value);
};


BaseComponent.prototype.handleStyleLeft = function (value) {
    if (this.anchor)
        this.anchor.setLeft(value);
};

BaseComponent.prototype.handleStyleRight = function (value) {
    if (this.anchor)
        this.anchor.setRight(value);
};

BaseComponent.prototype.handleStyleTop = function (value) {
    if (this.anchor)
        this.anchor.setTop(value);
};

BaseComponent.prototype.handleStyleBottom = function (value) {
    if (this.anchor)
        this.anchor.setBottom(value)
};

BaseComponent.prototype.handleStyleWidth = function (value) {
    if (this.anchor)
        this.anchor.setWidth(value);
};

BaseComponent.prototype.handleStyleHeight= function (value) {
    if (this.anchor)
        this.anchor.setHeight(value)
};


BaseComponent.prototype.addChild = function (child) {
    if (child.parent) child.parent.removeChild(child);
    this.children.push(child);
    child.parent = this;
    this.handleAddChild(child, - 1);//negative index for appending child
    child.onAttached(this);
};

BaseComponent.prototype.addChildBefore = function (child, existingChild) {
    if (child.parent) child.parent.removeChild(child);
    var existChildIndex = this.children.indexOf(existingChild);
    if (existChildIndex >= 0) {
        this.children.splice(existChildIndex, 0, child);
        child.parent = this;
        this.handleAddChild(child, existChildIndex);
        child.onAttached(this);
        return true;
    }
    return false;
};

BaseComponent.prototype.addChildAfter = function (child, existingChild) {
    if (child.parent) child.parent.removeChild(child);
    var existChildIndex = this.children.indexOf(existingChild);
    if (existChildIndex >= 0) {
        this.children.splice(existChildIndex + 1, 0, child);
        child.parent = this;
        this.handleAddChild(child, existChildIndex + 1);
        child.onAttached(this);
        return true;
    }
    return false;
};

BaseComponent.prototype.handleAddChild = function (child, index) {
    throw new Error("Not implement!");
};

BaseComponent.prototype.removeChild = function (child) {
    var childIndex = this.children.indexOf(child);
    if (childIndex <= 0) return false;
    this.children.splice(childIndex, 1);
    this.handleRemoveChild(child, childIndex);
    child.parent = undefined;
    child.onDetached(this);
    return true;
};

BaseComponent.prototype.handleRemoveChild = function (child, index) {
    throw new Error("Not implement!");
};

BaseComponent.prototype.setEvent = function (key, value) {
    this.events[key] = value;
    this.on(key, value);
};

BaseComponent.prototype.removeEvent = function (key) {
    this.events[key] = undefined;
    delete this.events[key];
    this.off(key, value);
};




export default BaseComponent;