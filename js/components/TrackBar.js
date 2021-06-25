import {_} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import inheritComponentClass from "../core/inheritComponentClass";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";

function TrackBar() {
    ScalableComponent.call(this);
}

inheritComponentClass(TrackBar, ScalableComponent);

TrackBar.prototype.tag = 'TrackBar';
TrackBar.prototype.menuIcon = 'span.mdi.mdi-source-commit.mdi-rotate-90';


Object.assign(TrackBar.prototype.attributeHandlers, InputAttributeHandlers);

TrackBar.prototype.attributeHandlers.value = {
    set: function (value) {
        var prev = this.domElt.value;
        this.domElt.value = value;
        if (this.domElt.value !== prev) this.pinFire('value');
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: 'number',
        max: 1,
        min: 0,
        floatFixed: 2
    }
};


TrackBar.prototype.pinHandlers.value = {
    receives: function (value) {
        this.attributes.value = value;
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: 'number',
        max: 1,
        min: 0,
        floatFixed: 2
    }

};

TrackBar.prototype.render = function () {
    return _('trackbar');
};

TrackBar.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.apply(this, arguments);
    this.style.height = 18;
};

TrackBar.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.apply(this, arguments);
    this.domElt.on('change', function (){
        this.pinFire('value');
    }.bind(this));
};


TrackBar.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value'])
        .concat(InputAttributeNames);
};


TrackBar.prototype.measureMinSize = function () {
    return { width: 40, height: 18 };
};


TrackBar.prototype.getDataBindingDescriptor = function () {
    var thisC = this;
    return {
        set: function (value) {
            thisC.setAttribute('value', value);
        },
        get: function () {
            return thisC.getAttribute('value');
        }
    }
};

AssemblerInstance.addClass(TrackBar);

export default TrackBar;