import MPOTBasePreview from "./MPOTBasePreview";
import Fcore from "../../core/FCore";

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends {MPOTBasePreview}
 * @constructor
 */
function MPOTImagePreview() {
    MPOTBasePreview.call(this);
}

Object.defineProperties(MPOTImagePreview.prototype, Object.getOwnPropertyDescriptors(MPOTBasePreview.prototype))
MPOTImagePreview.prototype.constructor = MPOTImagePreview;


MPOTImagePreview.prototype.createView = function () {
    MPOTBasePreview.prototype.createView.call(this);
    this.$img = _('img');
    this.$content.addChild(this.$img);
};

MPOTImagePreview.prototype.setData = function (data) {
    MPOTBasePreview.prototype.setData.call(this, data);
    this.$img.src = data.src || '';
    this.$img.attr('style', '');
    this.$img.addStyle(data.style || {});
};


MPOTImagePreview.prototype.getData = function () {
    return this._data;
};

export default MPOTImagePreview;