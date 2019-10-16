import PropertyEditor from "./PropertyEditor";

function StyleEditor() {
    PropertyEditor.call(this);

}
Object.defineProperties(StyleEditor.prototype, Object.getOwnPropertyDescriptors(PropertyEditor.prototype));
StyleEditor.prototype.constructor = StyleEditor;


StyleEditor.prototype.setProperty = function (name, value) {
    return this.object.setStyle(name, value);
};


StyleEditor.prototype.getProperty = function (name) {
    return this.object.getStyle(name);
};


StyleEditor.prototype.getPropertyDescriptor = function (name) {
    return this.object.getStyleDescriptor(name);
};




StyleEditor.prototype.getPropertyNames = function () {
    return this.object.getAcceptsStyleNames();
};



export default StyleEditor;