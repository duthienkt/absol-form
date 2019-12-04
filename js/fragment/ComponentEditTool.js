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
}

Object.defineProperties(
  ComponentEditTool.prototype,
  Object.getOwnPropertyDescriptors(BaseEditor.prototype)
);
ComponentEditTool.prototype.constructor = ComponentEditTool;

ComponentEditTool.prototype.CONFIG_STORE_KEY = "AS_ComponentEditorTool_config";
ComponentEditTool.prototype.config = {
  windowStyle: {
    left: 100 + "px",
    top: "59px",
    height: Dom.getScreenSize().height / 2 + "px",
    minWidth: "18em"
  }
};

ComponentEditTool.prototype.bindWithLayoutEditor = function(editor) {
  var self=this;
  self.layoutEditor = editor;
  window.theFuck = this.layoutEditor;
  self.layoutEditor.on("selectedcomponentchange",self.updateVisiable.bind(this))
};

ComponentEditTool.prototype.ev_windowPosChange = function() {
  this.config.windowStyle = {
    width: this.$window.style.width,
    height: this.$window.style.height,
    top: this.$window.style.top,
    left: this.$window.style.left,
    minWidth: this.$window.style.minWidth,
  };
  this.saveConfig();
};

ComponentEditTool.prototype.onStart = function() {
  this.getView();
};

ComponentEditTool.prototype.onPause = function() {
  //todo
  this.$view.selfRemove();
};

ComponentEditTool.prototype.updateVisiable = function(){
  if(this.$visiable===undefined)
    return;
  var editors=[];
  if(this.layoutEditor!==undefined)
    editors = this.layoutEditor.anchorEditors;
  if(editors.length>2){
    for(var i=0;i<this.$visiable[2].length;i++)
      if(this.$visiable[2][i].classList.contains("disabled"))
        this.$visiable[2][i].classList.remove("disabled");
  }else
  {
    for(var i=0;i<this.$visiable[2].length;i++)
      if(!this.$visiable[2][i].classList.contains("disabled"))
      this.$visiable[2][i].classList.add("disabled");
  }

  if(editors.length>1){
    for(var i=0;i<this.$visiable[1].length;i++)
      if(this.$visiable[1][i].classList.contains("disabled"))
        this.$visiable[1][i].classList.remove("disabled");
  }else
  {
    for(var i=0;i<this.$visiable[1].length;i++)
      if(!this.$visiable[1][i].classList.contains("disabled"))
      this.$visiable[1][i].classList.add("disabled");
  }

  if(editors.length>0){
    for(var i=0;i<this.$visiable[0].length;i++)
      if(this.$visiable[0][i].classList.contains("disabled"))
        this.$visiable[0][i].classList.remove("disabled");
  }else
  {
    for(var i=0;i<this.$visiable[0].length;i++)
      if(!this.$visiable[0][i].classList.contains("disabled"))
      this.$visiable[0][i].classList.add("disabled");
  }
    
};

ComponentEditTool.prototype.onResume = function() {
  this.$window.addStyle(this.config.windowStyle).addTo(document.body);
};

ComponentEditTool.prototype.getView = function() {
  if (this.$view) return this.$view;
  var self = this;
  var items = [];
  var tempItem;
  this.$visiable = [];
  //////////////////////////////1//////////////////////////
    this.$visiable[1] = [];
    this.$visiable[2] = [];
    this.$visiable[0] = [];
    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_("mdi-align-horizontal-left")],
      on: {
        click: this.cmd_alignLeftDedge.bind(this)
      },
      props: {
        hover: "Align Left Edges"
      }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_("mdi-align-horizontal-center")],
      on: {
        click: this.cmd_alignHorizontalCenter.bind(this)
      },
      props: {
        hover: "Align Horizontal Center"
      }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_("mdi-align-horizontal-right")],
      on: {
        click: this.cmd_alignRightDedge.bind(this)
      },
      props: {
        hover: "Align Right Edges"
      }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_("span.mdi.mdi-arrow-expand-horizontal")],
      on: {
        click: this.cmd_equaliseWidth.bind(this)
      },
      props: {
        hover: "Equalise Width"
      }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    items.push(_({ tag: "br" }));

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_("mdi-align-vertical-top")],
      on: {
        click: this.cmd_alignTopDedge.bind(this)
      },
      props: {
        hover: "Align Top Edges"
      }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('mdi-align-vertical-bottom')],
      on: {
        click: this.cmd_alignBottomDedge.bind(this)
      },
      props: {
        hover: "Align Bottom Edges"
      }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('mdi-align-vertical-center')],
      on: {
        click: this.cmd_alignVerticalCenter.bind(this)
      },
      props: {
        hover: "Align Vertical Center"
      }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('mdi-align-vertical-center')],
      on: {
        click: this.cmd_equaliseHeight.bind(this)
      },
      props: {
        hover: "Equalise Height"
      }
    });
    items.push(tempItem);
    this.$visiable[1].push(tempItem);

    items.push(_({ tag: "br" }));
    ///////////////////////////2////////////////////////
  tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('span.mdi.mdi-distribute-horizontal-left')],
      on: {
        click: this.cmd_distributeHorizontalLeft.bind(this)
      },
      props: {
        hover: "Distribute Horizontal Left"
      }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('span.mdi.mdi-distribute-horizontal-center')],
      on: {
        click: this.cmd_distributeHorizontalCenter.bind(this)
      },
      props: {
        hover: "Distribute Horizontal Center"
      }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

  tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('span.mdi.mdi-distribute-horizontal-right')],
      on: {
        click: this.cmd_distributeHorizontalRight.bind(this)
      },
      props: {
        hover: 'Distribute Horizontal Right',
      }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

      tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [ _('<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\<path d="m21 7v10h-5v5h-2v-20h2v5h5"/>\<path d="m8 2h2v20h-2v-3h-5v-14h5z"/>\</svg>')],
      on: {
        click: this.cmd_distributeHorizontalDistance.bind(this)
      },
      props: {
        hover: 'Distribute Horizontal Distance',
      }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    items.push(_({ tag: "br" }));

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('span.mdi.mdi-distribute-vertical-top')],
      on: {
        click: this.cmd_distributeVerticalTop.bind(this)
      },
      props: {
        hover: 'Distribute Vertical Top',
      }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('span.mdi.mdi-distribute-vertical-center')],
      on: {
        click: this.cmd_distributeVerticalCenter.bind(this)
      },
      props: {
        hover: 'Distribute Vertical Center',
      }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('span.mdi.mdi-distribute-vertical-bottom')],
      on: {
        click: this.cmd_distributeVerticalBottom.bind(this)
      },
      props: {
        hover: 'Distribute Vertical Bottom',
      }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);

  tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: [_('<svg width="24" height="24" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\<path d="m7 3h10v5h5v2h-20v-2h5v-5"/>\<path d="m2 16v-2h20v2h-3v5h-14v-5z"/>\</svg>')],
      on: {
        click: this.cmd_distributeVerticalDistance.bind(this)
      },
      props: {
        hover: 'Distribute Verlical Distance',
      }
    });
    items.push(tempItem);
    this.$visiable[2].push(tempItem);
    items.push(_({ tag: "br" }));
    tempItem = _({
      tag: "button",
      class: "button-edit-tool",
      child: ['span.mdi.mdi-delete-variant'],
      on: {
        click: this.cmd_delete.bind(this)
      },
      props: {
        hover: 'Delete',
      }
    });
    items.push(tempItem);
    this.$visiable[0].push(tempItem);

  this.$window = _({
    tag: "onscreenwindow",
    class: "as-form-component-properties-editor-window",
    props: {
      windowTitle: "Properties",
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
    child: items
  });
  this.$window.addChild(this.$view);
  this.updateVisiable();
  return this.$view;
};

ComponentEditTool.prototype.cmd_distributeVerticalDistance = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  var i;
  for (i = 0; i < editors.length; ++i) {
    editor = editors[i];
    editor.component.reMeasure();
  }
  editors = editors.slice();
  editors.sort(function(a, b) {
    return (
      a.component.style.top +
      a.component.style.height / 2 -
      (b.component.style.top + b.component.style.height / 2)
    );
  });

  var sumDistance =
    editors[editors.length - 1].component.style.top -
    (editors[0].component.style.top + editors[0].component.style.height);
  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    sumDistance -= editor.component.style.height;
  }
  var distance = sumDistance / (editors.length - 1);
  var curentTop =
    editors[0].component.style.top +
    editors[0].component.style.height +
    distance;

  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    editor.alignVerticalCenter(
      editor.component.style.bottom - 2 * curentTop + editor.component.style.top
    );
    editor.component.reMeasure();
    curentTop += editor.component.style.height + distance;
  }
  this.layoutEditor.commitHistory("move", "Distribute Vertical Distance");
};

ComponentEditTool.prototype.cmd_distributeVerticalBottom = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  var i;
  for (i = 0; i < editors.length; ++i) {
    editor = editors[i];
    editor.component.reMeasure();
  }
  editors = editors.slice();
  editors.sort(function(a, b) {
    return a.component.style.bottom - b.component.style.bottom;
  });
  var minX = editors[0].component.style.bottom;
  var maxX = editors[editors.length - 1].component.style.bottom;
  if (minX == maxX) return;
  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    editor.alignBottomDedge(minX + ((maxX - minX) / (editors.length - 1)) * i);
    editor.component.reMeasure();
  }
  this.layoutEditor.commitHistory("move", "Distribute Vertical Bottom");
};

ComponentEditTool.prototype.cmd_distributeVerticalCenter = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  var i;
  for (i = 0; i < editors.length; ++i) {
    editor = editors[i];
    editor.component.reMeasure();
  }
  editors = editors.slice();
  editors.sort(function(a, b) {
    return (
      a.component.style.top +
      a.component.style.height / 2 -
      (b.component.style.top + b.component.style.height / 2)
    );
  });
  var minX =
    editors[0].component.style.top + editors[0].component.style.height / 2;
  var maxX =
    editors[editors.length - 1].component.style.top +
    editors[editors.length - 1].component.style.height / 2;
  if (minX == maxX) return;
  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    editor.alignTopDedge(
      minX +
        ((maxX - minX) / (editors.length - 1)) * i -
        editor.component.style.height / 2
    );
    editor.component.reMeasure();
  }
  this.layoutEditor.commitHistory("move", "Distribute Vertical Center");
};

ComponentEditTool.prototype.cmd_distributeVerticalTop = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  var i;
  for (i = 0; i < editors.length; ++i) {
    editor = editors[i];
    editor.component.reMeasure();
  }
  editors = editors.slice();
  editors.sort(function(a, b) {
    return a.component.style.top - b.component.style.top;
  });
  var minX = editors[0].component.style.top;
  var maxX = editors[editors.length - 1].component.style.top;
  if (minX == maxX) return;
  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    editor.alignTopDedge(minX + ((maxX - minX) / (editors.length - 1)) * i);
    editor.component.reMeasure();
  }
  this.layoutEditor.commitHistory("move", "Distribute Vertical Top");
};

ComponentEditTool.prototype.cmd_distributeHorizontalDistance = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  var i;
  for (i = 0; i < editors.length; ++i) {
    editor = editors[i];
    editor.component.reMeasure();
  }
  editors = editors.slice();
  editors.sort(function(a, b) {
    return (
      a.component.style.left +
      a.component.style.width / 2 -
      (b.component.style.left + b.component.style.width / 2)
    );
  });

  var sumDistance =
    editors[editors.length - 1].component.style.left -
    (editors[0].component.style.left + editors[0].component.style.width);
  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    sumDistance -= editor.component.style.width;
  }
  var distance = sumDistance / (editors.length - 1);
  var curentLeft =
    editors[0].component.style.left +
    editors[0].component.style.width +
    distance;

  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    editor.alignHorizontalCenter(
      editor.component.style.right -
        2 * curentLeft +
        editor.component.style.left
    );
    editor.component.reMeasure();
    curentLeft += editor.component.style.width + distance;
  }
  this.layoutEditor.commitHistory("move", "Distribute Horizontal Distance");
};

ComponentEditTool.prototype.cmd_distributeHorizontalRight = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  var i;
  for (i = 0; i < editors.length; ++i) {
    editor = editors[i];
    editor.component.reMeasure();
  }
  editors = editors.slice();
  editors.sort(function(a, b) {
    return a.component.style.right - b.component.style.right;
  });
  var minX = editors[0].component.style.right;
  var maxX = editors[editors.length - 1].component.style.right;
  if (minX == maxX) return;
  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    editor.alignRightDedge(minX + ((maxX - minX) / (editors.length - 1)) * i);
    editor.component.reMeasure();
  }
  this.layoutEditor.commitHistory("move", "Distribute Horizontal Right");
};

ComponentEditTool.prototype.cmd_distributeHorizontalCenter = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  var i;
  for (i = 0; i < editors.length; ++i) {
    editor = editors[i];
    editor.component.reMeasure();
  }
  editors = editors.slice();
  editors.sort(function(a, b) {
    return (
      a.component.style.left +
      a.component.style.width / 2 -
      (b.component.style.left + b.component.style.width / 2)
    );
  });
  var minX =
    editors[0].component.style.left + editors[0].component.style.width / 2;
  var maxX =
    editors[editors.length - 1].component.style.left +
    editors[editors.length - 1].component.style.width / 2;
  if (minX == maxX) return;
  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    editor.alignLeftDedge(
      minX +
        ((maxX - minX) / (editors.length - 1)) * i -
        editor.component.style.width / 2
    );
    editor.component.reMeasure();
  }
  this.layoutEditor.commitHistory("move", "Distribute Horizontal Center");
};

ComponentEditTool.prototype.cmd_distributeHorizontalLeft = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  var i;
  for (i = 0; i < editors.length; ++i) {
    editor = editors[i];
    editor.component.reMeasure();
  }
  editors = editors.slice();
  editors.sort(function(a, b) {
    return a.component.style.left - b.component.style.left;
  });
  var minX = editors[0].component.style.left;
  var maxX = editors[editors.length - 1].component.style.left;
  if (minX == maxX) return;
  for (i = 1; i < editors.length - 1; ++i) {
    editor = editors[i];
    editor.alignLeftDedge(minX + ((maxX - minX) / (editors.length - 1)) * i);
    editor.component.reMeasure();
  }
  this.layoutEditor.commitHistory("move", "Distribute Horizontal Left");
};

ComponentEditTool.prototype.cmd_equaliseHeight = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  this.component.reMeasure();
  var heightValue = this.component.getStyle("height");
  for (var i = 0; i < editors.length; ++i) {
    editor = editors[i];
    if (editor == this) continue;
    editor.equaliseHeight(heightValue);
  }
  this.layoutEditor.commitHistory("move", "Equalise Height");
};

ComponentEditTool.prototype.cmd_alignVerticalCenter = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  this.component.reMeasure();
  var centerValue =
    this.component.getStyle("bottom") - this.component.getStyle("top");
  for (var i = 0; i < editors.length; ++i) {
    editor = editors[i];
    if (editor == this) continue;
    editor.alignVerticalCenter(centerValue);
  }
  this.layoutEditor.commitHistory("move", "Align Verlical Center");
};

ComponentEditTool.prototype.cmd_alignBottomDedge = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  this.component.reMeasure();
  var bottomValue = this.component.getStyle("bottom");

  for (var i = 0; i < editors.length; ++i) {
    editor = editors[i];
    if (editor == this) continue;
    editor.alignBottomDedge(bottomValue);
  }
  this.layoutEditor.commitHistory("move", "Align Bottom Dedge");
};

ComponentEditTool.prototype.cmd_alignTopDedge = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  this.component.reMeasure();
  var topValue = this.component.getStyle("top");
  for (var i = 0; i < editors.length; ++i) {
    editor = editors[i];
    if (editor == this) continue;
    editor.alignTopDedge(topValue);
  }
  this.layoutEditor.commitHistory("move", "Align Top Dedge");
};

ComponentEditTool.prototype.cmd_equaliseWidth = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  this.component.reMeasure();
  var widthValue = this.component.getStyle("width");
  for (var i = 0; i < editors.length; ++i) {
    var editor = editors[i];
    if (editor == this) continue;
    editor.equaliseWidth(widthValue);
  }
  this.layoutEditor.commitHistory("move", "Equalise Width");
};

ComponentEditTool.prototype.cmd_alignHorizontalCenter = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  this.component.reMeasure();
  var centerValue =
    this.component.getStyle("right") - this.component.getStyle("left");
  for (var i = 0; i < editors.length; ++i) {
    editor = editors[i];
    if (editor == this) continue;
    editor.alignHorizontalCenter(centerValue);
  }
  this.layoutEditor.commitHistory("move", "Align Horizontal Center");
};

ComponentEditTool.prototype.cmd_alignRightDedge = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  this.component.reMeasure();
  var rightValue = this.component.getStyle("right");

  for (var i = 0; i < editors.length; ++i) {
    editor = editors[i];
    if (editor == this) continue;
    editor.alignRightDedge(rightValue);
  }
  this.layoutEditor.commitHistory("move", "Align Right Dedge");
};

ComponentEditTool.prototype.cmd_alignLeftDedge = function() {
  var editors = this.layoutEditor.anchorEditors;
  var editor;
  if(editors.length === 0)
  return;
  this.component = editors[editors.length - 1].component;
  if (this.component === undefined) return;
  this.component.reMeasure();
  var leftValue = this.component.getStyle("left");
  for (var i = 0; i < editors.length; ++i) {
    editor = editors[i];
    if (editor == this) continue;
    editor.alignLeftDedge(leftValue);
  }
  this.layoutEditor.commitHistory("move", "Align Left Dedge");
};

ComponentEditTool.prototype.cmd_delete = function() {
  var editors = this.layoutEditor.anchorEditors;
  var components = editors.map(function(e) {
    return e.component;
  });
  this.layoutEditor.removeComponent.apply(this.layoutEditor, components);
};

export default ComponentEditTool;
