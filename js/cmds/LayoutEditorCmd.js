import R from '../R';
import FormPreview from '../editor/FormPreview';
import ClipboardManager from '../ClipboardManager';

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
    if (!this.rootLayout) return;
    /**
     * @type {import('./FormEditor').default}
     */
    var formEditor = this.getContext(R.FORM_EDITOR);
    if (!formEditor) return;
    var tabHolder = formEditor.getEditorHolderByEditor(this);
    var currentTabIdent = tabHolder.ident;
    var previewTabIdent = currentTabIdent + '_preview';
    var previewEditor;
    var previewTabHolder = formEditor.getEditorHolderByIdent(previewTabIdent);
    if (previewTabHolder)
        previewEditor = previewTabHolder.editor;

    if (!previewEditor) {
        previewEditor = new FormPreview();
        previewEditor.attach(this);
        var name = tabHolder.name + ('(Preview)');
        var desc = tabHolder.desc;
        formEditor.openEditorTab(previewTabIdent, name, desc, previewEditor, { layoutEditor: this })
    }
    else {
        previewTabHolder.tabframe.requestActive();
    }

    var data = this.getData();
    previewEditor.setData(data);
};

LayoutEditorCmd.save = function () {

};

LayoutEditorCmd.saveAs = function () {

};

LayoutEditorCmd.export2Json = function () {

};

LayoutEditorCmd.cut = function () {
    if (this.anchorEditors.length < 1) return;
    var components = this.anchorEditors.map(function (ed) {
        return ed.component;
    });

    var components = components.map(function (component) {
        return component.getData();
    });
    ClipboardManager.set(R.CLIPBOARD.COMPONENTS, components);

    //code copy and edit from LayoutEditor.prototype.removeComponent 
    var self = this;
    this.anchorEditors.forEach(function (ed) {
        ed.component.remove();
        self.emit('removecomponent', { type: 'removecomponent', target: this, component:  ed.component }, this);
    });

    function visit(node) {
        if (node.attributes && node.attributes.name) {
            node.attributes.name = undefined;
            delete node.attributes.name;
        }
        if (node.children)
            node.children.forEach(visit);
    }
    components.forEach(visit);

    this.componentPropertiesEditor.edit(undefined);
    this.setActiveComponent();
    this.notifyDataChange();
    this.componentOtline.updateComponetTree();
    this.commitHistory('remove', 'Cut ' + components.map(function (c) {
        return c.getAttribute('name');
    }).join(', '));
};

LayoutEditorCmd.copy = function () {
    if (this.anchorEditors.length < 1) return;
    var components = this.anchorEditors.map(function (ed) {
        return ed.component.getData();
    });

    function visit(node) {
        if (node.attributes && node.attributes.name) {
            node.attributes.name = undefined;
            delete node.attributes.name;
        }
        if (node.children)
            node.children.forEach(visit);
    }
    components.forEach(visit);
    ClipboardManager.set(R.CLIPBOARD.COMPONENTS, components);

};

LayoutEditorCmd.paste = function () {
    var components = ClipboardManager.get(R.CLIPBOARD.COMPONENTS);
    if (components)
        this.addNewComponent(components, 0, 0);
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
        desc: 'Cut',
        bindKey: { win: 'Ctrl-X', mac: 'TODO?' }
    },
    copy: {
        type: 'trigger',
        icon: 'span.mdi.mdi-content-copy',
        desc: 'Copy',
        bindKey: { win: 'Ctrl-C', mac: 'TODO?' }
    },
    paste: {
        type: 'trigger',
        icon: 'span.mdi.mdi-content-paste',
        desc: 'Paste',
        bindKey: { win: 'Ctrl-V', mac: 'TODO?' }
    },
    delete: {
        type: 'trigger',
        icon: 'span.mdi.mdi-delete-variant',
        desc: 'Delete',
        bindKey: { win: 'Delete', mac: 'Delete' }

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