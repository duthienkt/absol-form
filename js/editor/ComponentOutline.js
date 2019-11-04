import Fcore from "../core/FCore";
import EventEmitter from "absol/src/HTML5/EventEmitter";
import Context from "absol/src/AppPattern/Context";
import R from "../R";
import '../../css/componentoutline.css';

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
    this.$expNodes = [];
    this.$focusNode = undefined;
    this._lastPressTime = 0;
}

Object.defineProperties(ComponentOutline.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(ComponentOutline.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
ComponentOutline.prototype.constructor = ComponentOutline;


ComponentOutline.prototype.onStart = function () {
    this.mLayoutEditor = this.getContext(R.LAYOUT_EDITOR);
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
    var anchorEditor = this.mLayoutEditor.findAnchorEditorByComponent(comp);
    if (anchorEditor) {
        anchorEditor.focus()
    }
    else {
        this.mLayoutEditor.setActiveComponent(comp);
    }

    if (this.mLayoutEditor.anchorEditors.length == 1) {
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
            '=================',


        ].concat(items)
    }
    event.stopPropagation();
    event.showContextMenu({
        items: items
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
    this.mLayoutEditor.moveToTopComponent(comp);
};

ComponentOutline.prototype.moveUp = function (comp) {
    this.mLayoutEditor.moveUpComponent(comp);
    this.updateComponetTree();
};

ComponentOutline.prototype.moveDown = function (comp) {
    this.mLayoutEditor.moveDownComponent(comp);
    this.updateComponetTree();
}

ComponentOutline.prototype.moveToBottom = function (comp) {
    this.mLayoutEditor.moveToBottomComponent(comp);
    this.updateComponetTree();
};

ComponentOutline.prototype.updateComponetTree = function () {
    var self = this;
    this.$expNodes = [];
    if (this.$exptree) {
        this.$exptree.remove();
        this.$exptree = undefined
    }

    function onPressNode(event) {
        if (event.shiftKey)
            self.mLayoutEditor.toggleActiveComponent(this.__comp__);
        else
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
                self.$expNodes.push(childElt);
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
        this.$expNodes.push(this.$exptree);
        visit(this.$exptree, this.mLayoutEditor.rootLayout);
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
        for (var j = 0; j < this.mLayoutEditor.anchorEditors.length; ++j) {
            if (this.mLayoutEditor.anchorEditors[j].component == nodeElt.__comp__) {
                editor = this.mLayoutEditor.anchorEditors[j];
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
    }
    // console.log(this.mLayoutEditor.getActivatedComponents());
};

ComponentOutline.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        class: 'as-component-outline',
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
};


ComponentOutline.prototype.selectNext = function (component) {
    var prev = undefined;
    var self = this;
    $('exptree', this.$view, function (node) {
        if (node.__comp__ == component) {
            prev = node;
        }
        else if (prev) {
            self.mLayoutEditor.setActiveComponent(node.__comp__);
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
                self.mLayoutEditor.setActiveComponent(prev.__comp__);
                prev.$node.focus();
                return true;
            }
        }
        prev = node;

    });
};


export default ComponentOutline;