import MultiObjectPropertyEditor from "../propertyeditors/MultiObjectPropertyEditor";

function StyleEditor() {
    MultiObjectPropertyEditor.call(this);

}
Object.defineProperties(StyleEditor.prototype, Object.getOwnPropertyDescriptors(MultiObjectPropertyEditor.prototype));
StyleEditor.prototype.constructor = StyleEditor;


StyleEditor.prototype.setProperty = function (object, name, value) {
    return object.setStyle(name, value);
};


StyleEditor.prototype.getProperty = function (object) {
    return object.getStyle.apply(object, Array.prototype.slice.call(arguments, 1));
};


StyleEditor.prototype.getPropertyDescriptor = function (object) {
    return object.getStyleDescriptor.apply(object, Array.prototype.slice.call(arguments, 1));
};


StyleEditor.prototype.getPropertyNames = function (object) {
    return object.getAcceptsStyleNames();
};


export default StyleEditor;