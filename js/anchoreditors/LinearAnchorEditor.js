import Fcore from '../core/FCore';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
import '../../css/anchoreditor.css';
import '../dom/Icons';

var _ = Fcore._;
var $ = Fcore.$;


/**
 * 
 * @param {import('../editor/LayoutEditor').default} layoutEditor 
 */
function LinearAnchorEditor(layoutEditor) {
    EventEmitter.call(this);
    var self = this;
    this.layoutEditor = layoutEditor;
    this.component = null;
    this.$modal = _({
        style: {
            zIndex: '10000000',
            left: '1px',
            right: '1px',
            top: '1px',
            bottom: '1px',
            position: 'fixed'
        }
    });
    this.$marginBox = _('resizebox')
        .on('click', this.focusMarginBox.bind(this))
        .on('beginmove', this.ev_beginMove.bind(this, true))
        .on('moving', this.ev_movingMargin.bind(this, true))
        .on('endmove', this.ev_endMove.bind(this, true));

    this.$resizeBox = _('resizebox')
        .on('mousedown', this.focus.bind(this))
        .on('beginmove', this.ev_beginMove.bind(this, true))
        .on('moving', this.ev_moving.bind(this, true))
        .on('endmove', this.ev_endMove.bind(this, true))
        .on('click', this.focus.bind(this));

    this.$resizeBox.defineEvent('contextmenu');
    this.$resizeBox.on('contextmenu', this.ev_contextMenu.bind(this));
    this.movingData = null;
    this.isFocus = false;
}

Object.defineProperties(LinearAnchorEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
LinearAnchorEditor.prototype.constructor = LinearAnchorEditor;


LinearAnchorEditor.prototype.ev_contextMenu = function (event) {
    var self = this;
    var items = [];
    if (this.layoutEditor.anchorEditors.length > 1) {
        items.push({
            icon: _('mdi-align-horizontal-left'),
            text: 'Align Left Edges',
            cmd: this.cmd_alignLeftDedge.bind(this)
        });
        items.push({
            icon: _('mdi-align-horizontal-center'),
            text: 'Align Horizontal Center',
            cmd: this.cmd_alignHorizontalCenter.bind(this)
        });
        items.push({
            icon: _('mdi-align-horizontal-right'),
            text: 'Align Right Edges',
            cmd: this.cmd_alignRightDedge.bind(this)
        });
        items.push({
            icon: _('span.mdi.mdi-arrow-expand-horizontal'),
            text: 'Equalise Width',
            cmd: this.cmd_equaliseWidth.bind(this)
        });

        items.push('================');
        items.push({
            icon: _('mdi-align-vertical-top'),
            text: 'Align Top Edges',
            cmd: this.cmd_alignTopDedge.bind(this)
        });
        items.push({
            icon: _('mdi-align-vertical-bottom'),
            text: 'Align Bottom Edges',
            cmd: this.cmd_alignBottomDedge.bind(this)
        });
        items.push({
            icon: _('mdi-align-vertical-center'),
            text: 'Align Vertical Center',
            cmd: this.cmd_alignVerticalCenter.bind(this)
        });
        items.push({
            icon: _('span.mdi.mdi-arrow-expand-vertical'),
            text: 'Equalise Height',
            cmd: this.cmd_equaliseHeight.bind(this)
        });
        items.push('================');
    }


    if (this.layoutEditor.anchorEditors.length > 2) {
        items.push({
            icon: _('span.mdi.mdi-distribute-horizontal-left'),
            text: 'Distribute Horizontal Left',
            cmd: this.cmd_distributeHorizontalLeft.bind(this)
        });
        items.push({
            icon: _('span.mdi.mdi-distribute-horizontal-center'),
            text: 'Distribute Horizontal Center',
            cmd: this.cmd_distributeHorizontalCenter.bind(this)
        });
        items.push({
            icon: _('span.mdi.mdi-distribute-horizontal-right'),
            text: 'Distribute Horizontal Right',
            cmd: this.cmd_distributeHorizontalRight.bind(this)
        });
        items.push({
            icon: _(
                '<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
                <path d="m21 7v10h-5v5h-2v-20h2v5h5"/>\
                <path d="m8 2h2v20h-2v-3h-5v-14h5z"/>\
            </svg>'),
            text: 'Distribute Horizontal Distance',
            cmd: this.cmd_distributeHorizontalDistance.bind(this)
        });

        items.push('================');
        items.push({
            icon: _('span.mdi.mdi-distribute-vertical-top'),
            text: 'Distribute Vertical Top',
            cmd: this.cmd_distributeVerticalTop.bind(this)
        });
        items.push({
            icon: _('span.mdi.mdi-distribute-vertical-center'),
            text: 'Distribute Vertical Center',
            cmd: this.cmd_distributeVerticalCenter.bind(this)
        });
        items.push({
            icon: _('span.mdi.mdi-distribute-vertical-bottom'),
            text: 'Distribute Vertical Bottom',
            cmd: this.cmd_distributeVerticalBottom.bind(this)
        });
        items.push({
            icon: _(
                '<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
                <path d="m7 3h10v5h5v2h-20v-2h5v-5"/>\
                <path d="m2 16v-2h20v2h-3v5h-14v-5z"/>\
            </svg>'),
            text: 'Distribute Verlical Distance',
            cmd: this.cmd_distributeVerticalDistance.bind(this)
        });
        items.push('================');
    }

    items.push({
        icon: 'span.mdi.mdi-delete-variant[style="color:red"]',
        text: 'Delete',
        cmd: this.cmd_delete.bind(this)
    });

    event.showContextMenu({
        items: items,
        extendStyle: {
            fontSize: '12px'
        }
    }, function (event) {
        var cmd = event.menuItem.cmd;
        if (typeof cmd == 'function') {
            cmd();
            self.layoutEditor.notifyDataChange();
        }
    });
    event.stopPropagation();
};


LinearAnchorEditor.prototype.focusMarginBox = function () {
    if (!this.component) return;
    if (this.isFocus) {
        this.$resizeBox.removeClass('as-focus');
        this.$marginBox.addClass('as-focus');
    }
    else {
        this.$marginBox.addClass('as-focus');
        this.isFocus = true;
        var editor;
        for (var i = 0; i < this.layoutEditor.anchorEditors.length; ++i) {
            editor = this.layoutEditor.anchorEditors[i];
            if (editor == this) continue;
            editor.blur();
        }
        this.emit('focus', { type: 'focus', target: this }, this);
    }
};

LinearAnchorEditor.prototype.focus = function () {
    if (!this.component) return;
    this.$resizeBox.addClass('as-focus');
    this.$marginBox.removeClass('as-focus');
    if (this.isFocus) return;
    this.isFocus = true;
    var editor;
    for (var i = 0; i < this.layoutEditor.anchorEditors.length; ++i) {
        editor = this.layoutEditor.anchorEditors[i];
        if (editor == this) continue;
        editor.blur();
    }
    this.emit('focus', { type: 'focus', target: this }, this);
};

LinearAnchorEditor.prototype.blur = function () {
    if (!this.isFocus) return;
    this.isFocus = false;
    this.$resizeBox.removeClass('as-focus');
    this.emit('blur', { type: 'blur', target: this }, this);
};

LinearAnchorEditor.prototype.edit = function (component) {
    this.component = component;
    if (!this.component) this.blur();
    this.update();
};

LinearAnchorEditor.prototype.update = function () {
    if (this.component) {
        var styleDescriptors = this.component.getStyleDescriptors();

        if (styleDescriptors.top || styleDescriptors.bottom || styleDescriptors.left || styleDescriptors.right) {
            this.$marginBox.addTo(this.layoutEditor.$forceground);
        }
        else {
            this.$marginBox.selfRemove();
        }
        this.$resizeBox.addTo(this.layoutEditor.$forceground);

        this.$resizeBox.canMove = !!(styleDescriptors.top || styleDescriptors.bottom || styleDescriptors.left || styleDescriptors.right);
        this.$resizeBox.canResize = !!(styleDescriptors.width || styleDescriptors.height);
        this.$marginBox.canClick = !!(styleDescriptors.top || styleDescriptors.bottom || styleDescriptors.left || styleDescriptors.right);
        this.$marginBox.canResize = true;
        this.updatePosition();
    }
    else {
        this.$resizeBox.remove();
        this.$marginBox.remove();
    }
};

LinearAnchorEditor.prototype.updatePosition = function () {
    if (this.component) {
        this.component.reMeasure();
        var bound = this.layoutEditor.$forceground.getBoundingClientRect();
        var compBound = this.component.view.getBoundingClientRect();
        this.$resizeBox.addStyle({
            left: compBound.left - bound.left + 'px',
            top: compBound.top - bound.top + 'px',
            width: compBound.width + 'px',
            height: compBound.height + 'px'
        });
        this.$marginBox.addStyle({
            left: compBound.left - bound.left - this.component.style.left + 'px',
            top: compBound.top - bound.top - this.component.style.top + 'px',
            width: compBound.width + this.component.style.left + this.component.style.right + 'px',
            height: compBound.height + this.component.style.top + this.component.style.bottom + 'px'
        });
    }
};



LinearAnchorEditor.prototype.ev_beginMove = function (userAction, event) {
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
    };
    if (userAction) {
        this.emit('beginmove', { type: 'beginmove', target: this, originEvent: event, target: this }, this);
        this.$modal.addTo(document.body);
    }
};



LinearAnchorEditor.prototype.ev_moving = function (userAction, event) {
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


    movingData.comp.reMeasure();
    this.updatePosition();
    if (positionIsChange) {
        this.emit("reposition", { type: 'reposition', component: movingData.comp, movingData: movingData, originEvent: event }, this);
        movingData.isChange = true;
    }
    if (userAction) this.emit('moving', { taget: this, type: 'moving', originEvent: event, target: this }, this);
};

LinearAnchorEditor.prototype.ev_movingMargin = function (userAction, event) {
    var movingData = this.movingData;
    var bound = this.layoutEditor.$forceground.getBoundingClientRect();

    var x = event.clientX - bound.left;
    var y = event.clientY - bound.top;
    movingData.dx = x - movingData.x0;
    movingData.dy = y - movingData.y0;
    var positionIsChange = false;


    if (movingData.styleDescriptors.bottom && event.option.bottom) {
        movingData.comp.setStyle('bottom', Math.max(0, movingData.style0.bottom + movingData.dy));
    }
    if (movingData.styleDescriptors.right && event.option.right) {
        movingData.comp.setStyle('right', Math.max(0, movingData.style0.right + movingData.dx));
    }

    this.updatePosition();
    movingData.comp.reMeasure();
    if (positionIsChange) {
        this.emit("reposition", { type: 'reposition', component: movingData.comp, movingData: movingData, originEvent: event }, this);
        movingData.isChange = true;
    }
    if (userAction) this.emit('moving', { taget: this, type: 'moving', originEvent: event, target: this }, this);
};


LinearAnchorEditor.prototype.ev_endMove = function (userAction, event) {
    if (this.movingData.isChange) {
        this.emit('change', { type: 'change', target: this, component: this.movingData.comp, originEvent: event }, this);
    }
    this.movingData = undefined;
    if (userAction) {
        this.emit('endmove', { taget: this, type: 'moving', originEvent: event, target: this }, this);
        setTimeout(this.$modal.selfRemove.bind(this.$modal), 100);
    }
};


LinearAnchorEditor.prototype.cmd_delete = function () {
    var editors = this.layoutEditor.anchorEditors;
    var components = editors.map(function (e) {
        return e.component;
    });
    this.layoutEditor.removeComponent.apply(this.layoutEditor, components);
};


LinearAnchorEditor.prototype.cmd_alignLeftDedge = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    this.component.reMeasure();
    var leftValue = this.component.getStyle('left');
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignLeftDedge(leftValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Left Dedge');
};


LinearAnchorEditor.prototype.cmd_alignRightDedge = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    this.component.reMeasure();
    var rightValue = this.component.getStyle('right');

    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignRightDedge(rightValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Right Dedge');

};

LinearAnchorEditor.prototype.cmd_alignHorizontalCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    this.component.reMeasure();
    var centerValue = this.component.getStyle('right') - this.component.getStyle('left');;
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignHorizontalCenter(centerValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Horizontal Center');

};

LinearAnchorEditor.prototype.cmd_equaliseWidth = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    this.component.reMeasure();
    var widthValue = this.component.getStyle('width');
    for (var i = 0; i < editors.length; ++i) {
        var editor = editors[i];
        if (editor == this) continue;
        editor.equaliseWidth(widthValue);
    }
    this.layoutEditor.commitHistory('move', 'Equalise Width');

};


LinearAnchorEditor.prototype.alignLeftDedge = function (leftValue) {
    if (!this.component) return;
    this.component.reMeasure();
    var currentHAlign = this.component.getStyle('hAlign');
    switch (currentHAlign) {
        case 'left':
        case 'fixed':
            this.component.setStyle('left', leftValue);
            break;
        case 'right':
            this.component.setStyle('right', this.component.getStyle('right') + (leftValue - this.component.getStyle('left')));
            break;
        case 'center':
            var center = this.component.getStyle('left') + this.component.getStyle('width') / 2;
            if (center - this.component.measureMinSize().width / 2 >= leftValue) {
                this.component.setStyle('width', (center - leftValue) * 2);
            }
            break;
    }
    this.updatePosition();
    this.component.reMeasure();
};


LinearAnchorEditor.prototype.alignRightDedge = function (rightValue) {
    if (!this.component) return;
    this.component.reMeasure();
    var currentHAlign = this.component.getStyle('hAlign');

    switch (currentHAlign) {
        case 'right':
        case 'fixed':
            this.component.setStyle('right', rightValue);
            break;
        case 'left':
            this.component.setStyle('left', this.component.getStyle('left') - (rightValue - this.component.getStyle('right')));
            break;
        case 'center':
            var center = this.component.getStyle('right') - this.component.getStyle('width') / 2;
            if (center + this.component.measureMinSize().width / 2 <= rightValue) {
                this.component.setStyle('width', (rightValue - center) * 2);
            }
            break;
    }
    this.updatePosition();
    this.component.reMeasure();
};


LinearAnchorEditor.prototype.alignHorizontalCenter = function (centerValue) { // right - left
    if (!this.component) return;
    this.component.reMeasure();
    var currentHAlign = this.component.getStyle('hAlign');
    var cRight = this.component.getStyle('right');
    var cLeft = this.component.getStyle('left');
    var newLeft = ((cRight + cLeft) - centerValue) / 2;
    var newRight = ((cRight + cLeft) + centerValue) / 2;

    switch (currentHAlign) {
        case 'right':
            this.component.setStyle('right', newRight);
            break;
        case 'fixed':
            this.component.setStyle('left', newLeft);
            this.component.setStyle('right', newRight);
            break;
        case 'left':
            this.component.setStyle('left', newLeft);
            break;
        case 'center':
            //noway to align center
            break;
    }
    this.updatePosition();
    this.component.reMeasure();
};


LinearAnchorEditor.prototype.equaliseWidth = function (widthValue) {
    if (!this.component) return;
    this.component.reMeasure();
    var currentHAlign = this.component.getStyle('hAlign');
    var cRight = this.component.getStyle('right');
    var cLeft = this.component.getStyle('left');
    var cWidth = this.component.getStyle('width');
    var dw = widthValue - cWidth;

    switch (currentHAlign) {
        case 'right':
            if (cLeft < dw)
                this.component.setStyle('right', cRight - (dw - cLeft));
            this.component.setStyle('width', widthValue);
            break;
        case 'left':
            if (cRight < dw)
                this.component.setStyle('left', cLeft - (dw - cWidth));
            this.component.setStyle('width', widthValue);
            break;
        case 'fixed':
            if (dw > cRight) {
                this.component.setStyle('right', 0);
                this.component.setStyle('left', cLeft - (dw - cWidth));
            }
            else {
                this.component.setStyle('right', cRight - dw);
            }
            break;
        case 'center':
            this.component.setStyle('width', widthValue);
            break;
    }
    this.updatePosition();
    this.component.reMeasure();
};



LinearAnchorEditor.prototype.cmd_alignTopDedge = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    this.component.reMeasure();
    var topValue = this.component.getStyle('top');
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignTopDedge(topValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Top Dedge');
};


LinearAnchorEditor.prototype.cmd_alignBottomDedge = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    this.component.reMeasure();
    var bottomValue = this.component.getStyle('bottom');

    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignBottomDedge(bottomValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Bottom Dedge');
};

LinearAnchorEditor.prototype.cmd_alignVerticalCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    this.component.reMeasure();
    var centerValue = this.component.getStyle('bottom') - this.component.getStyle('top');;
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignVerticalCenter(centerValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Verlical Center');

};

LinearAnchorEditor.prototype.cmd_equaliseHeight = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    this.component.reMeasure();
    var heightValue = this.component.getStyle('height');
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.equaliseHeight(heightValue);
    }
    this.layoutEditor.commitHistory('move', 'Equalise Height');
};



LinearAnchorEditor.prototype.alignTopDedge = function (topValue) {
    if (!this.component) return;
    this.component.reMeasure();
    var currentVAlign = this.component.getStyle('vAlign');
    switch (currentVAlign) {
        case 'top':
        case 'fixed':
            this.component.setStyle('top', topValue);
            break;
        case 'bottom':
            this.component.setStyle('bottom', this.component.getStyle('bottom') + (topValue - this.component.getStyle('top')));
            break;
        case 'center':
            var center = this.component.getStyle('top') + this.component.getStyle('height') / 2;
            if (center - this.component.measureMinSize().height / 2 >= topValue) {
                this.component.setStyle('height', (center - topValue) * 2);
            }
            break;
    }
    this.updatePosition();
    this.component.reMeasure();

};


LinearAnchorEditor.prototype.alignBottomDedge = function (bottomValue) {
    if (!this.component) return;
    this.component.reMeasure();
    var currentVAlign = this.component.getStyle('vAlign');

    switch (currentVAlign) {
        case 'bottom':
        case 'fixed':
            this.component.setStyle('bottom', bottomValue);
            break;
        case 'top':
            this.component.setStyle('top', this.component.getStyle('top') - (bottomValue - this.component.getStyle('bottom')));
            break;
        case 'center':
            var center = this.component.getStyle('bottom') - this.component.getStyle('height') / 2;
            if (center + this.component.measureMinSize().height / 2 <= bottomValue) {
                this.component.setStyle('height', (bottomValue - center) * 2);
            }
            break;
    }
    this.updatePosition();
};


LinearAnchorEditor.prototype.alignVerticalCenter = function (centerValue) { // bottom - top
    if (!this.component) return;
    this.component.reMeasure();
    var currentVAlign = this.component.getStyle('vAlign');
    var cBottom = this.component.getStyle('bottom');
    var cTop = this.component.getStyle('top');
    var newTop = ((cBottom + cTop) - centerValue) / 2;
    var newBottom = ((cBottom + cTop) + centerValue) / 2;

    switch (currentVAlign) {
        case 'bottom':
            this.component.setStyle('bottom', newBottom);
            break;
        case 'fixed':
            this.component.setStyle('top', newTop);
            this.component.setStyle('bottom', newBottom);
            break;
        case 'top':
            this.component.setStyle('top', newTop);
            break;
        case 'center':
            //noway to align center
            break;
    }
    this.updatePosition();
    this.component.reMeasure();
};


LinearAnchorEditor.prototype.equaliseHeight = function (heightValue) {
    if (!this.component) return;
    this.component.reMeasure();
    var currentVAlign = this.component.getStyle('vAlign');
    var cBottom = this.component.getStyle('bottom');
    var cTop = this.component.getStyle('top');
    var cHeight = this.component.getStyle('height');
    var dh = heightValue - cHeight;

    switch (currentVAlign) {
        case 'bottom':
            if (cTop < dh)
                this.component.setStyle('bottom', cBottom - (dh - cTop));
            this.component.setStyle('height', heightValue);
            break;
        case 'top':
            if (cBottom < dh)
                this.component.setStyle('top', cTop - (dh - cHeight));
            this.component.setStyle('height', heightValue);
            break;
        case 'fixed':
            if (dh > cBottom) {
                this.component.setStyle('bottom', 0);
                this.component.setStyle('top', cTop - (dh - cHeight));
            }
            else {
                this.component.setStyle('bottom', cBottom - dh);
            }
            break;
        case 'center':
            this.component.setStyle('height', heightValue);
            break;
    }
    this.updatePosition();
    this.component.reMeasure();
};





LinearAnchorEditor.prototype.cmd_distributeHorizontalLeft = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    for (i = 0; i < editors.length; ++i) {
        editor = editors[i];
        editor.component.reMeasure();
    }
    editors = editors.slice();
    editors.sort(function (a, b) {
        return a.component.style.left - b.component.style.left;
    });
    var minX = editors[0].component.style.left;
    var maxX = editors[editors.length - 1].component.style.left;
    if (minX == maxX) return;
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        editor.alignLeftDedge(minX + (maxX - minX) / (editors.length - 1) * i);
        editor.component.reMeasure();
    }
    this.layoutEditor.commitHistory('move', 'Distribute Horizontal Left');
};

LinearAnchorEditor.prototype.cmd_distributeHorizontalCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    for (i = 0; i < editors.length; ++i) {
        editor = editors[i];
        editor.component.reMeasure();
    }
    editors = editors.slice();
    editors.sort(function (a, b) {
        return (a.component.style.left + a.component.style.width / 2) - (b.component.style.left + b.component.style.width / 2);
    });
    var minX = (editors[0].component.style.left + editors[0].component.style.width / 2);
    var maxX = (editors[editors.length - 1].component.style.left + editors[editors.length - 1].component.style.width / 2);
    if (minX == maxX) return;
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        editor.alignLeftDedge(minX + (maxX - minX) / (editors.length - 1) * i - editor.component.style.width / 2);
        editor.component.reMeasure();
    }
    this.layoutEditor.commitHistory('move', 'Distribute Horizontal Center');
};



LinearAnchorEditor.prototype.cmd_distributeHorizontalRight = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    for (i = 0; i < editors.length; ++i) {
        editor = editors[i];
        editor.component.reMeasure();
    }
    editors = editors.slice();
    editors.sort(function (a, b) {
        return a.component.style.right - b.component.style.right;
    });
    var minX = editors[0].component.style.right;
    var maxX = editors[editors.length - 1].component.style.right;
    if (minX == maxX) return;
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        editor.alignRightDedge(minX + (maxX - minX) / (editors.length - 1) * i);
        editor.component.reMeasure();
    }
    this.layoutEditor.commitHistory('move', 'Distribute Horizontal Right');
};

LinearAnchorEditor.prototype.cmd_distributeHorizontalDistance = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    for (i = 0; i < editors.length; ++i) {
        editor = editors[i];
        editor.component.reMeasure();
    }
    editors = editors.slice();
    editors.sort(function (a, b) {
        return (a.component.style.left + a.component.style.width / 2) - (b.component.style.left + b.component.style.width / 2);
    });

    var sumDistance = editors[editors.length - 1].component.style.left - (editors[0].component.style.left + editors[0].component.style.width);
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        sumDistance -= editor.component.style.width;
    }
    var distance = sumDistance / (editors.length - 1);
    var curentLeft = editors[0].component.style.left + editors[0].component.style.width + distance;

    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        editor.alignHorizontalCenter(editor.component.style.right - 2 * curentLeft + editor.component.style.left);
        editor.component.reMeasure();
        curentLeft += editor.component.style.width + distance;
    }
    this.layoutEditor.commitHistory('move', 'Distribute Horizontal Distance');
};




LinearAnchorEditor.prototype.cmd_distributeVerticalTop = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    for (i = 0; i < editors.length; ++i) {
        editor = editors[i];
        editor.component.reMeasure();
    }
    editors = editors.slice();
    editors.sort(function (a, b) {
        return a.component.style.top - b.component.style.top;
    });
    var minX = editors[0].component.style.top;
    var maxX = editors[editors.length - 1].component.style.top;
    if (minX == maxX) return;
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        editor.alignTopDedge(minX + (maxX - minX) / (editors.length - 1) * i);
        editor.component.reMeasure();
    }
    this.layoutEditor.commitHistory('move', 'Distribute Vertical Top');
};

LinearAnchorEditor.prototype.cmd_distributeVerticalCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    for (i = 0; i < editors.length; ++i) {
        editor = editors[i];
        editor.component.reMeasure();
    }
    editors = editors.slice();
    editors.sort(function (a, b) {
        return (a.component.style.top + a.component.style.height / 2) - (b.component.style.top + b.component.style.height / 2);
    });
    var minX = (editors[0].component.style.top + editors[0].component.style.height / 2);
    var maxX = (editors[editors.length - 1].component.style.top + editors[editors.length - 1].component.style.height / 2);
    if (minX == maxX) return;
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        editor.alignTopDedge(minX + (maxX - minX) / (editors.length - 1) * i - editor.component.style.height / 2);
        editor.component.reMeasure();
    }
    this.layoutEditor.commitHistory('move', 'Distribute Vertical Center');
};



LinearAnchorEditor.prototype.cmd_distributeVerticalBottom = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    for (i = 0; i < editors.length; ++i) {
        editor = editors[i];
        editor.component.reMeasure();
    }
    editors = editors.slice();
    editors.sort(function (a, b) {
        return a.component.style.bottom - b.component.style.bottom;
    });
    var minX = editors[0].component.style.bottom;
    var maxX = editors[editors.length - 1].component.style.bottom;
    if (minX == maxX) return;
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        editor.alignBottomDedge(minX + (maxX - minX) / (editors.length - 1) * i);
        editor.component.reMeasure();
    }
    this.layoutEditor.commitHistory('move', 'Distribute Vertical Bottom');
};


LinearAnchorEditor.prototype.cmd_distributeVerticalDistance = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    for (i = 0; i < editors.length; ++i) {
        editor = editors[i];
        editor.component.reMeasure();
    }
    editors = editors.slice();
    editors.sort(function (a, b) {
        return (a.component.style.top + a.component.style.height / 2) - (b.component.style.top + b.component.style.height / 2);
    });

    var sumDistance = editors[editors.length - 1].component.style.top - (editors[0].component.style.top + editors[0].component.style.height);
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        sumDistance -= editor.component.style.height;
    }
    var distance = sumDistance / (editors.length - 1);
    var curentTop = editors[0].component.style.top + editors[0].component.style.height + distance;

    for (i = 1; i < editors.length - 1; ++i) {
        editor = editors[i];
        editor.alignVerticalCenter(editor.component.style.bottom - 2 * curentTop + editor.component.style.top);
        editor.component.reMeasure();
        curentTop += editor.component.style.height + distance;
    }
    this.layoutEditor.commitHistory('move', 'Distribute Vertical Distance');
};


export default LinearAnchorEditor;