import R from '../R';
import FormPreview from '../editor/FormPreview';
import ClipboardManager from '../ClipboardManager';
import PluginManager from '../core/PluginManager';
import Fcore from '../core/FCore';

/**
 * @type {import('../editor/LayoutEditor').default}
 */
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
    var formEditor = this.getContext(R.FORM_EDITOR);
    if (formEditor) {
        var tabHolder = formEditor.getEditorHolderByEditor(this);
        if (tabHolder)
            PluginManager.exec(this, R.PLUGINS.SAVE_CONTENT_DATA, tabHolder);
    }
    this.notifySaved();
};

LayoutEditorCmd.saveAs = function () {

};


LayoutEditorCmd.importFromJson = function () {
    var self = this;
    var state = "WAITING";
    var fileInput = Fcore._({
        tag: 'input',
        style: {
            position: 'fixed',
            zIndex: '-100',
            opacity: '0'
        },
        attr: {
            type: 'file',
            accept: 'application/JSON'
        },
        on: {
            change: function (event) {
                if (this.files.length > 0) {
                    var file = this.files[0];
                    var reader = new FileReader();
                    reader.onload = function () {
                        try {
                            var data = JSON.parse(reader.result);
                            if (data.app == R.APP) {
                                self.applyData(data);
                                self.commitHistory("import", 'Import form JSON file');
                            }
                            else {
                                console.error('Invalid data!');
                            }
                        }
                        catch (error) {
                            console.error(error);
                        }
                    };
                    reader.readAsText(file);
                }
            }
        }
    }).addTo(document.body);
    fileInput.focus();
    fileInput.click();
};

LayoutEditorCmd.export2Json = function () {
    var fileName = 'exported.json';
    var formEditor = this.getContext(R.FORM_EDITOR);
    if (formEditor) {
        var tabHolder = formEditor.getEditorHolderByEditor(this);
        fileName = tabHolder.name.replace(/[\\\/\.\?]/g, '_') + '.json';
    }

    var a = document.createElement('a');
    this.$view.appendChild(a);
    var text = JSON.stringify(Object.assign(this.getData(), {
        app: R.APP,
        version: R.VERSION
    }), null, '    ');
    var fileType = 'json'
    var blob = new Blob([text], { type: fileType, encoding:"UTF-8" });
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 1500)

};

LayoutEditorCmd.cut = function () {
    if (this.anchorEditors.length < 1) return;
    var components = this.anchorEditors.map(function (ed) {
        return ed.component;
    });

    var componentsData = components.map(function (component) {
        var data = component.getData();
        data.bound = component.view.getBoundingClientRect().toJSON();
        return data;
    });
    ClipboardManager.set(R.CLIPBOARD.COMPONENTS, componentsData);

    //code copy and edit from LayoutEditor.prototype.removeComponent 
    var self = this;
    this.anchorEditors.forEach(function (ed) {
        ed.component.remove();
        self.emit('removecomponent', { type: 'removecomponent', target: this, component: ed.component }, this);
    });

    function visit(node) {
        if (node.attributes && node.attributes.name) {
            node.attributes.name = undefined;
            delete node.attributes.name;
        }
        if (node.children)
            node.children.forEach(visit);
    }
    componentsData.forEach(visit);

    this.componentPropertiesEditor.edit(undefined);
    this.setActiveComponent();
    this.notifyDataChange();
    this.notifyUnsaved();
    this.componentOtline.updateComponetTree();
    this.commitHistory('cut', 'Cut ' + components.map(function (c) {
        return c.getAttribute('name');
    }).join(', '));
};

LayoutEditorCmd.copy = function () {
    if (this.anchorEditors.length < 1) return;
    var componentsData = this.anchorEditors.map(function (ed) {
        var data = ed.component.getData();
        data.bound = ed.component.view.getBoundingClientRect().toJSON();
        return data;
    });

    function visit(node) {
        if (node.attributes && node.attributes.name) {
            node.attributes.name = undefined;
            delete node.attributes.name;
        }
        if (node.children)
            node.children.forEach(visit);
    }

    componentsData.forEach(visit);
    ClipboardManager.set(R.CLIPBOARD.COMPONENTS, componentsData);
};

LayoutEditorCmd.paste = function (event) {
    var posX = 0;
    var posY = 0;
    if (event) {
        var bound = this.rootLayout.view.getBoundingClientRect();
        posX = this.mouseClientX - bound.left;
        posY = this.mouseClientY - bound.top;
    }

    var components = ClipboardManager.get(R.CLIPBOARD.COMPONENTS);
    if (components) {
        this.addNewComponent(components, posX, posY);
    }
};

LayoutEditorCmd.undo = function () {
    this.undoHistory.undo();
};

LayoutEditorCmd.redo = function () {
    this.undoHistory.redo();
};

LayoutEditorCmd.selectAll = function () {
    var now = new Date().getTime();
    var comp;
    if (this.anchorEditors.length == 0) {
        comp = this.rootLayout.children;
    }
    else {
        comp = (this.findNearestLayoutParent(this.anchorEditors[0].component.parent) || this.rootLayout).children;
    }

    this.setActiveComponent.apply(this, comp);
};

LayoutEditorCmd.editRootLayout = function () {
    this.editLayout(this.rootLayout);
    this.setActiveComponent(this.rootLayout);
}


export default LayoutEditorCmd;

export var LayoutEditorCmdDescriptors = {
    editRootLayout: {
        type: 'trigger',
        desc: "Edit Root Layout",
        icon: 'span.mdi.mdi-border-outside'
    },
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
    preview: {
        type: 'trigger',
        icon: 'span.mdi.mdi-play',
        desc: 'Preview',
        bindKey: { win: 'Ctrl-K', mac: 'TODO?' }

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
        desc: 'Save',
        bindKey: { win: 'Ctrl-S', mac: '//todo' }
    },
    saveAs: {
        type: 'trigger',
        icon: 'span.mdi.mdi-content-save-edit',
        desc: 'Save As'
    },
    importFromJson: {
        type: 'trigger',
        icon: 'span.mdi.mdi-cloud-upload[style="color:#1da8f2"]',
        desc: 'Import From JSON',
        bindKey: { win: 'Ctrl-Shift-I', mac: 'TODO?' }
    },
    export2Json: {
        type: 'trigger',
        icon: 'span.mdi.mdi-cloud-download-outline',
        desc: 'Export To JSON',
        bindKey: { win: 'Ctrl-Shift-E', mac: 'TODO?' }
    },
    undo: {
        type: 'trigger',
        icon: 'span.mdi.mdi-undo',
        desc: 'Undo',
        bindKey: { win: 'Ctrl-Z', mac: 'TODO?' }
    },
    redo: {
        type: 'trigger',
        icon: 'span.mdi.mdi-redo',
        desc: 'Redo',
        bindKey: { win: 'Ctrl-Y', mac: 'TODO?' }
    },
    selectAll: {
        type: 'trigger',
        desc: 'Select All',
        icon: 'span.mdi.mdi-select-all',
        bindKey: { win: 'Ctrl-A', mac: 'TODO?' }
    },
    sendBackward: {
        type: 'trigger',
        desc: 'Send Backward',
        icon: 'span.mdi.mdi-arrange-send-backward'
    }
};