/***
 * @typedef MPOTTypeHandler
 * @property {string} type
 * @property {function} previewValue
 */
import MPOTTextHandler from "./handler/MPOTTextHandler";
import MPOTImageHandler from "./handler/MPOTImageHanler";
import MPOTNumberHandler from "./handler/MPOTNumberHanler";
import MPOTNotSupportHandler from "./handler/MPOTNotSupportHanler";
import Fcore from "../core/FCore";

var _ = Fcore._;
var $ = Fcore.$;


function MPOTHandlerMng() {
    this.handlers = {};
    this.install([
        MPOTTextHandler,
        MPOTImageHandler,
        MPOTNumberHandler,
        MPOTNotSupportHandler
    ]);
}

/***
 *
 * @param {MPOTProperty} prop
 */
MPOTHandlerMng.prototype.previewProperty = function (prop, $ctn) {
    var handler = this.handlers[prop.type] || this.handlers['*'];
    handler.preview.value(prop, $ctn, _, $, this);
};


MPOTHandlerMng.prototype.editProperty = function (prop, $ctn, completeCallback) {
    var handler = this.handlers[prop.type] || this.handlers['*'];
    var action = prop.action || 'input';
    console.log(handler, action)
    handler.edit && handler.edit[action] && handler.edit[action](prop, $ctn, _, $, this, completeCallback);
};

/***
 *
 * @param {Array<MPOTTypeHandler>|MPOTTypeHandler} handler
 */
MPOTHandlerMng.prototype.install = function (handler) {
    var _this = this;
    if (handler instanceof Array) {
        handler.forEach(function (it) {
            _this.install(it);
        });
    }
    else {
        this.handlers[handler.type] = handler;
    }
};


export default new MPOTHandlerMng();