import Fcore from "../core/FCore";
import Context from "absol/src/AppPattern/Context";
import Dom from "absol/src/HTML5/Dom";
import '../../css/fontformatpicker.css';
import { FONT_FACES } from "./GoogleFont";


var _ = Fcore._;
var $ = Fcore.$;

/**
 *  @typedef  {import('absol/src/AppPattern/Context').default} FontFormatPicker
 */

function FontFormatPicker() {
    Context.call(this);
    this.fontFamilyItems = FONT_FACES.map(function (fontFamily) {
        var fontName = fontFamily.match(/\'([^\']+)\'/)[1];
        return { text: fontName, value: fontFamily, extendStyle:{
            fontFamily: fontFamily
        } }
    }, {});

    this.styleItems = [
        {text:'Regular', value:'Regular'},
        {text:'Italic', value:'Italic'},
        {text:'Bold', value:'Bold'},
        {text:'Bold italic', value:'BoldItalic'},
    ];
    this.fontFamilies = this.fontFamilyItems.reduce(function (ac, cr) {
        ac[cr.text] = cr.value;
        return ac;
    }, {});
}


Object.defineProperties(FontFormatPicker.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
FontFormatPicker.prototype.constructor = Context;


FontFormatPicker.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        tag: 'onscreenwindow',
        class: 'as-form-format-picker',
        props: {
            windowTitle: 'Font',
            windowIcon: 'span.mdi.mdi-alpha-f-box-outline'
        },
        child: [
            {
                child: [
                    {
                        class: ['as-form-format-picker-input-box', 'as-form-format-picker-input-box-select-font'],
                        child: [
                            {
                                class: 'as-form-format-picker-input-box-name',
                                child: { text: 'Font' }
                            },
                            {
                                tag: 'selectmenu',
                                class: 'as-form-format-picker-select-font',
                                props: {
                                    items: this.fontFamilyItems
                                }
                            }

                        ]
                    },
                    {
                        class: ['as-form-format-picker-input-box', 'as-form-format-picker-input-box-select-style'],
                        child: [
                            {
                                class: 'as-form-format-picker-input-box-name',
                                child: { text: 'Style' }
                            },
                            {
                                tag: 'selectmenu',
                                class: 'as-form-format-picker-select-font',
                                props: {
                                    items: this.styleItems
                                }
                            }

                        ]
                    }
                ]
            }
        ]
    });


    return this.$view;
};

FontFormatPicker.prototype.onResume = function () {
    this.getView().addTo(document.body);
};

FontFormatPicker.prototype.onPause = function () {
    this.getView().remove();
};


// Dom.documentReady.then(function () {
//     /**
//      * @type {FontFormatPicker}
//      */
//     var test = new FontFormatPicker();

//     test.start();

// });

export default FontFormatPicker;