import Fcore from '../core/FCore';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
import '../../css/anchoreditor.css';
import '../dom/Icons';

var _ = Fcore._;
var $ = Fcore.$;


/**
 * 
 * @param {import('./LayoutEditor').default} layoutEditor 
 */
function AnchorEditor(layoutEditor) {
    EventEmitter.call(this);
    this.layoutEditor = layoutEditor;
    this.component = null;
    this.$resizeBox = _('resizebox')
        .on('mousedown', this.focus.bind(this))
        .on('beginmove', this.ev_beginMove.bind(this, true))
        .on('moving', this.ev_moving.bind(this, true))
        .on('endmove', this.ev_endMove.bind(this, true));
    this.$resizeBox.defineEvent('contextmenu');
    this.$resizeBox.on('contextmenu', this.ev_contextMenu.bind(this));
    this.$topAlignLine = _('vline');
    this.$bottomAlignLine = _('vline');
    this.$leftAlignLine = _('hline');
    this.$rightAlignLine = _('hline');
    this.movingData = null;
    this.isFocus = false;
}

Object.defineProperties(AnchorEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
AnchorEditor.prototype.constructor = AnchorEditor;

AnchorEditor.prototype.ev_contextMenu = function (event) {
    var items = [];
    if (this.layoutEditor.anchorEditors.length > 0) {
        items.push({
            icon: _('mdi-align-horizontal-left'),
            text: 'Align Left Edges',
            cmd: 'align-left-edges'
        });
        items.push({
            icon: _('mdi-align-horizontal-center'),
            text: 'Align Horizontal Center',
            cmd: 'align-center'
        });
        items.push({
            icon: _('mdi-align-horizontal-right'),
            text: 'Align Right Edges',
            cmd: 'align-right-edges'
        });
        items.push('================');
        
        items.push({
            icon: _('mdi-align-vertical-bottom'),
            text: 'Align Bottom Edges',
            cmd: 'align-bottom-edges'
        });
        items.push({
            icon: _('mdi-align-vertical-bottom'),
            text: 'Align Vertical Center',
            cmd: 'align-vertical-bottom'
        });
        items.push({
            icon: _('mdi-align-vertical-bottom'),
            text: 'Align Top Edges',
            cmd: 'align-top-edges'
        });
        items.push('================');
    }

    items.push({
        icon:'span.mdi.mdi-delete-variant[style="color:red"]',
        text:'Delete',
        cmd:'delete'
    })
    event.showContextMenu({
        items: items
    }, function (event) {
        var cmd = event.menuItem.cmd;
        console.log(cmd);

    });
    event.stopPropagation();
};

AnchorEditor.prototype.focus = function () {
    if (!this.component) return;
    if (this.isFocus) return;
    this.isFocus = true;
    this.$resizeBox.addClass('as-focus');
    var editor;
    for (var i = 0; i < this.layoutEditor.anchorEditors.length; ++i) {
        editor = this.layoutEditor.anchorEditors[i];
        if (editor == this) continue;
        editor.blur();
    }
    this.emit('focus', { type: 'focus', target: this }, this);
};

AnchorEditor.prototype.blur = function () {
    if (!this.isFocus) return;
    this.isFocus = false;
    this.$resizeBox.removeClass('as-focus');
    this.emit('blur', { type: 'blur', target: this }, this);
};

AnchorEditor.prototype.edit = function (component) {
    this.component = component;
    if (!this.component) this.blur();
    this.update();
};

AnchorEditor.prototype.update = function () {
    if (this.component) {
        this.$resizeBox.addTo(this.layoutEditor.$forceground);
        var styleDescriptors = this.component.getStyleDescriptors();

        this.$resizeBox.canMove = !!(styleDescriptors.top || styleDescriptors.bottom || styleDescriptors.left || styleDescriptors.right);
        this.$resizeBox.canResize = !!(styleDescriptors.width || styleDescriptors.height);

        if (!styleDescriptors.top || styleDescriptors.top.disabled) {
            this.$topAlignLine.remove();
        }
        else {
            this.$topAlignLine.addTo(this.layoutEditor.$forceground);
        }

        if (!styleDescriptors.bottom || styleDescriptors.bottom.disabled) {
            this.$bottomAlignLine.remove();
        }
        else {
            this.$bottomAlignLine.addTo(this.layoutEditor.$forceground);
        }

        if (!styleDescriptors.left || styleDescriptors.left.disabled) {
            this.$leftAlignLine.remove();
        }
        else {
            this.$leftAlignLine.addTo(this.layoutEditor.$forceground);
        }

        if (!styleDescriptors.right || styleDescriptors.right.disabled) {
            this.$rightAlignLine.remove();
        }
        else {
            this.$rightAlignLine.addTo(this.layoutEditor.$forceground);
        }
        this.updatePosition();
    }
    else {
        this.$resizeBox.remove();
        this.$leftAlignLine.remove();
        this.$rightAlignLine.remove();
        this.$topAlignLine.remove();
        this.$bottomAlignLine.remove();
    }
};

AnchorEditor.prototype.updatePosition = function () {
    if (this.component) {
        var bound = this.layoutEditor.$forceground.getBoundingClientRect();
        var compBound = this.component.view.getBoundingClientRect();
        this.$resizeBox.addStyle({
            left: compBound.left - bound.left + 'px',
            top: compBound.top - bound.top + 'px',
            width: compBound.width + 'px',
            height: compBound.height + 'px'
        });

        if (this.$leftAlignLine.parentNode)
            this.$leftAlignLine.addStyle({
                left: compBound.left - bound.left - this.component.style.left + 'px',
                width: this.component.style.left + 'px',
                top: compBound.top - bound.top + compBound.height / 2 + 'px',
            });

        if (this.$rightAlignLine.parentNode)
            this.$rightAlignLine.addStyle({
                left: compBound.right - bound.left + 'px',
                width: this.component.style.right + 'px',
                top: compBound.top - bound.top + compBound.height / 2 + 'px',
            });

        if (this.$topAlignLine.parentNode)
            this.$topAlignLine.addStyle({
                top: compBound.top - bound.top - this.component.style.top + 'px',
                height: this.component.style.top + 'px',
                left: compBound.left - bound.left + compBound.width / 2 + 'px',
            });

        if (this.$bottomAlignLine.parentNode)
            this.$bottomAlignLine.addStyle({
                top: compBound.bottom - bound.top + 'px',
                height: this.component.style.bottom + 'px',
                left: compBound.left - bound.left + compBound.width / 2 + 'px',
            });
    }
};



AnchorEditor.prototype.ev_beginMove = function (userAction, event) {
    var bound = this.layoutEditor.$forceground.getBoundingClientRect();
    this.movingData = {
        x0: event.clientX - bound.left,
        y0: event.clientY - bound.top,
        dx: 0,
        dy: 0,
        option: event.option,
        styleDescriptors: this.component.getStyleDescriptors(),
        style0: Object.assign({}, this.component.style),
        comp: this.component,
        isChange: false,
        startTime: new Date().getTime()
    };
    if (userAction) this.emit('beginmove', { type: 'beginmove', target: this, originEvent: event, target: this }, this);
};



AnchorEditor.prototype.ev_moving = function (userAction, event) {
    var movingData = this.movingData;
    var bound = this.layoutEditor.$forceground.getBoundingClientRect();
    var x = event.clientX - bound.left;
    var y = event.clientY - bound.top;
    movingData.dx = x - movingData.x0;
    movingData.dy = y - movingData.y0;
    var positionIsChange = false;

    if (movingData.styleDescriptors.left && !movingData.styleDescriptors.left.disabled && (movingData.option.left || movingData.option.body)) {
        movingData.comp.setStyle('left', Math.max(0, movingData.style0.left + movingData.dx));
        positionIsChange = true;
    }

    if (movingData.styleDescriptors.right && !movingData.styleDescriptors.right.disabled && (movingData.option.right || movingData.option.body)) {
        movingData.comp.setStyle('right', Math.max(0, movingData.style0.right - movingData.dx));
        positionIsChange = true;

    }

    if (movingData.styleDescriptors.width && !movingData.styleDescriptors.width.disabled) {
        if (movingData.option.left) {
            if (!!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                movingData.comp.setStyle('width', Math.max(movingData.comp.measureMinSize().width, movingData.style0.width - movingData.dx * 2));
            }
            else {
                movingData.comp.setStyle('width', Math.max(movingData.style0.width - movingData.dx));
            }
            positionIsChange = true;
        }
        if (movingData.option.right) {
            if (movingData.styleDescriptors.left && !!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                movingData.comp.setStyle('width', Math.max(movingData.comp.measureMinSize().width, movingData.style0.width + movingData.dx * 2));
                //center align
            }
            else {
                movingData.comp.setStyle('width', Math.max(movingData.comp.measureMinSize().width, movingData.style0.width + movingData.dx));
            }
            positionIsChange = true;
        }
    }

    if (movingData.styleDescriptors.top && !movingData.styleDescriptors.top.disabled && (movingData.option.top || movingData.option.body)) {
        movingData.comp.setStyle('top', Math.max(0, movingData.style0.top + movingData.dy));
        positionIsChange = true;
    }

    if (movingData.styleDescriptors.bottom && !movingData.styleDescriptors.bottom.disabled && (movingData.option.bottom || movingData.option.body)) {
        movingData.comp.setStyle('bottom', Math.max(0, movingData.style0.bottom - movingData.dy));
        positionIsChange = true;
    }

    if (movingData.styleDescriptors.height && !movingData.styleDescriptors.height.disabled) {
        if (movingData.option.top) {
            if (movingData.styleDescriptors.top && !!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height - movingData.dy * 2));
            }
            else {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height - movingData.dy));
            }
            positionIsChange = true;

        }
        if (movingData.option.bottom) {
            if (movingData.styleDescriptors.top && !!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height + movingData.dy * 2));
            }
            else {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height + movingData.dy));
            }
            positionIsChange = true;
        }
    }

    this.updatePosition();
    movingData.comp.reMeasure();
    if (positionIsChange) {
        this.emit("reposition", { type: 'reposition', component: movingData.comp, movingData: movingData, originEvent: event }, this);
        movingData.isChange = true;
    }
    if (userAction) this.emit('moving', { taget: this, type: 'moving', originEvent: event, target: this }, this);
};


AnchorEditor.prototype.ev_endMove = function (userAction, event) {
    this.movingData.endTime = new Date().getTime();
    if (this.movingData.isChange) {
        this.emit('change', { type: 'change', target: this, component: this.movingData.comp, originEvent: event }, this);
    }
    else {
        if (this.movingData.endTime - this.movingData.startTime > 500) {
            if (userAction) this.emit('longclick', { type: 'longclick', target: this, originEvent: event, time: this.movingData.endTime - this.movingData.startTime, originEvent: event }, this);

        }
        else {
            if (userAction) this.emit('quickclick', { type: 'quickclick', target: this, originEvent: event, time: this.movingData.endTime - this.movingData.startTime, originEvent: event }, this);
        }
    }
    this.movingData = undefined;
    if (userAction) this.emit('endmove', { taget: this, type: 'moving', originEvent: event, target: this }, this);
};


export default AnchorEditor;