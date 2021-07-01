import {AssemblerInstance} from "../core/Assembler";
import BaseBlock from "../core/BaseBlock";
import inheritComponentClass from "../core/inheritComponentClass";
import noop from "absol/src/Code/noop";

function CBFunction() {
    BaseBlock.call(this);
    this.func = noop;
    this.attributes.args = [];
    this.pinHandlers = Object.assign({},CBFunction.prototype.pinHandlers );
    this.receivedArgValues = {};
    this.result = undefined;
}

inheritComponentClass(CBFunction, BaseBlock);

CBFunction.prototype.tag = 'function';


CBFunction.prototype.attributeHandlers.body = {
    set: function (value, ref) {
        ref.set(value);
        if (value && this.attributes.args) {
            this.rebuildFunction();
        }
        return value;
    },
    descriptor:{
        type:'text'
    }
};

CBFunction.prototype.attributeHandlers.args = {
    descriptor:{
        type:'text[]'
    }
};

CBFunction.prototype.attributeHandlers.defaultArgs = {
    set: function (value) {
        Object.assign(this.receivedArgValues, value);
        return value;
    },
    descriptor: {
        type: 'object'
    }
};

CBFunction.prototype.pinHandlers.exec = {
    receives:function (){
        this.exec();
    },
    descriptor:{
        type:'bool'
    }
};


CBFunction.prototype.pinHandlers.result = {
    get: function () {
        return this.result;
    }
};

CBFunction.prototype.rebuildFunction = function () {
    var self = this;
    try {
        this.pinHandlers = this.attributes.args.reduce(function (ac, cr) {
            ac[cr] = {
                receives: function (value) {
                    if (value && value.then) {
                        value.then(function () {
                            self.receivedArgValues[cr] = value;
                            self.exec();
                        });
                    }
                    else {
                        self.receivedArgValues[cr] = value;
                        self.exec();
                    }
                }
            };
            return ac;
        }, {});


        Object.assign(this.pinHandlers, CBFunction.prototype.pinHandlers);

        this.func = (new Function([
            `return function(${this.attributes.args.join(', ')}){`,
            this.attributes.body,
            '}'
        ].join('\n')))();
    } catch (error) {
        console.error(error);
        this.func = noop;
    }
};

CBFunction.prototype.exec = function () {
    var self = this;
    var receivedArgValues = this.receivedArgValues;
    var completeArg = true;
    var result;
    var args = this.attributes.args.map(function (name) {
        if (name in receivedArgValues) {
            return receivedArgValues[name];
        }
        else completeArg = false;
    });
    if (completeArg) {
        result = this.func.apply(this, args);
        if (result && result.then) {
            result.then(function (result) {
                self.result = result;
                self.pinFire('result');
            })
        }
        else {
            this.result = result;
            this.pinFire('result');
        }
    }
};


AssemblerInstance.addClass(CBFunction);

export default CBFunction;