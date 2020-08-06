import '../../css/mpotpropertyeditor.css';
import Fcore from "../core/FCore";
import BaseEditor from "../core/BaseEditor";
import {randomIdent} from "absol/src/String/stringGenerate";
import FrameView from "absol-acomp/js/FrameView";
import MPOTTextEditor from "./edit/MPOTTextEditor";
import MPOTImageEditor from "./edit/MPOTImageEditor";
import MPOTNotSupportEditor from "./edit/MPOTNotSupportEditor";

var $ = Fcore.$;
var _ = Fcore._;

/***
 * @extends BaseEditor
 * @constructor
 */
function MPOTPropertyEditor() {
    BaseEditor.call(this);
    this._data = {};
    this._nodeConstructor = {
        text: MPOTTextEditor,
        image: MPOTImageEditor,
        '*': MPOTNotSupportEditor
    };


}

Object.defineProperties(MPOTPropertyEditor.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
MPOTPropertyEditor.prototype.constructor = MPOTPropertyEditor;


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
        if (property.type === 'group') {
            property.properties.reduce(visit, ac);
        }
        else {
            var name = property.name || property.key;
            var fName = property.fName || name;
            var key = property.key || property.name || randomIdent(10);
            var holder = {
                property: property,
                name: name,
                key: key,
                fName: fName
            };
            ac.push(holder);
        }

        return ac;
    }, []);

    this._headerHolderByKey = this._headerHolders.reduce(function (ac, cr) {
        ac[cr.key] = cr;
        return ac;
    }, {});

    this._tabItems = this._headerHolders.map(function (holder) {
        return {
            text: holder.fName,
            value: holder.key
        }
    });
    this.$tabbar.items = this._tabItems;
}

MPOTPropertyEditor.prototype._loadPropertyNodeKey = function () {
    this._nodeKey = this._data.properties.reduce(function visit(ac, property) {
        var key = property.key || property.name || randomIdent(10);
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
        var editorConstructor = thisE._nodeConstructor[prop.type];
        if (editorConstructor){
            it.editor = new editorConstructor();
            it.editor.attach(this);
            frameElt.addChild(it.editor.getView());
            it.editor.setData(prop);
        }
    });
    if (this._headerHolders.length > 0) {
        this._headerHolders[0].$frame.requestActive();
        this.$tabbar.value = this._headerHolders[0].key;
    }
};

MPOTPropertyEditor.prototype.setData = function (data) {
    this._data = data;
    this._loadPropertyNodeKey();
    this._loadHeader();
    this._loadPropertyTab();
};

MPOTPropertyEditor.prototype.ev_tabbarChange = function (event) {
    var key = this.$tabbar.value;
    var holder = this._headerHolderByKey[key];
    var frameElt = holder.$frame;
    frameElt.requestActive();
};


export default MPOTPropertyEditor;
