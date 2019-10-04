import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;

function NumberInput() {
    ScalableComponent.call(this);
}

Object.defineProperties(NumberInput.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
NumberInput.prototype.constructor = NumberInput;

NumberInput.prototype.tag = "NumberInput";
NumberInput.prototype.menuIcon = ['<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">',
    '<path d = "m17 7h5v10h-5v2a1 1 0 0 0 1 1h2v2h-2.5c-0.55 0-1.5-0.45-1.5-1 0 0.55-0.95 1-1.5 1h-2.5v-2h2a1 1 0 0 0 1-1v-14a1 1 0 0 0-1-1h-2v-2h2.5c0.55 0 1.5 0.45 1.5 1 0-0.55 0.95-1 1.5-1h2.5v2h-2a1 1 0 0 0-1 1v2m-15 0h11v2h-9v6h9v2h-11v-10m18 8v-6h-3v6h3z" />',
    '<g style="fill-rule:evenodd;fill:#141414;stroke-linejoin:round" aria-label="00">',
    '<path d="m5.595 13.93 0.3453 0.3299q0.5831-0.6522 0.9782-1.477 0.445-0.9322 0.445-1.696 0-0.656-0.2148-1.366l-0.1956 0.02302q-0.6598 0.5678-1.036 1.68-0.3299 0.9744-0.3299 1.972 0 0.06138 0.00767 0.2647 0.00384 0.1688 0 0.2685zm1.02-4.853 0.4028 0.3031q0.2494-0.06905 0.4949-0.1419 0.3568-0.09974 0.4719-0.09974 0.1688 0 0.3299 0.5025 0.165 0.514 0.165 1.216 0 1.385-1.389 3.077-0.8209 1.001-1.254 1.001-0.2954 0-0.61-0.3376-0.7097-0.7596-0.7097-1.531 0-1.174 0.5409-2.279 0.5908-1.208 1.557-1.711z" style="fill:#141414;stroke-width:2.616" />',
    '<path d="m9.969 13.93 0.3453 0.3299q0.5831-0.6522 0.9782-1.477 0.445-0.9322 0.445-1.696 0-0.656-0.2148-1.366l-0.1956 0.02302q-0.6598 0.5678-1.036 1.68-0.3299 0.9744-0.3299 1.972 0 0.06138 0.00767 0.2647 0.00384 0.1688 0 0.2685zm1.02-4.853 0.4028 0.3031q0.2494-0.06905 0.4949-0.1419 0.3568-0.09974 0.4719-0.09974 0.1688 0 0.3299 0.5025 0.165 0.514 0.165 1.216 0 1.385-1.389 3.077-0.8209 1.001-1.254 1.001-0.2954 0-0.61-0.3376-0.7097-0.7596-0.7097-1.531 0-1.174 0.5409-2.279 0.5908-1.208 1.557-1.711z" style="fill:#141414;stroke-width:2.616" />',
    '</g>',
    '</svg>'].join('');

NumberInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
NumberInput.prototype.SUPPORT_EVENT_NAMES = ['change'];


NumberInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('change', function(event){
        self.attributes.value = event.value;
    });
};

NumberInput.prototype.render = function () {
    return _('numberinput');
};


NumberInput.prototype.setAttributeValue = function (value) {
    this.view.value = value;
    return this.view.value;
};

export default NumberInput;