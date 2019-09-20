function Assembler() {
    this.constructors = {

    };
};

Assembler.prototype.build = function (data) {
    var construction = this.constructors[data.tag];
    if (construction == undefined) throw new Error("undefined construction " + data.tag);
    var res = new construction();

    var style = data.style;
    if (typeof style == 'object')
        for (var styleName in style) {
            res.setStyle(styleName, style[styleName]);
        }


    var attributes = data.attributes;
    if (typeof attributes == 'object')
        for (var attributeName in attributes) {
            res.setAttribute(attributeName, attributes[attributeName]);
        }

    var events = data.events;
    if (typeof events == 'object')
        for (var eventName in events) {
            res.setEvent(eventName, events[eventName]);
        }

    var children = data.children;
    if (children && children.length > 0) {
        for (var i = 0; i < children.length; ++i) {
            var child = this.build(children[i]);
            res.addChild(child);
        }
    }
    return res;

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