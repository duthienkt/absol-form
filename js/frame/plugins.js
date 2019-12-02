import XHR from 'absol/src/Network/XHR';

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
        if (contentArguments.ext == 'form') {
            event.showContextMenu({
                items: [
                    {
                        text: 'Open',
                        icon: 'span.mdi.mdi-menu-open',
                        cmd: 'open'
                    },
                    {
                        text: 'Duplicate',
                        icon: 'span.mdi.mdi-content-duplicate',
                        cmd: 'duplicate'
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
                    }

                    res.getNode().defineEvent('contextmenu')
                        .on('contextmenu', contextMenuEventHandler.bind(res, it));
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
    if (accumulator.contentArguments.ext == 'form') {
        catWorkspace(accumulator.contentArguments.fullPath).then(function (out) {
            try {
                var data = JSON.parse(out);
                accumulator.editor.setData(data);
            }
            catch (error) {
                console.error(error)
            }
        });
    }
    // console.log(accumulator);

}