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
    return res;
}


HRuler.prototype.update = function () {
    var fontSize = this.getFontSize();
    var bound = this.getBoundingClientRect();
    var lineCount = Math.floor((bound.width - 2) / this._spacing) + 1;//2 is border-size
    while (this.$lines.length < lineCount) {
        this.$lines.push(_('.as-hruler-line'));
    }
    var i;
    var lineElt;
    for (i = 0; i < lineCount; ++i) {
        lineElt = this.$lines[i];
        if (i % this._major == 0) {
            lineElt.addClass('major');
        }
        else {
            lineElt.removeClass('major');
        }
        lineElt.addStyle('left', this._spacing * i - 0.5 + 'px');
    }

    while (this._viewingLineCount < lineCount) {
        this.$lines[this._viewingLineCount++].addTo(this);
    }

    while (this._viewingLineCount > lineCount) {
        this.$lines[--this._viewingLineCount].remove();
    }

    var numberCount = Math.floor(lineCount / this.major);
    while (this.$numbers.length < numberCount) {
        this.$numbers.push(_('.as-hruler-major-number'));
    }
    var numberElt;
    var number;
    for (i = 0; i < numberCount; ++i) {
        number = i * this._spacing * this._major;
        numberElt = this.$numbers[i];
        if (numberElt.__cacheNumber__ != number) {
            numberElt.__cacheNumber__ = number;
            numberElt.innerHTML = number + '';
        }
        numberElt.addStyle('left', this._major * this._spacing * i - 0.7 * 2.5 * fontSize + 'px')
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