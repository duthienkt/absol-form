import MPOTBasePreview from "./MPOTBasePreview";
import Fcore from "../../core/FCore";

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends {MPOTBasePreview}
 * @constructor
 */
function MPOTGroupPreview() {
    MPOTBasePreview.call(this);
    this.properties  = [];
}

Object.defineProperties(MPOTGroupPreview.prototype, Object.getOwnPropertyDescriptors(MPOTBasePreview.prototype))
MPOTGroupPreview.prototype.constructor = MPOTGroupPreview;

MPOTGroupPreview.prototype.createView = function () {
    this.$view = _({
        class: 'mpot-group',
        child: [
            {
                class: 'mpot-preview-group-name',
                child: { text: '' }
            }
        ]
    });
    this.$name = $('.mpot-preview-group-name', this.$view);
};


export default MPOTGroupPreview;