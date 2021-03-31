import GrandContext from "absol/src/AppPattern/GrandContext";
import OOP from "absol/src/HTML5/OOP";
import noop from "absol/src/Code/noop";
import {randomIdent} from "absol/src/String/stringGenerate";
import FNode from "./FNode";
import FModel from "./FModel";

/***
 * @constructor
 * @augments GrandContext
 * @augments FNode
 * @augments FModel
 */
function FmFragment() {
    GrandContext.call(this);
    FNode.call(this);
    FModel.call(this);
    this.view = null;
    this._componentIdList = [];
    this.onCreate();
}

OOP.mixClass(FmFragment, GrandContext, FNode, FModel);

FmFragment.prototype.type = 'FRAGMENT';
FmFragment.prototype.tag = 'FmFragment';

FmFragment.prototype.menuIcon = 'span.mdi.mdi-terraform';

/***
 * call by Assembler
 * @param {BaseComponent} view
 */
FmFragment.prototype.setContentView = function (view) {
    this.view = view;
    this.view.fragment = this;
    this._bindView();
};

//reassign this property in constructor or onCreate to change default layout,
// this data will be use for assembler
FmFragment.prototype.contentViewData = {
    tag: 'LinearLayout'
};

FmFragment.prototype.onCreate = noop;

/**
 * call by assembly
 */
FmFragment.prototype.onCreated = noop;

/***
 *
 * @param {String} id
 */
FmFragment.prototype.findViewById = function (id) {
    return this[$ + id];
};

FmFragment.prototype._bindView = function () {
    while (this._componentIdList.length > 0) {
        delete this[$ + this._componentIdList.pop()];
    }
    if (!this.view) return;
    var thisFm = this;

    /***
     *
     * @param {BaseComponent} root
     */
    function visit(root) {
        if (root.fragment && root.fragment !== thisFm) return;//hold by other fragment
        var id = root.getAttribute('id');
        if (id) {
            thisFm['$' + id] = root;
            thisFm._componentIdList.push(id);
            root.children.forEach(visit);
        }
    }

    visit(this.view);
};


FmFragment.prototype._bindData = function () {

};

// data will bind to each element in layout
FmFragment.prototype.getData = function () {

};

FmFragment.prototype.setData = function (data) {

};


export default FmFragment;


/***
 *
 * @param {{tag: string ,contentViewData?:Object}} opt
 * @return {CustomFmFragment}
 */
export function makeFmFragmentClass(opt) {
    function CustomFmFragment() {
        FmFragment.apply(this, arguments);
    }

    OOP.mixClass(CustomFmFragment, FmFragment);
    CustomFmFragment.prototype.tag = opt.tag || 'CustomFmFragment_' + randomIdent(10);
    if (opt.contentViewData)
        CustomFmFragment.prototype.contentViewData = opt.contentViewData;

    return CustomFmFragment;
}