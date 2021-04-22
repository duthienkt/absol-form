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
    this._componentNameList = [];
    this._props = {};
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
    this.view.domElt.fragment = this;
    this._bindView();
    this._bindData();
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
FmFragment.prototype.findViewByName = function (id) {
    return this['$' + id];
};

FmFragment.prototype._bindView = function () {
    while (this._componentNameList.length > 0) {
        delete this['$' + this._componentNameList.pop()];
    }
    if (!this.view) return;
    var thisFm = this;

    /***
     *
     * @param {BaseComponent} root
     */
    function visit(root) {
        if (root.fragment && root.fragment !== thisFm) return;//hold by other fragment
        var id = root.getAttribute('name');
        if (id) {
            thisFm['$' + id] = root;
            thisFm._componentNameList.push(id);
            root.children.forEach(visit);
        }
    }

    visit(this.view);
};


FmFragment.prototype._bindData = function () {
    var props = {};
    this._props = props;

    function visit(node, isRoot) {
        if (node.fragment && !isRoot && node.getAttribute('dataBinding')) {
            Object.defineProperty(props, node.getAttribute('name'), {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    Object.assign(node.fragment.props, value);
                },
                get: function () {
                    return node.fragment.props
                }
            })
        }
        else {
            node.bindDataToObject(props);
            for (var i = 0; i < node.children.length; ++i) {
                visit(node.children[i]);
            }
        }
    }

    visit(this.view, true);
};


Object.defineProperty(FmFragment.prototype, 'domElt', {
    get: function () {
        return this.view && this.view.view;
    }
});
Object.defineProperty(FmFragment.prototype, 'props', {
    get: function () {
        return this._props;
    },
    set: function (props) {
        Object.assign(this._props, props)
    }
});

Object.defineProperty(FmFragment.prototype, 'parentFragment', {
    get: function () {
        var pE = this.domElt.parentElement;
        while (pE) {
            if (pE.fragment) return pE.fragment;
            pE = pE.parentElement
        }
        return null;
    }
});


export default FmFragment;


/***
 *
 * @param {{tag: string ,contentViewData?:Object, prototype?: Object}} opt
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
    if (opt.prototype) {
        Object.defineProperties(CustomFmFragment.prototype, Object.getOwnPropertyDescriptors(opt.prototype));
    }

    return CustomFmFragment;
}
