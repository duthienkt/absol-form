import '../../../css/mpotbaseeditor.css';
import Fcore from "../../core/FCore";
import Context from "absol/src/AppPattern/Context";
import EventEmitter from "absol/src/HTML5/EventEmitter";

var _ = Fcore._;
var $ = Fcore.$;

/****
 * @extends Context
 * @constructor
 */
function MPOTBaseEditor() {
    Context.call(this);
    EventEmitter.call(this);
    this._data = null;
    this.$view = null;
    this.$inputList = [];
    this.createView();
}

Object.defineProperties(MPOTBaseEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(MPOTBaseEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
MPOTBaseEditor.prototype.constructor = MPOTBaseEditor;

MPOTBaseEditor.prototype.type = 'base';

MPOTBaseEditor.prototype.createView = function () {
    this.$view = _({
        class: 'mpot-base-editor'
    });
};

MPOTBaseEditor.prototype._assignInputList = function (eList) {
    var thisE = this;
    eList = eList || [];
    this.$inputList = eList;
    this.$inputList.forEach(function (elt, idx, arr) {
        elt.attr('tabindex', '1');
        elt.addClass('mpot-choice-input');
        if (!elt.tagName.toLowerCase().match(/input|texarea/)) {
            elt.on('keydown', function (event) {
                var focusElt;
                switch (event.key) {
                    case 'ArrowUp':
                        event.preventDefault();
                        focusElt = arr[idx - 1];
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        focusElt = arr[idx + 1];
                        break;
                    case ' ':
                        event.preventDefault();
                        this.click();
                        break;
                    case 'Enter':
                        thisE.notifyChange();
                        break;
                }
                if (focusElt) thisE._focusInput(focusElt);
            });
        }
    });
};

MPOTBaseEditor.prototype._focusInput = function (inputElt) {
    inputElt.focus();
    if (inputElt.tagName.toLowerCase().match(/input|textarea/)) inputElt.select();
};

MPOTBaseEditor.prototype._findFocusInput = function () {
    if (this.$inputList.length === 0) return null;
    var res;
    var input;
    for (var i = 0; i < this.$inputList.length && !res; ++i) {
        input = this.$inputList[i];
        if (input.checked) res = input;
    }
    return res || this.$inputList[0];
};

MPOTBaseEditor.prototype.focus = function () {
    var input = this._findFocusInput();
    if (input) this._focusInput(input);
};

MPOTBaseEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
};

MPOTBaseEditor.prototype.setData = function (data) {
    this._data = data;
}


MPOTBaseEditor.prototype.getData = function () {
    return this._data;
};

MPOTBaseEditor.prototype.notifyChange = function (extendData) {
    this.emit('change', Object.assign({}, extendData), this);
};

MPOTBaseEditor.prototype.getPreviewData = function () {
    return { type: this.type };
};

MPOTBaseEditor.prototype.isCompleted = function () {
    return true;
};

export default MPOTBaseEditor;
