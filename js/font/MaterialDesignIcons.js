import Fcore from "../core/FCore";

import XHR from 'absol/src/Network/XHR';

var linkElts = document.getElementsByTagName('link');
var linkElt;
for (var i = 0; i < linkElts.length; ++i) {
    linkElt = linkElts[i];
    if (linkElt.href && linkElt.href.indexOf('materialdesignicons') >= 0)
        break;
}

if (!linkElt || !linkElt.href || linkElt.href.indexOf('materialdesignicons') < 0) {
    linkElt = Fcore._('<link rel="stylesheet" href="//cdn.materialdesignicons.com/4.5.95/css/materialdesignicons.min.css">').addTo(document.head);
}


var loadFontPromise = XHR.getRequest(linkElt.href, 'text').then(function (text) {
    var regex = /\.mdi-([^:]+)::before/g;
    var iconNames = [];


    var iconNameMatch;
    do {
        iconNameMatch = regex.exec(text);
        if (iconNameMatch)
            iconNames.push(iconNameMatch[1]);

    } while (iconNameMatch);
    return {
        iconNames: iconNames
    }
});

export function getMaterialDesignIconNames() {
    return loadFontPromise.then(function (data) {
        return data.iconNames;
    });
};

export function getMaterialDesignLinkElt() {
    return linkElt;
}

