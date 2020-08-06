import MPOTBaseEditor from "./MPOTBaseEditor";
import Fcore from "../../core/FCore";
import {randomIdent} from "absol/src/String/stringGenerate";
import MPOTTextEditor from "./MPOTTextEditor";

var $ = Fcore.$;
var _ = Fcore._;


function MPOTImageEditor() {
    MPOTBaseEditor.call(this);

}

Object.defineProperties(MPOTImageEditor.prototype, Object.getOwnPropertyDescriptors(MPOTBaseEditor.prototype));
MPOTImageEditor.prototype.constructor = MPOTImageEditor;
MPOTImageEditor.prototype.type = 'image';


MPOTImageEditor.prototype._showInput = function () {
    this.$view.clearChild();
    this.$previewImg = _({
        tag: 'img',
        style: {
            'max-width': '300px',
            'max-height': '300px',
            display: 'block'
        }
    });
    var previewImg = this.$previewImg;
    this.$input = _({
        tag: 'input',
        attr: {
            type: 'file',
            accept: "image/*"
        },
        style: {
            marginBottom: '1em'
        },
        on: {
            change: function (event) {
                if (this.files.length == 1) {
                    previewImg.src = URL.createObjectURL(this.files[0]);
                }
            }
        }
    });

    this.$view.addChild(this.$input);
    this.$view.addChild(this.$previewImg);
};

MPOTImageEditor.prototype._showSingleChoice = function () {
    var data = this._data;
    var groupName = randomIdent(10);
    this.$choiceList = _({
        class: 'mpot-choice-list',
        child: data.items.map(function (item, idx) {
            return {
                class: 'mpot-choice',
                child: [
                    {
                        class: 'mpot-choice-select-cell',
                        child: {
                            tag: 'radiobutton',
                            attr:{
                                name: groupName
                            }
                        }
                    },
                    {
                        class: 'mpot-choice-value',
                        child: {
                            tag: 'img',
                            props: { src: item.src }
                        }
                    }
                ]
            }
        })

    });
    this.$view.clearChild().addChild(this.$choiceList);
};

MPOTImageEditor.prototype._showMultiChoice = function () {
    var data = this._data;
    this.$choiceList = _({
        class: 'mpot-choice-list',
        child: data.items.map(function (item, idx) {
            return {
                class: 'mpot-choice',
                child: [
                    {
                        class: 'mpot-choice-select-cell',
                        child: {
                            tag: 'checkboxbutton'
                        }
                    },
                    {
                        class: 'mpot-choice-value',
                        child: {
                            tag: 'img',
                            props: { src: item.src }
                        }
                    }
                ]
            }
        })

    });
    this.$view.clearChild().addChild(this.$choiceList);
};



MPOTImageEditor.prototype.setData = function (data){
    this._data = data;
    if (data.action === 'input') {
        this._showInput();
    }
    else if (data.action === 'single-choice') {
        this._showSingleChoice();
    }
};


export default MPOTImageEditor;