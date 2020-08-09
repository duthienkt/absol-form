import {randomIdent} from "absol/src/String/stringGenerate";

export function normalizeEditData(eData){
    var idDict = {};
    eData = eData ||{};
    eData.properties =  eData.properties || [];
    eData.properties.forEach(function visit(prop){
        prop.id = prop.id || randomIdent(16);
        if (idDict[prop.id]) prop.id += randomIdent(4);
        idDict[prop.id] = true;
        if (prop.type === 'group'){
            prop.properties =  prop.properties||[];
            prop.properties.forEach(visit);
        }
    });
    return eData;
}