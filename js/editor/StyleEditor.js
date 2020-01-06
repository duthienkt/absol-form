import PropertyEditor from "./PropertyEditor";

function StyleEditor() {
    PropertyEditor.call(this);

}
Object.defineProperties(StyleEditor.prototype, Object.getOwnPropertyDescriptors(PropertyEditor.prototype));
StyleEditor.prototype.constructor = StyleEditor;


StyleEditor.prototype.setProperty = function (name, value) {
    return this.object.setStyle(name, value);
};


StyleEditor.prototype.getProperty = function () {
    return this.object.getStyle.apply(this.object, arguments);
};


StyleEditor.prototype.getPropertyDescriptor = function (name) {
    return this.object.getStyleDescriptor.apply(this.object, arguments);
};




StyleEditor.prototype.getPropertyNames = function () {
    return this.object.getAcceptsStyleNames();
};



export default StyleEditor;