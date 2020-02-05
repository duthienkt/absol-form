import PhotoSwipeFrag from "absol-photoswipeviewer/PhotoSwipeFrag";
import BaseEditor from "../core/BaseEditor";
import Context from "absol/src/AppPattern/Context";


function PhotoViewer() {
    BaseEditor.call(this);
    PhotoSwipeFrag.call(this);
}

Object.assign(PhotoViewer.prototype, PhotoSwipeFrag.prototype);
for (var prot in BaseEditor.prototype) {
    if (BaseEditor.prototype[prot] == Context.prototype[prot]) continue;
    if (PhotoViewer.prototype[prot] != Context.prototype[prot]) continue;
    PhotoViewer.prototype[prot] = BaseEditor.prototype[prot];
}

PhotoViewer.prototype.constructor = PhotoViewer;

PhotoViewer.prototype.setData = function(data){
    var self = this;
    if (data.images){
        data.images.forEach(function(photoItem){
            self.push(photoItem);
        })
    }
};

export default PhotoViewer;