import '../../css/mpotpreview.css';
import Fcore from "../core/FCore";
import Fragment from "absol/src/AppPattern/Fragment";
import MPOTHanlerMng from "./MPOTHandlerMng";
import DomSignal from "absol/src/HTML5/DomSignal";
import MPOTImagePreview from "./preview/MPOTImagePreview";
import MPOTTextPreview from "./preview/MPOTTextPreview";
import MPOTGroupPreview from "./preview/MPOTGroupPreview";
import MPOTNotSupportPreview from "./preview/MPOTNotSupportPreview";

var _ = Fcore._;
var $ = Fcore.$;


/***
 * @typedef MPOTProperty
 * @property {String}type
 * @property {String} name
 * @property value
 */

/***
 * @extends {Fragment}
 * @constructor
 */
function MPOTPreview() {
    Fragment.call(this);
    this.domSignal = new DomSignal();
    this.domSignal.on('requestUpdateData', this._updateData.bind(this));
    this._data = {};
    this._nodeConstructors = {
        image: MPOTImagePreview,
        text: MPOTTextPreview,
        "*": MPOTNotSupportPreview
    };

    this.nodes = [];



}

Object.defineProperties(MPOTPreview.prototype, Object.getOwnPropertyDescriptors(Fragment.prototype));
MPOTPreview.prototype.constructor = MPOTPreview;

/***
 *
 * @param {MPOTProperty} prop
 * @private
 */
MPOTPreview.prototype.createProperty = function (prop) {
    var constructor = this._nodeConstructors[prop.type];
    var propertyPreview = null;
    if (constructor){
        var propertyPreview = new constructor();
        propertyPreview.setData(prop);
    }
    return propertyPreview;
};

MPOTPreview.prototype.createGroup = function (group) {
    var _this = this;
    var groupPreview = new MPOTGroupPreview();
    groupPreview.setData(group);
    var properties = [];
    if (group.properties) {
        properties = group.properties.map(function (prop) {
            var it = _this.createProperty(prop);
            groupPreview.getView().addChild(it.getView());
            return it;
        });
    }
    groupPreview.properties = properties;
    return groupPreview;
};

MPOTPreview.prototype.createView = function () {
    this.$view = _({
        class: 'mpot-preview',
        child: [
            {
                class: 'mpot-preview-header',
                child: [
                    {
                        class: 'mpot-preview-title',
                        child: { text: '' }
                    }
                ]
            },
            {
                class: 'mpot-preview-body'
            }

        ]
    });
    this.$titleText = $('.mpot-preview-title', this.$view).firstChild;
    this.$body = $('.mpot-preview-body', this.$view);
    this.requestUpdateData();
};

MPOTPreview.prototype._updatePropertyNameWidth = function () {

};

MPOTPreview.prototype._updateTitle = function () {
    this.$titleText.data = this._data.title || '';
};

MPOTPreview.prototype._updateBody = function () {
    var _this = this;
    var data = this._data;
    this.$body.clearChild();
    data.properties.forEach(function (prop) {
        if (prop.type === 'group') {
            var groupNode = _this.createGroup(prop);
            _this.$body.addChild(groupNode.getView());
        }
        else {
            var propNode = _this.createProperty(prop);
            _this.$body.addChild(propNode.getView());
        }
    });
};


MPOTPreview.prototype._updateData = function () {
    if (!this.$view) return;
    this._updateTitle();
    this._updatePropertyNameWidth();
    this._updateBody();
};

MPOTPreview.prototype.requestUpdateData = function () {
    this.domSignal.emit('requestUpdateData');
};


MPOTPreview.prototype.setData = function (data) {
    this._data = data;
    this.requestUpdateData();
};


export default MPOTPreview;