import MPOTBasePreview from "./MPOTBasePreview";
import Fcore from "../../core/FCore";


var _ = Fcore._;
var $ = Fcore.$;


/***
 * @extends {MPOTBasePreview}
 * @constructor
 */
function MPOTTextPreview() {
    MPOTBasePreview.call(this);
    this._data = null;

}

Object.defineProperties(MPOTTextPreview.prototype, Object.getOwnPropertyDescriptors(MPOTBasePreview.prototype))
MPOTTextPreview.prototype.constructor = MPOTTextPreview;
MPOTTextPreview.prototype.type = 'text';

MPOTTextPreview.prototype.createView = function () {
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


MPOTTextPreview.prototype._viewData = function () {
    var data = this._data;
    if (data.values && data.values.length >= 0) {
        this.$text.firstChild.data = data.values.join(', ');
    }
    else {
        this.$text.firstChild.data = data.value || '';
    }
};

MPOTTextPreview.prototype.setData = function (data) {
    MPOTBasePreview.prototype.setData.call(this, data);
    this._viewData();
};


MPOTTextPreview.prototype.getData = function () {
    return this._data;
};

export default MPOTTextPreview;