export var PropertyNames = [
    'id', 'name', 'text', 'textDecode', 'value', 'placeHolder', 'disabled', 'tooltip', 'disembark',
    /********************/
    'hAlign', 'left', 'right',
    'vAlign', 'top', 'bottom',
    'width', 'height',
    'overflowY'
];

var IndexedPropertyNames = PropertyNames.reduce(function (ac, cr, i) {
    ac[cr] = i;
    return ac;
}, {});

export default IndexedPropertyNames;