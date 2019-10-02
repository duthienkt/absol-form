

function FNode() {
    /**
     * @type {FNode}
     */
    this.parent = null;

    /**
     * @type {Array<FNode>}
     */
    this.children = [];
}


FNode.prototype.onDetach = function () {/* NOOP */ };
FNode.prototype.onDetached = function () {/* NOOP */ };

FNode.prototype.onAttach = function () {/* NOOP */ };
FNode.prototype.onAttached = function () {/* NOOP */ };


/**
 * @param {FNode} child
 * @param {Number} index
 */
FNode.prototype.onRemoveChild = function (child, index) { }


/**
 * @param {FNode} child
 * @param {Number} index
 */
FNode.prototype.onAddChild = function (child, index) { };

/**
 * @return {FNode}
 */
FNode.prototype.remove = function () {
    if (this.parent)
        this.parent.removeChild(this);
};

/**
 * @param {FNode} child
 * @return {FNode}
 */
FNode.prototype.addChild = function (child) {
    child.remove();
    this.children.push(child);
    child.parent = this;
    //data ready
    this.onAttach();
    this.onAddChild(child, - 1);//negative index for appending child
    child.onAttached();
};


/**
 * @param {FNode} child
 * @return {FNode}
 */
FNode.prototype.removeChild = function (child) {
    var childIndex = this.children.indexOf(child);
    if (childIndex < 0) return false;
    this.children.splice(childIndex, 1);
    child.onDetach(this);
    this.onRemoveChild(child, childIndex);
    child.parent = undefined;
    child.onDetached(this);
    return true;
};


/**
 * @param {FNode} child
 * @param {FNode} at
 * @return {FNode}
 */
FNode.prototype.addChildBefore = function (child, at) {
    child.remove();
    var atIndex = this.children.indexOf(at);
    if (atIndex >= 0) {
        this.children.splice(atIndex, 0, child);
        child.parent = this;
        this.onAttach();
        this.onAddChild(child, atIndex);
        child.onAttached();
        return true;
    }
    return false;
};


/**
 * @param {FNode} child
 * @param {FNode} at
 * @return {FNode}
 */
FNode.prototype.addChildAfter = function (child, at) {
    child.remove();
    var atIndex = this.children.indexOf(at);
    if (atIndex >= 0) {
        this.children.splice(atIndex + 1, 0, child);
        child.parent = this;
        this.onAttach();
        this.onAddChild(child, atIndex + 1);
        child.onAttached();
        return true;
    }
    return false;
};


/**
 * @param {FNode} child
 * @return {FNode}
 */
FNode.prototype.findChildBefore = function (child) {
    var index = this.children.indexOf(child);
    if (index > 0) return this.children[index - 1];
};


/**
 * @param {FNode} child
 * @return {FNode}
 */
FNode.prototype.findChildAfter = function (child) {
    var index = this.children.indexOf(child);
    if (index < this.children.length - 1) return this.children[index + 1];
};


/**
 * @param {FNode} child
 * @return {Number}
 */
FNode.prototype.indexOfChild = function (child) {
    return this.children.indexOf(child);
};


export default FNode;