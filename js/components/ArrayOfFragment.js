import ScalableComponent from "../core/ScalableComponent";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../core/FCore";
import {AssemblerInstance} from "../core/Assembler";
import {inheritComponentClass} from "../core/BaseComponent";
import "../../css/arrayoffragment.css";


/***
 * @extends ScalableComponent
 * @constructor
 */
function ArrayOfFragment() {
    ScalableComponent.call(this);
    this.fragments = [];
    this._makeArray();
}

inheritComponentClass(ArrayOfFragment, ScalableComponent);

ArrayOfFragment.prototype.tag = "ArrayOfFragment";
ArrayOfFragment.prototype.menuIcon = "span.mdi.mdi-tray-full";

ArrayOfFragment.prototype.styleHandlers.itemSpacing = {
    set: function (value) {
        this.domElt.addStyle('--as-aof-item-spacing', value + 'px');
        return value;
    },
    descriptor: {
        type: 'measureSize',
        units: ['px']
    },
    export: function () {
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        if (value === 10) return undefined;
        return value;
    }
};


ArrayOfFragment.prototype.render = function () {
    return _({
        class: 'as-array-of-fragment'
    });
};

ArrayOfFragment.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.style.itemSpacing = 0;
}

ArrayOfFragment.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat("itemFragmentClass");
};

ArrayOfFragment.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat("itemSpacing");
};


ArrayOfFragment.prototype.getAttributeItemFragmentClassDescriptor = function () {
    return {
        type: 'fragmentClass'
    };
};


ArrayOfFragment.prototype._clearAllFragment = function () {
    this.domElt.clearChild();
};


ArrayOfFragment.prototype._makeArray = function () {
    if (this._dataArr) return;
    var self = this;
    this._dataArr = [];

    this._dataArr.push = function () {
        this.splice.apply(this, [this.length, this.length].concat(Array.prototype.slice.apply(arguments)));
        return arguments.length;
    }


    var oUnShift = this._dataArr.unshift;
    this._dataArr.unshift = function () {
        var newItems = Array.prototype.slice.call(arguments);
        return oUnShift.apply(this._array, newItems);
    }


    this._dataArr.pop = function () {
        if (this.length <= 0) return undefined;
        var res = this[this.length - 1];
        this.slice(this.length - 1, this.length);
        return res;
    };


    this._dataArr.shift = function () {
        if (this.length <= 0) return undefined;
        var res = this[0];
        this.slice(0, 1);
        return res;
    };

    this._dataArr.splice = function () {
        var start;
        var end;
        var addedItems;
        if (arguments.length < 1) start = 0;
        else start = arguments[0];
        if (arguments.length < 2)
            end = this.length;
        else end = arguments[1];
        if (start < 0) start = this.length - start;
        if (end < 0) end = this.length - end;
        start = Math.max(0, start);
        end = Math.max(start, end);
        if (arguments.length > 2)
            addedItems = Array.prototype.slice.call(arguments, 2);
        else addedItems = [];

        var className = self.getAttribute('itemFragmentClass');
        var newFragments = addedItems.map(function (item) {
            var frag = AssemblerInstance.buildFragment({
                class: className
            });
            frag.props = item;
            frag.attach(self);
            return frag;
        });
        var endElt = self.fragments[end] && self.fragments[end].domElt;
        var removedFragments = self.fragments.splice.apply(self.fragments, [start, end].concat(newFragments));
        removedFragments.forEach(function (frg) {
            frg.domElt.remove();
        });

        newFragments.forEach(function (frg) {
            if (endElt)
                self.domElt.addChildBefore(frg.domElt, endElt);
            else self.domElt.addChild(frg.domElt);
        });
        var newBindItems = newFragments.map(function (frg) {
            return frg.props;
        });
        return Array.prototype.splice.apply(this, [start, end].concat(newBindItems));
    };
};

ArrayOfFragment.prototype.getDataBindingDescriptor = function () {
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


export default ArrayOfFragment;

