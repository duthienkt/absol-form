import Fcore from "../core/FCore";
var _ = Fcore._;
Fcore.install('mdi-align-horizontal-left', function () {
    return _(
        '<svg width="24px" height="24px" viewBox="0 0 24 24">\
            <path fill="#000000" d = "M22 13V19H6V13H22M6 5V11H16V5H6M2 2V22H4V2H2" />\
        </svg>');
});

Fcore.install('mdi-align-horizontal-center', function () {
    return _(
        '<svg width="24px" height="24px" viewBox="0 0 24 24">\
             <path fill="#000000" d="M20 19H13V22H11V19H4V13H11V11H7V5H11V2H13V5H17V11H13V13H20V19Z" />\
        </svg>');
});

Fcore.install('mdi-align-horizontal-right', function () {
    return _(
        '<svg width="24px" height="24px" viewBox="0 0 24 24">\
             <path fill="#000000" d="M18 13V19H2V13H18M8 5V11H18V5H8M20 2V22H22V2H20Z" />\
        </svg>');
});

Fcore.install('mdi-align-vertical-bottom', function () {
    return _(
        '<svg width="24px" height="24px" viewBox="0 0 24 24">\
             <path fill="#000000" d="M11 18H5V2H11V18M19 8H13V18H19V8M22 20H2V22H22V20Z" />\
        </svg>');
});

Fcore.install('mdi-align-vertical-center', function () {
    return _(
        '<svg width="24px" height="24px" viewBox="0 0 24 24">\
             <path fill="#000000" d="M5 20V13H2V11H5V4H11V11H13V7H19V11H22V13H19V17H13V13H11V20H5Z" />\
        </svg>');
});


Fcore.install('mdi-align-vertical-top', function () {
    return _(
        '<svg width="24px" height="24px" viewBox="0 0 24 24">\
           <path fill="#000000" d="M11 22H5V6H11V22M19 6H13V16H19V6M22 2H2V4H22V2Z" />\
        </svg>');
});