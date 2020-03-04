import BaseAnchorEditorCmd from './BaseAnchorEditorCmd';

/**
 * @type {import('../anchoreditors/LinearAnchorEditor').default}
 */
var LinearAnchorEditorCmd = Object.assign({}, BaseAnchorEditorCmd);;


LinearAnchorEditorCmd.equaliseWidth = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var widthValue = this.component.getStyle('width', 'px');
    for (var i = 0; i < editors.length; ++i) {
        var editor = editors[i];
        if (editor == this) continue;
        editor.equaliseWidth(widthValue);
    }
    this.layoutEditor.commitHistory('move', 'Equalise Width');

};


LinearAnchorEditorCmd.equaliseHeight = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var heightValue = this.component.getStyle('height', 'px');
    for (var i = 0; i < editors.length; ++i) {
        var editor = editors[i];
        if (editor == this) continue;
        editor.equaliseHeight(heightValue);
    }
    this.layoutEditor.commitHistory('move', 'Equalise Height');

};



LinearAnchorEditorCmd.verticalAlignTop = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    for (var i = 0; i < editors.length; ++i) {
        var editor = editors[i];
        editor.verticalAlignTop();
    }
    this.layoutEditor.commitHistory('move', 'Vertical Align Top');
};


LinearAnchorEditorCmd.verticalAlignCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    for (var i = 0; i < editors.length; ++i) {
        var editor = editors[i];
        editor.verticalAlignCenter();
    }
    this.layoutEditor.commitHistory('move', 'Vertical Align Center');
};


LinearAnchorEditorCmd.verticalAlignBottom = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    for (var i = 0; i < editors.length; ++i) {
        var editor = editors[i];
        editor.verticalAlignBottom();
    }
    this.layoutEditor.commitHistory('move', 'Vertical Align Bottom');
};


LinearAnchorEditorCmd.horizontalAlignLeft = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    for (var i = 0; i < editors.length; ++i) {
        var editor = editors[i];
        editor.horizontalAlignLeft();
    }
    this.layoutEditor.commitHistory('move', 'Horizontal Align Left');
};


LinearAnchorEditorCmd.horizontalAlignCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    for (var i = 0; i < editors.length; ++i) {
        var editor = editors[i];
        editor.horizontalAlignCenter();
    }
    this.layoutEditor.commitHistory('move', 'Horizontal Align Center');
};


LinearAnchorEditorCmd.horizontalAlignRight = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    for (var i = 0; i < editors.length; ++i) {
        var editor = editors[i];
        editor.horizontalAlignRight();
    }
    this.layoutEditor.commitHistory('move', 'Horizontal Align Right');
};


export default LinearAnchorEditorCmd;


export var LinearAnchorEditorCmdTree = [
    [
        [
            'horizontalAlignLeft',
            'horizontalAlignCenter',
            'horizontalAlignRight',
            'equaliseWidth'
        ],
        [
            'verticalAlignTop',
            'verticalAlignCenter',
            'verticalAlignBottom',
            'equaliseHeight'
        ]
    ]
];

export var LinearAnchorEditorCmdDescriptors = {
    equaliseWidth: {
        type: 'trigger',
        icon: 'span.mdi.mdi-arrow-expand-horizontal',
        desc: 'Equalise Width'
    },
    equaliseHeight: {
        type: 'trigger',
        icon: 'span.mdi.mdi-arrow-expand-vertical',
        desc: 'Equalise Height',
    },
    verticalAlignTop: {
        type: 'trigger',
        icon: 'span.mdi.mdi-format-vertical-align-top',
        desc: 'Vertical Align Top',
    },
    verticalAlignCenter: {
        type: 'trigger',
        icon: 'span.mdi.mdi-format-vertical-align-center',
        desc: 'Vertical Align Center',
    },
    verticalAlignBottom: {
        type: 'trigger',
        icon: 'span.mdi.mdi-format-vertical-align-bottom',
        desc: 'Vertical Align Bottom',
    },
    horizontalAlignLeft: {
        type: 'trigger',
        icon: 'span.mdi.mdi-format-horizontal-align-left',
        desc: 'Horizontal Align Left',
    },
    horizontalAlignCenter: {
        type: 'trigger',
        icon: 'span.mdi.mdi-format-horizontal-align-center',
        desc: 'Horizontal Align Center',
    },
    horizontalAlignRight: {
        type: 'trigger',
        icon: 'span.mdi.mdi-format-horizontal-align-right',
        desc: 'Horizontal Align Right',
    }
};