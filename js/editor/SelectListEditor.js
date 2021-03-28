import BaseEditor from "../core/BaseEditor";
import OOP from "absol/src/HTML5/OOP";
import {$, _} from "../core/FCore";
import '../../css/selectlisteditor.css';
import TableEditor from "absol-sheet/js/fragment/TableEditor";
import R from "../R";
import SelectListCmd, {SelectListCmdDescriptors, SelectListCmdTree} from "../cmds/SelectListEditorCmd";
import ResizeSystem from "absol/src/HTML5/ResizeSystem";
import Toast from "absol-acomp/js/Toast";

function SelectListEditor() {
    BaseEditor.call(this);
    this.cmdRunner.assign(SelectListCmd);
    this.tableEditor = new TableEditor();
    window.E = this;
}

OOP.mixClass(SelectListEditor, BaseEditor);


SelectListEditor.prototype.createView = function () {
    this.$view = _({
        class: 'as-select-list-editor',
        child: [
            {
                class: 'as-select-list-editor-header',
                child:
                    { class: 'as-select-list-editor-cmd-tool-container' },
            },
            {
                class: 'as-select-list-editor-body',
                child: this.tableEditor.getView()
            }
        ]
    });
    this.$header = $('.as-select-list-editor-header', this.$view);
    this.$body = $('.as-select-list-editor-body', this.$view);
    this.$cmdToolCtn = $('.as-select-list-editor-cmd-tool-container', this.$view);
    this.$attachhook = _('attachhook').on('attached', function () {
        this.requestUpdateSize();
        ResizeSystem.add(this);
    });
    this.$attachhook.requestUpdateSize = this.updateSize.bind(this);
    this.$view.addChild(this.$attachhook);
};


SelectListEditor.prototype.updateSize = function () {
    this.$body.addStyle('top', this.$header.offsetHeight + 'px');
};

SelectListEditor.prototype.setData = function (data) {
    var tableData = {
        propertyDescriptors: [
            {
                text: {
                    text: 'Text',
                    type: 'string'
                },
                value: {
                    text: 'Value',
                    type: 'string'
                }
            }
        ],
        propertyNames: ['text', 'value'],
        records: data.map(function (item) {
            return { text: item.text, value: item.value };
        })
    };
    this.tableEditor.setData(tableData);
};


SelectListEditor.prototype.getData = function (data) {
    return this.tableEditor.getData().records;
};


SelectListEditor.prototype.onAttached = function () {
    this.CMDTool = this.getContext(R.CMD_TOOL);
};

SelectListEditor.prototype.onResume = function () {
    this.updateSize();
    this.CMDTool = this.getContext(R.CMD_TOOL);
    if (this.CMDTool) {
        this.CMDTool.bindWithEditor(this);
        this.CMDTool.start();
    }
};

SelectListEditor.prototype.onPause = function () {
    if (this.CMDTool) {
        this.CMDTool.pause();
    }
};

SelectListEditor.prototype.insertRowAfterCurrent = function () {
    var cellEditor = this.tableEditor.currentCellEditor;
    if (cellEditor) {
        this.tableEditor.insertRow(cellEditor.row.idx + 1, {});
    }
    else {
        this.tableEditor.insertRow(cellEditor.records.length, {});
    }
};

SelectListEditor.prototype.insertRowBeforeCurrent = function () {
    var cellEditor = this.tableEditor.currentCellEditor;
    if (cellEditor) {
        this.tableEditor.insertRow(cellEditor.row.idx, {});
    }
    else {
        this.tableEditor.insertRow(0, {});
    }
};

SelectListEditor.prototype.removeCurrentRow = function () {
    var cellEditor = this.tableEditor.currentCellEditor;
    var rowIdx;
    var colIdx;
    if (cellEditor) {
        rowIdx = cellEditor.row.idx;
        colIdx = cellEditor.col.index;
    }
    else {
        rowIdx = this.tableEditor.records.length - 1;
        colIdx = 0;
    }
    if (rowIdx >= 0) {
        this.tableEditor.removeRow(rowIdx);
        rowIdx = Math.min(rowIdx, this.tableEditor.records.length - 1);
        if (rowIdx >= 0) {
            this.tableEditor.editCell(this.tableEditor.tableData.findRowByIndex(rowIdx), this.tableEditor.tableData.findColByIndex(colIdx));
        }
    }
};


SelectListEditor.prototype.verify = function () {
    var record;
    var records = this.tableEditor.records;
    var error = false;
    var dict = {};
    for (var i = 0; i < records.length; ++i) {
        record = records[i];
        if (typeof record.text !== "string" || record.text.length == 0) {
            error = 'Invalid data!';
            this.tableEditor.editCell(this.tableEditor.tableData.findRowByIndex(i), this.tableEditor.tableData.findColByIndex(0));
            break;
        }
        if (typeof record.value !== "string" || record.value.length == 0 ||dict[record.value]) {
            if (typeof record.value !== "string" || record.value.length == 0 ){
                error = 'Invalid data!';
            }
            else{
                error = 'Duplicate value!';
            }
            this.tableEditor.editCell(this.tableEditor.tableData.findRowByIndex(i), this.tableEditor.tableData.findColByIndex(1));
            break;
        }
        dict[record.value] = true;
    }
    if (error) {
        var errorToast = Toast.make({
            props: {
                htitle: 'Error',
                message: error,
                variant: 'error'
            }
        });

        setTimeout(function () {
            errorToast.disappear();
        }, 3000);
    }

    return !error;
};


SelectListEditor.prototype.getCmdDescriptor = function (name) {
    var descriptor = SelectListCmdDescriptors[name];
    var res = Object.assign({
        type: 'trigger',
        desc: 'command: ' + name,
        icon: 'span.mdi.mdi-apple-keyboard-command',
        disabled: false
    }, descriptor);
    return res;
};

SelectListEditor.prototype.getCmdGroupTree = function () {
    return SelectListCmdTree;
};

SelectListEditor.prototype.getCmdToolCtn = function () {
    return this.$cmdToolCtn;
};


export default SelectListEditor;