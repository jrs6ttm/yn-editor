/**
 * Created by DISI on 03.07.2015.
 */
var appUtils = {
    saveToLocalDisk: (function (view) {
        "use strict";
        // IE <10 is explicitly unsupported
        if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
            return;
        }
        var
            doc = view.document
        // only get URL when necessary in case Blob.js hasn't overridden it yet
            , get_URL = function () {
                return view.URL || view.webkitURL || view;
            }
            , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
            , can_use_save_link = "download" in save_link
            , click = function (node) {
                var event = doc.createEvent("MouseEvents");
                event.initMouseEvent(
                    "click", true, false, view, 0, 0, 0, 0, 0
                    , false, false, false, false, 0, null
                );
                node.dispatchEvent(event);
            }
            , webkit_req_fs = view.webkitRequestFileSystem
            , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
            , throw_outside = function (ex) {
                (view.setImmediate || view.setTimeout)(function () {
                    throw ex;
                }, 0);
            }
            , force_saveable_type = "application/octet-stream"
            , fs_min_size = 0
        // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
        // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
        // for the reasoning behind the timeout and revocation flow
            , arbitrary_revoke_timeout = 500 // in ms
            , revoke = function (file) {
                var revoker = function () {
                    if (typeof file === "string") { // file is an object URL
                        get_URL().revokeObjectURL(file);
                    } else { // file is a File
                        file.remove();
                    }
                };
                if (view.chrome) {
                    revoker();
                } else {
                    setTimeout(revoker, arbitrary_revoke_timeout);
                }
            }
            , dispatch = function (filesaver, event_types, event) {
                event_types = [].concat(event_types);
                var i = event_types.length;
                while (i--) {
                    var listener = filesaver["on" + event_types[i]];
                    if (typeof listener === "function") {
                        try {
                            listener.call(filesaver, event || filesaver);
                        } catch (ex) {
                            throw_outside(ex);
                        }
                    }
                }
            }
            , auto_bom = function (blob) {
                // prepend BOM for UTF-8 XML and text/* types (including HTML)
                if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                    return new Blob(["\ufeff", blob], {type: blob.type});
                }
                return blob;
            }
            , FileSaver = function (blob, name) {
                blob = auto_bom(blob);
                // First try a.download, then web filesystem, then object URLs
                var
                    filesaver = this
                    , type = blob.type
                    , blob_changed = false
                    , object_url
                    , target_view
                    , dispatch_all = function () {
                        dispatch(filesaver, "writestart progress write writeend".split(" "));
                    }
                // on any filesys errors revert to saving with object URLs
                    , fs_error = function () {
                        // don't create more object URLs than needed
                        if (blob_changed || !object_url) {
                            object_url = get_URL().createObjectURL(blob);
                        }
                        if (target_view) {
                            target_view.location.href = object_url;
                        } else {
                            var new_tab = view.open(object_url, "_blank");
                            if (new_tab == undefined && typeof safari !== "undefined") {
                                //Apple do not allow window.open, see http://bit.ly/1kZffRI
                                view.location.href = object_url
                            }
                        }
                        filesaver.readyState = filesaver.DONE;
                        dispatch_all();
                        revoke(object_url);
                    }
                    , abortable = function (func) {
                        return function () {
                            if (filesaver.readyState !== filesaver.DONE) {
                                return func.apply(this, arguments);
                            }
                        };
                    }
                    , create_if_not_found = {create: true, exclusive: false}
                    , slice
                    ;
                filesaver.readyState = filesaver.INIT;
                if (!name) {
                    name = "download";
                }
                if (can_use_save_link) {
                    object_url = get_URL().createObjectURL(blob);
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                    return;
                }
                // Object and web filesystem URLs have a problem saving in Google Chrome when
                // viewed in a tab, so I force save with application/octet-stream
                // http://code.google.com/p/chromium/issues/detail?id=91158
                // Update: Google errantly closed 91158, I submitted it again:
                // https://code.google.com/p/chromium/issues/detail?id=389642
                if (view.chrome && type && type !== force_saveable_type) {
                    slice = blob.slice || blob.webkitSlice;
                    blob = slice.call(blob, 0, blob.size, force_saveable_type);
                    blob_changed = true;
                }
                // Since I can't be sure that the guessed media type will trigger a download
                // in WebKit, I append .download to the filename.
                // https://bugs.webkit.org/show_bug.cgi?id=65440
                if (webkit_req_fs && name !== "download") {
                    name += ".download";
                }
                if (type === force_saveable_type || webkit_req_fs) {
                    target_view = view;
                }
                if (!req_fs) {
                    fs_error();
                    return;
                }
                fs_min_size += blob.size;
                req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
                    fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
                        var save = function () {
                            dir.getFile(name, create_if_not_found, abortable(function (file) {
                                file.createWriter(abortable(function (writer) {
                                    writer.onwriteend = function (event) {
                                        target_view.location.href = file.toURL();
                                        filesaver.readyState = filesaver.DONE;
                                        dispatch(filesaver, "writeend", event);
                                        revoke(file);
                                    };
                                    writer.onerror = function () {
                                        var error = writer.error;
                                        if (error.code !== error.ABORT_ERR) {
                                            fs_error();
                                        }
                                    };
                                    "writestart progress write abort".split(" ").forEach(function (event) {
                                        writer["on" + event] = filesaver["on" + event];
                                    });
                                    writer.write(blob);
                                    filesaver.abort = function () {
                                        writer.abort();
                                        filesaver.readyState = filesaver.DONE;
                                    };
                                    filesaver.readyState = filesaver.WRITING;
                                }), fs_error);
                            }), fs_error);
                        };
                        dir.getFile(name, {create: false}, abortable(function (file) {
                            // delete file if it already exists
                            file.remove();
                            save();
                        }), abortable(function (ex) {
                            if (ex.code === ex.NOT_FOUND_ERR) {
                                save();
                            } else {
                                fs_error();
                            }
                        }));
                    }), fs_error);
                }), fs_error);
            }
            , FS_proto = FileSaver.prototype
            , saveAs = function (blob, name) {
                return new FileSaver(blob, name);
            }
            ;
        // IE 10+ (native saveAs)
        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
            return function (blob, name) {
                return navigator.msSaveOrOpenBlob(auto_bom(blob), name);
            };
        }

        FS_proto.abort = function () {
            var filesaver = this;
            filesaver.readyState = filesaver.DONE;
            dispatch(filesaver, "abort");
        };
        FS_proto.readyState = FS_proto.INIT = 0;
        FS_proto.WRITING = 1;
        FS_proto.DONE = 2;

        FS_proto.error =
            FS_proto.onwritestart =
                FS_proto.onprogress =
                    FS_proto.onwrite =
                        FS_proto.onabort =
                            FS_proto.onerror =
                                FS_proto.onwriteend =
                                    null;

        return saveAs;
    }(
        typeof self !== "undefined" && self
        || typeof window !== "undefined" && window
        || this.content
    )),
    getMxCellPersistObj: function (mxCell) {
        //console.log(mxCell);
        var mxCellJsonObj = [];
        if (mxCell) {
            var obj = {
                id: mxCell.id,
                style: mxCell.style,
                value: {
                    label: mxCell.getValue().getAttribute('label'),
                    description: mxCell.getValue().getAttribute('description'),
                    creator:mxCell.getValue().getAttribute('creator')
                },
                vertex: mxCell.vertex,
                parent: mxCell.parent.id,
                geometry: {
                    x: mxCell.geometry.x,
                    y: mxCell.geometry.y,
                    width: mxCell.geometry.width,
                    height: mxCell.geometry.height,
                    relative: mxCell.geometry.relative
                }
            };
            mxCellJsonObj.push(obj);
            if (mxCell.children) {
                for (var i = 0; i < mxCell.children.length; i++) {
                    var obj = {
                        id: mxCell.children[i].id,
                        style: mxCell.children[i].style,
                        value: '',
                        vertex: mxCell.children[i].vertex,
                        parent: mxCell.children[i].parent.id,
                        geometry: {
                            x: mxCell.children[i].geometry.x,
                            y: mxCell.children[i].geometry.y,
                            width: mxCell.children[i].geometry.width,
                            height: mxCell.children[i].geometry.height,
                            relative: mxCell.children[i].geometry.relative,
                            offset: {
                                x: mxCell.children[i].geometry.offset.x,
                                y: mxCell.children[i].geometry.offset.y
                            }
                        }
                    };
                    mxCellJsonObj.push(obj);
                }
            }

            //console.log(mxCellJsonObj);

        } else {
            var obj = {};
            mxCellJsonObj.push(obj);
        }

        return mxCellJsonObj;
    },
    getMxGeometryChange: function (mxGeometryChange) {
        //console.log(mxGeometryChange);
        var id = mxGeometryChange.cell.id;
        var x = mxGeometryChange.geometry.x;
        var y = mxGeometryChange.geometry.y;
        var width = mxGeometryChange.geometry.width;
        var height = mxGeometryChange.geometry.height;
        var MxGeometryChange = {
            id: id,
            x: x,
            y: y,
            width: width,
            height: height
        };
        //console.log(MxGeometryChange);
        var title = 'geometryChange';
        syncChanges(title, MxGeometryChange, function (changes) {
            //console.log(changes);
            //ecEditorUi.editor.graph.updateCellGeometry(changes.id, changes.x, changes.y, changes.width, changes.height);
        });
        /*EditorUi.communication.syncChanges(title, MxGeometryChange, function (changes) {
         //console.log(changes);
         //ecEditorUi.editor.graph.updateCellGeometry(changes.id, changes.x, changes.y, changes.width, changes.height);
         });*/

    },
    getMxCellAttributeChange: function (mxCellAttributeChange) {
        //console.log(mxCellAttributeChange);
        var id = mxCellAttributeChange.cell.id;
        var attribute = mxCellAttributeChange.attribute;
        var value = mxCellAttributeChange.value;
        var mxCellAttributeChange = {
            id: id,
            attribute: attribute,
            value: value
        };
        console.log(mxCellAttributeChange);
    },
    getMxStyleChange: function (mxStyleChange) {
        //console.log(mxStyleChange);
        var id = mxStyleChange.cell.id;
        var style = mxStyleChange.style;
        var mxStyleChange = {
            id: id,
            style: style
        };
        console.log(mxStyleChange);
    },
    getMxChildChange: function (mxChildChange) {
        if (!mxChildChange.parent) {
            var MxChildRemove = {
                id: mxChildChange.child.id
            };
            syncChanges('removeCell', MxChildRemove, function (changes) {

            });
        }
        console.log(mxChildChange);
    },
    getMxValueChange: function (mxValueChange) {
        console.log(mxValueChange);
        var id = mxValueChange.cell.id;
        var attributes = mxValueChange.value.getAttribute('label');
        var attributes = {
            id: id,
            attributes: attributes
        };
        console.log(attributes);
        if (mxValueChange.previous.getAttribute('label') !== mxValueChange.value.getAttribute('label')) {
            syncChanges('changeLabel', attributes, function (changes) {

            })
        }
    },

    genMxCellValueFromPersistObj: function (mxCellPersistObj) {
        var ecCellValue = mxUtils.createXmlDocument().createElement('ecCell');
        ecCellValue.setAttribute('label', (mxCellPersistObj.value != '') ? mxCellPersistObj.value.label : '');
        ecCellValue.setAttribute('description', (mxCellPersistObj.value != '') ? mxCellPersistObj.value.description : '');
        ecCellValue.setAttribute('id', (mxCellPersistObj.id != '') ? mxCellPersistObj.id : '');
        ecCellValue.setAttribute('creator', (mxCellPersistObj.value != '') ? mxCellPersistObj.value.creator : '');
        return ecCellValue;


    },
    insertVertexToGraph: function (graph, parent, id, ecCellValue, x, y, width, height, style, relative) {
        graph.insertVertex(parent, id, ecCellValue, x, y, width, height, style, relative);
    },
    updateVertex: function (id, ecCellValue, x, y, width, hight, style, relative) {
        // find mxCell by id

    },
    convertQueryStrToJSON: function () {
        var href = window.location.href;
        var idx = href.lastIndexOf('?');
        var url = href.substr(idx);
        if (url === '')
            return '';
        var pairs = (url || location.search).slice(1).split('&');
        var result = {};
        for (var idx in pairs) {
            var pair = pairs[idx].split('=');
            if (!!pair[0])
                result[pair[0]] = decodeURIComponent(pair[1] || '');
        }
        return result;
    },
    convertJSONToQueryStr: function (obj, isWithQuestMark) {
        var parts = [], queryStr = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        queryStr = parts.join('&');
        if (isWithQuestMark === undefined || isWithQuestMark) {
            queryStr = '?' + queryStr;
        }
        return queryStr;
    }
};

var BasicMessage = function (isSuccess, type, message, data) {
    this.success = isSuccess;
    this.type = type;
    this.msg = message;
    this.data = data;
};
