/**
 * map from component to anchor
 * @param {string} name
 * @returns {{getDescriptor: function, set: set, get: (function(): *)}}
 */
export default function makeMapStyleHandler(name) {
    return {
        set: function (value) {
            this.childNode.style[name] = value;
        },
        get: function () {
            return this.childNode.style[name];
        },
        getDescriptor: function () {
            this.childNode.style.getPropertyDescriptor(name);
        }
    }
}