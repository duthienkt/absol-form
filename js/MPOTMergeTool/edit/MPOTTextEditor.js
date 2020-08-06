import MPOTBaseEditor from "./MPOTBaseEditor";
import Fcore from "../../core/FCore";
import {randomIdent} from "absol/src/String/stringGenerate";

var $ = Fcore.$;
var _ = Fcore._;

function MPOTTextEditor() {
    MPOTBaseEditor.call(this);

}

Object.defineProperties(MPOTTextEditor.prototype, Object.getOwnPropertyDescriptors(MPOTBaseEditor.prototype));
MPOTTextEditor.prototype.constructor = MPOTTextEditor;
MPOTTextEditor.prototype.type = 'text';


MPOTTextEditor.prototype._showInput = function () {
    var data = this._data;
    this.$view.clearChild();
    var aOb = {
        style: {
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
        },
        on: {
            keydown: function (event) {
                if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
                    this.blur();
                }
            }
        }
    };
    if (data.long) {
        Object.assign(aOb, {
            tag: 'textarea'

        });
    }
    else {
        Object.assign(aOb, {
            tag: 'input',
            attr: {
                type: 'text'
            }

        });
    }
    this.$input = _(aOb);
    this.$view.addChild(this.$input);
};

MPOTTextEditor.prototype._showSingleChoice = function () {
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
                            attr: {
                                name: groupName
                            }
                        }
                    },
                    {
                        class: 'mpot-choice-value',
                        child: {
                            tag: 'span',
                            child: { text: item.text }
                        }
                    }
                ]
            }
        })

    });
    this.$view.clearChild().addChild(this.$choiceList);
};

MPOTTextEditor.prototype._showMultiChoice = function () {
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
                            tag: 'checkboxbutton',
                            attr: {}
                        }
                    },
                    {
                        class: 'mpot-choice-value',
                        child: {
                            tag: 'span',
                            child: { text: item.text }
                        }
                    }
                ]
            }
        })

    });
    this.$view.clearChild().addChild(this.$choiceList);
};


MPOTTextEditor.prototype.setData = function (data) {
    this._data = data;
    if (data.action === 'input') {
        this._showInput();
    }
    else if (data.action === 'single-choice') {
        this._showSingleChoice();
    }
};


export default MPOTTextEditor;