import MPOTBaseEditor from "./MPOTBaseEditor";
import Fcore from "../../core/FCore";
import {randomIdent} from "absol/src/String/stringGenerate";

var $ = Fcore.$;
var _ = Fcore._;
var $$ = Fcore.$$;

function MPOTTextEditor() {
    MPOTBaseEditor.call(this);

}

Object.defineProperties(MPOTTextEditor.prototype, Object.getOwnPropertyDescriptors(MPOTBaseEditor.prototype));
MPOTTextEditor.prototype.constructor = MPOTTextEditor;
MPOTTextEditor.prototype.type = 'text';

MPOTTextEditor.prototype._showInput = function () {
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
                    data.value = this.value;
                    this.blur();
                    thisE.notifyChange();
                }
            },
            input: function () {
                data.value = this.value;
                thisE.notifyChange({ notFinish: true });
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
    this._assignInputList([this.$input]);

    this.$input.value = data.value || '';
    this.$input.placeholder = data.placeholder || '';
    this.$view.addChild(this.$input);
};

MPOTTextEditor.prototype._showSingleChoice = function () {
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

MPOTTextEditor.prototype._showMultiChoice = function () {
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


MPOTTextEditor.prototype.setData = function (data) {
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

MPOTTextEditor.prototype.isCompleted = function () {
    var data = this._data;
    return !!(data.value || (data.values && data.values.length > 0));
};

MPOTTextEditor.prototype.getPreviewData = function () {
    var data = this._data;

    var pData = {
        type: this.type,
        name: data.name,
        id: data.id
    };
    var data = this._data;
    switch (data.action) {
        case 'multi-choice':
            var dict = this._choiceListChecked;
            pData.values = data.items.filter(function (u, i) {
                return dict[u];
            });
            break;
        default :
            pData.value = data.value;
            break;
    }
    return pData;
};


export default MPOTTextEditor;