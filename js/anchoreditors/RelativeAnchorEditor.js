import Fcore from '../core/FCore';
import '../../css/anchoreditor.css';
import '../dom/Icons';
import BaseAnchorEditor from '../core/BaseAnchorEditor';
import { LayoutEditorCmdDescriptors } from '../cmds/LayoutEditorCmd';

var _ = Fcore._;
var $ = Fcore.$;


/**
 * 
 * @param {import('../editor/LayoutEditor').default} layoutEditor 
 */
function RelativeAnchorEditor(layoutEditor) {
    BaseAnchorEditor.call(this, layoutEditor);
    var self = this;
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
    this.$resizeBox = _('resizebox')
        .on('mousedown', this.focus.bind(this))
        .on('beginmove', this.ev_beginMove.bind(this, true))
        .on('moving', this.ev_moving.bind(this, true))
        .on('endmove', this.ev_endMove.bind(this, true))
        .on('click', function (ev) {
            self.emit('click', ev, true);
        })
        .on('dblclick', this.cmd_layoutEdit.bind(this));
    this.$resizeBox.defineEvent('contextmenu');
    this.$resizeBox.on('contextmenu', this.ev_contextMenu.bind(this));
    this.$topAlignLine = _('vline');
    this.$bottomAlignLine = _('vline');
    this.$leftAlignLine = _('hline');
    this.$rightAlignLine = _('hline');
    this.movingData = null;
    this.isFocus = false;
    this.snapDistance = 2;
}

Object.defineProperties(RelativeAnchorEditor.prototype, Object.getOwnPropertyDescriptors(BaseAnchorEditor.prototype));
RelativeAnchorEditor.prototype.constructor = RelativeAnchorEditor;

RelativeAnchorEditor.prototype.ev_contextMenu = function (event) {
    var self = this;
    var items = [];
    function makeItem(name) {
        if (name === null) return '=====';
        var cmdDescriptor = LayoutEditorCmdDescriptors[name];
        var res = {
            icon: cmdDescriptor.icon,
            text: cmdDescriptor.desc,
            cmd: name
        };
        if (cmdDescriptor.bindKey && cmdDescriptor.bindKey.win) {
            res.key = cmdDescriptor.bindKey.win;
        }
        return res;
    }
    if (this.layoutEditor.anchorEditors.length > 1) {
        items.push.apply(items, [
            'alignLeftDedge',
            'alignHorizontalCenter',
            'alignRightDedge',
            'equaliseWidth',
            null,
            'alignTopDedge',
            'alignVerticalCenter',
            'alignBottomDedge',
            'equaliseHeight',
            null
        ].map(makeItem));
    }


    if (this.layoutEditor.anchorEditors.length > 2) {
        items.push.apply(items, [
            'distributeHorizontalLeft',
            'distributeHorizontalCenter',
            'distributeHorizontalRight',
            'distributeHorizontalDistance',
            null,
            'distributeVerticalTop',
            'distributeVerticalCenter',
            'distributeVerticalBottom',
            'distributeVerticalDistance',
            null
        ].map(makeItem));
    }

    if (this.layoutEditor.anchorEditors.length == 1 && this.layoutEditor.anchorEditors[0].component.reMeasureChild) {
        items.push({
            icon: 'span.mdi.mdi-square-edit-outline[style="color:blue"]',
            text: 'Edit Layout',
            cmd: this.cmd_layoutEdit.bind(this)
        });
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
        else if (typeof cmd == 'string') {
            self.layoutEditor.execCmd(cmd);
        }
        self.layoutEditor.getView().focus();
    });
    event.stopPropagation();
};

RelativeAnchorEditor.prototype.focus = function () {
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

RelativeAnchorEditor.prototype.blur = function () {
    if (!this.isFocus) return;
    this.isFocus = false;
    this.$resizeBox.removeClass('as-focus');
    this.emit('blur', { type: 'blur', target: this }, this);
};


RelativeAnchorEditor.prototype.update = function () {
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


RelativeAnchorEditor.prototype.updatePosition = function () {
    if (this.component) {
        var bound = this.layoutEditor.$forceground.getBoundingClientRect();
        var compBound = this.component.view.getBoundingClientRect();
        var styleLeft = this.component.getStyle('left', 'px');
        var styleTop = this.component.getStyle('top', 'px');
        var styleRight = this.component.getStyle('right', 'px');
        var styleBottom = this.component.getStyle('bottom', 'px');
        this.$resizeBox.addStyle({
            left: compBound.left - bound.left + 'px',
            top: compBound.top - bound.top + 'px',
            width: compBound.width + 'px',
            height: compBound.height + 'px'
        });

        if (this.$leftAlignLine.parentNode)
            this.$leftAlignLine.addStyle({
                left: compBound.left - bound.left - styleLeft + 'px',
                width: styleLeft + 'px',
                top: compBound.top - bound.top + compBound.height / 2 + 'px',
            });

        if (this.$rightAlignLine.parentNode)
            this.$rightAlignLine.addStyle({
                left: compBound.right - bound.left + 'px',
                width: styleRight + 'px',
                top: compBound.top - bound.top + compBound.height / 2 + 'px',
            });

        if (this.$topAlignLine.parentNode)
            this.$topAlignLine.addStyle({
                top: compBound.top - bound.top - styleTop + 'px',
                height: styleTop + 'px',
                left: compBound.left - bound.left + compBound.width / 2 + 'px',
            });

        if (this.$bottomAlignLine.parentNode)
            this.$bottomAlignLine.addStyle({
                top: compBound.bottom - bound.top + 'px',
                height: styleBottom + 'px',
                left: compBound.left - bound.left + compBound.width / 2 + 'px',
            });
    }
};



RelativeAnchorEditor.prototype.ev_beginMove = function (userAction, event) {
    var bound = this.layoutEditor.$forceground.getBoundingClientRect();
    this.component.reMeasure();
    var snapLines = this.getSnapLines();
    this.movingData = {
        x0: event.clientX - bound.left,
        y0: event.clientY - bound.top,
        dx: 0,
        dy: 0,
        option: event.option,
        styleDescriptors: this.component.getStyleDescriptors(),
        style0: Object.assign(
            {},
            this.component.style,
            {
                left: this.component.getStyle('left', 'px'),
                right: this.component.getStyle('right', 'px'),
                top: this.component.getStyle('top', 'px'),
                bottom: this.component.getStyle('bottom', 'px'),
                width: this.component.getStyle('width', 'px'),
                height: this.component.getStyle('height', 'px')
            }
        ),
        comp: this.component,
        isChange: false,
        snapLines: snapLines,
        $snapXLines: [],
        $snapYLines: [],
        nearestYVal: 10000000,
        nearestY: [],
        nearestXVal: 10000000,
        nearestX: [],
    };
    if (userAction) {
        this.emit('beginmove', { type: 'beginmove', target: this, originEvent: event.originEvent || event, repeatEvent: event, target: this }, this);
        this.$modal.addTo(document.body);
        this._updateSnapLines();
    }
};



RelativeAnchorEditor.prototype.ev_moving = function (userAction, event) {
    var movingData = this.movingData;
    var bound = this.layoutEditor.$forceground.getBoundingClientRect();
    var x = event.clientX - bound.left;
    var y = event.clientY - bound.top;

    movingData.dx = x - movingData.x0;
    movingData.dy = y - movingData.y0;
    if (event.originEvent.ctrlKey) {
        var newW, newH, dH, dW;
        if (movingData.option.body) {
            if (Math.abs(movingData.dx) < Math.abs(movingData.dy)) {
                movingData.dx = 0;
            }
            else {
                movingData.dy = 0;
            }
        }
        else {
            if (movingData.option.right) {
                if (!!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                    newW = Math.max(0, movingData.style0.width + movingData.dx * 2);
                }
                else {
                    newW = Math.max(0, movingData.style0.width + movingData.dx);
                }
                newH = movingData.style0.height * newW / Math.max(1, movingData.style0.width);


            }
            else if (movingData.option.left) {
                if (!!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                    newW = Math.max(0, movingData.style0.width - movingData.dx * 2);
                }
                else {
                    newW = Math.max(0, movingData.style0.width - movingData.dx);
                }
                newH = movingData.style0.height * newW / Math.max(1, movingData.style0.width);
            }
        }
        if (movingData.option.bottom) {
            movingData.dy = newH - movingData.style0.height;
            if (!!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.dy /= 2;
            }
        }
        else if (movingData.option.top) {
            movingData.dy = -(newH - movingData.style0.height);
            if (!!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.dy /= 2;
            }
        }
    }

    var positionIsChange = false;

    if (movingData.styleDescriptors.left && !movingData.styleDescriptors.left.disabled && (movingData.option.left || movingData.option.body)) {
        movingData.comp.setStyle('left', Math.max(0, movingData.style0.left + movingData.dx), 'px');
        positionIsChange = true;
    }

    if (movingData.styleDescriptors.right && !movingData.styleDescriptors.right.disabled && (movingData.option.right || movingData.option.body)) {
        movingData.comp.setStyle('right', Math.max(0, movingData.style0.right - movingData.dx), 'px');
        positionIsChange = true;

    }

    if (movingData.styleDescriptors.width && !movingData.styleDescriptors.width.disabled) {
        if (movingData.option.left) {
            if (!!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                movingData.comp.setStyle('width', Math.max(movingData.comp.measureMinSize().width, movingData.style0.width - movingData.dx * 2), 'px');
            }
            else {
                movingData.comp.setStyle('width', Math.max(movingData.style0.width - movingData.dx), 'px');
            }
            positionIsChange = true;
        }
        if (movingData.option.right) {
            if (movingData.styleDescriptors.left && !!movingData.styleDescriptors.left.disabled && !!movingData.styleDescriptors.right.disabled) {
                movingData.comp.setStyle('width', Math.max(movingData.comp.measureMinSize().width, movingData.style0.width + movingData.dx * 2), 'px');
                //center align
            }
            else {
                movingData.comp.setStyle('width', Math.max(movingData.comp.measureMinSize().width, movingData.style0.width + movingData.dx), 'px');
            }
            positionIsChange = true;
        }
    }

    if (movingData.styleDescriptors.top && !movingData.styleDescriptors.top.disabled && (movingData.option.top || movingData.option.body)) {
        movingData.comp.setStyle('top', Math.max(0, movingData.style0.top + movingData.dy), 'px');
        positionIsChange = true;
    }

    if (movingData.styleDescriptors.bottom && !movingData.styleDescriptors.bottom.disabled && (movingData.option.bottom || movingData.option.body)) {
        movingData.comp.setStyle('bottom', Math.max(0, movingData.style0.bottom - movingData.dy), 'px');
        positionIsChange = true;
    }

    if (movingData.styleDescriptors.height && !movingData.styleDescriptors.height.disabled) {
        if (movingData.option.top) {
            if (movingData.styleDescriptors.top && !!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height - movingData.dy * 2), 'px');
            }
            else {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height - movingData.dy), 'px');
            }
            positionIsChange = true;

        }
        if (movingData.option.bottom) {
            if (movingData.styleDescriptors.top && !!movingData.styleDescriptors.top.disabled && !!movingData.styleDescriptors.bottom.disabled) {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height + movingData.dy * 2), 'px');
            }
            else {
                movingData.comp.setStyle('height', Math.max(movingData.comp.measureMinSize().height, movingData.style0.height + movingData.dy), 'px');
            }
            positionIsChange = true;
        }
    }

    this.updatePosition();
    movingData.comp.reMeasure();
    if (positionIsChange) {
        this.emit("reposition", { type: 'reposition', component: movingData.comp, movingData: movingData, originEvent: event.originEvent || event, repeatEvent: event }, this);
        movingData.isChange = true;
    }
    if (userAction) {
        this.emit('moving', { taget: this, type: 'moving', originEvent: event.originEvent || event, repeatEvent: event, target: this, repeatEvent: event }, this);
        this._updateSnapLines();
    }
};


RelativeAnchorEditor.prototype.ev_endMove = function (userAction, event) {
    if (this.movingData.isChange) {
        this.emit('change', { type: 'change', target: this, component: this.movingData.comp, originEvent: event.originEvent || event, repeatEvent: event }, this);
    }

    if (userAction) {
        this.emit('endmove', { taget: this, type: 'moving', originEvent: event.originEvent || event, target: this, repeatEvent: event }, this);
        this.$modal.remove();
        this.movingData.$snapYLines.forEach(function (e) {
            e.remove();
        });
        this.movingData.$snapXLines.forEach(function (e) {
            e.remove();
        });
        if (this.movingData.nearestXVal <= this.snapDistance) {
            var firsLineX = this.movingData.nearestX[0];

            if (firsLineX.flat & 1) {
                this.alignLeftDedge(firsLineX.value, this.movingData.body);
            }
            else if (firsLineX.flat & 2) {
                this.alignHorizontalCenter(this.layoutEditor.rootLayout.style.width - 2 * firsLineX.value);
            }
            else if (firsLineX.flat & 4) {
                this.alignRightDedge(this.layoutEditor.rootLayout.style.width - firsLineX.value, this.movingData.body);
            }
        }

        if (this.movingData.nearestYVal <= this.snapDistance) {
            var firsLineY = this.movingData.nearestY[0];

            if (firsLineY.flat & 1) {
                this.alignTopDedge(firsLineY.value, this.movingData.body);
            }
            else if (firsLineY.flat & 2) {
                this.alignVerticalCenter(this.layoutEditor.rootLayout.style.height - 2 * firsLineY.value);
            }
            else if (firsLineY.flat & 4) {
                this.alignBottomDedge(this.layoutEditor.rootLayout.style.height - firsLineY.value, this.movingData.body);
            }
        }
    };

    this.movingData = undefined;
};


RelativeAnchorEditor.prototype._updateSnapLines = function () {
    return;//todo
    // as-align-horizontal-lin
    var nearestYVal = 10000;
    var nearestY = [];
    var top = this.component.style.top;
    var middleY = this.component.style.top + this.component.style.height / 2;
    var bottom = this.component.style.top + this.component.style.height;
    var yLines = this.movingData.snapLines.y;
    var line;
    var dist;
    var yIsSmaller;
    var option = this.movingData.option;
    for (var i = 0; i < yLines.length; ++i) {
        line = yLines[i];
        if ((line.flat & 1) && (option.body || option.top)) {
            dist = Math.abs(line.value - top);
            if (dist < nearestYVal) {
                nearestY = [line];
                nearestYVal = dist;
                yIsSmaller = line.value < top;
            }
            else if (dist == nearestYVal && (line.value < top) == yIsSmaller) {
                nearestY.push(line);
            }
        }
        else if ((line.flat & 2) && (option.body)) {
            dist = Math.abs(line.value - middleY);
            if (dist < nearestYVal) {
                nearestY = [line];
                nearestYVal = dist;
                yIsSmaller = line.value < middleY;
            }
            else if (dist == nearestYVal && (line.value < middleY) == yIsSmaller) {
                nearestY.push(line);
            }
        }
        else if ((line.flat & 4) && (option.body || option.bottom)) {
            dist = Math.abs(line.value - bottom);
            if (dist < nearestYVal) {
                nearestY = [line];
                nearestYVal = dist;
                yIsSmaller = line.value < bottom;
            }
            else if (dist == nearestYVal && (line.value < bottom) == yIsSmaller) {
                nearestY.push(line);
            }
        }
        // if 
    }

    var layoutBound = this.layoutEditor.rootLayout.view.getBoundingClientRect();
    var forcegroundBound = this.layoutEditor.$forceground.getBoundingClientRect();
    while (this.movingData.$snapYLines.length < nearestY.length) {
        this.movingData.$snapYLines.push(_({
            class: 'as-align-horizontal-line',
            style: {
                left: layoutBound.left - forcegroundBound.left + 'px',
                width: layoutBound.width + 'px',
            }
        }).addTo(this.layoutEditor.$forceground));
    }

    while (this.movingData.$snapYLines.length > nearestY.length) {
        this.movingData.$snapYLines.pop().remove();
    }


    for (var i = 0; i < nearestY.length; ++i) {
        this.movingData.$snapYLines[i].addStyle('top', layoutBound.left - forcegroundBound.left + nearestY[i].value + 'px');
        if (nearestYVal <= this.snapDistance) {
            this.movingData.$snapYLines[i].addClass('as-active');
        }
        else {
            this.movingData.$snapYLines[i].removeClass('as-active');
        }
    }
    this.movingData.nearestY = nearestY;
    this.movingData.nearestYVal = nearestYVal;

    var nearestXVal = 10000;
    var nearestX = [];
    var left = this.component.style.left;
    var middleX = this.component.style.left + this.component.style.width / 2;
    var right = this.component.style.left + this.component.style.width;
    var xLines = this.movingData.snapLines.x;
    var line;
    var dist;
    var xIsSmaller;
    for (var i = 0; i < xLines.length; ++i) {
        line = xLines[i];
        if ((line.flat & 1) && (option.body || option.left)) {
            dist = Math.abs(line.value - left);
            if (dist < nearestXVal) {
                nearestX = [line];
                nearestXVal = dist;
                xIsSmaller = line.value < left;
            }
            else if (dist == nearestXVal && (line.value < left) == xIsSmaller) {
                nearestX.push(line);
            }
        }
        else if ((line.flat & 2) && (option.body)) {
            dist = Math.abs(line.value - middleX);
            if (dist < nearestXVal) {
                nearestX = [line];
                nearestXVal = dist;
                xIsSmaller = line.value < middleX;
            }
            else if (dist == nearestXVal && (line.value < middleX) == xIsSmaller) {
                nearestX.push(line);
            }
        }
        else if ((line.flat & 4) && (option.body || option.right)) {
            dist = Math.abs(line.value - right);
            if (dist < nearestXVal) {
                nearestX = [line];
                nearestXVal = dist;
                xIsSmaller = line.value < right;

            }
            else if (dist == nearestXVal && (line.value < right) == xIsSmaller) {
                nearestX.push(line);
            }
        }
        // if 
    }

    var layoutBound = this.layoutEditor.rootLayout.view.getBoundingClientRect();
    var forcegroundBound = this.layoutEditor.$forceground.getBoundingClientRect();
    while (this.movingData.$snapXLines.length < nearestX.length) {
        this.movingData.$snapXLines.push(_({
            class: 'as-align-vertical-line',
            style: {
                top: layoutBound.top - forcegroundBound.top + 'px',
                height: layoutBound.height + 'px',
            }
        }).addTo(this.layoutEditor.$forceground));
    }

    while (this.movingData.$snapXLines.length > nearestX.length) {
        this.movingData.$snapXLines.pop().remove();
    }


    for (var i = 0; i < nearestX.length; ++i) {
        this.movingData.$snapXLines[i].addStyle('left', layoutBound.left - forcegroundBound.left + nearestX[i].value + 'px');
        if (nearestXVal <= this.snapDistance) {
            this.movingData.$snapXLines[i].addClass('as-active');
        }
        else {
            this.movingData.$snapXLines[i].removeClass('as-active');
        }
    }
    this.movingData.nearestX = nearestX;
    this.movingData.nearestXVal = nearestXVal;
};


RelativeAnchorEditor.prototype.cmd_alignLeftDedge = function () {
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


RelativeAnchorEditor.prototype.cmd_alignRightDedge = function () {
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

RelativeAnchorEditor.prototype.cmd_alignHorizontalCenter = function () {
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

RelativeAnchorEditor.prototype.cmd_equaliseWidth = function () {
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


RelativeAnchorEditor.prototype.alignLeftDedge = function (leftValue, keepSize) {
    if (!this.component) return;
    this.component.reMeasure();
    var lLeft = this.component.style.left;
    var lRight = this.component.style.right;
    var currentHAlign = this.component.getStyle('hAlign');
    switch (currentHAlign) {
        case 'left':
            this.component.setStyle('left', leftValue); break;
        case 'fixed':
            this.component.setStyle('left', leftValue);
            if (keepSize) {
                this.component.setStyle('right', lRight - (leftValue - lLeft));
            }
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


RelativeAnchorEditor.prototype.alignRightDedge = function (rightValue, keepSize) {
    if (!this.component) return;
    this.component.reMeasure();
    var currentHAlign = this.component.getStyle('hAlign');
    var lLeft = this.component.style.left;
    var lRight = this.component.style.right;
    switch (currentHAlign) {
        case 'right':
            this.component.setStyle('right', rightValue);
            break;
        case 'fixed':
            this.component.setStyle('right', rightValue);
            if (keepSize) {
                this.component.setStyle('left', lLeft - (rightValue - lRight));
            }
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


RelativeAnchorEditor.prototype.alignHorizontalCenter = function (centerValue) { // right - left
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


RelativeAnchorEditor.prototype.equaliseWidth = function (widthValue) {
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



RelativeAnchorEditor.prototype.cmd_alignTopDedge = function () {
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


RelativeAnchorEditor.prototype.cmd_alignBottomDedge = function () {
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

RelativeAnchorEditor.prototype.cmd_alignVerticalCenter = function () {
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

RelativeAnchorEditor.prototype.cmd_equaliseHeight = function () {
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



RelativeAnchorEditor.prototype.alignTopDedge = function (topValue, keepSize) {
    if (!this.component) return;
    this.component.reMeasure();
    var currentVAlign = this.component.getStyle('vAlign');
    var lTop = this.component.style.top;
    var lBottom = this.component.style.bottom;
    switch (currentVAlign) {
        case 'top':
            this.component.setStyle('top', topValue);
            break;
        case 'fixed':
            this.component.setStyle('top', topValue);
            if (keepSize) {
                this.component.setStyle('bottom', lBottom - (topValue - lTop));
            }
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


RelativeAnchorEditor.prototype.alignBottomDedge = function (bottomValue, keepSize) {
    if (!this.component) return;
    this.component.reMeasure();
    var currentVAlign = this.component.getStyle('vAlign');

    switch (currentVAlign) {
        case 'bottom':
            this.component.setStyle('bottom', bottomValue);
            break;
        case 'fixed':
            this.component.setStyle('bottom', bottomValue);
            if (keepSize) {
                this.component.setStyle('top', lTop - (bottomValue - lBottom));
            }
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


RelativeAnchorEditor.prototype.alignVerticalCenter = function (centerValue) { // bottom - top
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


RelativeAnchorEditor.prototype.equaliseHeight = function (heightValue) {
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





RelativeAnchorEditor.prototype.cmd_distributeHorizontalLeft = function () {
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

RelativeAnchorEditor.prototype.cmd_distributeHorizontalCenter = function () {
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



RelativeAnchorEditor.prototype.cmd_distributeHorizontalRight = function () {
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

RelativeAnchorEditor.prototype.cmd_distributeHorizontalDistance = function () {
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




RelativeAnchorEditor.prototype.cmd_distributeVerticalTop = function () {
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


RelativeAnchorEditor.prototype.cmd_distributeVerticalCenter = function () {
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



RelativeAnchorEditor.prototype.cmd_distributeVerticalBottom = function () {
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


RelativeAnchorEditor.prototype.cmd_distributeVerticalDistance = function () {
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




/**
 * @returns {{x:Array<{components:Array, value:Number}>, y:Array<{components:Array, value:Number}, flat:Number>}}
 */
RelativeAnchorEditor.prototype.getSnapLines = function () {
    if (!this.component.parent) return { x: [], y: [] };
    var children = this.component.parent.children;
    var xComp = [];
    var yComp = [];
    var comp;
    for (var i = 0; i < children.length; ++i) {
        comp = children[i];
        if (this.component == comp) continue;
        comp.reMeasure();
        xComp.push({ component: comp, value: comp.style.left, flat: 1 });
        xComp.push({ component: comp, value: comp.style.left + comp.style.width / 2, flat: 2 });
        xComp.push({ component: comp, value: comp.style.left + comp.style.width, flat: 4 });

        yComp.push({ component: comp, value: comp.style.top, flat: 1 });
        yComp.push({ component: comp, value: comp.style.top + comp.style.height / 2, flat: 2 });
        yComp.push({ component: comp, value: comp.style.top + comp.style.height, flat: 4 });
    }

    var cmp = function (a, b) {
        return a.value - b.value;
    };
    xComp.sort(cmp);
    yComp.sort(cmp);

    var reducer = function (ac, cr) {
        if (ac.last.value != cr.value) {
            ac.last = { components: [cr.component], value: cr.value, flat: 0 };
            ac.result.push(ac.last);
        }
        else {
            if (ac.last.components.indexOf(cr.component) < 0)
                ac.last.components.push(cr.component);
        }
        ac.last.flat = ac.last.flat | cr.flat;
        return ac;
    };

    return {
        x: xComp.reduce(reducer, { result: [], last: { value: -1000000, components: [], flat: 0 } }).result,
        y: yComp.reduce(reducer, { result: [], last: { value: -1000000, components: [], flat: 0 } }).result
    };
};


export default RelativeAnchorEditor;