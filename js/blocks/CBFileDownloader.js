import BaseBlock from "../core/BaseBlock";
import inheritComponentClass from "../core/inheritComponentClass";
import {AssemblerInstance} from "../core/Assembler";
import {_} from "../core/FCore";
import {randomUniqueIdent} from "../core/utils";


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
        var a;
        var blob;
        var url;
        if (typeof value === 'string') {
            blob = new Blob([value], { type: 'text/plain', encoding: "UTF-8" });
        }
        if (blob) {
            url = URL.createObjectURL(blob);
        }
        if (url) {
            a = _({
                tag: 'a',
                style: { display: 'none' },
                attr: {
                    download: this.attributes.fileName || randomUniqueIdent() + '.txt',
                    target: '_blank',
                    href: url
                }
            }).addTo(document.body);
            a.click();
            a.remove();
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