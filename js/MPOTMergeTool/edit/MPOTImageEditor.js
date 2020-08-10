import MPOTBaseEditor from "./MPOTBaseEditor";
import Fcore from "../../core/FCore";
import {randomIdent} from "absol/src/String/stringGenerate";

var $ = Fcore.$;
var $$ = Fcore.$$;
var _ = Fcore._;

/***
 * @extends MPOTBaseEditor
 * @constructor
 */
function MPOTImageEditor() {
    MPOTBaseEditor.call(this);
}

Object.defineProperties(MPOTImageEditor.prototype, Object.getOwnPropertyDescriptors(MPOTBaseEditor.prototype));
MPOTImageEditor.prototype.constructor = MPOTImageEditor;
MPOTImageEditor.prototype.type = 'image';


MPOTImageEditor.prototype._showInput = function () {
    var thisE = this;
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
                    var src = URL.createObjectURL(this.files[0]);
                    previewImg.src = src;
                    thisE._data.value = src;
                    thisE._data.file = this.files[0];
                    thisE.notifyChange()
                }
            }
        }
    });

    this._assignInputList([this.$input]);

    this.$view.addChild(this.$input);
    this.$view.addChild(this.$previewImg);
};

MPOTImageEditor.prototype._showSingleChoice = function () {
    var thisE = this;
    var data = this._data;
    var groupName = randomIdent(10);
    this.$choiceList = _({
        class: 'mpot-choice-list',
        child: data.items.map(function (item, idx, arr) {
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
                                checked: item === data.src
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
                            tag: 'img',
                            props: { src: item }
                        }
                    }
                ]
            }
        })
    });
    this._assignInputList($$('radiobutton', this.$choiceList));
    this.$view.clearChild().addChild(this.$choiceList);
};

MPOTImageEditor.prototype._showMultiChoice = function () {
    var thisE = this;
    var data = this._data;
    var groupName = randomIdent(10);

    this._choiceListChecked = (data.values || []).reduce(function (ac, cr) {
        ac[cr] = true;
        return ac;
    }, {});
    this.$choiceList = _({
        class: 'mpot-choice-list',
        child: data.items.map(function (item, idx, arr) {
            return {
                class: 'mpot-choice',
                child: [
                    {
                        class: 'mpot-choice-select-cell',
                        child: {
                            tag: 'checkboxbutton',
                            attr: {
                                name: groupName
                            },
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
                            tag: 'img',
                            props: { src: item }
                        }
                    }
                ]
            }
        })
    });
    this._assignInputList($$('checkboxbutton', this.$choiceList));
    this.$view.clearChild().addChild(this.$choiceList);
};


MPOTImageEditor.prototype.setData = function (data) {
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

MPOTImageEditor.prototype.getPreviewData = function () {
    var data = this._data || {};
    var pData = {
        type: this.type,
        name: data.name,
        id: data.id,
        style: data.style || {}
    };
    pData.type = this.type;
    switch (data.action) {
        case 'input':
            pData.value = data.value;
            break;
        case 'single-choice':
            pData.value = data.value;
            break;
        case 'multi-choice':
            pData.values = data.values;
            break;
    }
    return pData;
};


export default MPOTImageEditor;