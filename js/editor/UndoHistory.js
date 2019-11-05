import Fcore from "../core/FCore";
import EventEmitter from "absol/src/HTML5/EventEmitter";
import Context from "absol/src/AppPattern/Context";
import '../../css/undohistory.css';

var _ = Fcore._;
var $ = Fcore.$;

function UndoHistory() {
    EventEmitter.call(this);
    Context.call(this);
    this._lastPosition = undefined;
    this.items = [];
    this.lastItemIndex = this.items.length - 1;
}

Object.defineProperties(UndoHistory.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(UndoHistory.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
UndoHistory.prototype.constructor = UndoHistory;

UndoHistory.prototype.ev_clickDockBtn = function () {
    this.$view.removeClass('as-minimize');
    if (this._lastPosition) {
        var bound = this.$view.getBoundingClientRect();
    }


};


UndoHistory.prototype.ev_clickMinimizeBtn = function () {
    this.$view.addClass('as-minimize');
};


UndoHistory.prototype.ev_relocation = function () {

};


UndoHistory.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        tag: 'onscreenwindow',
        class: ['as-undo-history', 'as-minimize-x'],
        props: {
            windowTitle: 'Undo Manager',
            windowIcon: 'span.mdi.mdi-cogs'
        },
        child: [
            {
                class: 'as-undo-history-active-buttons',
                child: [
                    {
                        tag: 'button',
                        class: 'as-undo-history-active-undo',
                        attr: {
                            title: 'Undo'
                        },
                        props: {
                            disabled: true
                        },
                        child: 'span.mdi.mdi-undo'
                    },
                    {
                        tag: 'button',
                        class: 'as-undo-history-active-redo',
                        attr: {
                            title: 'Redo'
                        },
                        props: {
                            disabled: true
                        },
                        child: 'span.mdi.mdi-redo'
                    },
                    {
                        class: 'as-undo-history-active-buttons-right-container',
                        child: {
                            tag: 'button',
                            attr: {
                                title: 'Clear'
                            },
                            class: 'as-undo-history-active-clear',
                            child: 'span.mdi.mdi-delete'
                        }
                    }

                ]
            },
            {
                tag: 'bscroller',
                class: ['as-undo-history-item-list'],
                child: this.items.map(function (item) { return item.getView() })
            }
        ]
    });
    this.$view.$dockBtn.on('click', this.ev_clickDockBtn.bind(this));
    this.$view.$minimizeBtn.on('click', this.ev_clickMinimizeBtn.bind(this));
    this.$view.on('relocation', this.ev_relocation.bind(this));
    this.$list = $('.as-undo-history-item-list', this.$view);
    this.$undoBtn = $('button.as-undo-history-active-undo', this.$view)
        .on('click', this.undo.bind(this));
    this.$redoBtn = $('button.as-undo-history-active-redo', this.$view)
        .on('click', this.redo.bind(this));
    this.$clear = $('button.as-undo-history-active-clear', this.$view)
        .on('click', this.clear.bind(this));
    return this.$view;
};


UndoHistory.prototype.onResume = function () {
    this.getView().addTo(document.body);
};

UndoHistory.prototype.onPause = function () {
    this.getView().remove();
};


UndoHistory.prototype.checkout = function (item, viewOnly) {
    var cItem;
    var found = false;
    for (var i = this.items.length - 1; i >= 0; --i) {
        cItem = this.items[i];
        if (cItem == item) {
            cItem.setActive(true);
            found = true;
            this.lastItemIndex = i;
        }
        else {
            cItem.setActive(false);
        }
        cItem.setDisabled(!found);
    }
    this.$list.scrollInto(item.getView());
    this.$undoBtn.disabled = this.lastItemIndex <= 0;
    this.$redoBtn.disabled = this.lastItemIndex >= this.items.length - 1;
    if (!viewOnly) this.emit('checkout', { type: 'checkout', target: this, item: item }, this);
};

UndoHistory.prototype.undo = function () {
    if (this.lastItemIndex > 0) {
        this.checkout(this.items[this.lastItemIndex - 1]);
    }
};

UndoHistory.prototype.redo = function () {
    if (this.lastItemIndex < this.items.length - 1) {
        this.checkout(this.items[this.lastItemIndex + 1]);
    }
}

/**
 * @param {String} type
 * @param {*} data
 * @param {String} description
 * @param {Date} timestamp
 */
UndoHistory.prototype.commit = function (type, data, description, timestamp) {
    var item;
    while (this.items.length > this.lastItemIndex + 1) {
        item = this.items.pop();
        item.getView().remove();
    }
    var res = new UndoHistoryItem(this, type, data, description, timestamp);
    this.items.push(res);
    this.$list.addChild(res.getView());
    this.checkout(res, true);
    return res;
};


UndoHistory.prototype.clear = function () {
    if (this.items.length < 2) return;
    var lastItem = this.items.pop();
    var lastData = lastItem.data;
    lastItem.getView().remove();
    while (this.items.length > 0) {
        lastItem = this.items.pop();
        lastItem.getView().remove();
    }
    this.commit('clear', lastData, 'Clear History');
}

UndoHistory.prototype.renew = function(){
    while (this.items.length > 0) {
        lastItem = this.items.pop();
        lastItem.getView().remove();
    }
};

/**
 * @param {UndoHistory}parent
 * @param {String} type 
 * @param {*} data 
 * @param {String} description 
 * @param {Date} timestamp 
 */
export function UndoHistoryItem(parent, type, data, description, timestamp) {
    this.parent = parent;
    this.type = type || 'edit';
    this.data = data;
    this.description = description || 'Change';
    this.timestamp = timestamp || new Date();
    this._active = false;
    this._disabled = false;
}


UndoHistoryItem.prototype.typeIcon = {
    move: 'span.mdi.mdi-move-resize',
    remove: 'span.mdi.mdi-delete-variant[style="color: rgb(255,59,59)"]',
    'edit-attribute': 'span.mdi.mdi-circle-edit-outline',
    edit: 'span.mdi.mdi-circle-edit-outline',
    add: 'span.mdi.mdi-pen-plus',
    'set-data': 'span.mdi.mdi-open-in-app',
    'move-resize': 'span.mdi.mdi-move-resize',
    'move-order': 'span.mdi.mdi-arrow-up-down-bold',
    'clear': 'span.mdi.mdi-check-outline'
};


UndoHistoryItem.prototype.setActive = function (bool) {
    this._active = !!bool;
    if (this.$view) {
        if (bool) {
            this.$view.addClass('as-undo-history-item-active');
        }
        else {
            this.$view.removeClass('as-undo-history-item-active');
        }
    }
};


UndoHistoryItem.prototype.setDisabled = function (bool) {
    this._disabled = !!bool;
    if (this.$view) {
        if (bool) {
            this.$view.addClass('as-undo-history-item-disabled');
        }
        else {
            this.$view.removeClass('as-undo-history-item-disabled');
        }
    }
};

UndoHistoryItem.prototype.getActive = function () {
    return this._active;
};


UndoHistoryItem.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        class: ['as-undo-history-item'].concat(this._active ? ['as-undo-history-item-active'] : []).concat(this._disabled ? ['as-undo-history-item-disabled'] : []),
        attr: {
            title: this.timestamp.toLocaleTimeString()
        },
        child: [
            {
                class: 'as-undo-history-item-icon-container',
                child: this.typeIcon[this.type]
            },
            {
                text: this.description
            }
        ],
        on: {
            click: this.ev_click.bind(this)
        }
    });
    return this.$view;
};

UndoHistoryItem.prototype.ev_click = function (event) {
    this.parent.checkout(this);
};


export default UndoHistory;