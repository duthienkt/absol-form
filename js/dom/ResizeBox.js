import Fcore from "../core/FCore";
import '../../css/resizebox.css';
import OOP from "absol/src/HTML5/OOP";
import EventEmitter from "absol/src/HTML5/EventEmitter";

var _ = Fcore._;
var $ = Fcore.$;


function ResizeBox() {
    var res = _({
        class: 'as-resize-box',
        extendEvent: ['beginmove', 'endmove', 'moving'],
        child: {
            class: 'as-resize-box-body',
            child: [
                '.as-resize-box-dot.left-top',
                '.as-resize-box-dot.top',
                '.as-resize-box-dot.right-top',
                '.as-resize-box-dot.right',
                '.as-resize-box-dot.right-bottom',
                '.as-resize-box-dot.bottom',
                '.as-resize-box-dot.left-bottom',
                '.as-resize-box-dot.left'
            ]
        }

    });

    res.eventHandler = OOP.bindFunctions(res, ResizeBox.eventHandler);
    res.on('mousedown', res.eventHandler.mouseDownBody);
    res._lastOptionNames = undefined;
    return res;
}

ResizeBox.eventHandler = {};

ResizeBox.eventHandler.mouseDownBody = function (event) {
    if (EventEmitter.isMouseRight(event)) return;
    event.preventDefault();
    this._optionNames = event.target.attr('class').match(/body|left|top|right|bottom/g);
    var option =  this._optionNames.reduce(function (ac, key) {
        ac[key] = true;
        return ac;
    }, {});
    var beginMoveEvent = {
        clientX: event.clientX,
        clientY: event.clientY,
        target: this,
        originEvent: event,
        prevented: false,
        preventDefault: function () {
            this.prevented = true;
        },
        option: option,
        type: 'beginmove'
    };

    this.emit('beginmove', beginMoveEvent);
    if (beginMoveEvent.prevented) return;
    $(document.body).on('mousemove', this.eventHandler.mouseMoveBody)
        .on('mouseup', this.eventHandler.mouseFinishBody)
        .on('mouseleave', this.eventHandler.mouseFinishBody)
        .addClass('as-resize-box-overiding')
        .addClass(this._optionNames.join('-'));

};

ResizeBox.eventHandler.mouseMoveBody = function (event) {
    event.preventDefault();
    var beginMoveEvent = {
        clientX: event.clientX,
        clientY: event.clientY,
        target: this,
        originEvent: event,
        type: 'moving'
    };

    this.emit('moving', beginMoveEvent);
};

ResizeBox.eventHandler.mouseFinishBody = function (event) {
    event.preventDefault();

    $(document.body).off('mousemove', this.eventHandler.mouseMoveBody)
        .off('mouseup', this.eventHandler.mouseFinishBody)
        .off('mouseleave', this.eventHandler.mouseFinishBody)
        .removeClass('as-resize-box-overiding')
        .removeClass(this._optionNames.join('-'));;
    var endMoveEvent = {
        clientX: event.clientX,
        clientY: event.clientY,
        target: this,
        originEvent: event,
        type: 'endmove'
    };
    this.emit('endmove', endMoveEvent);
    this._optionNames = undefined;
};


ResizeBox.property = {};

ResizeBox.property.canMove = {
    set:function(value) {
        if (value){
            this.addClass('as-can-move');
        }
        else{
            this.removeClass('as-can-move');
        }
    }, 
    get: function () {
        return this.containsClass('as-can-move');
    }
}

ResizeBox.property.canResize = {
    set:function(value) {
        if (value){
            this.addClass('as-can-resize');
        }
        else{
            this.removeClass('as-can-resize');
        }
    }, 
    get: function () {
        return this.containsClass('as-can-resize');
    }
}

Fcore.install('resizebox', ResizeBox);


export default ResizeBox;