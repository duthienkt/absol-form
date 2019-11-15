import Context from "absol/src/AppPattern/Context";
import EventEmitter from "absol/src/HTML5/EventEmitter";
import Fcore from "../core/FCore";
import Dom from "absol/src/HTML5/Dom";
import '../../css/layoutsizeeditor.css';
import { contenteditableTextOnly, preventNotNumberInput } from "absol-acomp/js/utils";

var _ = Fcore._;
var $ = Fcore.$;

function LayoutSizeEditor() {
    Context.call(this);
    EventEmitter.call(this)
}

Object.defineProperties(LayoutSizeEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(LayoutSizeEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
LayoutSizeEditor.prototype.constructor = LayoutSizeEditor;


LayoutSizeEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        class: 'as-layout-size-editor',
        tag: 'sizebox',
        props: {
            boxTitle: 'Position'
        },
        child: { tag: 'sizebox', props: { boxTitle: 'marrgin' } }
    });
    ;

    return this.$view;
};


export function SizeBox() {
    this.$left = _({
        tag: 'spaninput',
        elt: $('.as-size-box-editor-position-left>span.absol-span-input', this),
        props: {
            type: 'number'
        }
    });

    this.$right = _({
        tag: 'spaninput',
        elt: $('.as-size-box-editor-position-right>span.absol-span-input', this),
        props: {
            type: 'number'
        }
    });
    this.$top = _({
        tag: 'spaninput',
        elt: $('.as-size-box-editor-position-top span.absol-span-input', this),
        props: {
            type: 'number'
        }
    });
    this.$bottom = _({
        tag: 'spaninput',
        elt: $('.as-size-box-editor-position-bottom span.absol-span-input', this),
        props: {
            type: 'number'
        }
    });

    this.$center = $('.as-size-box-editor-position-center', this);
    this.$title = $('.as-size-box-editor-title', this);


}

SizeBox.prototype.addChild = function (elt) {
    this.$center.addChild(elt);
    return this;
};

SizeBox.property = {};
SizeBox.property.boxTitle = {
    set: function (value) {
        this.$title.innerHTML = value + '';
    },
    get: function () {
        return this.$title.innerHTML;
    }
};


SizeBox.render = function () {
    return _(
        '<div class="as-size-box-editor">\
            <div class="as-size-box-editor-position-top">\
                <div><div class="as-size-box-editor-title">Title text</div></div>\
                <div><span  class="absol-span-input" contenteditable="true"></span></div>\
                <div></div>\
            </div>\
            <div class="as-size-box-editor-position-mid">\
                <div class="as-size-box-editor-position-left">\
                    <span class="absol-span-input" contenteditable="true"></span>\
                </div>\
                <div class="as-size-box-editor-position-center">\
                </div>\
                <div class="as-size-box-editor-position-right">\
                     <span class="absol-span-input" contenteditable="true"></span>\
                </div>\
            </div>\
            <div class="as-size-box-editor-position-bottom">\
                <div></div>\
                <div><span class="absol-span-input" contenteditable="true"></span></div>\
                <div></div>\
            </div>\
        </div>');
};




Fcore.install('sizebox', SizeBox);

export default LayoutSizeEditor;
