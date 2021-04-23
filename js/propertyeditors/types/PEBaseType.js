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
    this.descriptor = this.editor.getPropertyDescriptor(this.editor.objects[0], this.pName);
    return this.descriptor;
};

PEBaseType.prototype.getValue = function () {
    return this.editor.getProperty(this.editor.objects[0], this.pName);
};

PEBaseType.prototype.setValue = function (value) {
    this.editor.setPropertyAll(this.pName, value);
};

PEBaseType.prototype.notifyChange = function (){
    this.editor.notifyChange(this.pName, this);
};

PEBaseType.prototype.notifyStopChange = function (){
    this.editor.notifyStopChange(this.pName);
};

export default PEBaseType;
