import MultiObjectPropertyEditor from "../propertyeditors/MultiObjectPropertyEditor";
import IndexedPropertyNames from "../core/IndexedPropertyNames";

function AllPropertyEditor() {
    MultiObjectPropertyEditor.call(this);
}

Object.defineProperties(AllPropertyEditor.prototype, Object.getOwnPropertyDescriptors(MultiObjectPropertyEditor.prototype));
AllPropertyEditor.prototype.constructor = AllPropertyEditor;


AllPropertyEditor.prototype.setProperty = function (object, name, value) {
    if (object.__AllPropertyEditorGroupName__.attributes[name])
        return object.setAttribute(object.__AllPropertyEditorGroupName__.attributes[name], value);
    if (object.__AllPropertyEditorGroupName__.style[name])
        return object.setStyle(object.__AllPropertyEditorGroupName__.style[name], value);
    throw new Error('not found ' + name);

};


AllPropertyEditor.prototype.getProperty = function (object, name) {
    if (object.__AllPropertyEditorGroupName__.attributes[name])
        return object.getAttribute(object.__AllPropertyEditorGroupName__.attributes[name]);
    if (object.__AllPropertyEditorGroupName__.style[name])
        return object.getStyle.apply(object, [object.__AllPropertyEditorGroupName__.style[name]].concat(Array.prototype.slice.call(arguments, 1)));
    throw new Error('not found ' + name);
};


AllPropertyEditor.prototype.getPropertyDescriptor = function (object, name) {
    if (object.__AllPropertyEditorGroupName__.attributes[name])
        return object.getAttributeDescriptor(object.__AllPropertyEditorGroupName__.attributes[name]);
    if (object.__AllPropertyEditorGroupName__.style[name])
        return object.getStyleDescriptor(object.__AllPropertyEditorGroupName__.style[name]);
    throw new Error('not found ' + name);
};




AllPropertyEditor.prototype.getPropertyNames = function (object) {
    var indexed = IndexedPropertyNames;
    return (Object.keys(object.__AllPropertyEditorGroupName__.attributes).concat(Object.keys(object.__AllPropertyEditorGroupName__.style))).sort(function (a, b){
        return indexed[a] - indexed[b];
    });
};



AllPropertyEditor.prototype.edit = function () {
    if (this.objects)
        this.objects.forEach(function (object) {
            delete object.__AllPropertyEditorGroupName__;
        });
    Array.prototype.forEach.call(arguments, function (object) {
        object.__AllPropertyEditorGroupName__ = {};
        var attributes = object.getAcceptsAttributeNames();
        var style = object.getAcceptsStyleNames();

        object.__AllPropertyEditorGroupName__.attributes = attributes.reduce(function (ac, cr) {
            ac[cr] = cr;
            return ac;
        }, {});
        object.__AllPropertyEditorGroupName__.style = style.reduce(function (ac, cr) {
            ac[cr] = cr;
            return ac;
        }, {});

        var key;
        for (key in object.__AllPropertyEditorGroupName__.attributes) {
            if (object.__AllPropertyEditorGroupName__.style[key]) {
                delete object.__AllPropertyEditorGroupName__.attributes[key];
                delete object.__AllPropertyEditorGroupName__.style[key];
                object.__AllPropertyEditorGroupName__.attributes[key + '(attribute)'] = key;
                object.__AllPropertyEditorGroupName__.style[key + '(style)'] = key;
            }
        }
    });
    return MultiObjectPropertyEditor.prototype.edit.apply(this, arguments);
}

export default AllPropertyEditor;