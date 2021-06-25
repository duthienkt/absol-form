import Fcore from "../core/FCore";
import './FontIconPicker';
import EventEmitter from "absol/src/HTML5/EventEmitter";

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends AElement
 * @constructor
 */
function FontIconInput() {
    this.on('click', this.eventHandler.click);
}

FontIconInput.tag = 'FontIconInput'.toLowerCase();

FontIconInput.eventHandler = {};

FontIconInput.eventHandler.click = function (event) {
    this.togglePicker();
};

FontIconInput.eventHandler.clickIcon = function (event) {
    this.value = event.value;
    this.emit('change', {
        type: 'change',
        value: event.value,
        target: this,
        originEvent: event.originEvent || event
    }, this);
    this.closePicker();
};

FontIconInput.prototype.share = {
    $follower: null,
    $picker: null,
    $holder: null
};


FontIconInput.eventHandler.clickBody = function (event) {
    if (EventEmitter.hitElement(this, event) || EventEmitter.hitElement(this.share.$picker, event)) return;
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
    this.prepare();
    if (this.share.$holder) {
        this.share.$holder.closePicker();
    }
    this.share.$holder = this;
    this.addClass('as-font-icon-selecting');

    this.share.$picker.on('clickicon', this.eventHandler.clickIcon);
    this.share.$follower.addTo(document.body);
    this.share.$follower.followTarget = this;
    $(document.body).on('click', this.eventHandler.clickBody);
    this.share.$picker.selectValues(this.value);
};


FontIconInput.prototype.closePicker = function () {
    this.removeClass('as-font-icon-selecting');
    document.body.off('click', this.eventHandler.clickBody);
    this.share.$picker.off('clickicon', this.eventHandler.clickIcon);
    if (this.share.$holder === this) {
        this.share.$holder = null;
        this.share.$follower.remove();
    }
};

FontIconInput.prototype.prepare = function () {
    if (!this.share.$picker) {
        this.share.$follower = _('follower.as-font-icon-follower');
        this.share.$picker = _('fonticonpicker').addTo(this.share.$follower);
    }
};

FontIconInput.render = function () {
    return _({
        tag: 'button',
        extendEvent: 'change',
        class: 'as-font-icon-input'
    });
}

FontIconInput.property = {};
FontIconInput.property.value = {
    set: function (value) {
        this.clearChild();
        this._value = value;
        if (this._value) {
            this.addChild(_(value));
        }
        else {
            this.addChild(_('<span></span>'));
        }
    },
    get: function () {
        return this._value;
    }
};


Fcore.install(FontIconInput);

export default FontIconInput;