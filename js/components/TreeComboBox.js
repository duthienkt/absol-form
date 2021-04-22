import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import OOP from "absol/src/HTML5/OOP";

var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function TreeComboBox() {
    ScalableComponent.call(this);
}

OOP.mixClass(TreeComboBox, ScalableComponent);

TreeComboBox.prototype.tag = "TreeComboBox";

TreeComboBox.prototype.menuIcon = [
    '<svg style="width:22px;height:22px" viewBox="0 0 24 24" width="24" height="24">',
    '<g transform="scale(0.5, 0.5) translate(10, 10)">',
    '<path fill="currentColor" d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V20H7L5,20V9H7V11H13V13Z" />',
    '</g>',
    '<path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4" />',
    '</svg>'
].join('\n');


TreeComboBox.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.list = [
        {
            text: '0', value: '0',
            items: [
                { text: "13", value: '13' },
                { text: "14", value: '14' },
            ]
        },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },


    ];
    this.attributes.value = '0';
    console.log(this.attributes.list);
    Object.defineProperty(this.attributes, 'text', {
            get: function () {
                if (this.list) {
                    for (var i = 0; i < this.list.length; ++i)
                        if (this.list[i].value == this.value) return this.list[i].text;
                    return '';
                }
                else {
                    return "";
                }
            }
        }
    )
};


TreeComboBox.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.bindAttribute('searchable', 'enableSearch');
    this.bindAttribute('value', 'value');
    this.view.on('change', function () {
        self.emit("change", { type: 'change', value: this.value }, self);
    });
};


TreeComboBox.prototype.render = function () {
    return _('selecttreemenu');
};


TreeComboBox.prototype.setAttributeList = function (value) {
    this.view.items = value;
    return this.view.items;
};

TreeComboBox.prototype.getAttributeList = function () {
    return this.view.items.map(function visit (item) {
        var res = { text: item.text, value: item.value };
        if (item.items && item.items.length >0){
            res.items = item.items.map(visit);
        }
        return res;
    });
};


TreeComboBox.prototype.setAttributeText = function (value) {
    return value;
};


TreeComboBox.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["treeList", 'value','searchable']);
};

TreeComboBox.prototype.getAttributeTreeListDescriptor = function () {
    return {
        type: 'SelectTreeList'
    };
};

TreeComboBox.prototype.getAttributeValueDescriptor = function () {
    return {
        type: 'text'
    };
};


TreeComboBox.prototype.getAttributeSearchableDescriptor = function () {
    return {
        type: 'bool'
    };
};


TreeComboBox.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


TreeComboBox.prototype.measureMinSize = function () {
    var minWidthStyle = parseFloat(this.view.getComputedStyleValue('min-width').replace('px'));
    return { width: Math.max(minWidthStyle, 24), height: 25 };
};

TreeComboBox.prototype.getDataBindingDescriptor = function () {
    var thisC = this;
    var subObj = {};
    Object.defineProperties(subObj, {
        value: {
            configurable: true,
            enumerable: true,
            set: function (value) {
                thisC.setAttribute('value', value);
            },
            get: function () {
                return thisC.getAttribute('value');
            }
        },
        treeList: {
            enumerable: true,
            configurable: true,
            get: function () {
                return thisC.getAttribute('list');
            },
            set: function (value) {
                thisC.setAttribute('list', value);
            }
        }
    });

    return {
        set: function (value) {
            Object.assign(subObj, value);
        },
        get: function () {
            return subObj;
        }
    };
};

export default TreeComboBox;