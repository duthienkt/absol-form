import EventEmitter from "absol/src/HTML5/EventEmitter";
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";

function BaseEditor() {
    EventEmitter.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}


Object.defineProperties(BaseEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
Object.defineProperties(BaseEditor.prototype, Object.getOwnPropertyDescriptors(Fragment.prototype));
BaseEditor.prototype.constructor = BaseEditor;

BaseEditor.prototype.CONFIG_STORE_KEY = "AS_BaseEditor_config";
BaseEditor.prototype.config = {};//share width differentInstance

BaseEditor.prototype.loadConfig = function () {
    var raw = localStorage.getItem(this.CONFIG_STORE_KEY);
    if (raw) {
        try {
            Object.assign(this.config, JSON.parse(raw));
        }
        catch (error) {
            console.error("Config fail:", error);
        }
    }
};


BaseEditor.prototype.saveConfig = function () {
    if (this._saveConfigTimeOut > 0) {
        clearTimeout(this._saveConfigTimeOut);
        this._saveConfigTimeOut = -1;
    }
    var self = this;
    setTimeout(function () {
        var raw = JSON.stringify(self.config);
        localStorage.setItem(self.CONFIG_STORE_KEY, raw);
    }, 2000);
};


BaseEditor.prototype.setData = function (data) {
    throw new Error('Not implement!');
};

BaseEditor.prototype.getData = function () {
    throw new Error('Not implement!');
};

BaseEditor.prototype.getComponentTool = function () {
    return undefined;
};

BaseEditor.prototype.getOutlineTool = function () {
    return undefined;
};

BaseEditor.prototype.notifyDataChange = function () {
    this.emit('datachange', { type: 'datachange', target: this }, this);
};



BaseEditor.prototype.runCmd = function () {
    return this.cmdRunner.invoke.apply(this.cmdRunner, arguments);
};

export default BaseEditor;