import Fcore from "../core/FCore";

import XHR from 'absol/src/Network/XHR';
import Dom from "absol/src/HTML5/Dom";

var loadFontPromise = Dom.documentReady.then(function () {
    var linkElts = document.getElementsByTagName('link');
    var linkElt;
    for (var i = 0; i < linkElts.length; ++i) {
        linkElt = linkElts[i];
        if (linkElt.href && linkElt.href.indexOf('materialdesignicons') >= 0){
            break;
        }
    }


    return XHR.getRequest(linkElt.href, 'text').then(function (text) {
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
})


export function getMaterialDesignIconNames() {
    return loadFontPromise.then(function (data) {
        return data.iconNames;
    });
};

export function getMaterialDesignLinkElt() {
    var linkElts = document.getElementsByTagName('link');
    var linkElt;
    for (var i = 0; i < linkElts.length; ++i) {
        linkElt = linkElts[i];
        if (linkElt.href && linkElt.href.indexOf('materialdesignicons') >= 0)
            return linkElt;
    }

}

