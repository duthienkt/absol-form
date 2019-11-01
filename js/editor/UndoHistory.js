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
    this.items = [
        new UndoHistoryItem(),
        new UndoHistoryItem(),
        new UndoHistoryItem(),
        new UndoHistoryItem(),
        new UndoHistoryItem()
    ]
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
                        props: {
                            disabled: true
                        },
                        child: 'span.mdi.mdi-undo'
                    },
                    {
                        tag: 'button',
                        props: {
                            disabled: true
                        },
                        child: 'span.mdi.mdi-redo'
                    },
                    {
                        class: 'as-undo-history-active-buttons-right-container',
                        child: {
                            tag: 'button',
                            props: {
                                disabled: true
                            },
                            child: 'span.mdi.mdi-delete'
                        }
                    }

                ]
            },
            {
                class: 'as-undo-history-item-list',
                child: this.items.map(function (item) { return item.getView() })
            }
        ]
    });
    this.$view.$dockBtn.on('click', this.ev_clickDockBtn.bind(this));
    this.$view.$minimizeBtn.on('click', this.ev_clickMinimizeBtn.bind(this));
    this.$view.on('relocation', this.ev_relocation.bind(this));
    return this.$view;
};


UndoHistory.prototype.onStart = function () {
    this.getView().addTo(document.body);
};

/**
 * 
 * @param {String} type 
 * @param {*} data 
 * @param {String} description 
 * @param {Date} timestamp 
 */
export function UndoHistoryItem(type, data, description, timestamp) {
    this.type = type||'edit';
    this.data = data;
    this.description = description||'Move component';
    this.timestamp = timestamp || new Date();
}

UndoHistoryItem.prototype.typeIcon = {
    move: 'span.mdi.mdi-move-resize',
    delete: 'span.mdi.mdi-move-delete-variant[style="color: rgb(255,59,59)"]',
    'edit-attribute': 'span.mdi.mdi-circle-edit-outline',
    edit: 'span.mdi.mdi-circle-edit-outline'
};


UndoHistoryItem.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        class: 'as-undo-history-item',
        attr:{
            title:this.timestamp.toLocaleTimeString()
        },
        child: [
            {
                class: 'as-undo-history-item-icon-container',
                child: this.typeIcon[this.type]
            }
        ]
    });
    return this.$view;
};





export default UndoHistory;