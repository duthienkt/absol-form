var LayoutEditorCmd = {};
LayoutEditorCmd.distributeVerticalDistance = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalDistance();
    }
};

LayoutEditorCmd.distributeVerticalBottom = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeVerticalBottom();
    }
};

LayoutEditorCmd.distributeVerticalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeVerticalCenter();
    }
};

LayoutEditorCmd.distributeVerticalTop = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeVerticalTop();
    }
};

LayoutEditorCmd.distributeHorizontalDistance = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalDistance();
    }
};

LayoutEditorCmd.distributeHorizontalRight = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalRight();
    }
};

LayoutEditorCmd.distributeHorizontalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalCenter();
    }
};

LayoutEditorCmd.distributeHorizontalLeft = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalLeft();
    }
};

LayoutEditorCmd.equaliseHeight = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_equaliseHeight();
    }
};

LayoutEditorCmd.alignVerticalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignVerticalCenter();
    }
};

LayoutEditorCmd.alignBottomDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignBottomDedge();
    }
};

LayoutEditorCmd.alignTopDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignTopDedge();
    }
};

LayoutEditorCmd.equaliseWidth = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_equaliseWidth();
    }
};

LayoutEditorCmd.alignHorizontalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignHorizontalCenter();
    }
};

LayoutEditorCmd.alignRightDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignRightDedge();
    }
};

LayoutEditorCmd.alignLeftDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignLeftDedge();
    }
};

LayoutEditorCmd.delete = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_delete();
    }
};

LayoutEditorCmd.preview = function () {
    this.preview();
};

LayoutEditorCmd.save = function () {

};

LayoutEditorCmd.saveAs = function () {

};

LayoutEditorCmd.export2Json = function () {

};

export default LayoutEditorCmd;

export var LayoutEditorCmdDescriptors = {
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
                    <path d="m7 3h10v5h5v2h-20v-2h5v-5"/>\
                    <path d="m2 16v-2h20v2h-3v5h-14v-5z"/>\
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
        icon: 'mdi-align-vertical-center',
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
        icon: 'mdi-align-horizontal-right',
        desc: 'Align Right Edges',
    },
    alignLeftDedge: {
        type: 'trigger',
        icon: 'span.mdi.mdi-align-horizontal-left',
        desc: 'Align Left Edges',
    },
    preview: {
        type: 'trigger',
        icon: 'span.mdi.mdi-play',
        desc: 'Preview'
    },
    cut: {
        type: 'trigger',
        icon: 'span.mdi.mdi-content-cut',
        desc: 'Cut'
    },
    copy: {
        type: 'trigger',
        icon: 'span.mdi.mdi-content-copy',
        desc: 'Copy'
    },
    paste: {
        type: 'trigger',
        icon: 'span.mdi.mdi-content-paste',
        desc: 'Copy'
    },
    delete: {
        type: 'trigger',
        icon: 'span.mdi.mdi-delete-variant',
        desc: 'Delete'
    },
    save: {
        type: 'trigger',
        icon: 'span.mdi.mdi-content-save',
        desc: 'Save'
    },
    saveAs: {
        type: 'trigger',
        icon: 'span.mdi.mdi-content-save-edit',
        desc: 'Save As'
    },
    export2Json: {
        type: 'trigger',
        icon: 'span.mdi.mdi-cloud-download-outline',
        desc: 'Export To JSON'
    }
};