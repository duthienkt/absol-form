function WindowManager() {
    this.windowHolders = [];
    this.zIndex = 100;
}


WindowManager.prototype.ev_mouseDownWindow = function (holder, event) {
    holder.delta = 1000;
    this.reIndex();
};


WindowManager.prototype.remove = function (elt) {
    var holder = this.getHolder(elt);
    if (!holder) return;
    elt.off('mousedown', holder.onmousedown);
    elt.remove();
    holder.delta -= 100000000;
    this.reIndex();
};

WindowManager.prototype.getHolder = function (elt) {
    for (var i = 0; i < this.windowHolders.length; ++i) {
        if (this.windowHolders[i].elt == elt) return this.windowHolders[i];
    }
};

WindowManager.prototype.add = function (elt) {
    var holder = this.getHolder(elt);
    if (holder) return holder;
    var holder = {
        elt: elt,
        zIndex: 100,
        delta: 1000
    }
    holder.onmousedown = this.ev_mouseDownWindow.bind(this, holder);
    this.windowHolders.push(holder);
    elt.on('mousedown', holder.onmousedown);
    elt.addTo(document.body);
    this.reIndex();
    return holder;
};

WindowManager.prototype.reIndex = function () {
    this.windowHolders.sort(function (a, b) {
        return a.zIndex + a.delta - b.zIndex - b.delta;
    });
    while (this.windowHolders.length > 0 && this.windowHolders[0].delta < 0) this.windowHolders.pop();
    var holder;
    for (var i = 0; i < this.windowHolders.length; ++i) {
        holder = this.windowHolders[i];
        holder.delta = 0;
        if (holder.zIndex != this.zIndex + i) {
            holder.zIndex = this.zIndex + i;
            holder.elt.addStyle('zIndex', holder.zIndex + '');
        }
    }
};



export default new WindowManager();