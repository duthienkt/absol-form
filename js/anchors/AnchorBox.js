function AnchorBox(){
    this.view  = this.render();
}



AnchorBox.prototype.render = function(){
    throw new Error("Not implement!");
};


AnchorBox.prototype.setAlign = function(value){
    this._align = value;
}

AnchorBox.prototype.getAlign = function(){
    return this._align;
}





export default AnchorBox;
