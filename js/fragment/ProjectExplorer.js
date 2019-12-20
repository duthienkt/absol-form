
import EventEmitter from "absol/src/HTML5/EventEmitter";
import Fcore from "../core/FCore";
import '../../css/projectexplorer.css';
import PluginManager from "../core/PluginManager";
import R from "../R";
import BaseEditor from "../core/BaseEditor";

var _ = Fcore._;
var $ = Fcore.$;

function ProjectExplorer() {
    BaseEditor.call(this);
    this.pluginContext = {
        self: this,
        _: _,
        $: $
    };

    this.data = {
        projectName: null
    };
    PluginManager.exec(this, R.PLUGINS.PROJECT_EXPLORER, this.pluginContext);
}

Object.defineProperties(ProjectExplorer.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
Object.defineProperties(ProjectExplorer.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
EventEmitter.prototype.constructor = ProjectExplorer;

ProjectExplorer.prototype.getView = function () {
    var self = this;
    if (this.$view) return this.$view;
    this.$view = _({
        class: 'as-form-explorer',
        child: {
            tag: 'droppanel',
            props: {
                name: this.data.projectName || 'NONE'
            }
        }
    });

    this.$droppanel = $('droppanel', this.$view);
    /** before new feature release, I cheated here */

    this.$cmdCtn = _('.absol-drop-panel-head-cmd-button-container');
    this.$reloadCmdBtn = _({
        tag: 'button',
        child: 'span.mdi.mdi-reload',
        on: {
            click: this.loadExpTree.bind(this)
        }
    }).addTo(this.$cmdCtn);
    this.$droppanel.$head.addChild(this.$cmdCtn);
    var clickCallback = this.$droppanel.$head._azar_extendEvents.nonprioritize.click[0].callback;
    this.$droppanel.$head.off('click', clickCallback)
        .on('click', function (event) {
            if (!EventEmitter.hitElement(self.$cmdCtn, event)){
                clickCallback.apply(this, arguments);
            }
        });

    if (this.data.projectName != null)
        this.loadExpTree();
    return this.$view;
};


ProjectExplorer.prototype.openProject = function (value) {
    if (typeof value == 'string')
        this.data = { projectName: value || "Unknown" };
    else {
        this.data = value || {};
    }
    if (this.$view) {
        this.$droppanel.name = this.data.projectName;
        this.loadExpTree();
    }
};


ProjectExplorer.prototype.loadExpTree = function () {
    if (this.pluginContext.loadExpTree)
        this.pluginContext.loadExpTree();
};

ProjectExplorer.prototype.openItem = function (type, ident, name, contentArguments, desc) {
    var formEditor = this.getContext(R.FORM_EDITOR);
    if (formEditor) {
        formEditor.openItem(type, ident, name, contentArguments, desc);
    }
};

export default ProjectExplorer;