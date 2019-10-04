function FViewable() {
    this.style = {};
}


/**
 * @returns {Array<String>}
 */
FViewable.prototype.getAcceptsStyleNames = function () {
    return [];
};


FViewable.prototype.render = function () {
    throw new Error('Not Implement');
};

/**
 * @param {String} name
 * @returns {}
 */
FViewable.prototype.getStyleDescriptor = function (name) {
    var functionName = 'getStyle' + name.substr(0, 1).toUpperCase() + name.substr(1) + 'Descriptor';
    return this[functionName] && this[functionName].call(this);
};


/**
 * @returns {}
 */
FViewable.prototype.getStyleDescriptors = function () {
    var result = {};
    var names = this.getAcceptsStyleNames();
    var key;
    for (var i = 0; i< names.length; ++i){
        key = names[i];
        result[key] = this.getStyleDescriptor(key);
    }
    return result;
};




/**
 * @param {String} name
 * @param {} value
 * @returns {} value which is set 
 */
FViewable.prototype.setStyle = function (name, value) {
    var functionName = 'setStyle' + name.substr(0, 1).toUpperCase() + name.substr(1);
    var res = value;
    if (this[functionName]) {
        res = this[functionName].call(this, value);
    }
    if (res === undefined) {
        delete this.style[name];
    }
    else {
        this.style[name] = res;
    }
    return res;
};


/**
* @param {String} name
 * @returns {} value which is set 
 */
FViewable.prototype.getStyle = function (name) {
    return this.style[name];
};

export default FViewable;