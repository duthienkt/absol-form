import BaseEditor from "../core/BaseEditor";
import Fcore from "../core/FCore";
import Dom from "absol/src/HTML5/Dom";
import '../../css/componentedittool.css';

var _ = Fcore._;
var $ = Fcore.$;

function ComponentEditTool() {
    BaseEditor.call(this);
    this.$dockElt = null;
    this.$visiable = [];
    this.$dataButton = {
    self:this,
    Edges: [
        {
        tag:"as-from-align-controler-edit-tool-edges-horizontal",
        child:[
            {
                tag:"as-from-tool-button",
                child:"mdi-align-horizontal-left",
                click:this.cmd_alignLeftDedge.bind(this),
                hover:"Align Left Edges"
            },
            {
                tag:"as-from-tool-button",
                child:"mdi-align-horizontal-center",
                click:this.cmd_alignHorizontalCenter.bind(this),
                hover:"Align Horizontal Center"
            },
            {
                tag:"as-from-tool-button",
                child:"mdi-align-horizontal-right",
                click:this.cmd_alignRightDedge.bind(this),
                hover:"Align Right Edges"
            },
            {
                tag:"as-from-tool-button",
                child:"span.mdi.mdi-arrow-expand-horizontal",
                click:this.cmd_equaliseWidth.bind(this),
                hover:"Equalise Width"
            }
        ]
    },
    {
        tag:"as-from-align-controler-edit-tool-edges-vertical",
        child:[
            {
                tag:"as-from-tool-button",
                child:"mdi-align-vertical-top",
                click:this.cmd_alignTopDedge.bind(this),
                hover:"Align Top Edges"
            },
            {
                tag:"as-from-tool-button",
                child:"mdi-align-vertical-bottom",
                click:this.cmd_alignBottomDedge.bind(this),
                hover:"Align Bottom Edge"
            },
            {
                tag:"as-from-tool-button",
                child:"mdi-align-vertical-center",
                click:this.cmd_alignVerticalCenter.bind(this),
                hover:"Align Vertical Center"
            },
            {
                tag:"as-from-tool-button",
                child:"span.mdi.mdi-arrow-expand-vertical",
                click:this.cmd_equaliseHeight.bind(this),
                hover:"Equalise Height"
            }
        ]
    }],
    Distribute:[
        {
            tag:"as-from-align-controler-edit-tool-distribute-horizontal",
            child:[
                {  
                    tag:"as-from-tool-button",
                    child:"span.mdi.mdi-distribute-horizontal-left",
                    click:this.cmd_distributeHorizontalLeft.bind(this),
                    hover:"Distribute Horizontal Left"
                },
                {  
                    tag:"as-from-tool-button",
                    child:"span.mdi.mdi-distribute-horizontal-center",
                    click:this.cmd_distributeHorizontalCenter.bind(this),
                    hover:"Distribute Horizontal Center"
                },
                {  
                    tag:"as-from-tool-button",
                    child:"span.mdi.mdi-distribute-horizontal-right",
                    click:this.cmd_distributeHorizontalRight.bind(this),
                    hover:"Distribute Horizontal Right"
                },
                {  
                    tag:"as-from-tool-button",
                    child:_('<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\<path d="m21 7v10h-5v5h-2v-20h2v5h5"/>\<path d="m8 2h2v20h-2v-3h-5v-14h5z"/>\</svg>'),
                    click:this.cmd_distributeHorizontalDistance.bind(this),
                    hover:"Distribute Horizontal Distance"
                },
            ]
              
        },
        {
            tag:"as-from-align-controler-edit-tool-distribute-vertical",
            child:[
                {  
                    tag:"as-from-tool-button",
                    child:"span.mdi.mdi-distribute-vertical-top",
                    click:this.cmd_distributeVerticalTop.bind(this),
                    hover:"Distribute Vertical Top"
                },
                {  
                    tag:"as-from-tool-button",
                    child:'span.mdi.mdi-distribute-vertical-center',
                    click:this.cmd_distributeVerticalCenter.bind(this),
                    hover:"Distribute Vertical Center"
                },
                {  
                    tag:"as-from-tool-button",
                    child:"span.mdi.mdi-distribute-vertical-bottom",
                    click:this.cmd_distributeVerticalBottom.bind(this),
                    hover:"Distribute Vertical Bottom"
                },
                {  
                    tag:"as-from-tool-button",
                    child:_('<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\<path d="m7 3h10v5h5v2h-20v-2h5v-5"/>\<path d="m2 16v-2h20v2h-3v5h-14v-5z"/>\</svg>'),
                    click:this.cmd_distributeVerticalDistance.bind(this),
                    hover:"Distribute Verlical Distance"
                },
            ]
              
        }
    ],
    Delete:[
        {
            tag:"as-from-align-controler-edit-tool-delete",
            child:[
                {  
                    tag:"as-from-tool-button",
                    child:"span.mdi.mdi-delete-variant",
                    click:this.cmd_delete.bind(this),
                    hover:"Delete"
                },
            ]
        }
    ],
    Preview:[
        {
            tag:"as-from-align-controler-edit-tool-preview",
            child:[
                {
                    tag:"as-from-tool-button",
                    child:"span.mdi.mdi-magnify",
                    click:this.cmd_preview.bind(this),
                    hover:"Preview"
                }
            ]
        }
    ]
}
}

Object.defineProperties(ComponentEditTool.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
ComponentEditTool.prototype.constructor = ComponentEditTool;

ComponentEditTool.prototype.CONFIG_STORE_KEY = "AS_ComponentEditorTool_config";
ComponentEditTool.prototype.config = {
    windowStyle: {
        left: '57px',
        top: Dom.getScreenSize().height - 330 + 'px',
        height: '110px'
    }
};

ComponentEditTool.prototype.bindWithLayoutEditor = function (editor) {
    var self = this;
    self.$layoutEditor = editor;
    if(self.$layoutEditor===undefined)
    {
        this.onPause();
        return;
    }
    
    self.$layoutEditor.on("selectedcomponentchange", self.updateVisiable.bind(this))
};

ComponentEditTool.prototype.ev_windowPosChange = function () {
    this.config.windowStyle = {
        width: this.$window.style.width,
        height: this.$window.style.height,
        top: this.$window.style.top,
        left: this.$window.style.left,
        minWidth: this.$window.style.minWidth,
    };
    this.saveConfig();
};

ComponentEditTool.prototype.onStart = function () {
    this.getView();
};

ComponentEditTool.prototype.onPause = function () {
    //todo
    this.$view.selfRemove();
};

ComponentEditTool.prototype.updateVisiable = function () {
    if (this.$visiable === undefined)
        return;
    var editors = [];
    if (this.$layoutEditor !== undefined)
        editors = this.$layoutEditor.anchorEditors;
    if (editors.length > 2) {
        for (var i = 0; i < this.$distribute.length; i++)
            this.$distribute[i].disabled = false;
    } else {
        for (var i = 0; i < this.$distribute.length; i++)
            this.$distribute[i].disabled = true;
    }
    if (editors.length > 1) {
        for (var i = 0; i < this.$edges.length; i++)
            this.$edges[i].disabled = false;
    } else {
        for (var i = 0; i < this.$edges.length; i++)
            this.$edges[i].disabled = true;
    }

    if (editors.length > 0) {
        for (var i = 0; i < this.$delete.length; i++)
            this.$delete[i].disabled = false;
    } else {
        for (var i = 0; i < this.$delete.length; i++)
            this.$delete[i].disabled = true;
    }

    if (editors.length > 0) {
        for (var i = 0; i < this.$preview.length; i++)
            this.$preview[i].disabled = false;
    } else {
        for (var i = 0; i < this.$preview.length; i++)
            this.$preview[i].disabled = true;
    }

};

ComponentEditTool.prototype.onResume = function () {
    this.$window.addStyle(this.config.windowStyle).addTo(document.body);
};

ComponentEditTool.prototype.button = function(object){
    return _(
                {
                    tag:"button",
                    class: object.tag,
                    child: object.child,
                    on: {
                        click: function() {
                        object.click();
                        if (object.hover !== undefined)
                            Fcore.creator.tooltip.closeTooltip(this.session);
                        },
                        mouseover: function() {
                        if (object.hover !== undefined)
                            this.session = Fcore.creator.tooltip.show(
                            this,
                            object.hover,
                            "bottom"
                            );
                        },
                        mouseout: function() {
                        if (object.hover !== undefined)
                            Fcore.creator.tooltip.closeTooltip(this.session);
                        }
                    }
                }
    );
};

ComponentEditTool.prototype.extract = function(object)
{
    var edges= object.Edges;
    this.$edges=[];
    var final = [];
    var button,container;
    for(var i=0;i<edges.length;i++){
        container=_(
            {
                tag:"div",
                class:edges[i].tag
            }
        )
        for(var j=0;j<edges[i].child.length;j++)
        {
            button=this.button(edges[i].child[j]);
            container.addChild(button);
            this.$edges.push(button);
        }
        final.push(container);
    }

    var distribute= object.Distribute;
    this.$distribute=[];
    for(var i=0;i<distribute.length;i++){
        container=_(
            {
                tag:"div",
                class:distribute[i].tag
            }
        )
        for(var j=0;j<distribute[i].child.length;j++)
        {
            button=this.button(distribute[i].child[j]);
            container.addChild(button);
            this.$distribute.push(button);
        }
        final.push(container);
    }

    var deleteTemp= object.Delete;
    this.$delete=[];
    for(var i=0;i<deleteTemp.length;i++){
        container=_(
            {
                tag:"div",
                class:deleteTemp[i].tag
            }
        )
        for(var j=0;j<deleteTemp[i].child.length;j++)
        {
            button=this.button(deleteTemp[i].child[j]);
            container.addChild(button);
            this.$delete.push(button);
        }
        final.push(container);
    }

    var previewTemp= object.Preview;
    this.$preview=[];
    for(var i=0;i<previewTemp.length;i++){
        container=_(
            {
                tag:"div",
                class:previewTemp[i].tag
            }
        )
        for(var j=0;j<previewTemp[i].child.length;j++)
        {
            button=this.button(previewTemp[i].child[j]);
            container.addChild(button);
            this.$preview.push(button);
        }
        final.push(container);
    }
    return final;
}
    
ComponentEditTool.prototype.getView = function () {
        if (this.$view) return this.$view;
        var self = this;

        this.$window = _({
            tag: "onscreenwindow",
            class: "as-form-component-properties-editor-window",
            props: {
                windowTitle: "Tools",
                windowIcon: "span.mdi.mdi-shape-plus"
            },
            on: {
                sizechange: this.ev_windowPosChange.bind(this),
                drag: this.ev_windowPosChange.bind(this),
                relocation: this.ev_windowPosChange.bind(this)
            }
        });
        this.$view = _({
            class: "as-form-component-edit-tool",
            child: ComponentEditTool.prototype.extract(this.$dataButton)
        });
        this.$window.addChild(this.$view);
        this.updateVisiable();
        return this.$view;
    };

ComponentEditTool.prototype.findFocusAnchorEditor = function () {
    var focusEditor = this.$layoutEditor.anchorEditors.filter(function (e) { return e.isFocus });
    return focusEditor[0];
}

ComponentEditTool.prototype.cmd_distributeVerticalDistance = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalDistance();
    }
};

ComponentEditTool.prototype.cmd_distributeVerticalBottom = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeVerticalBottom();
    }
};

ComponentEditTool.prototype.cmd_distributeVerticalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeVerticalCenter();
    }
};

ComponentEditTool.prototype.cmd_distributeVerticalTop = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeVerticalTop();
    }
};

ComponentEditTool.prototype.cmd_distributeHorizontalDistance = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalDistance();
    }
};

ComponentEditTool.prototype.cmd_distributeHorizontalRight = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalRight();
    }
};

ComponentEditTool.prototype.cmd_distributeHorizontalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalCenter();
    }
};

ComponentEditTool.prototype.cmd_distributeHorizontalLeft = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_distributeHorizontalLeft();
    }
};

ComponentEditTool.prototype.cmd_equaliseHeight = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_equaliseHeight();
    }
};

ComponentEditTool.prototype.cmd_alignVerticalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignVerticalCenter();
    }
};

ComponentEditTool.prototype.cmd_alignBottomDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignBottomDedge();
    }
};

ComponentEditTool.prototype.cmd_alignTopDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignTopDedge();
    }
};

ComponentEditTool.prototype.cmd_equaliseWidth = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_equaliseWidth();
    }
};

ComponentEditTool.prototype.cmd_alignHorizontalCenter = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignHorizontalCenter();
    }
};

ComponentEditTool.prototype.cmd_alignRightDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignRightDedge();
    }
};

ComponentEditTool.prototype.cmd_alignLeftDedge = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_alignLeftDedge();
    }
};

ComponentEditTool.prototype.cmd_delete = function () {
    var editor = this.findFocusAnchorEditor();
    if (editor) {
        editor.cmd_delete();
    }
};

ComponentEditTool.prototype.cmd_preview = function () {
    if (this.$layoutEditor.preview) {
        this.$layoutEditor.preview();
    }
};

export default ComponentEditTool;
