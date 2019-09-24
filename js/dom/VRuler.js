import Fcore from "../core/FCore";
import '../../css/vruler.css';
import Dom from "absol/src/HTML5/Dom";

var _ = Fcore._;
var $ = Fcore.$;


function VRuler() {
    var res = _({
        class: 'as-vruler'
    });

    res.$attachHook = _('attachhook').on('error', function () {
        this.updateSize = res.update.bind(res);
        Dom.addToResizeSystem(this);
        this.updateSize();
    }).addTo(res);

    res.$lines = [];
    res.$numbers = [];
    this.$mesureTarget = undefined;
    res._viewingNumberCount = 0;
    res._viewingLineCount = 0;
    res._spacing = 10;
    res._major = 10;
    return res;
}


VRuler.prototype.mesureElement = function (elt) {
    if (typeof elt == "string") elt = $(elt);
    this.$mesureTarget = elt;
};


VRuler.prototype.update = function () {
    var fontSize = this.getFontSize();
    var mesureBound;
    var bound = this.getBoundingClientRect();
    var contentBound = {
        left: bound.left + 1,
        right: bound.right - 1,
        top: bound.top + 1,
        bottom: bound.bottom - 1,
        width: bound.width - 2,
        height: bound.height - 2
    };
    if (this.$mesureTarget) {
        mesureBound = this.$mesureTarget.getBoundingClientRect();
    }
    else {
        mesureBound = contentBound;
    }

    var topOfset = (mesureBound.top - contentBound.top) % this._spacing;
    if (topOfset < 0) topOfset += this._spacing;


    var lineIndexOfset = Math.round((contentBound.top - mesureBound.top + topOfset) / this._spacing);

    var lineCount = Math.floor((contentBound.height - topOfset) / this._spacing) + 1;

    while (this.$lines.length < lineCount) {
        this.$lines.push(_('.as-vruler-line'));
    }
    var i;
    var lineElt;
    for (i = 0; i < lineCount; ++i) {
        lineElt = this.$lines[i];
        if ((i + lineIndexOfset) % this._major == 0) {
            lineElt.addClass('major');
        }
        else {
            lineElt.removeClass('major');
        }
        lineElt.addStyle('top', topOfset + this._spacing * i - 0.5 + 'px');
    }

    while (this._viewingLineCount < lineCount) {
        this.$lines[this._viewingLineCount++].addTo(this);
    }

    while (this._viewingLineCount > lineCount) {
        this.$lines[--this._viewingLineCount].remove();
    }

    var numberCount = Math.floor((lineCount + lineIndexOfset - 1) / this._major) - Math.ceil(lineIndexOfset / this._major) + 1;

    while (this.$numbers.length < numberCount) {
        this.$numbers.push(_('.as-vruler-major-number'));
    }
    var numberElt;
    var number;
    var majorTopOfset = topOfset;
    if (lineIndexOfset > 0) {
        majorTopOfset += (this._major - lineIndexOfset % this._spacing) * this._spacing;
    }
    for (i = 0; i < numberCount; ++i) {
        number = (Math.ceil(lineIndexOfset / this._major) + i) * this._spacing * this._major;
        numberElt = this.$numbers[i];
        if (numberElt.__cacheNumber__ != number) {
            numberElt.__cacheNumber__ = number;
            numberElt.innerHTML = number + '';
        }
        numberElt.addStyle('top', majorTopOfset + this._major * i * this._spacing - 0.7 * 0.5 * fontSize + 'px')
    }

    while (this._viewingNumberCount < numberCount) {
        this.$numbers[this._viewingNumberCount++].addTo(this);
    }

    while (this._viewingNumberCount > numberCount) {
        this.$numbers[--this._viewingNumberCount].remove();
    }
};




VRuler.property = {};
VRuler.property.major = {
    set: function (value) {
        if (value > 0) {
            this._major = value;
            this.update();
        }
    },
    get: function () {
        return this._major;
    }
};

VRuler.property.spacing = {
    set: function (value) {
        if (value > 0) {
            this._spacing = value;
            this.update();
        }
    },
    get: function () {
        return this._spacing;
    }
};


Fcore.install('vruler', VRuler);

export default VRuler;