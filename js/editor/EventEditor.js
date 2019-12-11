import PropertyEditor from "./PropertyEditor";

function EventEditor() {
    PropertyEditor.call(this);

}
Object.defineProperties(EventEditor.prototype, Object.getOwnPropertyDescriptors(PropertyEditor.prototype));
EventEditor.prototype.constructor = EventEditor;


EventEditor.prototype.setProperty = function (name, value) {
    return this.object.setEvent(name, value);
};


EventEditor.prototype.getProperty = function (name) {
    return this.object.getEvent(name);
};


EventEditor.prototype.getPropertyDescriptor = function (name) {
    return this.object.getEventDescriptor(name);
};


EventEditor.prototype.getPropertyNames = function () {
    return this.object.getAcceptsEventNames();
};



export default EventEditor;