import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;
var $ = Fcore.$;

function Table() {
    ScalableComponent.call(this);
}

Object.defineProperties(Table.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
Table.prototype.constructor = Table;

Table.prototype.tag = "Table";
Table.prototype.menuIcon = "span.mdi.mdi-table-large";
Table.count = 0;

Table.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.name = 'Table_' + (Table.count++);
    this.attributes.header = ['Col 1', 'Col 2', 'Col 3'];
}

Table.prototype.render = function () {
    return _({
        tag: 'table',
        child: ['thead', 'tbody']
    });
};


Table.prototype.setAttributeText = function (value) {
    this.view.clearChild().addChild(_({ text: value }));
    return value;
};


Table.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['header']);
};


Table.prototype.getAttributeHeaderDescriptor = function () {
    return {
        type: "array"
    };
};

Table.prototype.setAttributeHeader = function (header) {
    if (!(header.length > 0)) {
        header = ["Data Error"];
    }
    var headerElt = $('thead', this.view);
    headerElt.clearChild();
    var rowElt = _('tr');
    var cellElt;
    for (var i = 0; i < header.length; ++i) {
        cellElt = _({
            tag: 'td',
            child: { text: header[i] }
        });
        rowElt.addChild((cellElt));
    }
    headerElt.addChild(rowElt);

    return header;
}

export default Table;