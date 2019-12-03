import BaseEditor from "../core/BaseEditor";
import Fcore from "../core/FCore";
import AbsolBrace from "absol-brace";
import '../../css/codeeditor.css';

import 'brace/keybinding/emacs';
import 'brace/ext/searchbox';
import 'brace/mode/javascript';
import 'brace/mode/markdown';
import 'brace/mode/jsx';
import 'brace/mode/php';
import 'brace/mode/html';
import 'brace/mode/css';

import 'brace/ext/language_tools';
import 'brace/snippets/css';
import 'brace/snippets/javascript';
import 'brace/snippets/php';
import 'brace/snippets/html';
import 'brace/snippets/json';
import 'brace/snippets/text';
import 'brace/snippets/markdown';
import 'brace/snippets/jsx';
import 'brace/ext/beautify';


var _ = Fcore._;
var $ = Fcore.$;

function CodeEditor() {
    BaseEditor.call(this);
    this.aceEditor = null;
    this._openningData = { type: 'txt', value: '' };
}

Object.defineProperties(CodeEditor.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
CodeEditor.prototype.constructor = CodeEditor;

CodeEditor.prototype.TYPE_MODE = {
    js: 'ace/mode/javascript',
    txt: 'ace/mode/plain_text',
    json: 'ace/mode/json',
    md: 'ace/mode/markdown',
    html:'ace/mode/html',
    css:'ace/mode/css',
    LICENSE:'ace/mode/plain_text'
};

CodeEditor.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = _({
        tag: 'pre',
        class: 'as-code-editor'
    });
    this.aceEditor = AbsolBrace.ace.edit(this.$view);
    return this.$view;
};

/**
 * @param {{type:String, value: String}} data
 */
CodeEditor.prototype.setData = function (data) {
    this._openningData = data;
    this.aceEditor.setValue(data.value);
    this.aceEditor.setOption('mode', this.TYPE_MODE[data.type] || this.TYPE_MODE.txt);
    this.aceEditor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true
    });
};

CodeEditor.prototype.getData = function () {
    var value = this.aceEditor.getValue();
    return Object.assign({}, this._openningData, { value: value });
};



export default CodeEditor;



