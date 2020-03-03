import BaseAnchorEditorCmd from './BaseAnchorEditorCmd';

/**
 * @type {import('../anchoreditors/LinearAnchorEditor').default}
 */
var LinearAnchorEditorCmd =  Object.assign({}, BaseAnchorEditorCmd);;

export default LinearAnchorEditorCmd;


export var LinearAnchorEditorCmdTree = [
    [
        'equaliseWidth'
    ]
];

export var LinearAnchorEditorCmdDescriptors = {
    equaliseWidth: {
        type: 'trigger',
        icon: 'span.mdi.mdi-arrow-expand-horizontal',
        desc: 'Equalise Width'
    }
};