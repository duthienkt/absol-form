import Fcore, {$} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import {inheritComponentClass} from "../core/BaseComponent";
import '../../css/imagefileinput.css';
import {openFileDialog} from "absol-acomp/js/utils";

var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function ImageFileInput() {
    ScalableComponent.call(this);
    this._imageSrc = undefined;
}

inheritComponentClass(ImageFileInput, ScalableComponent);

ImageFileInput.prototype.tag = "ImageFileInput";
ImageFileInput.prototype.menuIcon = "span.mdi.mdi-image-plus";

ImageFileInput.prototype._defaultBackgroundImg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiICB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgIDxwYXRoIGZpbGw9IiNhYWFhYWEiIGQ9Ik01LDNBMiwyIDAgMCwwIDMsNVYxOUEyLDIgMCAwLDAgNSwyMUgxNC4wOUMxNC4wMywyMC42NyAxNCwyMC4zNCAxNCwyMEMxNCwxOS4zMiAxNC4xMiwxOC42NCAxNC4zNSwxOEg1TDguNSwxMy41TDExLDE2LjVMMTQuNSwxMkwxNi43MywxNC45N0MxNy43LDE0LjM0IDE4Ljg0LDE0IDIwLDE0QzIwLjM0LDE0IDIwLjY3LDE0LjAzIDIxLDE0LjA5VjVDMjEsMy44OSAyMC4xLDMgMTksM0g1TTE5LDE2VjE5SDE2VjIxSDE5VjI0SDIxVjIxSDI0VjE5SDIxVjE2SDE5WiIgLz4KPC9zdmc+';

ImageFileInput.prototype.attributeHandlers.value = {
    set: function (value) {
        if (typeof value === 'string') {
            this._imageSrc = value;
        }
        else if ((value instanceof File) || (value instanceof Blob)) {
            this._imageSrc = URL.createObjectURL(value);
        }
        else if (value && value.url) {
            this._imageSrc = value.url;
        }
        else {
            this._imageSrc = undefined;
            value = null;
        }
        if (this._imageSrc) {
            this.$img.addStyle('backgroundImage', 'url(' + this._imageSrc + ')');
            this.domElt.addClass('as-has-file');
        }
        else {
            this.$img.addStyle('backgroundImage', 'url(' + this._defaultBackgroundImg + ')');
            this.domElt.removeClass('as-has-file');
        }
        return value;
    },
    descriptor: {
        type: "ImageSource",
        sign: 'ImageSource'
    },
    export: function () {
        return this._imageSrc;
    }
};

ImageFileInput.prototype.attributeHandlers.readonly = {
    set: function (value) {
        return !!value;
    },
    descriptor: {
        type: 'bool'
    },
    export: function () {
        return arguments[arguments.length - 1].get() || undefined;
    }
};

ImageFileInput.prototype.styleHandlers.previewSize = {
    set: function (value) {
        if (!['contain', 'cover'].includes(value)) value = 'contain';
        if (value === 'contain')
            this.$img.removeStyle('backgroundSize');
        else
            this.$img.addStyle('backgroundSize', value);
        return value;
    },
    export: function () {
        var value = arguments[arguments.length - 1];
        return value === 'contain' ? undefined : value;
    },
    descriptor: {
        type: 'enum',
        values: ['contain', 'cover']
    }
};

ImageFileInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.readonly = false;
    this.style.previewSize = 'contain';
    this.attributes.value = null;
};

ImageFileInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    this.domElt.on('click', this.openImageFileDialog.bind(this));

};

ImageFileInput.prototype.openImageFileDialog = function () {
    if (window.contentModule && window.contentModule.chooseFile) {
        window.contentModule.chooseFile({ type: "image_file" }).then(function (result) {
            if (result) {
                this.attributes.value = result;
            }
        }.bind(this));
    }
    else {
        openFileDialog({ accept: 'image/*' }).then(function (files) {
            if (files && files.length > 0) {
                this.attributes.value = files[0];
            }
        }.bind(this));
    }
}


ImageFileInput.prototype.render = function () {
    var res = _({
        class: 'asf-image-file-input',
        child: [
            {
                class: 'asf-image-file-input-img',
                style: {
                    backgroundImage: 'url(' + this._defaultBackgroundImg + ')'
                }
            }
        ]
    });
    this.$img = $('.asf-image-file-input-img', res);
    return res;
};


ImageFileInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value']);
};

ImageFileInput.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['previewSize']);
};

ImageFileInput.prototype.getDataBindingDescriptor = function () {
    var thisC = this;
    return {
        set: function (value) {
            thisC.setAttribute('value', value);
        },
        get: function () {
            return thisC.getAttribute('value');
        }
    }
};

export default ImageFileInput;