import MPOTBasePreview from "./MPOTBasePreview";
import Fcore from "../../core/FCore";

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends {MPOTBasePreview}
 * @constructor
 */
function MPOTNotSupportPreview() {
    MPOTBasePreview.call(this);
}

Object.defineProperties(MPOTNotSupportPreview.prototype, Object.getOwnPropertyDescriptors(MPOTBasePreview.prototype))
MPOTNotSupportPreview.prototype.constructor = MPOTNotSupportPreview;


MPOTNotSupportPreview.prototype.createView = function () {
    MPOTBasePreview.prototype.createView.call(this);
};

MPOTNotSupportPreview.prototype.setData = function (data) {
    MPOTBasePreview.prototype.setData.call(this, data);
    this.$content.addChild(_({
        tag: 'div',
        style: {
            color: 'red'
        },
        child: [
            {
                tag: 'span',
                child: { text: 'Not support ' }
            },
            {
                tag: 'strong',
                child: { text: data.type + '' }
            },
            {
                tag: 'span',
                child: { text: '!' }
            }
        ]
    }))
};


MPOTNotSupportPreview.prototype.getData = function () {
    return this._data;
};

export default MPOTNotSupportPreview;