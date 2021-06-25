import GrandContext from "absol/src/AppPattern/GrandContext";
import OOP from "absol/src/HTML5/OOP";
import noop from "absol/src/Code/noop";
import {randomIdent} from "absol/src/String/stringGenerate";
import FNode, {traversal} from "./FNode";
import FModel from "./FModel";
import {AssemblerInstance} from "./Assembler";
import {_} from "./FCore";
import DomSignal from "absol/src/HTML5/DomSignal";
import EventEmitter from "absol/src/HTML5/EventEmitter";


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
    this.emittor = new EventEmitter();
    this._componentNameList = [];

    this.embarkedProps = {};
    this._props = {};
    Object.defineProperty(this, 'props', {
        set: function (value) {
            Object.assign(this.props);
        },
        get: function () {
            return this._props;
        }
    });

    this.view = null;
    this.blocks = [];
    this.lines = [];
    this.entrys = [];
    this.domSignal = null;
    this.onCreate();
    this.buildContentView();
    this.onCreated();
    this.domSignal.on('request_fragment_auto_start', function () {
        if (!this.parent) this.start();
    }.bind(this));
    this.domSignal.emit('request_fragment_auto_start');
}

OOP.mixClass(FmFragment, GrandContext, FNode, FModel);

FmFragment.prototype.type = 'FRAGMENT';
FmFragment.prototype.tag = 'FmFragment';

FmFragment.prototype.menuIcon = 'span.mdi.mdi-terraform';

FmFragment.prototype.buildContentView = function () {
    var self = this;
    var contentViewData = this.contentViewData;
    var blocks;
    var layout;
    var lines;
    var i;
    var block;
    var line;
    var blockDict = {};
    if (contentViewData.tag) {
        layout = contentViewData;
    }
    else {
        layout = contentViewData.layout;
        blocks = contentViewData.circuit && contentViewData.circuit.blocks;
        lines = contentViewData.circuit && contentViewData.circuit.lines;
    }
    if (layout) {
        this.view = AssemblerInstance.buildComponent(layout, this);
        traversal(this.view, function (path) {
            blockDict[path.node.attributes.id] = path.node;
            blockDict[path.node.attributes.name] = path.node;
            if (path.node.fragment !== self){
                path.skipChildren();
            }
        })
    }
    else {
        throw new Error("Invalid Fragment class: layout must not be null!");
    }
    if (blocks) {
        for (i = 0; i < blocks.length; ++i) {
            block = AssemblerInstance.buildBlock(blocks[i], this);
            blockDict[block.attributes.id] = block;
            this.blocks.push(block);
            if (block.tag === 'CBEntry') {
                this.entrys.push(block);
            }
        }
    }
    if (lines) {
        for (i = 0; i < lines.length; ++i) {
            line = AssemblerInstance.buildLine(lines[i], blockDict);
            if (line) this.lines.push(line);
        }
    }
    if (!this.view.domElt.domSignal) {
        this.view.domElt.$domSignal = _('attachhook');
        this.view.domElt.appendChild(this.view.domElt.$domSignal);
        this.view.domElt.domSignal = new DomSignal(this.view.domElt.$domSignal);
    }
    this.domSignal = this.view.domElt.domSignal;
    this.blocks.forEach(function (block) {
        if (block.onAttached) block.onAttached();
    });
};

FmFragment.prototype.execEntry = function () {
    for (var i = 0; i < this.entrys.length; ++i) {
        this.entrys[i].exec();
    }
};


FmFragment.prototype.onAddChild = function (child, index) {
    if (this.state === "RUNNING")
        child.start();
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

FmFragment.prototype.start = function () {
    if (this.state.match(/DIE/)) {
        console.error(this, 'DIED!');
        return;
    }

    if (this.state.match(/RUNNING/)) return;

    if (this.state.match(/STOP|CREATE/)) {
        this.state = "STANDBY";
        //start entry before call onStart
        this.execEntry();
        this.onStart && this.onStart();
        this.children.forEach(function (fc) {
            fc.start();
        })
    }
    if (this.state.match(/STANDBY|PAUSE/)) {
        this.resume();
    }
}

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
        if (node.isFragmentView && !isRoot) {
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
            if (node.getAttribute('dataBinding'))
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
 * @return {Function}
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
