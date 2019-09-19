function Assembler() {
    this.constructions = {

    };
};

Assembler.prototype.build = function (data) {
    var construction = this.constructions[data.tag];
    if (construction == undefined) throw new Error("undefined construction");
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

Assembler.prototype.addComponent = function (name, construction) {
    this.constructions[name] = construction;
};

Assembler.prototype.removeComponent = function (name, construction) {
    this.constructions[name] = undefined;
    delete this.constructions[name];
};

export default Assembler;