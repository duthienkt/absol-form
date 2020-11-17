import Fcore from '../core/FCore';

import '../../css/anchoreditor.css';
import '../dom/Icons';
import BaseAnchorEditor from '../core/BaseAnchorEditor';
import LinearAnchorEditorCmd, { LinearAnchorEditorCmdTree, LinearAnchorEditorCmdDescriptors } from '../cmds/LinearAnchorEditorCmd';

var _ = Fcore._;
var $ = Fcore.$;


/**
 * 
 * @param {import('../editor/LayoutEditor').default} layoutEditor 
 */
function LinearAnchorEditor(layoutEditor) {
    BaseAnchorEditor.call(this, layoutEditor);
    this.cmdRunner.assign(LinearAnchorEditorCmd);
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
        .on('click', function (ev) {
            self.emit('click', ev, true);
        })
        .on('dblclick', this.execCmd.bind(this, 'layoutEdit'));

    this.$resizeBox.defineEvent('contextmenu');
    this.$resizeBox.on('contextmenu', this.ev_contextMenu.bind(this));
    this.movingData = null;
    this.isFocus = false;
}

Object.defineProperties(LinearAnchorEditor.prototype, Object.getOwnPropertyDescriptors(BaseAnchorEditor.prototype));
LinearAnchorEditor.prototype.constructor = LinearAnchorEditor;


LinearAnchorEditor.prototype.ev_contextMenu = function (event) {
    var self = this;
    var items = [];

    function makeItem(name) {
        if (name === null) return '=====';
        var cmdDescriptor = LinearAnchorEditorCmdDescriptors[name];
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

    items = [
        'horizontalAlignLeft',
        'horizontalAlignCenter',
        'horizontalAlignRight'
    ].concat(this.layoutEditor.anchorEditors.length > 1 ? [] : [
        'equaliseWidth'
    ]).concat([
        null,
        'verticalAlignTop',
        'verticalAlignCenter',
        'verticalAlignBottom'
    ]).concat(this.layoutEditor.anchorEditors.length > 1 ? [] : [
        'equaliseHeight'
    ]).concat([null]).map(makeItem);

    if (this.layoutEditor.anchorEditors.length == 1 && this.layoutEditor.anchorEditors[0].component.reMeasureChild) {
        items.push({
            icon: 'span.mdi.mdi-square-edit-outline[style="color:blue"]',
            text: 'Edit Layout',
            cmd: this.execCmd.bind(this, 'layoutEdit')
        });
    }

    items.push({
        icon: 'span.mdi.mdi-delete-variant[style="color:red"]',
        text: 'Delete',
        cmd: 'delete'
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




    // event.stopPropagation();
};


LinearAnchorEditor.prototype.focusMarginBox = function () {
    if (!this.component) return;
    if (this.isFocus) {
        // this.$resizeBox.removeClass('as-focus');// this is feature, not bug
        // this.$marginBox.addClass('as-focus');
    }
    else {
        // this.$marginBox.addClass('as-focus');
        this.$resizeBox.addClass('as-focus')
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
            left: (compBound.left - bound.left) / this.layoutEditor._softScale + 'px',
            top: (compBound.top - bound.top) / this.layoutEditor._softScale + 'px',
            width: compBound.width / this.layoutEditor._softScale + 'px',
            height: compBound.height / this.layoutEditor._softScale + 'px'
        });
        this.$marginBox.addStyle({
            left: (compBound.left - bound.left) / this.layoutEditor._softScale - this.component.getStyle('left', 'px') + 'px',
            top: (compBound.top - bound.top) / this.layoutEditor._softScale - this.component.getStyle('top', 'px') + 'px',
            width: compBound.width / this.layoutEditor._softScale + this.component.getStyle('left', 'px') + this.component.getStyle('right', 'px') + 'px',
            height: compBound.height / this.layoutEditor._softScale + this.component.getStyle('top', 'px') + this.component.getStyle('bottom', 'px') + 'px'
        });
    }
};


LinearAnchorEditor.prototype.ev_beginMove = function (userAction, event) {
    var bound = this.layoutEditor.$forceground.getBoundingClientRect();
    this.movingData = {
        x0: (event.clientX - bound.left) / this.layoutEditor._softScale,
        y0: (event.clientY - bound.top) / this.layoutEditor._softScale,
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
    };
    if (userAction) {
        this.emit('beginmove', { type: 'beginmove', target: this, originEvent: event, repeatEvent: event }, this);
        this.$modal.addTo(document.body);
        this.layoutEditor.$mouseOffsetStatus.children[2].innerHTML = ' Δ' + this.movingData.dx + ', ' + this.movingData.dy;
    }
};



LinearAnchorEditor.prototype.ev_moving = function (userAction, event) {
    var movingData = this.movingData;
    var bound = this.layoutEditor.$forceground.getBoundingClientRect();

    var x = (event.clientX - bound.left) / this.layoutEditor._softScale;
    var y = (event.clientY - bound.top) / this.layoutEditor._softScale;
    movingData.dx = x - movingData.x0;
    movingData.dy = y - movingData.y0;

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


    movingData.comp.reMeasure();
    this.updatePosition();
    if (positionIsChange) {
        this.emit("reposition", { type: 'reposition', component: movingData.comp, movingData: movingData, originEvent: event, repeatEvent: event }, this);
        movingData.isChange = true;
    }
    if (userAction) {
        this.emit('moving', { taget: this, type: 'moving', originEvent: event, repeatEvent: event, target: this }, this);
        this.layoutEditor.$mouseOffsetStatus.children[2].innerHTML = ' Δ' + this.movingData.dx + ', ' + this.movingData.dy;
    }
};

LinearAnchorEditor.prototype.ev_movingMargin = function (userAction, event) {
    var movingData = this.movingData;
    var bound = this.layoutEditor.$forceground.getBoundingClientRect();

    var x = (event.clientX - bound.left) / this.layoutEditor._softScale;
    var y = (event.clientY - bound.top) / this.layoutEditor._softScale;
    movingData.dx = x - movingData.x0;
    movingData.dy = y - movingData.y0;
    var positionIsChange = false;

    if (movingData.styleDescriptors.bottom && event.option.bottom) {
        movingData.comp.setStyle('bottom', Math.max(0, movingData.style0.bottom + movingData.dy), 'px');
        positionIsChange = true;
    }
    if (movingData.styleDescriptors.right && event.option.right) {
        movingData.comp.setStyle('right', Math.max(0, movingData.style0.right + movingData.dx), 'px');
        positionIsChange = true;
    }

    this.updatePosition();
    movingData.comp.reMeasure();
    if (positionIsChange) {
        this.emit("reposition", { type: 'reposition', component: movingData.comp, movingData: movingData, originEvent: event }, this);
        movingData.isChange = true;
    }
    if (userAction) {
        this.emit('moving', { taget: this, type: 'moving', originEvent: event, target: this }, this);
        this.layoutEditor.$mouseOffsetStatus.children[2].innerHTML = ' Δ' + this.movingData.dx + ', ' + this.movingData.dy;
    }
};


LinearAnchorEditor.prototype.ev_endMove = function (userAction, event) {
    if (this.movingData.isChange) {
        this.emit('change', { type: 'change', target: this, component: this.movingData.comp, originEvent: event }, this);
    }
    this.movingData = undefined;
    if (userAction) {
        this.emit('endmove', { taget: this, type: 'moving', originEvent: event, target: this }, this);
        setTimeout(this.$modal.selfRemove.bind(this.$modal), 100);
        this.layoutEditor.$mouseOffsetStatus.children[2].innerHTML = '';
    }
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
    this.component.setStyle('width', widthValue, 'px');
    this.updatePosition();
};



LinearAnchorEditor.prototype.equaliseHeight = function (heightValue) {
    if (!this.component) return;
    this.component.setStyle('height', heightValue, 'px');
    this.updatePosition();
};

LinearAnchorEditor.prototype.verticalAlignTop = function () {
    if (!this.component) return;
    var styleBot = (this.component.getStyle('top', 'px') + this.component.getStyle('bottom', 'px'));
    this.component.setStyle('top', 0, 'px');
    this.component.setStyle('bottom', styleBot, 'px');
    this.updatePosition();
};


LinearAnchorEditor.prototype.verticalAlignCenter = function () {
    if (!this.component) return;
    var styleTopBot = (this.component.getStyle('top', 'px') + this.component.getStyle('bottom', 'px')) / 2;
    this.component.setStyle('top', styleTopBot, 'px');
    this.component.setStyle('bottom', styleTopBot, 'px');
    this.updatePosition();
};

LinearAnchorEditor.prototype.verticalAlignBottom = function () {
    if (!this.component) return;
    var styleTop = (this.component.getStyle('top', 'px') + this.component.getStyle('bottom', 'px'));
    this.component.setStyle('top', styleTop, 'px');
    this.component.setStyle('bottom', 0, 'px');
    this.updatePosition();
};


LinearAnchorEditor.prototype.horizontalAlignRight = function () {
    if (!this.component) return;
    var styleLeft = (this.component.getStyle('left', 'px') + this.component.getStyle('right', 'px'));
    this.component.setStyle('left', styleLeft, 'px');
    this.component.setStyle('right', 0, 'px');
    this.updatePosition();
};


LinearAnchorEditor.prototype.horizontalAlignLeft = function () {
    if (!this.component) return;
    var styleRight = (this.component.getStyle('left', 'px') + this.component.getStyle('right', 'px'));
    this.component.setStyle('right', styleRight, 'px');
    this.component.setStyle('left', 0, 'px');
    this.updatePosition();
};


LinearAnchorEditor.prototype.horizontalAlignCenter = function () {
    if (!this.component) return;
    var styleLeftRight = (this.component.getStyle('left', 'px') + this.component.getStyle('right', 'px')) / 2;
    this.component.setStyle('left', styleLeftRight, 'px');
    this.component.setStyle('right', styleLeftRight, 'px');
    this.updatePosition();
};





LinearAnchorEditor.prototype.getCmdGroupTree = function () {
    return LinearAnchorEditorCmdTree;
};

LinearAnchorEditor.prototype.getCmdDescriptor = function (name) {
    return LinearAnchorEditorCmdDescriptors[name];
};


LinearAnchorEditor.prototype.execCmd = function () {
    return this.cmdRunner.invoke.apply(this.cmdRunner, arguments);
};


export default LinearAnchorEditor;