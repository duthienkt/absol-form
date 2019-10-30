import Fcore from "../core/FCore";
import EventEmitter from "absol/src/HTML5/EventEmitter";
import Context from "absol/src/AppPattern/Context";
import R from "../R";

var _ = Fcore._;
var $ = Fcore.$;


function ComponentOutline() {
    Context.call(this);
    EventEmitter.call(this);
    this.$view = null;
    /**
     * @type {import('./LayoutEditor').default}
     */
    this.mLayoutEditor = null;
    this.activeComponents = [];
}

Object.defineProperties(ComponentOutline.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(ComponentOutline.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
ComponentOutline.prototype.constructor = ComponentOutline;


ComponentOutline.prototype.onStart = function () {
    this.mLayoutEditor = this.getContext(R.LAYOUT_EDITOR);
};

ComponentOutline.prototype.ev_contextNode = function (comp, event) {
    var self = this;
    event.stopPropagation();
    event.showContextMenu({
        items: [
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
            '=================',
            {
                icon: 'span.mdi.mdi-delete-variant',
                text: 'Delete',
                cmd: 'delete',
                extendStyle: {
                    color: 'red'
                }
            }

        ]
    }, function (event) {
        switch (event.menuItem.cmd) {
            case "delete":
                if (comp.parent) {
                    self.mLayoutEditor.removeComponent(comp);
                }
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
        }
    });
};

ComponentOutline.prototype.moveToTop = function (comp) {
    var parent = comp.parent;
    if (!parent) return;
    var firstChild = parent.children[0];
    if (firstChild == comp) return;
    comp.remove();
    parent.addChildBefore(comp, firstChild);
    this.updateComponetTree();
    this.mLayoutEditor.notifyDataChange();
};

ComponentOutline.prototype.moveUp = function (comp) {
    var parent = comp.parent;
    if (!parent) return;
    var prevChild = parent.findChildBefore(comp);
    if (!prevChild) return;
    comp.remove();
    parent.addChildBefore(comp, prevChild);
    this.updateComponetTree();
    this.mLayoutEditor.notifyChanged();
};

ComponentOutline.prototype.moveDown = function (comp) {
    var parent = comp.parent;
    if (!parent) return;
    var nextChild = parent.findChildAfter(comp);
    if (!nextChild) return;
    nextChild.remove();
    parent.addChildBefore(nextChild, comp);
    this.updateComponetTree();
    this.mLayoutEditor.notifyChanged();
}

ComponentOutline.prototype.moveToBottom = function (comp) {
    var parent = comp.parent;
    if (!parent) return;
    comp.remove();
    parent.addChild(comp);
    this.updateComponetTree();
    this.mLayoutEditor.notifyChanged();
};

ComponentOutline.prototype.updateComponetTree = function () {
    var self = this;
    if (this.$exptree) {
        this.$exptree.remove();
        this.$exptree = undefined
    }

    function onPressNode() {
        self.mLayoutEditor.setActiveComponent(this.__comp__);
    }

    function visit(expTree, comp) {
        if (comp.children) {
            comp.children.forEach(function (childComp) {
                var childElt = _({
                    tag: 'exptree',
                    extendEvent: ['contextmenu'],
                    props: {
                        icon: childComp.menuIcon,
                        name: childComp.getAttribute('name'),
                        __comp__: childComp
                    },
                    on: {
                        click: onPressNode,
                        contextmenu: self.ev_contextNode.bind(self, childComp)
                    }
                });
                expTree.addChild(childElt);
                visit(childElt, childComp)
            });
        }
    }


    if (this.mLayoutEditor.rootLayout) {
        this.$exptree = _({
            tag: 'exptree',
            props: {
                status: 'open',
                icon: this.mLayoutEditor.rootLayout.menuIcon,
                name: this.mLayoutEditor.rootLayout.getAttribute('name'),
                __comp__: this.mLayoutEditor.rootLayout,
                __isRoot__: true
            },
            on: {
                press: onPressNode
            }
        });

        visit(this.$exptree, this.mLayoutEditor.rootLayout);
        if (this.$view) {
            this.$view.addChild(this.$exptree);
        }
    }
};

ComponentOutline.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        class: 'as-component-outline'//,
        // child:{}
    });
    if (this.$exptree)
        this.$view.addChild(this.$exptree);

    return this.$view;
};





export default ComponentOutline;