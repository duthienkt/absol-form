import Fcore, {$} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import {inheritComponentClass} from "../core/BaseComponent";
import '../../css/imagefileinput.css';
import {openFileDialog} from "absol-acomp/js/utils";
import MessageInput, {prepareIcon} from "absol-acomp/js/MessageInput";
import ImageFileInput from "./ImageFileInput";

var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function FileInput() {
    ImageFileInput.call(this);
}

inheritComponentClass(FileInput, ImageFileInput);

FileInput.prototype.tag = "FileInput";
FileInput.prototype.menuIcon = "span.mdi.mdi-file-plus";

FileInput.prototype._defaultBackgroundImg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBz' +
    'dmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMu' +
    'b3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHhtbG5zPSJo' +
    'dHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cu' +
    'dzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgIHdpZHRoPSIyNCIgaGVpZ2h0' +
    'PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4NCiAgIDxwYXRoIGZpbGw9IiNhYWFhYWEi' +
    'IGQ9Ik0xMyw5SDE4LjVMMTMsMy41VjlNNiwySDE0TDIwLDhWMjBBMiwyIDAgMCwxIDE4' +
    'LDIySDZDNC44OSwyMiA0LDIxLjEgNCwyMFY0QzQsMi44OSA0Ljg5LDIgNiwyTTExLDE1' +
    'VjEySDlWMTVINlYxN0g5VjIwSDExVjE3SDE0VjE1SDExWiIgLz4NCjwvc3ZnPg==';

FileInput.prototype.attributeHandlers.value = {
    set: function (value) {
        prepareIcon();
        MessageInput.iconSupportAsync.then(function (result) {
            if (value) {
                var fileName;
                if (typeof value === 'string') {
                    fileName = value;
                }
                else if (typeof value === 'object') {
                    fileName = value.name || value.fileName || value.title || value.url;
                }
                var namePart = fileName.toLowerCase().split('.');
                var ext = 'default';
                var p;
                while (namePart.length > 0) {
                    p = namePart.pop();
                    if (result.indexOf(p) >= 0) {
                        ext = p;
                        break;
                    }
                }
                this._imageSrc = MessageInput.iconAssetRoot + '/' + ext + '.svg';
            }
            else {
                this._imageSrc = undefined;
            }
            if (this._imageSrc) {
                this.$img.addStyle('backgroundImage', 'url(' + this._imageSrc + ')');
                this.domElt.removeClass('as-has-file');
            }
            else {
                this.$img.addStyle('backgroundImage', 'url(' + this._defaultBackgroundImg + ')');
                this.domElt.removeClass('as-has-file');
            }

        }.bind(this));
        if (!value) value = null;
        return value;
    },
    descriptor: {
        type: "FileSource",
        sign: 'FileSource'
    },
    export: function () {
        return this.value || undefined;
    }
};


FileInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    this.domElt.on('click', this.openFileDialog.bind(this));

};

FileInput.prototype.openFileDialog = function () {
    if (window.contentModule && window.contentModule.chooseFile) {
        window.contentModule.chooseFile({}).then(function (result) {
            if (result) {
                this.attributes.value = result;
            }
        }.bind(this));
    }
    else {
        openFileDialog({}).then(function (files) {
            if (files && files.length > 0) {
                this.attributes.value = files[0];
            }
        }.bind(this));
    }
};


export default FileInput;