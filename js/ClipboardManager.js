import Broadcast from 'absol/src/Network/Broadcast';
import { randomIdent } from 'absol/src/String/stringGenerate';
import EventEmitter from 'absol/src/HTML5/EventEmitter';

/**
 * Share bestween tab(same origin) use localStorage and BroardCast
 */
function ClipboardManager() {
    EventEmitter.call(this);
    this.broadcast = new Broadcast('formeditor_clipboard', randomIdent(20));
    var localDataText = localStorage.getItem(this.LOCAL_STORE_KEY);
    var localData;
    try {
        localData = JSON.parse(localDataText || '{}');
    }
    catch (error) {
        localData.data = {};
    }
    this.data = localData.data || {};
    this.broadcast.on('set', this.ev_BroadcastSet.bind(this));
};

Object.defineProperties(ClipboardManager.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
ClipboardManager.prototype.constructor

ClipboardManager.prototype.LOCAL_STORE_KEY = 'AS_Form_ClipboardManager';


ClipboardManager.prototype.ev_BroadcastSet = function (key, value) {
    this.set(key, value, true);
};


ClipboardManager.prototype.set = function (key, value, isPrivate) {
    this.data[key] = value;
    console.log(key, value);
    
    this.emit('set', key, value, this);
    if (!isPrivate) {
        this.broadcast.emit('set', key, value);
        localStorage.setItem(this.LOCAL_STORE_KEY, JSON.stringify({ data: this.data }));
    }
};


ClipboardManager.prototype.get = function (key) {
    return this.data[key];
};

export default new ClipboardManager();