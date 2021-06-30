import ScalableComponent from "../core/ScalableComponent";
import TableEditor from "absol-sheet/js/fragment/TableEditor";
import {randomSentence} from "absol/src/String/stringGenerate";
import {_} from "../core/FCore";
import DomSignal from "absol/src/HTML5/DomSignal";
import inheritComponentClass from "../core/inheritComponentClass";
import {AssemblerInstance} from "../core/Assembler";


/***
 * @extends ScalableComponent
 * @constructor
 */
function TableInput() {
    this.editor = new TableEditor();
    ScalableComponent.call(this);
}


inheritComponentClass(TableInput, ScalableComponent);

TableInput.prototype.tag = 'TableInput';

TableInput.prototype.menuIcon = 'span.mdi.mdi-table-edit';

TableInput.prototype.render = function () {
    return this.editor.getView();
};

TableInput.prototype.styleHandlers.maxHeight = {
    set: function (value) {
        if (!(value > 0 && value < Infinity)) value = null;
        if (value) {
            this.domElt.addStyle('max-height', value + 'px');
        }
        else {
            this.domElt.removeStyle('max-height');
        }
        return value;
    },
    export: function () {
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        if (value) return value;
        return undefined;
    },
    descriptor: {
        type: 'LengthInPixel'
    }
};

TableInput.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['maxHeight']);
};


TableInput.prototype.attributeHandlers.propertyNames = {
    set: function (value) {
        this._dataFlushed = false;
        this._requestUpdateContent();
        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        if (this._dataFlushed) {
            return this.editor.tableData.propertyNames;
        }
        else {
            return ref.get();
        }
    }
};

TableInput.prototype.attributeHandlers.propertyDescriptors = {
    set: function (value) {
        this._dataFlushed = false;
        this._requestUpdateContent();
        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        if (this._dataFlushed) {
            return this.editor.tableData.propertyDescriptors;
        }
        else {
            return ref.get();
        }
    }
};

TableInput.prototype.attributeHandlers.config = {
    set: function (value) {
        this._dataFlushed = false;
        this._requestUpdateContent();
        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        if (this._dataFlushed) {
            return this.editor.tableData.config;
        }
        else {
            return ref.get();
        }
    },
    export: function () {
        return Object.assign({}, this.attributes.config);
    }
};


TableInput.prototype.attributeHandlers.records = {
    set: function (value) {
        this._dataFlushed = false;
        this._requestUpdateContent();
        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        if (this._dataFlushed) {
            return this.editor.tableData.records;
        }
        else {
            return ref.get();
        }
    }
};

TableInput.prototype.pinHandlers.records = {
    receives: function (value) {
        this.attributes.records = value;
    },
    get: function () {
        return this.attributes.records;
    },
    descriptor: {
        type: 'object[]'
    }
};


TableInput.prototype.onCreated = function () {
    this.$domSignal = _('attachhook.as-dom-signal');
    this.view.appendChild(this.$domSignal)
    this.domSignal = new DomSignal(this.$domSignal);
    this.domSignal.on('requestUpdateContent', this._updateContent.bind(this));
    this._dataFlushed = true;
    this.setAttribute('propertyDescriptors', {
        text: {
            type: 'text',
            text: "Kiểu text"
        },
        number: {
            text: 'Kiểu số',
            type: 'number'
        },
        boolean: {
            text: 'Kiểu boolean',
            type: 'boolean'
        },
        enum: {
            type: 'enum',
            items: [
                { text: 'Type 0', value: '0' },
                { text: 'Type 1', value: '1' },
                { text: 'Type 2', value: '2' },
                { text: 'Type 4', value: '4' },
            ]
        }
    });
    this.setAttribute('propertyNames', ['text', 'number', 'boolean', 'enum']);
    this.setAttribute('records', [{ text: randomSentence(50), number: 4, boolean: true, 'enum': '2' }]);
    this.editor.on('change', function () {
        this.pinFire('records');
        this.notifyChange();
    }.bind(this));
};


TableInput.prototype._verifyTableData = function () {
    if (!this.attributes.propertyNames
        || !(this.attributes.propertyNames instanceof Array)
        || !this.attributes.propertyDescriptors
        || !this.attributes.records
        || !this.attributes.records
    ) return false;
    return true;
}

TableInput.prototype._updateContent = function () {
    if (this._verifyTableData()) {
        var prevRecords = this.editor.records;
        this.editor.setData({
            propertyNames: this.attributes.propertyNames,
            propertyDescriptors: this.attributes.propertyDescriptors,
            records: this.attributes.records,
            config: this.attributes.config
        });
        this._dataFlushed = true;
        if (prevRecords !== this.editor.records) {
            this.pinFire('records');
            this.notifyChange();
        }
    }
};

TableInput.prototype._requestUpdateContent = function () {
    this.domSignal.emit('requestUpdateContent');
};


TableInput.prototype.createDataBindingDescriptor = function () {
    var thisTI = this;
    var props = {};
    Object.defineProperties(props, {
        propertyNames: {
            enumerable: true,
            set: function (pnA) {
                thisTI.setAttribute('propertyNames', pnA);
            },
            get: function () {
                return thisTI.getAttribute('propertyNames');
            }
        },
        propertyDescriptors: {
            enumerable: true,
            set: function (pdO) {
                thisTI.setAttribute('propertyDescriptors', pdO);
            },
            get: function () {
                return thisTI.getAttribute('propertyDescriptors');
            }
        },
        records: {
            enumerable: true,
            set: function (records) {
                thisTI.setAttribute('records', records);
            },
            get: function () {
                return thisTI.getAttribute('records');
            }
        }
    })

    return {
        enumerable: true,
        set: function (value) {
            Object.assign(props, value);
        },
        get: function () {
            return props;
        }
    };
};

AssemblerInstance.addClass(TableInput);

export default TableInput;