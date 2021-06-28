import XHR from 'absol/src/Network/XHR';
import CodeEditor from '../editor/CodeEditor';
import {base64EncodeUnicode} from 'absol/src/Converter/base64';
import Fcore, {$, _} from '../core/FCore';
import JSZip from 'jszip';
import R from '../R';
import ExpTree from "absol-acomp/js/ExpTree";
import {makeFmFragmentClass} from "../core/FmFragment";
import {AssemblerInstance} from "../core/Assembler";
import OnScreenWindow from "absol-acomp/js/OnsScreenWindow";

var WORKSPACE_FOLDER = 'formeditor/workspace';

var extIcons = {
    form: 'span.mdi.mdi-card-bulleted-outline',
    jpg: 'span.mdi.mdi-file-image-outline',
    js: 'span.mdi.mdi-nodejs',
    json: 'span.mdi.mdi-json',
    html: 'span.mdi.mdi-xml',
    css: 'span.mdi.mdi-language-css3',
    gitignore: 'span.mdi.mdi-git',
    license: 'span.mdi.mdi-license',
    md: 'span.mdi.mdi-markdown-outline',
    "*": 'span.mdi.mdi-file-document-outline'
}


function openNewFormDialog() {
    var nameInput = _(`<input type="text"></input>`);
    var typeInput = _({
        tag: 'selectmenu',
        props: {
            items: [
                { text: 'RelativeLayout', value: 'RelativeLayout' },
                { text: 'LinearLayout', value: 'LinearLayout' },
                { text: 'ChainLayout', value: 'ChainLayout' }
            ]
        }
    })
    var rows = [
        ['Name', nameInput],
        ['Layout type', typeInput]
    ];
    var okBtn = _({ tag: 'button', style: { marginLeft: '20px' }, child: { text: 'OK' } });
    var cancelBtn = _({ tag: 'button', child: { text: 'Cancel' } });

    /***
     * @type {OnScreenWindow}
     */
    var windowElt = _({
        tag: OnScreenWindow.tag,
        style: {
            left: 'calc(50vw - 150px)',
            top: 'calc(40vh - 100px)',
            width: '300px',
            height: '135px'
        },
        props: {
            windowTitle: 'New Form',
            windowIcon: 'span.mdi.mdi-file-plus-outline'
        },
        child: [
            {
                style: { padding: '5px', width: '100%', boxSizing: 'border-box', display: 'table' },
                child: rows.map(function (row) {
                    return {
                        style: { display: 'table-row' },
                        child: [`<label style="display: table-cell">${row[0]} </label>`, {
                            style: { display: 'table-cell', paddingBottom: '10px' },
                            child: row[1]
                        }]
                    }
                })
            },
            {
                style: { textAlign: 'center' },
                child: [cancelBtn, okBtn]
            }
        ]
    });
    windowElt.$minimizeBtn.addStyle('display', 'none');
    windowElt.$dockBtn.addStyle('display', 'none');


    var modal = _({
        tag: 'modal',
        style: { zIndex: 100000 },
        child: windowElt
    });

    modal.addTo(document.body);

    return new Promise(function (rs, rj) {
        okBtn.on('click', function () {
            var name = nameInput.value;
            if (name.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
                modal.remove();
                rs({ name: name, layoutType: typeInput.value });

            }
            else {
                nameInput.focus();
                nameInput.select();
            }
        });

        function onCancel() {
            modal.remove();
            rj();
        }

        cancelBtn.on('click', onCancel);
        windowElt.$closeBtn.on('click', onCancel);

    });
}


function lsWorkspace(path) {
    return XHR.postRepquest('https://absol.cf/shell_exec.php', JSON.stringify({
        cmd: 'ls -la -F "' + path + '"',
        cwd: WORKSPACE_FOLDER
    })).then(function (out) {
        return out.trim().split(/[\r\n]+/).slice(1).map(function (line) {
            var parts = line.split(/\s+/);
            var name = parts[8];
            var type = 'FILE';
            var ext = undefined;
            if (name[name.length - 1] == '/' || name[name.length - 1] == '\\') {
                type = "FOLDER";
                name = name.substr(0, name.length - 1);
            }
            else {
                ext = (name.split('.').pop() || '').toLowerCase()
            }
            return {
                type: type,
                name: name,
                fullPath: path + '/' + name,
                time: parts[5] + ' ' + parts[6],
                size: parseInt(parts[4]),
                owner: parts[2],
                ext: ext
            }
        }).filter(function (obj) {
            return obj.name.indexOf('.') != 0;
        });
    }).catch(function (error) {
        console.error(error);
    });
}

function writeFileBase64(path, b64) {
    return XHR.postRepquest('https://absol.cf/shell_exec.php', JSON.stringify({
        cmd: 'echo \'' + b64 + '\'>' + path,
        cwd: WORKSPACE_FOLDER
    })).then(function (out) {
        console.log(out);

    });
};


function writeFile(path, text) {
    var b64 = base64EncodeUnicode(text);

    return XHR.postRepquest('https://absol.cf/shell_exec.php', JSON.stringify({
        cmd: 'echo \'' + b64 + '\' | base64 -d >' + path,
        cwd: WORKSPACE_FOLDER
    })).then(function (out) {
        console.log(out);

    });
}

function catWorkspace(path) {
    return XHR.postRepquest('https://absol.cf/shell_exec.php', JSON.stringify({
        cmd: 'cat "' + path + '"',
        cwd: WORKSPACE_FOLDER
    }));
}


export function PluginProjectExplore(context) {
    var _ = context._;
    var $ = context.$;
    var folder2icon = {
        form: { tag: 'img', props: { src: 'https://absol.cf/exticons/extra/folder-neon.svg' } },
        template: { tag: 'img', props: { src: 'https://absol.cf/exticons/extra/folder-svn.svg' } }
    }
    /**
     * @type {import('../fragment/ProjectExplorer').default}
     */
    var self = context.self;

    function contextMenuEventHandler(contentArguments, event) {
        var items = [];
        if (contentArguments.type === 'FILE') {
            items.push(
                {
                    text: 'Open',
                    icon: 'span.mdi.mdi-menu-open',
                    cmd: 'open'
                }
            );
        }
        else if (contentArguments.name === 'form') {
            items.push(
                {
                    text: 'New Form',
                    icon: 'span.mdi.mdi-plus',
                    cmd: 'new_form'
                }
            );
        }

        event.showContextMenu({
            items: items,
            extendStyle: {
                fontSize: '12px'
            }
        }, function (event) {
            switch (event.menuItem.cmd) {
                case 'open':
                    self.openItem(contentArguments.ext, contentArguments.fullPath.replace(/[^a-zA-Z0-9\_]/g, '_'), contentArguments.name, contentArguments, contentArguments.fullPath)
                    break;
            }
        });
    }

    context.loadExpTree = function () {
        function visit(rootElt, path) {
            lsWorkspace(path.join('/')).then(function (result) {
                result.forEach(function (it) {
                    var res;
                    if (it.type == 'FOLDER') {
                        res = _({
                            tag: 'exptree',
                            props: {
                                name: it.name,
                                icon: folder2icon[it.name] || 'span.mdi.mdi-folder',
                                status: 'close'
                            },
                            on: {
                                statuschange: function () {
                                    if (this.status == 'open')
                                        visit(res, path.concat([it.name]))
                                }
                            }
                        });
                    }
                    else if (it.type == 'FILE') {
                        res = _({
                            tag: 'exptree',
                            props: {
                                name: it.name,
                                icon: extIcons[it.ext] || extIcons['*']
                            }
                        });
                        res.getNode().on('dblclick', function (event) {
                            self.openItem(it.ext, it.fullPath.replace(/[^a-zA-Z0-9\_]/g, '_'), it.name, it, it.fullPath);
                        });

                    }
                    res.getNode().defineEvent('contextmenu')
                        .on('contextmenu', contextMenuEventHandler.bind(res, it))
                    res.addTo(rootElt);
                });
            });
            rootElt.clearChild();
        }

        var droppanel = self.$droppanel;
        visit(droppanel, [self.data.projectName]);
    };
    self.$newFormBtn = _({
        tag: 'button',
        child: 'span.mdi.mdi-file-plus-outline',
        on:{
            click: function (){
                openNewFormDialog().then(function (result) {
                    console.log(result);
                });
            }
        }
    });
    self.$cmdCtn.addChildBefore(self.$newFormBtn, self.$cmdCtn.firstChild);


}

export function downloadFragmentData(path) {
    return catWorkspace(path).then(function (out) {
        if (out[0] == '{') {// is json
            try {
                var data = JSON.parse(out);
                return data;
            } catch (error) {
                console.error(error)
            }
        }
        else {
            return JSZip.loadAsync(out, { base64: true }).then(function (zip) {
                return zip.file('data.txt')
                    .async('text')
                    .then(function (text) {
                        try {
                            var data = JSON.parse(text);
                            return data;
                        } catch (error) {
                            console.error(error)
                        }
                    });
            });
        }
    });
}

export function PluginLoadContentData(accumulator) {
    var sync;
    if (accumulator.contentArguments.ext == 'form') {
        sync = downloadFragmentData(accumulator.contentArguments.fullPath)
            .then(function (data) {
                accumulator.editor.setData(data);
            });
    }
    else if (CodeEditor.prototype.TYPE_MODE[accumulator.contentArguments.ext]) {
        sync = catWorkspace(accumulator.contentArguments.fullPath).then(function (out) {
            try {
                accumulator.editor.setData({ value: out, type: accumulator.contentArguments.ext });
            } catch (error) {
                console.error(error)
            }
        });
    }
    else if (accumulator.contentArguments.ext == 'jpg') {
        accumulator.editor.setData({ images: ['//absol.cf/' + WORKSPACE_FOLDER + '/' + accumulator.contentArguments.fullPath] });
        sync = Promise.resolve();
    }
    accumulator.waitFor(sync);
}


export function PluginSaveContentData(accumulator) {
    if (accumulator.contentArguments.ext == 'form') {
        var textData = (JSON.stringify(accumulator.editor.getData()));
        var zip = new JSZip();
        zip.file('data.txt', textData);
        zip.generateAsync({ type: 'base64' }).then(function (b64) {
            writeFileBase64(accumulator.contentArguments.fullPath, b64).then(function (out) {
                console.log("Save success: ", accumulator.contentArguments.fullPath);
            });
        })
    }
}


export function PluginBuildComponent(context) {

    var data = context.data;
    if (data.tag == "LoginForm") {

        context.result = context.self.build({
            "tag": "RelativeLayout",
            "attributes": {
                "name": "PesionalInfor",
                "target": "",
                "formType": "SO_YEU_LY_LICH"
            },
            "style": {
                "hAlign": "left",
                "vAlign": "top",
                "left": 0,
                "right": 0,
                "top": -20.040624999999977,
                "bottom": 0,
                "height": 353.40625,
                "width": 960.1563,
                "backgroundImage": "",
                "backgroundColor": "#ffffff00"
            },
            "children": [
                {
                    "tag": "Ellipse",
                    "attributes": {
                        "name": "Circle_0",
                        "target": ""
                    },
                    "style": {
                        "hAlign": "left",
                        "vAlign": "top",
                        "left": 36.0625,
                        "right": 624.0938,
                        "top": 18.40625,
                        "bottom": 35,
                        "height": 300,
                        "width": 300,
                        "boxAlign": "lefttop",
                        "fillColor": "#ebe936ee",
                        "strokeColor": "#e31919e0",
                        "strokeWidth": 1
                    }
                },
                {
                    "tag": "Ellipse",
                    "attributes": {
                        "name": "Ellipse_1",
                        "target": ""
                    },
                    "style": {
                        "hAlign": "left",
                        "vAlign": "top",
                        "left": 83.703125,
                        "right": 820.453175,
                        "top": 80.40625,
                        "bottom": 217,
                        "height": 56,
                        "width": 56,
                        "boxAlign": "lefttop",
                        "fillColor": "white",
                        "strokeColor": "black",
                        "strokeWidth": 1
                    }
                },
                {
                    "tag": "Ellipse",
                    "attributes": {
                        "name": "Ellipse_2",
                        "target": ""
                    },
                    "style": {
                        "hAlign": "left",
                        "vAlign": "top",
                        "left": 209,
                        "right": 695.1563,
                        "top": 79,
                        "bottom": 218.40625,
                        "height": 56,
                        "width": 56,
                        "boxAlign": "lefttop",
                        "fillColor": "white",
                        "strokeColor": "black",
                        "strokeWidth": 1
                    }
                },
                {
                    "tag": "Ellipse",
                    "attributes": {
                        "name": "Ellipse_3",
                        "target": ""
                    },
                    "style": {
                        "hAlign": "left",
                        "vAlign": "top",
                        "left": 91.703125,
                        "right": 827.453175,
                        "top": 94.40625,
                        "bottom": 218,
                        "height": 41,
                        "width": 41,
                        "boxAlign": "lefttop",
                        "fillColor": "#000000ff",
                        "strokeColor": "black",
                        "strokeWidth": 0
                    }
                },
                {
                    "tag": "Ellipse",
                    "attributes": {
                        "name": "Ellipse_9",
                        "target": ""
                    },
                    "style": {
                        "hAlign": "left",
                        "vAlign": "top",
                        "left": 216,
                        "right": 703.1563,
                        "top": 92,
                        "bottom": 220.40625,
                        "height": 41,
                        "width": 41,
                        "boxAlign": "lefttop",
                        "fillColor": "#000000ff",
                        "strokeColor": "black",
                        "strokeWidth": 0
                    }
                },
                {
                    "tag": "Rectangle",
                    "attributes": {
                        "name": "Rectangle_0",
                        "target": ""
                    },
                    "style": {
                        "hAlign": "left",
                        "vAlign": "top",
                        "left": 378.703125,
                        "right": 348.453175,
                        "top": 41.40625,
                        "bottom": 163,
                        "height": 149,
                        "width": 233,
                        "boxAlign": "lefttop",
                        "fillColor": "#4fe01dc2",
                        "strokeColor": "#3819b2c0",
                        "strokeWidth": 11,
                        "roundCornerX": 25,
                        "roundCornerY": 0
                    }
                }
            ]
        });
        context.result.formType = 'LoginForm';
        context.result.getData = function () {
            return {
                tag: 'LoginForm',
                style: this.style,
                attributes: this.attributes
            }
        };
    }
}


export function PluginComponentPickerView(context) {
    var allNode = $('exptree', context.self.$view, function (node) {
        return node.name == "all";
    });

    var projectExplorer = context.self.getContext(R.PROJECT_EXPLORER);
    var projectName = projectExplorer.data.projectName;

    var formNode = _({
        tag: ExpTree.tag,
        props: {
            name: 'fragment',
            status: 'close'
        },
        on: {
            press: context.toggleGroup
        },
        child: []
    });
    allNode.addChild(formNode);
    lsWorkspace(projectName + '/' + 'form').then(function (res) {
        Promise.all(res.map(function (file) {
            var fragmentTag = file.name.replace(/\.form$/, '');
            return downloadFragmentData(projectName + '/' + 'form/' + file.name)
                .then(function (fData) {
                    var fragmentConstructor = makeFmFragmentClass({
                        tag: fragmentTag,
                        contentViewData: fData
                    });
                    AssemblerInstance.addConstructor(fragmentConstructor);
                    return _({
                        tag: 'exptree',
                        props: {
                            name: fragmentTag,
                            icon: 'span.mdi.mdi-terraform',
                            componentConstructor: fragmentConstructor
                        }
                    });
                })
        })).then(function (eltList) {
            eltList.forEach(function (elt) {
                formNode.addChild(elt)
            });
        })
    });

    var templateNode = _({
        tag: ExpTree.tag,
        props: {
            name: 'template',
            status: 'close'
        },
        on: {
            press: context.toggleGroup
        },
        child: []
    });
    allNode.addChild(templateNode);
    lsWorkspace(projectName + '/' + 'template').then(function (res) {
        Promise.all(res.map(function (file) {
            var templateName = file.name.replace(/\.ftl$/, '');
            return downloadFragmentData(projectName + '/' + 'template/' + file.name)
                .then(function (fData) {
                    return _({
                        tag: 'exptree',
                        props: {
                            name: templateName,
                            icon: 'span.mdi.mdi-terraform',
                            componentConstructor: fData
                        }
                    });
                })
        })).then(function (eltList) {
            console.log(eltList)
            eltList.forEach(function (elt) {
                templateNode.addChild(elt);
            });
        })
    });


}