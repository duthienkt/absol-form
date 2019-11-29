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

Fcore.install('frame-ico', function () {
    return _(
        '<svg width="25.03mm" height="26.1mm" version="1.1" viewBox="0 0 25.03 26.1" xmlns="http://www.w3.org/2000/svg">' +
        '    <g transform="translate(0,-270.9)">' +
        '        <path d="m12.662 270.91-7.0158 3.7418v4.0759l6.9156-4.0424 7.0492 3.9756-0.13363-3.9422z" style="fill:gray" />' +
        '        <path d="m12.628 276.89-6.7486 3.6416 6.6817 4.0424 6.7151-3.842z" style="fill:rgb(240, 122, 0)" />' +
        '        <path d="m5.2452 282.4-0.03341 7.3165 6.3811 3.8754 0.03341-7.4167z" style="fill:rgb( 122, 240, 0)" />' +
        '        <path d="m19.745 282.37-6.3811 3.842v7.3499l6.4145-3.7084z" style="fill:rgb(0, 122, 240)" />' +
        '        <path d="m21.816 283.07-0.13364 7.8176-6.7486 4.1093 3.2406 2.0045 6.7152-3.9088 0.13363-8.1517z" style="fill:gray" />' +
        '        <path d="m3.1738 283.04-3.1738 2.0045v7.7842l6.7151 4.1093 3.3409-1.8709-6.7151-3.9756z" style="fill:gray" />' +
        '    </g>' +
        '</svg>'
    );
});
