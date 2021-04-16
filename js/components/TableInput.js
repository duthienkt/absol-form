import ScalableComponent from "../core/ScalableComponent";
import OOP from "absol/src/HTML5/OOP";
import TableEditor from "absol-sheet/js/fragment/TableEditor";
import {randomSentence} from "absol/src/String/stringGenerate";
import {_} from "../core/FCore";
import DomSignal from "absol/src/HTML5/DomSignal";


/***
 * @extends ScalableComponent
 * @constructor
 */
function TableInput() {
    this.editor = new TableEditor();
    ScalableComponent.call(this);
}


OOP.mixClass(TableInput, ScalableComponent);

TableInput.prototype.tag = 'TableInput';

TableInput.prototype.menuIcon = 'span.mdi.mdi-table-edit';

TableInput.prototype.render = function () {
    return this.editor.getView();
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
            type:'enum',
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
        this.editor.setData({
            propertyNames: this.attributes.propertyNames,
            propertyDescriptors: this.attributes.propertyDescriptors,
            records: this.attributes.records
        });
    }
};

TableInput.prototype._requestUpdateContent = function () {
    this.domSignal.emit('requestUpdateContent');
};

TableInput.prototype.setAttributePropertyNames = function (value) {
    this._dataFlushed = false;
    this._requestUpdateContent();
    return value;
};

TableInput.prototype.getAttributePropertyNames = function () {
    if (this._dataFlushed) {
        return this.editor.tableData.propertyNames;
    }
    else {
        return this.attributes.propertyNames;
    }
};


TableInput.prototype.setAttributePropertyDescriptors = function (value) {
    this._dataFlushed = false;
    this._requestUpdateContent();
    return value;
};


TableInput.prototype.getAttributePropertyDescriptors = function () {
    if (this._dataFlushed) {
        return this.editor.tableData.propertyDescriptors;
    }
    else {
        return this.attributes.propertyDescriptors;
    }
};


TableInput.prototype.setAttributeRecords = function (value) {
    this._dataFlushed = false;
    this._requestUpdateContent();
    return value;
};

TableInput.prototype.getAttributeRecords = function () {
    if (this._dataFlushed) {
        return this.editor.tableData.records;
    }
    else {
        return this.attributes.records;
    }
};

TableInput.prototype.getDataBindingDescriptor = function () {
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

export default TableInput;