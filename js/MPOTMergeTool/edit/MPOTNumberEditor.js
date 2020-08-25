import MPOTBaseEditor from "./MPOTBaseEditor";
import Fcore from "../../core/FCore";
import {randomIdent} from "absol/src/String/stringGenerate";

var $ = Fcore.$;
var _ = Fcore._;
var $$ = Fcore.$$;

function MPOTNumberEditor() {
    MPOTBaseEditor.call(this);

}

Object.defineProperties(MPOTNumberEditor.prototype, Object.getOwnPropertyDescriptors(MPOTBaseEditor.prototype));
MPOTNumberEditor.prototype.constructor = MPOTNumberEditor;
MPOTNumberEditor.prototype.type = 'text';

MPOTNumberEditor.prototype._showInput = function () {
    var thisE = this;
    var data = this._data;
    this.$view.clearChild();
    var aOb = {
        class: 'mpot-text-input',
        style: {
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
        },
        on: {
            keydown: function (event) {
                if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
                    data.value = parseFloat(this.value);
                    if (isNaN(data.value)) data.value = null;
                    this.blur();
                    thisE.notifyChange();
                }
            },
            input: function (){
                data.value = parseFloat(this.value);
                if (isNaN(data.value)) data.value = null;
                thisE.notifyChange({ notFinish: true });
            }
        }
    }
    Object.assign(aOb, {
        tag: 'input',
        attr: {
            type: 'number'
        }
    });
    this.$input = _(aOb);
    this._assignInputList([this.$input]);
    this.$input.value = data.value || '';
    this.$input.placeholder = data.placeholder || '';
    this.$view.addChild(this.$input);
};

MPOTNumberEditor.prototype._showSingleChoice = function () {
    var thisE = this;
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
                            },
                            props: {
                                checked: item === data.value
                            },
                            on: {
                                change: function () {
                                    if (this.checked) {
                                        data.value = item;
                                        thisE.notifyChange();
                                    }
                                }
                            }
                        }
                    },
                    {
                        class: 'mpot-choice-value',
                        child: {
                            tag: 'span',
                            child: { text: item }
                        }
                    }
                ]
            };
        })
    });
    this._assignInputList($$('radiobutton', this.$choiceList));
    this.$view.clearChild().addChild(this.$choiceList);
};

MPOTNumberEditor.prototype._showMultiChoice = function () {
    var thisE = this;
    var data = this._data;
    this._choiceListChecked = (data.values || []).reduce(function (ac, cr) {
        ac[cr] = true;
        return ac;
    }, {});
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
                            props: {
                                checked: thisE._choiceListChecked[item]
                            },
                            on: {
                                change: function () {
                                    thisE._choiceListChecked[item] = this.checked;
                                    var dict = thisE._choiceListChecked;
                                    data.values = data.items.filter(function (u, i) {
                                        return dict[u];
                                    });
                                    thisE.notifyChange({ notFinish: true });
                                }
                            }
                        }
                    },
                    {
                        class: 'mpot-choice-value',
                        child: {
                            tag: 'span',
                            child: { text: item }
                        }
                    }
                ]
            }
        })

    });
    this._assignInputList($$('checkboxbutton', this.$choiceList));
    this.$view.clearChild().addChild(this.$choiceList);
};

MPOTNumberEditor.prototype.isCompleted = function () {
    var data = this._data;
    return !!((typeof data.value === 'number') || (data.values && data.values.length > 0))
};

MPOTNumberEditor.prototype.setData = function (data) {
    this._data = data;
    if (data.action === 'input') {
        this._showInput();
    }
    else if (data.action === 'single-choice') {
        this._showSingleChoice();
    }
    else if (data.action === 'multi-choice') {
        this._showMultiChoice();
    }
};

MPOTNumberEditor.prototype.getPreviewData = function () {
    var data = this._data;
    var pData = {
        type: this.type,
        name: data.name,
        value: data.value,
        id: data.id
    };
    var data = this._data;
    switch (data.action) {
        case 'input':
            break;
        case 'single-choice':
            break;
        case 'multi-choice':
            pData.values = data.values;
            break;
    }
    return pData;
};


export default MPOTNumberEditor;