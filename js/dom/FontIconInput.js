import Fcore from "../core/FCore";
import './FontIconPicker';
import Dom from "absol/src/HTML5/Dom";
import EventEmitter from "absol/src/HTML5/EventEmitter";
var _ = Fcore._;
var $ = Fcore.$;

function FontIconInput() {
    this.prepare();
    this.on('click', this.eventHandler.click);
}

FontIconInput.eventHandler = {};

FontIconInput.eventHandler.click = function (event) {
    this.togglePicker();
};

FontIconInput.eventHandler.clickIcon = function (event) {
    this.value = event.value;
    this.closePicker();

};

FontIconInput.eventHandler.clickBody = function (event) {
    if (EventEmitter.hitElement(this, event) || EventEmitter.hitElement(this.$fontIconPicker, event)) return;
    this.closePicker();
};

FontIconInput.prototype.togglePicker = function () {
    if (this.containsClass('as-font-icon-selecting')) {
        this.closePicker();
    }
    else {
        this.openPicker();
    }
};


FontIconInput.prototype.openPicker = function () {
    if (FontIconInput.lastOpen) {
        FontIconInput.lastOpen.closePicker();
    }
    FontIconInput.lastOpen = this;
    this.addClass('as-font-icon-selecting');
    this.$fontIconPicker.on('clickicon', this.eventHandler.clickIcon);
    this.$ctn.addTo(document.body);
    this.$follower.followTarget = this;
    $(document.body).on('click', this.eventHandler.clickBody);
    this.$fontIconPicker.selectValues(this.value);
};


FontIconInput.prototype.closePicker = function () {
    this.removeClass('as-font-icon-selecting');
    if (FontIconInput.lastOpen == this) {
        FontIconInput.lastOpen == null;
        this.$ctn.remove();
    }
    document.body.off('click', this.eventHandler.clickBody);
};

FontIconInput.prototype.prepare = function () {
    if (!FontIconInput.$fontIconPicker) {
        FontIconInput.$ctn = _('.absol-context-hinge-fixed-container');
        FontIconInput.$follower = _('follower').addTo(FontIconInput.$ctn);
        FontIconInput.$fontIconPicker = _('fonticonpicker').addTo(FontIconInput.$follower);
        FontIconInput.lastOpen = null;
    }

    this.$follower = FontIconInput.$follower;

    this.$fontIconPicker = FontIconInput.$fontIconPicker;
    this.$ctn = FontIconInput.$ctn;
};

FontIconInput.render = function () {
    return _({
        tag: 'button',
        extendEvent:'change',
        class: 'as-font-icon-input'
    });
}

FontIconInput.property = {};
FontIconInput.property.value = {
    set: function (value) {
        this.clearChild();
        this._value = value;
        if (this._value){
            this.addChild(_(value));
        }
    },
    get: function () {
        return this._value;
    }
};


Fcore.install('FontIconInput'.toLowerCase(), FontIconInput);

export default FontIconInput;


Dom.documentReady.then(function () {
    _('fonticoninput').addTo(document.body);
})