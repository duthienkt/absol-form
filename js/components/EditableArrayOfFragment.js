import ScalableComponent from "../core/ScalableComponent";
import OOP from "absol/src/HTML5/OOP";
import {$, _} from "../core/FCore";
import {AssemblerInstance} from "../core/Assembler";
import ArrayOfFragment from "./ArrayOfFragment";
import FlexiconButton from "absol-acomp/js/FlexiconButton";
import '../../css/editablearrayoffragment.css';
import inheritComponentClass from "../core/inheritComponentClass";


/***
 * @extends ArrayOfFragment
 * @constructor
 */
function EditableArrayOfFragment() {
    ArrayOfFragment.call(this);
    this.fragments = [];
    this._makeArray();
}

inheritComponentClass(EditableArrayOfFragment, ArrayOfFragment);

EditableArrayOfFragment.prototype.tag = "EditableArrayOfFragment";
EditableArrayOfFragment.prototype.menuIcon = "span.mdi.mdi-tray-full";

EditableArrayOfFragment.prototype.render = function () {
    return _({
        class: 'as-editable-array-of-fragment',
        child: [
            '.as-editable-array-of-fragment-item-list',
            {
                class: 'as-editable-array-of-fragment-bottom',
                child: [
                    {
                        tag: FlexiconButton.tag,
                        props: {
                            text: ('LanguageModule' in window) ? LanguageModule.text('txt_add') : 'Add'
                        }
                    }
                ]
            }
        ]
    });
};

EditableArrayOfFragment.prototype.onCreated = function () {
    this.$list = $('.as-editable-array-of-fragment-item-list', this.domElt);
    this.$addBtn = $('.as-editable-array-of-fragment-bottom .as-flexicon-button', this.domElt)
        .on('click', this.addNewRow.bind(this));
    ArrayOfFragment.prototype.onCreated.call(this);
};


EditableArrayOfFragment.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat("itemFragmentClass");
};


EditableArrayOfFragment.prototype.getAttributeItemFragmentClassDescriptor = function () {
    return {
        type: 'fragmentClass'
    };
};


EditableArrayOfFragment.prototype._makeArray = function () {
    if (this._dataArr) return;
    var self = this;
    this._dataArr = [];

    this._dataArr.push = function () {
        this.splice.apply(this, [this.length, this.length].concat(Array.prototype.slice.apply(arguments)));
        self.notifyChange();
        return arguments.length;
    }


    var oUnShift = this._dataArr.unshift;
    this._dataArr.unshift = function () {
        var newItems = Array.prototype.slice.call(arguments);
        self.notifyChange();
        return oUnShift.apply(this._array, newItems);
    }


    this._dataArr.pop = function () {
        if (this.length <= 0) return undefined;
        var res = this[this.length - 1];
        this.slice(this.length - 1, this.length);
        self.notifyChange();
        return res;
    };


    this._dataArr.shift = function () {
        if (this.length <= 0) return undefined;
        var res = this[0];
        this.slice(0, 1);
        self.notifyChange();
        return res;
    };

    this._dataArr.splice = function () {
        var start;
        var deleteCount;
        var addedItems;
        if (arguments.length < 1) start = 0;
        else start = arguments[0];
        if (start < 0) start = this.length - start;
        start = Math.max(0, start);
        if (arguments.length < 2)
            deleteCount = this.length - start;
        else
            deleteCount = arguments[1];
        if (deleteCount < 0) deleteCount = 0;
        deleteCount = Math.min(deleteCount, this.length - start);

        if (arguments.length > 2)
            addedItems = Array.prototype.slice.call(arguments, 2);
        else addedItems = [];

        var className = self.getAttribute('itemFragmentClass');
        var newFragments = addedItems.map(function (item) {
            var frag = AssemblerInstance.buildFragment({
                class: className
            });
            frag.props = item;
            return frag;
        });
        var endCtnElt = self.fragments[start + deleteCount] && self.fragments[start + deleteCount].domElt.parentElement;
        var removedFragments = self.fragments.splice.apply(self.fragments, [start, deleteCount].concat(newFragments));
        removedFragments.forEach(function (frg) {
            self.fragment.removeChild(frg);
            frg.domElt.parentElement.remove();
        });

        newFragments.forEach(function (frg) {
            self.fragment.addChild(frg);
            var itemCtn = _({
                class: 'as-editable-array-of-fragment-item',
                child: [
                    frg.domElt,
                    {
                        class: ['as-editable-array-of-fragment-remove-btn-ctn'],
                        child: {
                            tag: 'button',
                            class: 'as-from-tool-button',
                            child: 'span.mdi.mdi-delete',
                            on: {
                                click: function () {
                                    var eventData = {};
                                    eventData.type = 'cmd_remove_row';
                                    var idx = self._dataArr.indexOf(frg.props);
                                    eventData.rowIdx = idx;
                                    eventData.accepted = true;
                                    eventData.accept = function (isAccepted) {
                                        this.accepted = isAccepted;
                                    };
                                    self.emit(eventData.type, eventData, self);
                                    if (eventData.accepted && eventData.accepted.then) {
                                        eventData.accepted.then(function (isAccept) {
                                            if (isAccept) {
                                                if (idx >= 0) self._dataArr.splice(idx, 1);
                                            }
                                        });
                                    }
                                    else if (eventData.accepted) {
                                        if (idx >= 0) self._dataArr.splice(idx, 1);
                                    }
                                }
                            }
                        }
                    }
                ]
            });
            if (endCtnElt)
                self.$list.addChildBefore(itemCtn, endCtnElt);
            else self.$list.addChild(itemCtn);

        });
        var newBindItems = newFragments.map(function (frg) {
            return frg.props;
        });
        self.notifyChange();
        return Array.prototype.splice.apply(this, [start, deleteCount].concat(newBindItems));
    };
};

EditableArrayOfFragment.prototype.createDataBindingDescriptor = function () {
    var self = this;
    return {
        set: function (value) {
            value = value || [];
            if (!value.slice) value = [];
            self._dataArr.splice.apply(self._dataArr, [0, self._dataArr.length].concat(value));
        },
        get: function () {
            return self._dataArr;
        }
    }
};

EditableArrayOfFragment.prototype.addNewRow = function () {
    var eventData = {};
    eventData.type = 'cmd_insert_row';
    eventData.rowIdx = this._dataArr.length;
    eventData.result = {};
    eventData.resolve = function (result) {
        this.result = result;
    };
    var self = this;
    self.emit(eventData.type, eventData, self);
    if (eventData.result) {
        if (eventData.result.then) {
            eventData.result.then(function (result) {
                if (result) {
                    self._dataArr.push(result);
                }
            });
        }
        else {
            self._dataArr.push(eventData.result);
        }
    }
};

AssemblerInstance.addClass(EditableArrayOfFragment);

export default EditableArrayOfFragment;

