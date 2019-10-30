import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;

function Button() {
    ScalableComponent.call(this);
}

Object.defineProperties(Button.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
Button.prototype.constructor = Button;

Button.prototype.tag = "Button";
Button.prototype.menuIcon = "span.mdi.mdi-alpha-b-box";
Button.count = 0;

Button.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.name = 'Button_' + (Button.count++);
    this.attributes.text = this.attributes.name;
};

Button.prototype.onCreated = function () {
    var self = this;
    this.view.on('click', function(event){
        if (self.events.click){
            console.log('TODO: exec', self.events.click);
        }
    });
};



Button.prototype.render = function () {
    return _('button');
};


Button.prototype.setAttributeText = function (value) {
    this.view.clearChild().addChild(_({ text: value }));
    return value;
};


Button.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['text']);
};


Button.prototype.getAttributeTextDescriptor = function () {
    return {
        type: "text",
    };
};

export default Button;