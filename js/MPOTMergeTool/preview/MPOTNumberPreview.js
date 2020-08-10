import MPOTBasePreview from "./MPOTBasePreview";
import Fcore from "../../core/FCore";


var _ = Fcore._;
var $ = Fcore.$;


/***
 * @extends {MPOTBasePreview}
 * @constructor
 */
function MPOTNumberPreview() {
    MPOTBasePreview.call(this);
    this._data = null;

}

Object.defineProperties(MPOTNumberPreview.prototype, Object.getOwnPropertyDescriptors(MPOTBasePreview.prototype))
MPOTNumberPreview.prototype.constructor = MPOTNumberPreview;
MPOTNumberPreview.prototype.type = 'number';

MPOTNumberPreview.prototype.createView = function () {
    MPOTBasePreview.prototype.createView.call(this);
    this.$text = _({
        tag: 'span',
        child:
            {
                text: ''
            }
    });
    this.$content.addChild(this.$text);
};


MPOTNumberPreview.prototype._viewData = function () {
    var data = this._data;
    if (data.values && data.values.length >= 0) {
        this.$text.firstChild.data = data.values.join(', ');
    }
    else {
        this.$text.firstChild.data =typeof data.value === 'number' ? data.value+'':'';
    }
};

MPOTNumberPreview.prototype.setData = function (data) {
    MPOTBasePreview.prototype.setData.call(this, data);
    this._viewData();
};


MPOTNumberPreview.prototype.getData = function () {
    return this._data;
};

export default MPOTNumberPreview;