
import Fcore from "../core/FCore";
import '../../css/fonticonpicker.css';

import { wordsMatch } from "absol/src/String/stringMatching";
import { getMaterialDesignIconNames } from "../font/MaterialDesignIcons";
import { GOOGLE_MATERIAL_ICON_NAMES } from "../font/GoogleMaterialIcons";

var _ = Fcore._;
var $ = Fcore.$;


function FontIconPicker() {
    var self = this;
    this._fontIndex = 0;
    this._viewingFontIndex = -1;
    this.$searchInput = $('searchtextinput', this)
        .on('stoptyping', this.search.bind(this));
    this.$selectFont = $('.as-font-icon-picker-select-font', this)
        .on('change', this.updateContent.bind(this));
    this.$option = $('.as-font-icon-picker-option', this);
    this.$materialDesignContent = $('.as-font-icon-picker-content.as-font-icon-picker-material-design-icons', this);
    this.$googleMaterialContent = $('.as-font-icon-picker-content.as-font-icon-picker-google-material-icons', this);
    this.$mdiButtons = [];
    this.$googleMaterialIconButtons = [];
    this.on('click', this.eventHandler.clickContent);
    this.$activeButtons = {};
    this.$buttonList = {};
    getMaterialDesignIconNames().then(function (result) {
        var button;
        for (var i = 0; i < result.length; ++i) {
            button = _({
                tag: 'button',
                class: 'as-font-icon-picker-icon',
                child: 'span.mdi.mdi-' + result[i],
                attr: {
                    title: result[i]
                },
                props: {
                    __keywods__: result[i].split(/[\-\_\s]+/),
                    __data__: 'span.mdi.mdi-' + result[i]
                },
            }).addTo(self.$materialDesignContent);
            self.$mdiButtons.push(button);
            self.$buttonList[button.__data__] = button;
        }
    });

    GOOGLE_MATERIAL_ICON_NAMES.forEach(function (name) {
        var button = _({
            tag: 'button',
            class: 'as-font-icon-picker-icon',
            attr: {
                title: name
            },
            props: {
                __keywods__: name.split(/[\-\_\s]+/),
                __data__: '<i class="material-icons">' + name + '</i>'
            },
            child: {
                tag: 'i',
                class: 'material-icons',
                child: { text: name }
            },
        }).addTo(self.$googleMaterialContent);

        self.$googleMaterialIconButtons.push(button);
        self.$buttonList[button.__data__] = button;
    });

    this.updateContent();
    this.$noneBtn = $('button.none-icon', this);
    this.$noneBtn.__data__ = null;
    this.$noneBtn.on('click',this.eventHandler.clickContent);
}



FontIconPicker.render = function () {
    return _({
        extendEvent: 'clickicon',
        class: 'as-font-icon-picker',
        child: [
            'searchtextinput',
            {
                tag: 'selectmenu',
                class: 'as-font-icon-picker-select-font',
                props: {
                    items: [
                        {
                            text: 'Material Design Icons',
                            value: 0
                        },
                        {
                            text: 'Google Material Icons',
                            value: 1
                        }
                    ]
                },
                value: 0
            },
            {
                tag: 'button',
                class: ['as-font-icon-picker-icon', 'none-icon'],
                attr: {
                    title: 'None'
                },
                style: {
                    height: '2em',
                    verticalAlign: 'top'
                },
                child: {
                    tag: 'span',
                    style: {
                        fontSize: '1em'
                    },
                    child: { text: 'None' }
                }
            },
            {
                tag: 'bscroller',
                class: ['as-font-icon-picker-content', 'as-font-icon-picker-material-design-icons']
            },
            {
                tag: 'bscroller',
                class: ['as-font-icon-picker-content', 'as-font-icon-picker-google-material-icons']
            }
        ]
    });

};

FontIconPicker.eventHandler = {};
FontIconPicker.eventHandler.clickContent = function (event) {
    var target = event.target;
    while (target !== this && target) {
        if (target.containsClass('as-font-icon-picker-icon')) break;
        target = target.parentNode;
    }
    if (target && target.containsClass('as-font-icon-picker-icon')) {
        this.emit('clickicon', { type: 'clickicon', value: target.__data__, originEvent: event, target: this }, this);
    }
};

FontIconPicker.prototype.selectValues = function () {
    for (var name in this.$activeButtons) {
        this.$activeButtons[name].removeClass('as-font-icon-picker-selected');
    }
    this.$activeButtons = {};
    var button;
    for (var i = 0; i < arguments.length; ++i) {
        button = this.$buttonList[arguments[i]];
        if (button) {
            this.$activeButtons[arguments[i]] = button;
            button.addClass('as-font-icon-picker-selected');
        }
    }
};

FontIconPicker.prototype.updateContent = function () {
    this._fontIndex = this.$selectFont.value;
    if (this._fontIndex == 0) this.showMaterialDesignIcons();
    else if (this._fontIndex == 1) this.showGoogleMaterialIcons();
};

FontIconPicker.prototype.showMaterialDesignIcons = function () {
    this._fontIndex = 0;
    if (this._viewingFontIndex == 0) return;
    this._viewingFontIndex = 0;
    this.$materialDesignContent.removeStyle('display');
    this.$googleMaterialContent.addStyle('display', 'none');
    this.search();
};


FontIconPicker.prototype.showGoogleMaterialIcons = function () {
    this._fontIndex = 1;
    if (this._viewingFontIndex == 1) return;
    this._viewingFontIndex = 1;
    this.$materialDesignContent.addStyle('display', 'none');
    this.$googleMaterialContent.removeStyle('display');
    this.search();
};

FontIconPicker.prototype.search = function () {
    var keyword = this.$searchInput.value.trim().split(/[\-\_\s]+/).filter(function (w) {
        return !!w;
    });
    var viewList = this._fontIndex == 0 ? this.$mdiButtons : this.$googleMaterialIconButtons;
    var contentElt = this._fontIndex == 0 ? this.$materialDesignContent : this.$googleMaterialContent;
    if (keyword.length > 0) {
        var list = viewList.map(function (button) {
            return {
                elt: button,
                value: wordsMatch(keyword, button.__keywods__)
            }
        });
        list.sort(function (a, b) {
            return b.value - a.value;
        });

        var minValue = list[0].value;
        var maxValue = list[list.length - 1].value;
        var midValue = (minValue * 2 + maxValue) / 3;
        list = list.filter(function (item) {
            return item.value > midValue;
        });

        viewList = list.map(function (item) {
            return item.elt;
        });
    }
    contentElt.clearChild();
    viewList.forEach(function (elt) {
        elt.addTo(contentElt);
    });
};

Fcore.install('fonticonpicker', FontIconPicker);

export default FontIconPicker;