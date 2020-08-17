import MPOTBaseEditor from "./MPOTBaseEditor";
import Fcore from "../../core/FCore";
import {createEditor, EditorConstructors} from "../TypeHandler";

var $ = Fcore.$;
var _ = Fcore._;
var $$ = Fcore.$$;

function MPOTGroupEditor() {
    MPOTBaseEditor.call(this);
    /***
     *
     * @type {MPOTBaseEditor[]}
     */
    this.children = [];
}

Object.defineProperties(MPOTGroupEditor.prototype, Object.getOwnPropertyDescriptors(MPOTBaseEditor.prototype));
MPOTGroupEditor.prototype.constructor = MPOTGroupEditor;
MPOTGroupEditor.prototype.type = 'group';


MPOTGroupEditor.prototype.setData = function (data) {
    this._data = data;
    var thisE = this;
    this.$view.clearChild();
    this.children = data.properties.map(function (prop) {
        var type = prop.type;
        var editor = createEditor(type);
        editor.on('change', thisE.ev_nodeChange.bind(thisE));
        editor.attach(thisE);
        editor.getView().addTo(thisE.$view);
        editor.setData(prop);
        var itemElt = _({
            class: 'mpot-group-editor-item',
            child: [
                {
                    class: 'mpot-group-editor-item-name',
                    child: {
                        text: prop.name
                    }
                },
                editor.getView().addClass('mpot-group-editor-item-editor')
            ]
        });
        thisE.$view.addChild(itemElt);
        return editor;
    });
};

MPOTGroupEditor.prototype.focus = function () {
    if (this.children.length > 0) {
        this.children[0].focus();
    }
}

MPOTGroupEditor.prototype.getPreviewData = function () {
    var data = this._data;
    var pData = {
        id: data.id,
        type: data.type,
        name: data.name
    };

    pData.properties = this.children.map(function (child) {
        return child.getData();
    });

    return pData;
};

MPOTGroupEditor.prototype.ev_nodeChange = function (event, sender) {
    if (sender === this.children[this.children.length - 1]) {
        this.emit('change', event, sender);
    }
    else {
        event.notFinish = true;
        this.emit('change', event, sender);
        var idx = this.children.indexOf(sender);
        this.children[idx + 1].focus();
    }
}

EditorConstructors.group = MPOTGroupEditor;

export default MPOTGroupEditor;