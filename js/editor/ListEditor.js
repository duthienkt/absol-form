import Fcore from "../core/FCore";
import Context from "absol/src/AppPattern/Context";
import EventEmitter from "absol/src/HTML5/EventEmitter";
import '../../css/listeditor.css';
import QuickMenu from "absol-acomp/js/QuickMenu";
import { contenteditableTextOnly } from "absol-acomp/js/utils";

var _ = Fcore._;
var $ = Fcore.$;

function ListEditor() {
    Context.call(this);
    EventEmitter.call(this);
    this._data = [];
    this._lashHashValue = -1.1;
}


Object.defineProperties(ListEditor.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(ListEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
ListEditor.prototype.constructor = ListEditor;

ListEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        tag: 'table',
        class: 'as-list-editor',
        child: [
            {
                tag: 'thead',
                child: [
                    {
                        tag: 'tr',
                        child: [
                            {
                                tag: 'td',
                                child: { text: 'Text' }
                            },
                            {
                                tag: 'td',
                                child: { text: 'Value' }
                            },
                            {
                                tag: 'td'
                            }
                        ]
                    }
                ]
            },
            {
                tag: 'tbody',
                child: [
                    {
                        tag: 'tr',
                        class: 'as-list-editor-add-row',
                        child: {
                            tag: 'td',
                            attr: {
                                colspan: '3'
                            },
                            child: ['span.mdi.mdi-plus', { tag: 'span', child: { text: 'Add new item' } }]
                        }
                    }
                ]

            }
        ]
    });

    this.$body = $('tbody', this.$view);
    this.$addRow = $('.as-list-editor-add-row', this.$view).on('click', function () {
        self.appendRowElement();
    });
    this.updateData();
    return this.$view;
};

ListEditor.prototype.updateData = function () {
    if (!this.$view) return;
    if (this._lashHashValue == this.getDataHash()) return;
    this.$body.clearChild();
    var self = this;
    this.$items = this._data.map(function (item) {
        return self.makeNewRow(item).addTo(self.$body);
    });
    this.$body.addChild(this.$addRow);
    this.checkEmpty();
    this.checkDuplicate();
};


ListEditor.prototype.makeNewRow = function (data) {
    var self = this;
    var itemRow = _({
        tag: 'tr',
        class: 'as-list-editor-row',
        child: [
            {
                tag: 'td',
                class: ['as-list-editor-cell'],
                child: [{
                    tag: 'span',
                    class: 'as-list-editor-text',
                    attr: {
                        contenteditable: 'true'
                    },
                    child: { text: data.text },
                }
                ]
            },
            {
                tag: 'td',
                class: ['as-list-editor-cell'],
                child: {
                    tag: 'span',
                    class: 'as-list-editor-value',
                    attr: {
                        contenteditable: 'true'
                    },
                    child: { text: '' + data.value }
                }
            },
            {
                tag: 'td',
                child: {
                    tag: 'button',
                    class: 'as-list-editor-quick-menu-trigger',
                    child: {
                        tag: 'span',
                        class: ['mdi', 'mdi-dots-vertical']
                    }
                }
            }
        ]
    });

    itemRow.__data__ = data;
    itemRow.$textInput = $('.as-list-editor-text', itemRow)
        .on('keydown', function (event) {
            if (event.key == 'Enter') {
                event.preventDefault();
                this.blur();
            }
        }).on('blur', function () {
            var newText = itemRow.$textInput.innerText.trim();
            if (data.text != newText) {
                data.text = newText;
                if (self.checkEmpty() && self.checkDuplicate()) {
                    self.notifyChange();
                }

            }
        });
    contenteditableTextOnly(itemRow.$textInput, function (text) {
        return text.replace(/[\r\n]/g, '');
    });

    if ((data.text + '').trim() == '') {
        itemRow.$textInput.parentNode.addClass('empty-cell');
    }


    itemRow.$valueInput = $('.as-list-editor-value', itemRow)
        .on('keydown', function (event) {
            if (event.key == 'Enter') {
                event.preventDefault();
                this.blur();
            }
        }).on('blur', function () {
            var newValue = itemRow.$valueInput.innerText.trim();
            if (data.value != newValue) {
                data.value = newValue;
                if (self.checkEmpty() && self.checkDuplicate()) {
                    self.notifyChange();
                }
            }
        });
    contenteditableTextOnly(itemRow.$valueInput, function (text) {
        return text.replace(/[\r\n]/g, '');
    });

    if ((data.value + '').trim() == '') {
        itemRow.$valueInput.parentNode.addClass('empty-cell');
    }

    itemRow.$menuTrigger = $('.as-list-editor-quick-menu-trigger', itemRow);
    itemRow.quickMenuData = QuickMenu.toggleWhenClick(itemRow.$menuTrigger,
        {
            getMenuProps: function () {
                return {
                    extendStyle: { 'font-size': '12px' },
                    items: [
                        { icon: '.mdi.mdi-table-row-plus-before', text: 'Insert Row Before', cmd: 'insert-before' },
                        { icon: '.mdi.mdi-table-row-plus-after', text: 'Insert Row After', cmd: 'insert-after' },
                        { icon: '.mdi.mdi-table-row-remove', text: 'Remove', cmd: 'remove' },
                    ]
                };
            },
            onSelect: function (itemElt) {
                switch (itemElt.cmd) {
                    case 'remove': self.removeRowByElt(itemRow); break;
                    case 'insert-before': self.insertRowBeforeElt(itemRow); break;
                    case 'insert-after': self.insertRowAfterElt(itemRow); break;
                }
            }
        });

    return itemRow;
};

/**
 * @returns {Boolean}
 */
ListEditor.prototype.checkDuplicate = function () {
    var res = true;
    var textDict = {};
    var valueDict = {};
    var rows = Array.apply(null, this.$body.childNodes);
    var row;
    for (var i = 0; i < rows.length; ++i) {
        row = rows[i];
        if (row.__data__ && (row.__data__.text + '').trim() != '') {
            if (textDict[row.__data__.text]) {
                row.$textInput.parentNode.addClass('duplicate-cell');
            } else {
                textDict[row.__data__.text] = true;
                row.$textInput.parentNode.removeClass('duplicate-cell');
            }
        }

        if (row.__data__ && (row.__data__.value + '').trim() != '') {
            if (valueDict[row.__data__.value]) {
                row.$valueInput.parentNode.addClass('duplicate-cell');
                res = false;
            } else {
                valueDict[row.__data__.value] = true;
                row.$valueInput.parentNode.removeClass('duplicate-cell');
            }
        }
    };
    return res;
};


/**
 * @returns {Boolean}
 */
ListEditor.prototype.checkEmpty = function () {
    var res = true;
    var rows = Array.apply(null, this.$body.childNodes);
    var row;
    for (var i = 0; i < rows.length; ++i) {
        row = rows[i];

        if (row.__data__) {
            if (!row.__data__.text || row.__data__.text.trim() == '') {
                res = false;
                row.$textInput.parentNode.addClass('empty-cell');
            }
            else {
                row.$textInput.parentNode.removeClass('empty-cell');
            }

            if (!row.__data__.value || row.__data__.value.trim() == '') {
                res = false;
                row.$valueInput.parentNode.addClass('empty-cell');
            }
            else {
                row.$valueInput.parentNode.removeClass('empty-cell');
            }
        }
    };
    return res;
};




ListEditor.prototype.removeRowByElt = function (rowElement) {
    rowElement.remove();
    this._data = this._data.filter(function (item) {
        return rowElement.__data__ != item;
    });
};


ListEditor.prototype.removeRowByData = function (rowData) {
    this._data = this._data.filter(function (item) {
        return rowData != item;
    });
    if (this.$view)
        $('.as-list-editor-row', this.$view, function (elt) {
            if (elt.__data__ == rowData) elt.remove();
            return true;
        });
};

ListEditor.prototype.insertRowBeforeElt = function (elt) {
    var itemData = { text: '', value: '' };
    var res = this.makeNewRow(itemData);
    this.$body.addChildBefore(res, elt);
    var index = this._data.indexOf(elt.__data__);
    this._data.splice(index, 0, itemData);
    return res;
};

ListEditor.prototype.insertRowAfterElt = function (elt) {
    var itemData = { text: '', value: '' };
    var res = this.makeNewRow(itemData);
    this.$body.addChildAfter(res, elt);
    var index = this._data.indexOf(elt.__data__);
    this._data.splice(index + 1, 0, itemData);
    return res;
};

ListEditor.prototype.appendRowElement = function () {
    var itemData = { text: '', value: '' };
    var res = this.makeNewRow(itemData);
    this.$body.addChildBefore(res, this.$addRow);
    this._data.push(itemData);
    return res;
};



ListEditor.prototype.setData = function (items) {
    items = items || [];
    this._data = items;
    this.updateData();
};

ListEditor.prototype.getData = function () {
    return this._data;//todo
};

/**
 * @returns {Number}
 */
ListEditor.prototype.getDataHash = function () {
    return this.data2Hash(this._data || []);
};


ListEditor.prototype.data2Hash = function (data) {
    return data.reduce(function (hash, item, idx) {
        var c;
        var s = idx + ':' + item.text + ':' + item.value;
        for (var i = 0; i < s.length; ++i) {
            c = s.charCodeAt(i);
            hash = (hash << 5) - hash + c;
            hash |= 0;
        }
        return hash;
    }, 0);
};



ListEditor.prototype.notifyChange = function () {
    var currentHash = this.getDataHash();
    if (this._lashHashValue != currentHash) {
        this._lashHashValue = currentHash;
        this.emit('change', { target: this, hash: currentHash }, this);
    }
};

export default ListEditor;