import MultiObjectPropertyEditor from "../propertyeditors/MultiObjectPropertyEditor";

function AttributeEditor() {
    MultiObjectPropertyEditor.call(this);

}
Object.defineProperties(AttributeEditor.prototype, Object.getOwnPropertyDescriptors(MultiObjectPropertyEditor.prototype));
MultiObjectPropertyEditor.prototype.constructor = AttributeEditor;


AttributeEditor.prototype.setProperty = function (object, name, value) {
    return object.setAttribute(name, value);
};


AttributeEditor.prototype.getProperty = function (object, name) {
    return object.getAttribute(name);
};


AttributeEditor.prototype.getPropertyDescriptor = function (object, name) {
    return object.getAttributeDescriptor(name);
};




AttributeEditor.prototype.getPropertyNames = function (object) {
    return object.getAcceptsAttributeNames();
};



export default AttributeEditor;