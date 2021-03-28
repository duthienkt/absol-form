var SelectListCmd = {};

SelectListCmd.save = function () {
    setTimeout(function () {
        if (this.verify())
            this.emit('save', { type: 'save', target: this }, this);
    }.bind(this), 100);//wait for complete saving
};

SelectListCmd.insertRowBefore = function () {
    this.insertRowBeforeCurrent();
};

SelectListCmd.insertRowAfter = function () {
    this.insertRowAfterCurrent();
};


SelectListCmd.removeCurrentRow = function () {
    this.removeCurrentRow();
};


export default SelectListCmd;

export var SelectListCmdTree = [
    [
        'save'
    ],
    [
        'insertRowBefore',
        'insertRowAfter',
        'removeCurrentRow'
    ]
];


export var SelectListCmdDescriptors = {
    save: {
        desc: 'Save',
        icon: 'span.mdi.mdi-content-save-move-outline'
    },
    insertRowBefore: {
        desc: 'Insert Row Before',
        icon: 'span.mdi.mdi-table-row-plus-before'
    },
    insertRowAfter: {
        desc: 'Insert Row After',
        icon: 'span.mdi.mdi-table-row-plus-after'
    },
    removeCurrentRow: {
        desc: 'Remove Current Row',
        icon: 'span.mdi.mdi-table-row-remove'
    }
}