import PropertyEditor from "./PropertyEditor";

function AllPropertyEditor() {
    PropertyEditor.call(this);
    this.propertyGroup = {};
}

Object.defineProperties(AllPropertyEditor.prototype, Object.getOwnPropertyDescriptors(PropertyEditor.prototype));
AllPropertyEditor.prototype.constructor = AllPropertyEditor;


AllPropertyEditor.prototype.setProperty = function (name, value) {
    if (this.propertyGroup.attributes[name])
        return this.object.setAttribute(this.propertyGroup.attributes[name], value);
    if (this.propertyGroup.style[name])
        return this.object.setStyle(this.propertyGroup.style[name], value);
    throw new Error('not found ' + name);

};


AllPropertyEditor.prototype.getProperty = function (name) {
    if (this.propertyGroup.attributes[name])
        return this.object.getAttribute(this.propertyGroup.attributes[name]);
    if (this.propertyGroup.style[name])
        return this.object.getStyle(this.propertyGroup.style[name], Array.prototype.slice.call(arguments, 1));
    throw new Error('not found ' + name);
};


AllPropertyEditor.prototype.getPropertyDescriptor = function (name) {
    if (this.propertyGroup.attributes[name])
        return this.object.getAttributeDescriptor(this.propertyGroup.attributes[name]);
    if (this.propertyGroup.style[name])
        return this.object.getStyleDescriptor(this.propertyGroup.style[name]);
    throw new Error('not found ' + name);
};




AllPropertyEditor.prototype.getPropertyNames = function () {
    var attributes = this.object.getAcceptsAttributeNames();
    var style = this.object.getAcceptsStyleNames();

    this.propertyGroup.attributes = attributes.reduce(function (ac, cr) {
        ac[cr] = cr;
        return ac;
    }, {});
    this.propertyGroup.style = style.reduce(function (ac, cr) {
        ac[cr] = cr;
        return ac;
    }, {});

    var key;
    for (key in this.propertyGroup.attributes) {
        if (this.propertyGroup.style[key]) {
            delete this.propertyGroup.attributes[key];
            delete this.propertyGroup.style[key];
            this.propertyGroup.attributes[key + '(attribute)'] = key;
            this.propertyGroup.style[key + '(style)'] = key;
        }
    }

    return Object.keys(this.propertyGroup.attributes).concat(Object.keys(this.propertyGroup.style)).sort();
};



export default AllPropertyEditor;