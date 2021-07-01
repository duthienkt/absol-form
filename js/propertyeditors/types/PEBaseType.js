import noop from "absol/src/Code/noop";


/***
 *
 * @param {MultiObjectPropertyEditor} editor
 * @param {string} pName
 * @param {Object} descriptor
 * @param {AElement} cellElt
 * @constructor
 */
function PEBaseType(editor, pName, descriptor, cellElt) {
    this.editor = editor;
    this.cellElt = cellElt;
    this.pName = pName;
    this.descriptor = descriptor;
    this.attachInput();
    this.reload();
}

PEBaseType.prototype.attachInput = noop;

PEBaseType.prototype.reload = noop;

PEBaseType.prototype.renewDescriptor = function () {
    this.descriptor = Object.assign({}, this.editor.getPropertyDescriptor(this.editor.objects[0], this.pName));
    //TODO: check permission
    var disabled = ['name', 'disembark',
            'value', 'values', 'list', 'treeList',
        'disabled', 'text', 'checked', 'textType'].indexOf(this.pName) >=0
        && this.editor.objects.some(function (obj) {
            return obj.attributes && obj.attributes.permissions && obj.attributes.permissions.edit_attributes === 'GENERATOR';
        });
    this.descriptor.disabled = this.descriptor.disabled || disabled;
    return this.descriptor;
};

PEBaseType.prototype.getValue = function () {
    return this.editor.getProperty.apply(this.editor, [this.editor.objects[0], this.pName].concat(Array.prototype.slice.call(arguments)));
};

PEBaseType.prototype.setValue = function (value) {
    this.editor.setPropertyAll.apply(this.editor, [this.pName, value].concat(Array.prototype.slice.call(arguments, 1)));
};

PEBaseType.prototype.notifyChange = function () {
    this.editor.notifyChange(this.pName, this);
};

PEBaseType.prototype.notifyStopChange = function () {
    this.editor.notifyStopChange(this.pName);
};

export default PEBaseType;
