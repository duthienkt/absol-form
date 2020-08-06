import '../../../css/mpotbaseeditor.css';
import Fcore from "../../core/FCore";
import Context from "absol/src/AppPattern/Context";
import MPOTTextEditor from "./MPOTTextEditor";

var _ = Fcore._;
var $ = Fcore.$;

/****
 * @extends Context
 * @constructor
 */
function MPOTBaseEditor() {
    Context.call(this);
    this._data = null;
    this.$view = null;
    this.createView();
}

Object.defineProperties(MPOTBaseEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
MPOTBaseEditor.prototype.constructor = MPOTBaseEditor;

MPOTBaseEditor.prototype.type = 'base';

MPOTBaseEditor.prototype.createView = function () {
    this.$view = _({
        class: 'mpot-base-editor'
    });
};

MPOTBaseEditor.prototype.getView = function () {
    if (this.$view) return this.$view;

};

MPOTBaseEditor.prototype.setData = function (data){
    this._data  = data;
}


MPOTBaseEditor.prototype.getData = function () {
    return this._data;
};

export default MPOTBaseEditor;
