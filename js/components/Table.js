import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import Dom from "absol/src/HTML5/Dom";
import { randomPhrase } from "absol/src/String/stringGenerate";

var _ = Fcore._;
var $ = Fcore.$;

function Table() {
    ScalableComponent.call(this);
}

Object.defineProperties(Table.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
Table.prototype.constructor = Table;

Table.prototype.tag = "Table";
Table.prototype.menuIcon = "span.mdi.mdi-table-large";

Table.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.header = this.attributes.header || [randomPhrase(10), randomPhrase(10), randomPhrase(10)];
    this.attributes.body = this.attributes.body || [
        [randomPhrase(10), randomPhrase(10), randomPhrase(10)],
        [randomPhrase(10), randomPhrase(10), randomPhrase(10)],
        [randomPhrase(10), randomPhrase(10), randomPhrase(10)]
    ];

    this.style.height = 100;
    this.style.width = 300;

}

// Table.prototype.onCreated = function () {
//     ScalableComponent.prototype.onCreate.call(this);
// }

Table.prototype.render = function () {
    this.$table = _({
        tag: 'table',
        class: 'as-inner-table',
        child: ['thead', 'tbody']

    });
    return _({
        tag: 'tablescroller',
        child: this.$table,
        props: {
            fixedCol: 0
        }
    });
};



Table.prototype.setStyle = function () {
    var res = ScalableComponent.prototype.setStyle.apply(this, arguments);
    Dom.updateResizeSystem();
    return res;
};


Table.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['header', 'body', 'fixedCol']);
};


Table.prototype.getAttributeHeaderDescriptor = function () {
    return {
        type: "array"
    };
};

Table.prototype.getAttributeBodyDescriptor = function () {
    return {
        type: "array2d"
    };
};

Table.prototype.getAttributeFixedColDescriptor = function () {
    return {
        type: "number",
        min: 0,
        max: Infinity
    };
};

Table.prototype.setAttributeHeader = function (header) {
    if (!(header.length > 0)) {
        header = ["Data Error"];
    }
    var headerElt = $('thead', this.$table).clearChild();
    headerElt.clearChild();
    var rowElt = _('tr');
    var cellElt;
    for (var i = 0; i < header.length; ++i) {
        cellElt = _({
            tag: 'th',
            child: { text: header[i] + '' }
        });
        rowElt.addChild((cellElt));
    }
    headerElt.addChild(rowElt);
    this.view._updateContent();

    return header;
};


Table.prototype.setAttributeBody = function (body) {
    if (!(body.length > 0)) {
        body = [["Data Error"]];
    }
    var bodyElt = $('tbody', this.$table).clearChild();
    var rowElt;
    // var cellElt;
    var row, cell;
    for (var i = 0; i < body.length; ++i) {
        row = body[i];
        rowElt = _('tr').addTo(bodyElt);
        for (var j = 0; j < row.length; ++j) {
            cell = row[j];
            _({ tag: 'td', child: { text: cell + '' } }).addTo(rowElt);
        }
    }
    this.view._updateContent();
    return body;

};

Table.prototype.setAttributeFixedCol = function (value) {
    if (value >= 0) {
    }
    else {
        value = 0;
    }
    this.view.fixedCol = value;
    return value;
};

export default Table;