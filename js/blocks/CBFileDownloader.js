import BaseBlock from "../core/BaseBlock";
import inheritComponentClass from "../core/inheritComponentClass";
import {AssemblerInstance} from "../core/Assembler";
import {saveTextAs} from "absol/src/Network/FileSaver";


/***
 * @extends BaseBlock
 * @constructor
 */
function CBFileDownloader() {
    BaseBlock.call(this);
}


inheritComponentClass(CBFileDownloader, BaseBlock);

CBFileDownloader.prototype.tag = "CBFileDownloader";


CBFileDownloader.prototype.pinHandlers.data = {
    receives: function (value) {
        if (typeof value === 'string') {
           saveTextAs(value, this.attributes.fileName);
        }
    },
    descriptor: {
        type: 'text'
    }
};

CBFileDownloader.prototype.attributeHandlers.fileName = {
    descriptor: {
        type: 'text'
    }
}

AssemblerInstance.addClass(CBFileDownloader);

export default CBFileDownloader;