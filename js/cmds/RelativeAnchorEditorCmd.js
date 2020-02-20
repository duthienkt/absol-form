
/**
 * @type {import("../anchoreditors/RelativeAnchorEditor").default}
 */
var RelativeAnchorEditorCmd = {};



RelativeAnchorEditorCmd.distributeHorizontalLeft = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    var editorHolders = editors.map(function (e) {
        return {
            left: e.component.getStyle('left', 'px'),
            editor: e
        };
    });
    editorHolders.sort(function (a, b) {
        return a.left - b.left;
    });

    var minX = editorHolders[0].left;
    var maxX = editorHolders[editors.length - 1].left;

    if (minX == maxX) return;
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editorHolders[i].editor;
        editor.alignLeftDedge(minX + (maxX - minX) / (editors.length - 1) * i, true);
    }
    this.layoutEditor.commitHistory('move', 'Distribute Horizontal Left');
};

RelativeAnchorEditorCmd.distributeHorizontalCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    var editorHolders = editors.map(function (e) {
        return {
            left: e.component.getStyle('left', 'px'),
            width: e.component.getStyle('width', 'px'),
            editor: e
        };
    });

    editorHolders.sort(function (a, b) {
        return (a.left + a.width / 2) - (b.left + b.width / 2);
    });
    var minX = (editorHolders[0].left + editorHolders[0].width / 2);
    var maxX = (editorHolders[editors.length - 1].left + editorHolders[editors.length - 1].width / 2);
    if (minX == maxX) return;
    var eHolder;
    for (i = 1; i < editors.length - 1; ++i) {
        eHolder = editorHolders[i]
        editor = eHolder.editor;
        editor.alignLeftDedge(minX + (maxX - minX) / (editors.length - 1) * i - eHolder.width / 2, true);
    }
    this.layoutEditor.commitHistory('move', 'Distribute Horizontal Center');
};



RelativeAnchorEditorCmd.distributeHorizontalRight = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    var editorHolders = editors.map(function (e) {
        return {
            right: e.component.getStyle('right', 'px'),
            editor: e
        };
    });
    editorHolders.sort(function (a, b) {
        return a.right - b.right;
    });

    var minX = editorHolders[0].right;
    var maxX = editorHolders[editorHolders.length - 1].right;
    if (minX == maxX) return;
    for (i = 1; i < editors.length - 1; ++i) {
        editor = editorHolders[i].editor;
        editor.alignRightDedge(minX + (maxX - minX) / (editorHolders.length - 1) * i, true);
    }
    this.layoutEditor.commitHistory('move', 'Distribute Horizontal Right');
};

RelativeAnchorEditorCmd.distributeHorizontalDistance = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    var editorHolders = editors.map(function (e) {
        return {
            left: e.component.getStyle('left', 'px'),
            width: e.component.getStyle('width', 'px'),
            right: e.component.getStyle('right', 'px'),
            editor: e
        };
    });

    editorHolders.sort(function (a, b) {
        return (a.left + a.width / 2) - (b.left + b.width / 2);
    });

    var sumDistance = editorHolders[editorHolders.length - 1].left - (editorHolders[0].left + editorHolders[0].width);
    var eHolder;
    for (i = 1; i < editors.length - 1; ++i) {
        eHolder = editorHolders[i];
        sumDistance -= eHolder.width;
    }
    var distance = sumDistance / (editors.length - 1);
    var curentLeft = editorHolders[0].left + editorHolders[0].width + distance;

    for (i = 1; i < editorHolders.length - 1; ++i) {
        eHolder = editorHolders[i];
        editor = eHolder.editor;

        editor.alignLeftDedge(curentLeft, true);
        curentLeft += eHolder.width + distance;
    }
    this.layoutEditor.commitHistory('move', 'Distribute Horizontal Distance');
};




RelativeAnchorEditorCmd.distributeVerticalTop = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    var editorHolders = editors.map(function (e) {
        return {
            top: e.component.getStyle('top', 'px'),
            editor: e
        };
    });

    editorHolders.sort(function (a, b) {
        return a.top - b.top;
    });
    var minX = editorHolders[0].top;
    var maxX = editorHolders[editorHolders.length - 1].top;
    if (minX == maxX) return;
    for (i = 1; i < editorHolders.length - 1; ++i) {
        editor = editorHolders[i].editor;
        editor.alignTopDedge(minX + (maxX - minX) / (editors.length - 1) * i);
    }
    this.layoutEditor.commitHistory('move', 'Distribute Vertical Top');
};


RelativeAnchorEditorCmd.distributeVerticalCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    var editorHolders = editors.map(function (e) {
        return {
            top: e.component.getStyle('top', 'px'),
            height: e.component.getStyle('height', 'px'),
            editor: e
        };
    });
    editorHolders.sort(function (a, b) {
        return (a.top + a.height / 2) - (b.top + b.height / 2);
    });
    var minX = (editorHolders[0].top + editorHolders[0].height / 2);
    var maxX = (editorHolders[editorHolders.length - 1].top + editorHolders[editorHolders.length - 1].height / 2);
    if (minX == maxX) return;
    var eHolder;
    for (i = 1; i < editorHolders.length - 1; ++i) {
        eHolder = editorHolders[i];
        editor = eHolder.editor;
        editor.alignTopDedge(minX + (maxX - minX) / (editors.length - 1) * i - eHolder.height / 2);
    }
    this.layoutEditor.commitHistory('move', 'Distribute Vertical Center');
};



RelativeAnchorEditorCmd.distributeVerticalBottom = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    var editorHolders = editors.map(function (e) {
        return {
            bottom: e.component.getStyle('bottom', 'px'),
            editor: e
        };
    });
    editorHolders.sort(function (a, b) {
        return a.bottom - b.bottom;
    });
    var minX = editorHolders[0].bottom;
    var maxX = editorHolders[editorHolders.length - 1].bottom;
    if (minX == maxX) return;
    for (i = 1; i < editorHolders.length - 1; ++i) {
        editor = editorHolders[i].editor;
        editor.alignBottomDedge(minX + (maxX - minX) / (editors.length - 1) * i);
    }
    this.layoutEditor.commitHistory('move', 'Distribute Vertical Bottom');
};


RelativeAnchorEditorCmd.distributeVerticalDistance = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var i;
    var editorHolders = editors.map(function (e) {
        return {
            top: e.component.getStyle('top', 'px'),
            height: e.component.getStyle('height', 'px'),
            editor: e
        };
    });
    editorHolders.sort(function (a, b) {
        return (a.top + a.height / 2) - (b.top + b.height / 2);
    });
    var eHolder;

    var sumDistance = editorHolders[editorHolders.length - 1].top - (editorHolders[0].top + editorHolders[0].height);
    for (i = 1; i < editorHolders.length - 1; ++i) {
        eHolder = editorHolders[i];
        sumDistance -= eHolder.height;
    }
    var distance = sumDistance / (editorHolders.length - 1);
    var curentTop = editorHolders[0].top + editorHolders[0].height + distance;

    for (i = 1; i < editorHolders.length - 1; ++i) {
        eHolder = editorHolders[i];
        editor = eHolder.editor;
        editor.alignTopDedge(curentTop);
        curentTop += eHolder.height + distance;
    }
    this.layoutEditor.commitHistory('move', 'Distribute Vertical Distance');
};



RelativeAnchorEditorCmd.alignLeftDedge = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var leftValue = this.component.getStyle('left', 'px');
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignLeftDedge(leftValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Left Dedge');
};


RelativeAnchorEditorCmd.alignRightDedge = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var rightValue = this.component.getStyle('right', 'px');

    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignRightDedge(rightValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Right Dedge');

};

RelativeAnchorEditorCmd.alignHorizontalCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var centerValue = this.component.getStyle('right', 'px') - this.component.getStyle('left', 'px');;
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignHorizontalCenter(centerValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Horizontal Center');

};

RelativeAnchorEditorCmd.equaliseWidth = function () {
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



RelativeAnchorEditorCmd.alignTopDedge = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var topValue = this.component.getStyle('top', 'px');
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignTopDedge(topValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Top Dedge');
};


RelativeAnchorEditorCmd.alignBottomDedge = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var bottomValue = this.component.getStyle('bottom', 'px');

    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignBottomDedge(bottomValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Bottom Dedge');
};

RelativeAnchorEditorCmd.alignVerticalCenter = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var centerValue = this.component.getStyle('bottom', 'px') - this.component.getStyle('top', 'px');
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.alignVerticalCenter(centerValue);
    }
    this.layoutEditor.commitHistory('move', 'Align Verlical Center');
};

RelativeAnchorEditorCmd.equaliseHeight = function () {
    var editors = this.layoutEditor.anchorEditors;
    var editor;
    var heightValue = this.component.getStyle('height', 'px');
    for (var i = 0; i < editors.length; ++i) {
        editor = editors[i];
        if (editor == this) continue;
        editor.equaliseHeight(heightValue);
    }
    this.layoutEditor.commitHistory('move', 'Equalise Height');
};





export var RelativeAnchorEditorCmdTree = [
    [
        'alignLeftDedge',
        'alignHorizontalCenter',
        'alignRightDedge',
        'equaliseWidth'
    ],
    [
        'alignTopDedge',
        'alignVerticalCenter',
        'alignBottomDedge',
        'equaliseHeight'
    ],
    [
        'distributeHorizontalLeft',
        'distributeHorizontalCenter',
        'distributeHorizontalRight',
        'distributeHorizontalDistance'
    ],
    [
        'distributeVerticalTop',
        'distributeVerticalCenter',
        'distributeVerticalBottom',
        'distributeVerticalDistance'
    ]
];

export var RelativeAnchorEditorCmdDescriptors = {
    distributeVerticalDistance: {
        type: 'trigger',
        desc: "Distribute Verlical Distance",
        icon: '<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
                    <path d="m7 3h10v5h5v2h-20v-2h5v-5"/>\
                    <path d="m2 16v-2h20v2h-3v5h-14v-5z"/>\
                </svg>'
    },
    distributeVerticalBottom: {
        type: 'trigger',
        desc: "Distribute Vertical Bottom",
        icon: 'span.mdi.mdi-distribute-vertical-bottom'
    },
    distributeVerticalCenter: {
        type: 'trigger',
        desc: "Distribute Vertical Center",
        icon: 'span.mdi.mdi-distribute-vertical-center'
    },
    distributeVerticalTop: {
        type: 'trigger',
        desc: "Distribute Vertical Top",
        icon: 'span.mdi.mdi-distribute-vertical-top'
    },
    distributeHorizontalDistance: {
        icon: '<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
                    <path d="m21 7v10h-5v5h-2v-20h2v5h5"/>\
                    <path d="m8 2h2v20h-2v-3h-5v-14h5z"/>\
                </svg>',
        type: 'trigger',
        desc: "Distribute Horizontal Distance"
    },
    distributeHorizontalRight: {
        type: 'trigger',
        desc: "Distribute Horizontal Right",
        icon: 'span.mdi.mdi-distribute-horizontal-right'
    },
    distributeHorizontalCenter: {
        icon: 'span.mdi.mdi-distribute-horizontal-center',
        type: 'trigger',
        desc: "Distribute Horizontal Center"
    },
    distributeHorizontalLeft: {
        icon: 'span.mdi.mdi-distribute-horizontal-left',
        type: 'trigger',
        desc: "Distribute Horizontal Left"
    },
    equaliseHeight: {
        type: 'trigger',
        icon: 'span.mdi.mdi-arrow-expand-vertical',
        desc: 'Equalise Height',
    },
    alignVerticalCenter: {
        type: 'trigger',
        icon: 'span.mdi.mdi-align-vertical-center',
        desc: 'Align Vertical Center'
    },
    alignBottomDedge: {
        type: 'trigger',
        icon: 'span.mdi.mdi-align-vertical-bottom',
        desc: 'Align Bottom Edges',
    },
    alignTopDedge: {
        type: 'trigger',
        icon: 'span.mdi.mdi-align-vertical-top',
        desc: 'Align Top Edges'
    },
    equaliseWidth: {
        type: 'trigger',
        icon: 'span.mdi.mdi-arrow-expand-horizontal',
        desc: 'Equalise Width'
    },
    alignHorizontalCenter: {
        type: 'trigger',
        icon: 'span.mdi.mdi-align-horizontal-center',
        desc: 'Align Horizontal Center'
    },
    alignRightDedge: {
        type: 'trigger',
        icon: 'span.mdi.mdi-align-horizontal-right',
        desc: 'Align Right Edges',
    },
    alignLeftDedge: {
        type: 'trigger',
        icon: 'span.mdi.mdi-align-horizontal-left',
        desc: 'Align Left Edges',
    },
    sendBackward: {
        type: 'trigger',
        desc: 'Send Backward',
        icon: 'span.mdi.mdi-arrange-send-backward'
    }
};

export default RelativeAnchorEditorCmd;