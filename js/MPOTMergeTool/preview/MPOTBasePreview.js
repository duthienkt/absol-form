import '../../../css/mpotbasepreview.css';
import Fcore from "../../core/FCore";
import Context from "absol/src/AppPattern/Context";

var _ = Fcore._;
var $ = Fcore.$;

/****
 * @extends Context
 * @constructor
 */
function MPOTBasePreview() {
    Context.call(this);
    this._data = {};
    this.$view = null;
    this.createView();
}

Object.defineProperties(MPOTBasePreview.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
MPOTBasePreview.prototype.constructor = MPOTBasePreview;

MPOTBasePreview.prototype.type = 'base';

MPOTBasePreview.prototype.createView = function () {
    this.$view = _({
        class: 'mpot-base-preview',
        child: [
            {
                class: 'mpot-base-preview-name',
                child: { text: '' }
            },
            {
                class: 'mpot-base-preview-content'
            }
        ]
    });
    this.$name = $('.mpot-base-preview-name', this.$view);
    this.$content = $('.mpot-base-preview-content', this.$view);
};

MPOTBasePreview.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.createView();
    return this.$view;
};

MPOTBasePreview.prototype.setData = function (data) {
    this._data = data;
    this.$name.firstChild.data = data.name || '';
};


MPOTBasePreview.prototype.getData = function () {
    return this._data;
};

export default MPOTBasePreview;