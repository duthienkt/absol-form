import ScalableComponent from "../core/ScalableComponent";
import OOP from "absol/src/HTML5/OOP";
import {_} from "../core/FCore";
import {AssemblerInstance} from "../core/Assembler";


/***
 * @extends ScalableComponent
 * @constructor
 */
function ArrayOfFragment() {
    ScalableComponent.call(this);
}

OOP.mixClass(ArrayOfFragment, ScalableComponent);

ArrayOfFragment.prototype.tag = "ArrayOfFragment";
ArrayOfFragment.prototype.menuIcon = "span.mdi.mdi-tray-full";

ArrayOfFragment.prototype.render = function () {
    return _({
        class: 'as-array-of-fragment'
    });
};

ArrayOfFragment.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat("itemFragmentClass");
};

// ArrayOfFragment.prototype.setAttributeItemFragmentClass = function (value) {
//     return value;
// };

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
        for (var i = 0; i < arguments.length; ++i) {
            //todo
        }
        return Array.prototype.push.apply(this, arguments);
    }


    var oUnShift = this._dataArr.unshift;
    this._dataArr.unshift = function () {
        var newItems = Array.prototype.slice.call(arguments);
        return oUnShift.apply(this._array, newItems);
    }


    this._dataArr.pop = function () {

        return Array.prototype.pop.apply(this, arguments);
    };


    this._dataArr.shift = function () {

        return Array.prototype.shift.apply(this, arguments);
    };

    this._dataArr.splice = function () {

        return Array.prototype.splice.apply(this, arguments);
    };
};

ArrayOfFragment.prototype.getDataBindingDescriptor = function () {
    var self = this;
    return {
        set: function (value) {
            value = value || [];
            if (!value.slice) value = [];
            self._clearAllFragment();
            for (var i = 0; i < value.length; ++i) {
                self._dataArr.push(value[i]);
            }
            //todo
        },
        get: function () {
            return self._dataArr;
        }
    }
};


export default ArrayOfFragment;

