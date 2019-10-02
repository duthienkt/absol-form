function FModel() {
    this.attributes = {};
}


/**
 * @returns {Array<String>}
 */
FModel.prototype.getAcceptsStyleNames = function () {

};


/**
 * @param {String} name
 * @returns {}
 */
FModel.prototype.getAttributeDescriptor = function (name) {
    var functionName = 'getAttribute' + name.substr(0, 1).toUpperCase() + name.substr(1) + 'Descriptor';
    return this[functionName] && this[functionName].call(this);
};


/**
 * @param {String} name
 * @param {} value
 * @returns {} value which is set 
 */
FModel.prototype.setAttribute = function (name, value) {
    var functionName = 'setAttribute' + name.substr(0, 1).toUpperCase() + name.substr(1);
    var res = this[functionName] && this[functionName].call(this, value);
    if (res === undefined) {
        delete this.attributes[name];
    }
    else {
        this.attributes[name] = res;
    }
    return res;
};


/**
* @param {String} name
 * @returns {} value which is set 
 */
FModel.prototype.getAttribute = function (name) {
    return this.attributes[name];
};

export default FModel;