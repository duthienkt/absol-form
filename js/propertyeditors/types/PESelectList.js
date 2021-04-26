import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import R from "../../R";
import {randomIdent} from "absol/src/String/stringGenerate";
import SelectListEditor from "../../editor/SelectListEditor";
import {_} from "../../core/FCore";
import Toast from "absol-acomp/js/Toast";

/***
 * @extends PEBaseType
 * @constructor
 */
function PESelectList() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PESelectList, PEBaseType);

PESelectList.prototype.attachInput = function () {
    this.$input = _({
        tag: 'button',
        class: 'as-from-tool-button',
        child: 'span.mdi.mdi-table-edit',
        on: {
            click: this.openTabForEditing.bind(this)
        }
    });
    this.cellElt.addChild(this.$input);

};

PESelectList.prototype.openTabForEditing = function () {
    var self = this;
    var listData = this.getValue();
    /**
     * @type {FormEditor}
     */
    var formEditor = this.editor.getContext(R.FORM_EDITOR);
    if (!formEditor) return;
    this._objects = this.editor.objects.slice();
    var object = this._objects[this._objects.length - 1];
    object.__objectIdent__ = object.__objectIdent__ || 'layout_' + (Math.random() * 10000 >> 0);
    var selectListTabIdent = object.__objectIdent__ + '_selectList_' + name;
    var selectListEditor;
    var editorTabHolder = formEditor.getEditorHolderByIdent(selectListTabIdent);
    if (editorTabHolder)
        selectListEditor = editorTabHolder.editor;
    if (!selectListEditor) {
        selectListEditor = new SelectListEditor();
        selectListEditor.attach(self.editor);
        var tabName = self.editor.getProperty(object, 'name') + '(' + self.pName + ')';
        var desc = 'SelectList';
        formEditor.openEditorTab(selectListTabIdent, tabName, desc, selectListEditor, { layoutEditor: this })
    }
    else {
        editorTabHolder.tabframe.requestActive();
    }
    selectListEditor.setData(listData);
    selectListEditor.on('save', function () {
        listData = this.getData();
        self.setValue(listData);
    });
};


PESelectList.prototype._verifyObjectList = function () {
    var currentObjects = this.editor.objects;
    var res = this._objects.every(function (obj, i) {
        return obj === currentObjects[i];
    });
    if (!res) {
        var toast = Toast.make({
            props: {
                htitle: "Error",
                message: "Invalid object!"
            }
        });
        setTimeout(toast.disappear.bind(toast), 2000);
    }
    return res;
};


export default PESelectList;