import Fcore from "../core/FCore";
import '../../css/hruler.css';
import Dom from "absol/src/HTML5/Dom";

var _ = Fcore._;
var $ = Fcore.$;


function HRuler() {
    var res = _({
        class: 'as-hruler'
    });

    res.$attachHook = _('attachhook').on('error', function () {
        this.updateSize = res.update.bind(res);
        Dom.addToResizeSystem(this);
        this.updateSize();
    }).addTo(res);

    res.$lines = [];
    res.$numbers = [];
    res._viewingNumberCount = 0;
    res._viewingLineCount = 0;
    res._spacing = 10;
    res._major = 10;
    res.$mesureTarget = null;
    return res;
}


HRuler.prototype.mesureElement = function (elt) {
    if (typeof elt == "string") elt = $(elt);
    this.$mesureTarget = elt;
};


HRuler.prototype.update = function () {
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

    var leftOfset = (mesureBound.left - contentBound.left) % this._spacing;
    if (leftOfset < 0) leftOfset += this._spacing;


    var lineIndexOfset = Math.round((contentBound.left - mesureBound.left + leftOfset) / this._spacing);

    var lineCount = Math.floor((contentBound.width - leftOfset) / this._spacing) + 1;

    while (this.$lines.length < lineCount) {
        this.$lines.push(_('.as-hruler-line'));
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
        lineElt.addStyle('left', leftOfset + this._spacing * i - 0.5 + 'px');
    }

    while (this._viewingLineCount < lineCount) {
        this.$lines[this._viewingLineCount++].addTo(this);
    }

    while (this._viewingLineCount > lineCount) {
        this.$lines[--this._viewingLineCount].remove();
    }

    var numberCount = Math.floor((lineCount + lineIndexOfset - 1) / this._major) - Math.ceil(lineIndexOfset / this._major) + 1;

    while (this.$numbers.length < numberCount) {
        this.$numbers.push(_('.as-hruler-major-number'));
    }
    var numberElt;
    var number;
    var majorLeftOfset = leftOfset;
    if (lineIndexOfset > 0) {
        majorLeftOfset += (this._major - lineIndexOfset % this._spacing) * this._spacing;
    }
    for (i = 0; i < numberCount; ++i) {
        number = (Math.ceil(lineIndexOfset / this._major) + i) * this._spacing * this._major;
        numberElt = this.$numbers[i];
        if (numberElt.__cacheNumber__ != number) {
            numberElt.__cacheNumber__ = number;
            numberElt.innerHTML = number + '';
        }
        numberElt.addStyle('left', majorLeftOfset + this._major * i * this._spacing - 0.7 * 2.5 * fontSize + 'px')
    }

    while (this._viewingNumberCount < numberCount) {
        this.$numbers[this._viewingNumberCount++].addTo(this);
    }

    while (this._viewingNumberCount > numberCount) {
        this.$numbers[--this._viewingNumberCount].remove();
    }
};




HRuler.property = {};
HRuler.property.major = {
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

HRuler.property.spacing = {
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


Fcore.install('hruler', HRuler);

export default HRuler;