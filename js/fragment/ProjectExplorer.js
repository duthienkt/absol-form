import Context from "absol/src/AppPattern/Context";
import EventEmitter from "absol/src/HTML5/EventEmitter";
import Fcore from "../core/FCore";
import '../../css/projectexplorer.css';
import PluginManager from "../core/PluginManager";
import R from "../R";

var _ = Fcore._;
var $ = Fcore.$;

function ProjectExplorer() {
    Context.call(this);
    this.pluginContext = {
        self: this,
        _: _,
        $: $
    };
    PluginManager.exec(this, R.PLUGINS.PROJECT_EXPLORER, this.pluginContext);

    this.data = {
        projectName: null,
        formList: []
    };
}

Object.defineProperties(ProjectExplorer.prototype, Object.getOwnPropertyDescriptors(Context.prototype));
Object.defineProperties(ProjectExplorer.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
EventEmitter.prototype.constructor = ProjectExplorer;

ProjectExplorer.prototype.getView = function () {
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
    if (this.data.projectName != null)
        this.loadExpTree();
    return this.$view;
};

ProjectExplorer.prototype.openProject = function (value) {
    this.data.projectName = value || "Unknown";
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
    if (formEditor){
        formEditor.openItem(type, ident, name, contentArguments, desc);
    }
};

export default ProjectExplorer;