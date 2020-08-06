import MPOTBaseEditor from "./MPOTBaseEditor";
import Fcore from "../../core/FCore";
import {randomIdent} from "absol/src/String/stringGenerate";

var $ = Fcore.$;
var _ = Fcore._;

function MPOTNotSupportEditor() {
    MPOTBaseEditor.call(this);

}

Object.defineProperties(MPOTNotSupportEditor.prototype, Object.getOwnPropertyDescriptors(MPOTBaseEditor.prototype));
MPOTNotSupportEditor.prototype.constructor = MPOTNotSupportEditor;
MPOTNotSupportEditor.prototype.type = 'text';


MPOTNotSupportEditor.prototype.setData = function (data) {
    this._data = data;
    this.$view.clearChild();
    this.$view.addChild(_({
        tag: 'div',
        style: {
            color: 'red'
        },
        child: [
            {
                tag: 'span',
                child: { text: 'Not support ' }
            },
            {
                tag: 'strong',
                child: { text: data.type + '' }
            },
            {
                tag: 'span',
                child: { text: '!' }
            }
        ]
    }));

};


export default MPOTNotSupportEditor;