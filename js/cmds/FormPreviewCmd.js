var FormPreviewCmd = {
    reload:function(){
        this.refresh();
    }
};


export default FormPreviewCmd;


export var FormPreviewCmdDescriptors = {
    reload:{
        type: 'trigger',
        desc: "Reload",
        icon: 'span.mdi.mdi-reload'
    }
};