import MPOTImagePreview from "./preview/MPOTImagePreview";
import MPOTTextPreview from "./preview/MPOTTextPreview";
import MPOTNotSupportPreview from "./preview/MPOTNotSupportPreview";
import MPOTNumberPreview from "./preview/MPOTNumberPreview";
import MPOTTextEditor from "./edit/MPOTTextEditor";
import MPOTImageEditor from "./edit/MPOTImageEditor";
import MPOTNumberEditor from "./edit/MPOTNumberEditor";
import MPOTNotSupportEditor from "./edit/MPOTNotSupportEditor";

export  var PreviewConstructors = {
    image: MPOTImagePreview,
    text: MPOTTextPreview,
    "*": MPOTNotSupportPreview,
    number: MPOTNumberPreview
};


export  var EditorConstructors = {
    text: MPOTTextEditor,
    image: MPOTImageEditor,
    number: MPOTNumberEditor,
    '*': MPOTNotSupportEditor
};

export function createEditor(type){
    var editorConstructor = EditorConstructors[type] || MPOTNotSupportEditor;
    return new editorConstructor();
}


export function createPreview(type){
    var editorConstructor = PreviewConstructors[type] || MPOTNotSupportPreview;
    return new editorConstructor();
}