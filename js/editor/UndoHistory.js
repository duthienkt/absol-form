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
}

Object.defineProperties(UndoHistory.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(UndoHistory.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
UndoHistory.prototype.constructor = UndoHistory;

UndoHistory.prototype.ev_clickDockBtn = function(){
    this.$view.removeClass('as-minimize');
    if (this._lastPosition){
        var bound = this.$view.getBoundingClientRect();
        
    }
    

};
UndoHistory.prototype.ev_clickMinimizeBtn = function(){
    this.$view.addClass('as-minimize');
};

UndoHistory.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        tag: 'onscreenwindow',
        class: ['as-undo-history', 'as-minimize'],
        props: {
            windowTitle: 'Undo Manager',
            windowIcon: 'span.mdi.mdi-cogs'
        },
        child: [

        ]
    });
    this.$view.$dockBtn.on('click', this.ev_clickDockBtn.bind(this));
    this.$view.$minimizeBtn.on('click', this.ev_clickMinimizeBtn.bind(this));
    return this.$view;
};


UndoHistory.prototype.onStart = function () {
    this.getView().addTo(document.body);
}

export function UndoHistoryItem(data) {
    this.data = data;
}

UndoHistoryItem.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        class: ''
    });

    return this.$view;
};





export default UndoHistory;