var InputAttributeHandlers = {};


InputAttributeHandlers.disabled = {
    set: function (value) {
        this.domElt.disabled = !!value;
    },
    get: function () {
        return this.domElt.disabled;
    },
    descriptor: {
        type: 'bool'
    },
    export: function () {
        return this.domElt.disabled || undefined;
    }
};


export default InputAttributeHandlers;

export var InputAttributeNames = ['disabled'];