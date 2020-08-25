import '../../css/mpotpropertyeditor.css';
import Fcore from "../core/FCore";
import BaseEditor from "../core/BaseEditor";
import {randomIdent} from "absol/src/String/stringGenerate";
import FrameView from "absol-acomp/js/FrameView";
import MPOTTextEditor from "./edit/MPOTTextEditor";
import MPOTImageEditor from "./edit/MPOTImageEditor";
import MPOTNotSupportEditor from "./edit/MPOTNotSupportEditor";
import MPOTNumberEditor from "./edit/MPOTNumberEditor";
import {createEditor, EditorConstructors} from "./TypeHandler";
import MPOTGroupEditor from "./edit/MPOTGroupEditor";

var $ = Fcore.$;
var _ = Fcore._;

/***
 * @extends BaseEditor
 * @constructor
 */
function MPOTPropertyEditor() {
    BaseEditor.call(this);
    this.setContext('PROPERTY_EDITOR', this);
    this._data = {};
    this.ev_nodeChange = this.ev_nodeChange.bind(this);
}

Object.defineProperties(MPOTPropertyEditor.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
MPOTPropertyEditor.prototype.constructor = MPOTPropertyEditor;

MPOTPropertyEditor.prototype._nodeConstructor = EditorConstructors;

MPOTPropertyEditor.prototype.createView = function () {
    this.$view = _({
        class: 'mpot-property-editor',
        child: [
            {
                class: 'mpot-property-editor-header',
                child: [
                    {
                        tag: 'buttonrange',
                        style: {
                            width: 'auto'
                        }
                    }
                ]
            },
            {
                class: 'mpot-property-editor-body',
                child: [
                    {
                        tag: 'frameview'
                    }
                ]
            }
        ]
    });

    this.$tabbar = $('.mpot-property-editor-header buttonrange', this.$view)
        .on('change', this.ev_tabbarChange.bind(this));

    this.$body = $('.mpot-property-editor-body', this.$view);
    /***
     *
     * @type {FrameView}
     */
    this.$frameview = $('frameview', this.$body);
};

MPOTPropertyEditor.prototype._loadHeader = function () {
    this._headerHolders = this._data.properties.reduce(function visit(ac, property) {
        var name = property.name || property.id;
        var fName = property.fName || name;
        var display = property.action !== 'const';
        var holder = {
            property: property,
            name: name,
            id: property.id,
            fName: fName,
            display: display
        };
        ac.push(holder);
        return ac;
    }, []);

    this._headerHolderById = this._headerHolders.reduce(function (ac, cr) {
        ac[cr.id] = cr;
        return ac;
    }, {});

    this._tabItems = this._headerHolders.filter(function (holder) {
        return holder.display;
    }).map(function (holder) {
        return {
            text: holder.fName,
            value: holder.id
        }
    });
    this.$tabbar.items = this._tabItems;
}

MPOTPropertyEditor.prototype._loadPropertyNodeKey = function () {
    this._nodeKey = this._data.properties.reduce(function visit(ac, property) {
        var key = property.id || property.name || randomIdent(10);
        var holder = {
            property: property
        };
        ac[key] = holder;
        if (property.type === 'group') {
            property.properties.reduce(visit, ac);
        }
        return ac;
    }, {});
};

MPOTPropertyEditor.prototype._loadPropertyTab = function () {
    this.$frameview.clearChild();
    var thisE = this;
    this._headerHolders.forEach(function (it) {
        var prop = it.property;
        var frameElt = _('tabframe.mpot-property-editor-frame');
        thisE.$frameview.addChild(frameElt);
        it.$frame = frameElt;
        it.editor = createEditor(prop.type);
        it.editor.on('change', thisE.ev_nodeChange);
        it.editor.attach(thisE);
        frameElt.addChild(it.editor.getView());
        it.editor.setData(prop);
    });
    if (this._headerHolders.length > 0) {
        this._headerHolders[0].$frame.requestActive();
        this.$tabbar.value = this._headerHolders[0].id;
    }
};

MPOTPropertyEditor.prototype.selectTabById = function (id) {
    var thisE = this;
    var headerHolder = this._headerHolderById[id];
    if (headerHolder) {
        this.$tabbar.value = headerHolder.id;
        this.$tabbar.notifyChange();
    }
    else {
        this._headerHolders.forEach(function (holder) {
            if (holder.property.type === 'group') {
                var index = holder.property.properties.map(function (p) {
                    return p.id
                }).indexOf(id);
                if (index >= 0) {
                    thisE.$tabbar.value = holder.id;
                    thisE.$tabbar.notifyChange();
                    holder.editor.children[index].focus();
                }
            }
        });
    }
};


MPOTPropertyEditor.prototype.setData = function (data) {
    this._data = data;
    this._loadPropertyNodeKey();
    this._loadHeader();
    this._loadPropertyTab();
};

MPOTPropertyEditor.prototype.getPreviewData = function () {
    var thisE = this;
    var data = this._data;
    var pData = {};
    pData.title = data.title;
    pData.properties = data.properties.map(function visit(prop) {
        var id = prop.id;
        var holder = thisE._headerHolderById[id];
        return holder.editor.getPreviewData();
    });
    return pData;
};


MPOTPropertyEditor.prototype.ev_tabbarChange = function (event) {
    var key = this.$tabbar.value;
    var holder = this._headerHolderById[key];
    var frameElt = holder.$frame;
    frameElt.requestActive();
    holder.editor.focus()
};


MPOTPropertyEditor.prototype.ev_nodeChange = function (event, sender) {
    var pData = sender.getPreviewData()
    var holder = this._headerHolderById[pData.id];
    this.notifyNodeChange(Object.assign({}, event, { nodePreviewData: pData }));
    if (!event.notFinish)
        setTimeout(this.$tabbar.nextValue.bind(this.$tabbar, true), 300);
};


MPOTPropertyEditor.prototype.notifyNodeChange = function (extendData) {
    this.emit('nodechange', Object.assign({}, extendData, { type: 'nodechange' }), this);
};

MPOTPropertyEditor.prototype.getCompletedMask = function () {
    return this._headerHolders.map(function (holder) {
        return holder.editor.isCompleted();
    });
};

MPOTPropertyEditor.prototype.isCompleted = function () {
    return this.getCompletedMask().reduce(function (ac, cr) {
        return ac && cr;
    }, true);
};

export default MPOTPropertyEditor;
