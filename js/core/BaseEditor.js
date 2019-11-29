import EventEmitter from "absol/src/HTML5/EventEmitter";
import Fragment from "absol/src/AppPattern/Fragment";

function BaseEditor(){
    EventEmitter.call(this);
    Fragment.call(this);
}


Object.defineProperties(BaseEditor.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
Object.defineProperties(BaseEditor.prototype, Object.getOwnPropertyDescriptors(Fragment.prototype));
BaseEditor.prototype.constructor = BaseEditor;

BaseEditor.prototype.setData = function(data){
    throw new Error('Not implement!');
};

BaseEditor.prototype.getData = function(){
    throw new Error('Not implement!');
};

export default BaseEditor;