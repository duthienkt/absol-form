import PropertyEditor from "./PropertyEditor";

function AttributeEditor() {
    PropertyEditor.call(this);

}
Object.defineProperties(AttributeEditor.prototype, Object.getOwnPropertyDescriptors(PropertyEditor.prototype));
AttributeEditor.prototype.constructor = AttributeEditor;


AttributeEditor.prototype.setProperty = function (name, value) {
    return this.object.setAttribute(name, value);
};


AttributeEditor.prototype.getProperty = function (name) {
    return this.object.getAttribute(name);
};


AttributeEditor.prototype.getPropertyDescriptor = function (name) {
    return this.object.getAttributeDescriptor(name);
};




AttributeEditor.prototype.getPropertyNames = function () {
    return this.object.getAcceptsAttributeNames();
};



export default AttributeEditor;