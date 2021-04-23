import Fcore from "../core/FCore";
import R from "../R";
import '../../css/componentoutline.css';
import BaseEditor from "../core/BaseEditor";
import FmFragment from "../core/FmFragment";
import Toast from "absol-acomp/js/Toast";

var _ = Fcore._;
var $ = Fcore.$;


function ComponentOutline() {
    BaseEditor.call(this);
    this.$view = null;
    /**
     * @type {import('./LayoutEditor').default}
     */
    this.layoutEditor = null;
    this.activeComponents = [];
    this.$expNodes = [];
    this.$focusNode = undefined;
    this._lastPressTime = 0;
}

Object.defineProperties(ComponentOutline.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
ComponentOutline.prototype.constructor = ComponentOutline;


ComponentOutline.prototype.onStart = function () {
    this.layoutEditor = this.getContext(R.LAYOUT_EDITOR);

};

ComponentOutline.prototype.ev_contextNode = function (comp, event) {
    var self = this;
    var items = [{
        icon: 'span.mdi.mdi-delete-variant',
        text: 'Delete',
        cmd: 'delete',
        extendStyle: {
            color: 'red'
        }
    }];
    var anchorEditor = this.layoutEditor.findAnchorEditorByComponent(comp);
    if (anchorEditor) {
        anchorEditor.focus();
        this.updateComponentStatus();
    }
    else {
        this.layoutEditor.setActiveComponent(comp);
    }

    if (this.layoutEditor.anchorEditors.length == 1) {
        items = [
            {
                icon: 'span.mdi.mdi-arrow-collapse-up',
                text: 'Move To Top',
                cmd: 'move-to-top'
            },
            {
                icon: 'span.mdi.mdi-arrow-up',
                text: 'Move Up',
                cmd: 'move-up'
            },
            {
                icon: 'span.mdi.mdi-arrow-down',
                text: 'Move Down',
                cmd: 'move-down'
            },
            {
                icon: 'span.mdi.mdi-arrow-collapse-down',
                text: 'Move To Bottom',
                cmd: 'move-to-bottom'
            },
            '================='
        ].concat(items)
    }

    if (comp.isLayout) {
        items = [{
            icon: 'span.mdi.mdi-square-edit-outline',
            text: comp.fragment ? "Edit Fragment" : 'Edit Layout',
            cmd: comp.fragment ? 'edit_fragment' : 'edit_layout',
            extendStyle: {
                color: 'blue'
            }
        },
            '=============='].concat(items);
    }
    event.stopPropagation();
    event.showContextMenu({
        items: items,
        extendStyle: {
            fontSize: '12px'
        }
    }, function (event) {
        switch (event.menuItem.cmd) {
            case "delete":
                self.layoutEditor.execCmd('delete');
                break;
            case 'move-to-top':
                self.moveToTop(comp);
                break;
            case 'move-up':
                self.moveUp(comp);
                break;
            case 'move-down':
                self.moveDown(comp);
                break;
            case 'move-to-bottom':
                self.moveToBottom(comp);
                break;
            case 'edit_layout':
                self.layoutEditor.editLayout(comp);
                break;
            case 'edit_fragment':
                var toast = Toast.make({
                    props: {
                        htitle: "TODO",
                        message: "Edit form"
                    }
                });
                setTimeout(toast.disappear.bind(toast), 2000);
                break;
        }
        setTimeout(self.$view.focus.bind(self.$view), 20);
    });
};

ComponentOutline.prototype.moveToTop = function (comp) {
    this.layoutEditor.moveToTopComponent(comp);
};

ComponentOutline.prototype.moveUp = function (comp) {
    this.layoutEditor.moveUpComponent(comp);
    this.updateComponentTree();
};

ComponentOutline.prototype.moveDown = function (comp) {
    this.layoutEditor.moveDownComponent(comp);
    this.updateComponentTree();
}

ComponentOutline.prototype.moveToBottom = function (comp) {
    this.layoutEditor.moveToBottomComponent(comp);
    this.updateComponentTree();
};

ComponentOutline.prototype.updateComponentTree = function () {
    var self = this;
    this.$expNodes = [];
    if (this.$exptree) {
        this.$exptree.remove();
        this.$exptree = undefined
    }

    function onPressNode(comp, event) {
        var target = event.target;
        if ((this.status == 'open' || this.status == 'close') && this.$node.$iconCtn.getBoundingClientRect().left > event.clientX - 3) {
            this.status = this.status == 'open' ? 'close' : 'open';
        }
        else {
            var parentLayout = self.layoutEditor.findNearestLayoutParent(comp.parent);
            if (event.shiftKey && parentLayout == self.layoutEditor.editingLayout)
                self.layoutEditor.toggleActiveComponent(comp);
            else {
                if (parentLayout != self.layoutEditor.editingLayout) {
                    self.layoutEditor.editLayout(parentLayout || self.layoutEditor.rootLayout);
                }
                self.layoutEditor.setActiveComponent(comp);
            }
        }
    }

    function visit(expTree, comp) {
        if (comp.children) {
            comp.children.forEach(function (childComp) {
                var childElt = _({
                    tag: 'exptree',
                    props: {
                        icon: childComp.fragment ? childComp.fragment.menuIcon : childComp.menuIcon,
                        name: childComp.getAttribute('name'),
                        __comp__: childComp
                    }
                });
                childElt.getNode().defineEvent(['contextmenu']);
                childElt.getNode().on({
                    click: onPressNode.bind(childElt, childComp),
                    contextmenu: self.ev_contextNode.bind(self, childComp)
                });
                expTree.addChild(childElt);
                self.$expNodes.push(childElt);
                if (!childComp.fragment)
                    visit(childElt, childComp);
                expTree.status = 'open';
            });
        }
    }


    if (this.layoutEditor.rootLayout) {
        this.$exptree = _({
            tag: 'exptree',
            props: {
                status: 'open',
                icon: this.layoutEditor.rootLayout.menuIcon,
                name: this.layoutEditor.rootLayout.getAttribute('name'),
                __comp__: this.layoutEditor.rootLayout,
                __isRoot__: true
            }
        });
        this.$exptree.on('press', onPressNode.bind(this.$exptree, this.layoutEditor.rootLayout))
        this.$expNodes.push(this.$exptree);
        visit(this.$exptree, this.layoutEditor.rootLayout);
        if (this.$view) {
            this.$view.addChild(this.$exptree);
        }
    }
    this.updateComponentStatus();
};

ComponentOutline.prototype.updateComponentStatus = function () {
    this.$focusNode = undefined;
    var nodeElt;
    var editor;
    for (var i = 0; i < this.$expNodes.length; ++i) {
        nodeElt = this.$expNodes[i];
        editor = undefined;
        for (var j = 0; j < this.layoutEditor.anchorEditors.length; ++j) {
            if (this.layoutEditor.anchorEditors[j].component == nodeElt.__comp__) {
                editor = this.layoutEditor.anchorEditors[j];
            }
        }
        if (editor) {
            nodeElt.addClass('as-component-outline-node-selected');
            if (editor.isFocus) {
                nodeElt.addClass('as-component-outline-node-focus');
                this.$focusNode = nodeElt;
            }
            else {
                nodeElt.removeClass('as-component-outline-node-focus');
            }
        }
        else {
            nodeElt.removeClass('as-component-outline-node-selected');
            nodeElt.removeClass('as-component-outline-node-focus');
        }
    }
};

ComponentOutline.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        tag: 'bscroller',
        class: ['as-component-outline'],
        attr: {
            tabindex: '1'
        },
        on: {
            keydown: this.ev_keydown.bind(this)
        }
    });
    if (this.$exptree)
        this.$view.addChild(this.$exptree);

    return this.$view;
};


ComponentOutline.prototype.ev_keydown = function (event) {
    var now = new Date().getTime();
    if (now - this._lastPressTime < 50) return;
    this._lastPressTime = now;
    switch (event.key) {
        case 'Down':
        case 'ArrowDown':
            if (this.$focusNode) this.selectNext(this.$focusNode.__comp__);
            break;
        case 'Up':
        case 'ArrowUp':
            if (this.$focusNode) this.selectPrev(this.$focusNode.__comp__);
            break;
    }
    this.layoutEditor.ev_cmdKeyDown(event);
    setTimeout(this.$view.focus.bind(this.$view), 10);
};


ComponentOutline.prototype.selectNext = function (component) {
    var prev = undefined;
    var self = this;
    $('exptree', this.$view, function (node) {
        if (node.__comp__ == component) {
            prev = node;
        }
        else if (prev) {
            self.layoutEditor.setActiveComponent(node.__comp__);
            node.$node.focus();
            return true;
        }
    });
};

ComponentOutline.prototype.selectPrev = function (component) {
    var prev = undefined;
    var self = this;
    $('exptree', this.$view, function (node) {
        if (node.__comp__ == component) {
            if (prev) {
                self.layoutEditor.setActiveComponent(prev.__comp__);
                prev.$node.focus();
                return true;
            }
        }
        prev = node;

    });
};


export default ComponentOutline;