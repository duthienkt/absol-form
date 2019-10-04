function BaseAnchor(){
    FViewable.call(this);
}



BaseAnchor.prototype.render = function(){
    throw new Error("Not implement!");
};


export default BaseAnchor;

