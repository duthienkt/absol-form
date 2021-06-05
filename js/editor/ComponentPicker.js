import RelativeLayout from "../layouts/RelativeLayout";
import DateInput from "../components/DateInput";
import TextInput from "../components/TextInput";
import TextArea from "../components/TextArea";
import NumberInput from "../components/NumberInput";
import ComboBox from "../components/ComboBox";
import Radio from "../components/Radio";
import CheckBox from "../components/Checkbox";
import Label from "../components/Label";
import Fcore from "../core/FCore";
import Context from "absol/src/AppPattern/Context";
import EventEmitter from "absol/src/HTML5/EventEmitter";

import '../../css/componentpicker.css';
import Draggable from "absol-acomp/js/Draggable";
import R from "../R";

import PluginManager from "../core/PluginManager";

import ComponentTreeList from "../components/ComponentTreeList";

var _ = Fcore._;
var $ = Fcore.$;


function ComponentPicker() {
    Context.call(this);
    EventEmitter.call(this);
    this.$view = null;
    /**
     * @type {import('./LayoutEditor').default}
     */
    this.layoutEditor = null;
}

Object.defineProperties(ComponentPicker.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(ComponentPicker.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
ComponentPicker.prototype.constructor = ComponentPicker;


ComponentPicker.prototype.bindWithEditor = function (editor) {
    this.layoutEditor = editor;
}

ComponentPicker.prototype.getView = function () {
    if (this.$view) return this.$view;
    if (this.$view) return this.$compExpTree;
    var self = this;

    function toggleGroup() {
        this.status = { open: 'close', close: 'open' }[this.status]
    }

    function makeExp(node) {
        if (typeof node === 'object') {
            return {
                tag: 'exptree',
                props: {
                    name: node.text,
                    status: 'close'
                },
                on: {
                    press: toggleGroup
                },
                child: node.children ? node.children.map(makeExp) : []
            };
        }
        else if (typeof node === 'function') {
            return {
                tag: 'exptree',
                props: {
                    name: node.prototype.tag,
                    icon: node.prototype.menuIcon,
                    componentConstructor: node

                }
            };
        }
        else {
            console.error('Invalid node ', node);
        }
    }


    this.$view = _({
        class: ['as-compopnent-picker', 'as-bscroller'],
        child: makeExp(ComponentTreeList)
    });

    this.$all = $('exptree', this.$view);
    this.$all.status = 'open';

    var context = { self: this, toggleGroup: toggleGroup, $view: this.$view };
    PluginManager.exec(this, R.PLUGINS.COMPONENT_PICKER_VIEW, context);

    //todo: find and call

    Draggable(this.$all).on('begindrag', self.ev_constructorBeginDrag.bind(self))
        .on('enddrag', self.ev_constructorEndDrag.bind(self))
        .on('drag', self.ev_constructorDrag.bind(self));

    return this.$view;
};

ComponentPicker.prototype._findComponentConstructor = function (elt) {
    while (elt) {
        if (elt.componentConstructor) return elt.componentConstructor;
        elt = elt.parentElement;
    }
    return null;
};


ComponentPicker.prototype.ev_constructorBeginDrag = function (event) {
    var constructor = this._findComponentConstructor(event.target);
    this._currentComponentConstructor = constructor;
    this.$modal = this.$modal || _('.as-compopnent-picker-forceground');
    this.$higne = this.$higne || _('.as-compopnent-picker-higne').addTo(this.$modal);
    this.$addBoxCtn = this.$addBoxCtn || _('.as-compopnent-picker-add-box-container').addTo(this.$higne);
    this.$addBox = this.$addBox || _({
        class: 'as-compopnent-picker-add-box',
        child: { class: 'as-compopnent-picker-add-box-plus', child: 'span.mdi.mdi-plus' }
    }).addTo(this.$addBoxCtn);
    if (this.$addBoxIcon) this.$addBoxIcon.remove();
    this.$addBoxIcon = _((constructor.prototype && constructor.prototype.menuIcon) || 'span.mdi.mdi-select-place').addTo(this.$addBox);
    this.$modal.addTo(document.body);
    if (this.layoutEditor.rootLayout) {
        this._dragRect = this.layoutEditor.rootLayout.domElt.getBoundingClientRect();
    }
    else {
        this._dragRect = undefined;
    }
};


ComponentPicker.prototype.ev_constructorEndDrag = function (event) {
    if (!this.$modal) return;//quick fix, must fix in Draggable
    this.$modal.remove();
    var constructor = this._currentComponentConstructor;
    var x = event.clientX;
    var y = event.clientY;
    var rect = this._dragRect;
    if (rect && rect.top <= y && rect.bottom >= y && rect.left <= x && rect.right >= x) {
        this.layoutEditor.addNewComponent(constructor, x - rect.left, y - rect.top);
    }
};

ComponentPicker.prototype.ev_constructorDrag = function (event) {
    this.$addBoxCtn.addStyle({
        left: event.clientX + 'px',
        top: event.clientY + 'px'
    });

    var x = event.clientX;
    var y = event.clientY;
    var rect = this._dragRect;
    if (rect && rect.top <= y && rect.bottom >= y && rect.left <= x && rect.right >= x) {
        this.$addBox.addClass('as-can-drop');
    }
    else {
        this.$addBox.removeClass('as-can-drop');
    }
};


export default ComponentPicker;