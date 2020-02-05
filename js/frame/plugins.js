import XHR from 'absol/src/Network/XHR';
import CodeEditor from '../editor/CodeEditor';
import { base64EncodeUnicode } from 'absol/src/Converter/base64';
import Fcore from '../core/FCore';
import JSZip from 'jszip';

var WOKSPACE_FOLDER = 'formeditor/workspace';

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


function lsWorkspace(path) {
    return XHR.postRepquest('https://absol.cf/shell_exec.php', JSON.stringify({
        cmd: 'ls -la -F "' + path + '"',
        cwd: WOKSPACE_FOLDER
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
    });
}

function writeFileBase64(path, b64) {
    return XHR.postRepquest('https://absol.cf/shell_exec.php', JSON.stringify({
        cmd: 'echo \'' + b64 + '\'>' + path,
        cwd: WOKSPACE_FOLDER
    })).then(function (out) {
        console.log(out);

    });
};


function writeFile(path, text) {
    var b64 = base64EncodeUnicode(text);

    return XHR.postRepquest('https://absol.cf/shell_exec.php', JSON.stringify({
        cmd: 'echo \'' + b64 + '\' | base64 -d >' + path,
        cwd: WOKSPACE_FOLDER
    })).then(function (out) {
        console.log(out);

    });
};

function catWorkspace(path) {
    return XHR.postRepquest('https://absol.cf/shell_exec.php', JSON.stringify({
        cmd: 'cat "' + path + '"',
        cwd: WOKSPACE_FOLDER
    }));
}


export function PluginProjectExplore(context) {
    var _ = context._;
    var $ = context.$;
    /**
     * @type {import('../fragment/ProjectExplorer').default}
     */
    var self = context.self;
    function contextMenuEventHandler(contentArguments, event) {
        // if (contentArguments.ext == 'form') {
        event.showContextMenu({
            items: [
                {
                    text: 'Open',
                    icon: 'span.mdi.mdi-menu-open',
                    cmd: 'open'
                }
            ],
            extendStyle: {
                fontSize: '12px'
            }
        }, function (event) {
            switch (event.menuItem.cmd) {
                case 'open':
                    self.openItem('form', contentArguments.fullPath.replace(/[^a-zA-Z0-9\_]/g, '_'), contentArguments.name, contentArguments, contentArguments.fullPath)
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
                                icon: 'span.mdi.mdi-folder',
                                status: 'close'
                            },
                            on: {
                                press: function () {
                                    this.status = { open: 'close', close: 'open' }[this.status];
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
                        res.getNode().defineEvent('contextmenu')
                            .on('contextmenu', contextMenuEventHandler.bind(res, it))
                            .on('dblclick', function (event) {
                                self.openItem(it.ext, it.fullPath.replace(/[^a-zA-Z0-9\_]/g, '_'), it.name, it, it.fullPath);
                            });
                    }

                    res.addTo(rootElt);
                });
            });
            rootElt.clearChild();

        }

        var droppanel = self.$droppanel;
        visit(droppanel, [self.data.projectName]);
    };

}


export function PluginLoadContentData(accumulator) {
    var sync;
    if (accumulator.contentArguments.ext == 'form') {
        sync = catWorkspace(accumulator.contentArguments.fullPath).then(function (out) {
            if (out[0] == '{') {// is json

                try {
                    var data = JSON.parse(out);
                    accumulator.editor.setData(data);
                }
                catch (error) {
                    console.error(error)
                }
            }
            else {// base64 zip
                JSZip.loadAsync(out, { base64: true }).then(function (zip) {
                    zip.file('data.txt')
                        .async('text')
                        .then(function (text) {
                            try {
                                var data = JSON.parse(text);
                                accumulator.editor.setData(data);
                            }
                            catch (error) {
                                console.error(error)
                            }
                        });
                });
            }
        });
    }
    else if (CodeEditor.prototype.TYPE_MODE[accumulator.contentArguments.ext]) {
        sync = catWorkspace(accumulator.contentArguments.fullPath).then(function (out) {
            try {
                accumulator.editor.setData({ value: out, type: accumulator.contentArguments.ext });
            }
            catch (error) {
                console.error(error)
            }
        });
    } else if (accumulator.contentArguments.ext == 'jpg') {
        accumulator.editor.setData({ images: ['//absol.cf/'+WOKSPACE_FOLDER + '/' + accumulator.contentArguments.fullPath] });
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



};



export function PluginComponentPickerView(context) {
    var allNode = Fcore.$('exptree', context.self.$view, function (node) {
        return node.name == "all";
    });

    var formNode = Fcore._({
        tag: 'exptree',
        props: {
            name: 'form',
            status: 'close'
        },
        on: {
            press: context.toggleGroup
        },
        child: [
            {
                tag: 'exptree',
                props: {
                    name: "TextInput",
                    icon: 'span.mdi.mdi-terraform',
                    componentConstructor: { tag: 'LoginForm' }
                }
            }

        ]
    });


    allNode.addChild(formNode);

}