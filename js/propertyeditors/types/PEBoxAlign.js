import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import {base64EncodeUnicode} from "absol/src/Converter/base64";
import {_} from "../../core/FCore";
import QuickMenu from "absol-acomp/js/QuickMenu";


/***
 * @extends PEBaseType
 * @constructor
 */
function PEBoxAlign() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PEBoxAlign, PEBaseType);

PEBoxAlign.prototype.icons = {
    lefttop: 'm0 0v24h24v-24zm1 1h22v22h-22zm2 2h10.3v2h-10.3v-2m0 4h14v2h-14v-2m0 4h9.9v2h-9.9v-2',
    centertop: 'm24 24v-24h-24v24zm-1-1h-22v-22h22zm-6.05-18h-9.9v-2h9.9v2m2.05 4h-14v-2h14v2m-1.85 4h-10.3v-2h10.3v2',
    righttop: 'm24 0v24h-24v-24zm-1 1h-22v22h22zm-2 2h-10.3v2h10.3v-2m0 4h-14v2h14v-2m0 4h-9.9v2h9.9v-2',
    leftcenter: 'm0 24v-24h24v24zm1-1h22v-22h-22zm2-6h10.3v-2h-10.3v2m0-4h14v-2h-14v2m0-4h9.9v-2h-9.9v2',
    centercenter: 'm0 24v-24h24v24zm1-1h22v-22h-22zm6.05-14h9.9v-2h-9.9v2m-2.05 4h14v-2h-14v2m1.85 4h10.3v-2h-10.3v2',
    rightcenter: 'm24 24v-24h-24v24zm-1-1h-22v-22h22zm-2-6h-10.3v-2h10.3v2m0-4h-14v-2h14v2m0-4h-9.9v-2h9.9v2',
    leftbottom: 'm0 24v-24h24v24zm1-1h22v-22h-22zm2-2h10.3v-2h-10.3v2m0-4h14v-2h-14v2m0-4h9.9v-2h-9.9v2',
    centerbottom: 'm24 0v24h-24v-24zm-1 1h-22v22h22zm-6.05 18h-9.9v2h9.9v-2m2.05-4h-14v2h14v-2m-1.85-4h-10.3v2h10.3v-2',
    rightbottom: 'm24 24v-24h-24v24zm-1-1h-22v-22h22zm-2-2h-10.3v-2h10.3v2m0-4h-14v-2h14v2m0-4h-9.9v-2h9.9v2'
};

PEBoxAlign.prototype._makeIcon = function (name) {
    var path = this.icons[name];
    var data = '<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
                    <path d="' + path + '" style="stroke-width:0"/>\
                </svg>';
    return _({
        tag: 'img',
        style: {
            'image-rendering': 'pixelated'
        },
        props: {
            src: 'data:image/svg+xml;base64,' + base64EncodeUnicode(data)
        }
    });
}

PEBoxAlign.prototype.attachInput = function () {
    this.$button = _('button.as-property-editor-text-align-input');
    this.cellElt.addChild(this.$button);
    var self = this;
    QuickMenu.toggleWhenClick(this.$button, {
        getMenuProps: function () {
            return {
                items: [
                    {
                        text: 'Left-Top',
                        icon: self._makeIcon('lefttop'),
                        menuData: 'lefttop'
                    },
                    {
                        text: 'Center-Top',
                        icon: self._makeIcon('centertop'),
                        menuData: 'centertop'
                    },
                    {
                        text: 'Right-Top',
                        icon: self._makeIcon('righttop'),
                        menuData: 'righttop'
                    },
                    {
                        text: 'Left-Center',
                        icon: self._makeIcon('leftcenter'),
                        menuData: 'leftcenter'
                    },
                    {
                        text: 'Center-Center',
                        icon: self._makeIcon('centercenter'),
                        menuData: 'centercenter'
                    },
                    {
                        text: 'Right-Center',
                        icon: self._makeIcon('rightcenter'),
                        menuData: 'rightcenter'
                    },
                    {
                        text: 'Left-Botttom',
                        icon: self._makeIcon('leftbottom'),
                        menuData: 'leftbottom'
                    },
                    {
                        text: 'Center-Botttom',
                        icon: self._makeIcon('centerbottom'),
                        menuData: 'centerbottom'
                    },
                    {
                        text: 'Right-Botttom',
                        icon: self._makeIcon('rightbottom'),
                        menuData: 'rightbottom'
                    }
                ]
            }
        },
        onSelect: function (item) {
            self.$button.clearChild().addChild(self._makeIcon(item.menuData));
            self.setValue(item.menuData);
            self.notifyStopChange();
        }
    });
};

PEBoxAlign.prototype.reload = function () {
    this.$button.clearChild().addChild(this._makeIcon(this.getValue() || 'lefttop'));
};


export default PEBoxAlign;
