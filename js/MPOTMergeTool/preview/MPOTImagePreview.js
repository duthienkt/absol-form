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
MPOTImagePreview.prototype.type = 'image';

MPOTImagePreview.prototype.createView = function () {
    MPOTBasePreview.prototype.createView.call(this);
};

MPOTImagePreview.prototype._viewData = function () {
    var thisP = this;
    var data = this._data;
    if (data.values && data.values.length >= 0) {
        this.$imgs = data.values.map(function (it) {
            return _({
                tag: 'img',
                style: data.style||{},
                props: {
                    src: it
                }
            }).addTo(thisP.$content);
        });
    }
    else {
        this.$img = _({
            tag: 'img',
            style: data.style || {},
            props: {
                src: data.value
            }
        }).addTo(thisP.$content);
    }
}

MPOTImagePreview.prototype.setData = function (data) {
    MPOTBasePreview.prototype.setData.call(this, data);
    this.$content.clearChild();
    this._viewData();
};


MPOTImagePreview.prototype.getData = function () {
    return this._data;
};

export default MPOTImagePreview;