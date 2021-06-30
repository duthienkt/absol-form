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
import CCBlock from "absol/src/AppPattern/circuit/CCBlock";
import inheritComponentClass from "./inheritComponentClass";
import {randomUniqueIdent} from "./utils";
import BaseBlock from "./BaseBlock";


/***
 * @constructor
 * @augments GrandContext
 * @augments FNode
 * @augments BaseBlock
 */
function FmFragment() {
    GrandContext.call(this);
    FNode.call(this);
    EventEmitter.call(this);
    FModel.call(this);
    CCBlock.call(this, { id: randomUniqueIdent() });
    this.emittor = this;
    this._componentNameList = [];

    this.boundProps = {};
    this._props = {};
    Object.defineProperty(this, 'props', {
        set: function (value) {
            Object.assign(this.props, value);
        },
        get: function () {
            return this._props;
        }
    });

    this.view = null;
    this.blocks = [];
    this.lines = [];
    this.entrys = [];
    this.propsGates = [];
    this.domSignal = null;
    this.onCreate();
    this.buildContentView();
    this.onCreated();
    this.domSignal.on('request_fragment_auto_start', function () {
        if (!this.parent) this.start();
        this.onReady();
        this.emit('ready', { target: this, type: 'ready' }, this);
    }.bind(this));
    this.domSignal.emit('request_fragment_auto_start');
}

inheritComponentClass(FmFragment, GrandContext, FNode, BaseBlock);

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
            if (path.node.fragment !== self) {
                path.skipChildren();
            }
        });
        this.view.pinHandlers = Object.assign({}, this.view.pinHandlers);
        this.view.pinHandlers.props = {
            receives: function (value) {
                self.props = value;
            },
            get: function () {
                return self.props;
            },
            descriptor: {
                type: 'object'
            }
        }
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
            if (block.tag === 'CBPropsGate') {
                this.propsGates.push(block);
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
    this.domSignal.on('fire_props_pin', this.pinFirePropsChange.bind(this));
    traversal(this.view, function (path) {
        path.node.onFragmentAttached();
        if (path.node.fragment !== self) {
            path.skipChildren();
        }
    });
    this.blocks.forEach(function (block) {
        if (block.onAttached) block.onAttached();
    });
    this.view.updateEmbark();
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

FmFragment.prototype.onReady = noop;


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

FmFragment.prototype.notifyPropsChange = function (info) {
    if (this.domSignal) {
        this._propsChangeInfo = this._propsChangeInfo || {};
        this._propsChangeInfo.names = this._propsChangeInfo.names || [];
        if (this._propsChangeInfo.names.indexOf(info.name) < 0)
            this._propsChangeInfo.names.push(info.name);
        this._propsChangeInfo.path = [];
        this.domSignal.emit('fire_props_pin', this._propsChangeInfo);
    }
};

FmFragment.prototype.pinFirePropsChange = function (info) {
    this._propsChangeInfo = info;
    var frag = this;
    var parent = frag.parent;
    this.propsGates.forEach(function (block) {
        block.pinFire('props');
        if (info)
            block.pinFire('props_change_info', info);
    });
    this.view.pinFire('props');
    if (!parent && frag.parent && frag.parent.attributes.dataBinding) {
        frag.parent.pinFirePropsChange(info && {
            names: info.names,
            path: [frag.view.attributes.name].concat(info.path)
        });
    }
    this._propsChangeInfo = null;
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
