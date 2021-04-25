import PEBaseType from "./PEBaseType";
import OOP from "absol/src/HTML5/OOP";
import QuickMenu from "absol-acomp/js/QuickMenu";
import {$, _} from "../../core/FCore";


/***
 * @extends PEBaseType
 * @constructor
 */
function PETextAlign() {
    PEBaseType.apply(this, arguments);
}

OOP.mixClass(PETextAlign, PEBaseType);

PETextAlign.prototype.icons = {
    left: 'mdi-format-align-left',
    right: 'mdi-format-align-right',
    center: 'mdi-format-align-center'
}

PETextAlign.prototype.attachInput = function () {
    var self = this;
    this.$button = _({
        tag: 'button',
        class: 'as-property-editor-text-align-input',
        child: 'span.mdi'
    });
    this.cellElt.addChild(this.$button);
    this.$icon = $('span.mdi', this.$button);
    this._lastClass = this.icons[this.getValue()] || this.icons.left;

    QuickMenu.toggleWhenClick(this.$button, {
        getMenuProps: function () {
            return {
                items: [
                    {
                        text: 'Left',
                        icon: 'span.mdi.' + self.icons.left,
                        menuData: 'left'
                    },
                    {
                        text: 'Center',
                        icon: 'span.mdi.' + self.icons.center,
                        menuData: 'center'
                    },
                    {
                        text: 'Right',
                        icon: 'span.mdi.' + self.icons.right,
                        menuData: 'right'
                    }
                ]
            }
        },
        onSelect: function (item) {
            var newIcon = self.icons[item.menuData];
            if (newIcon !== self._lastClass) {
                self.$icon.removeClass(self._lastClass)
                    .addClass(newIcon);
                self._lastClass = newIcon;
            }
            self.setValue(item.menuData);
            self.notifyStopChange();
        }
    });
};

PETextAlign.prototype.reload = function () {
    this.$icon.removeClass(this._lastClass)
        .addClass(this.icons[this.getValue()] || this.icons.left);
};


export default PETextAlign