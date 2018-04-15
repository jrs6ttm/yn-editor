/**
 * Constructs a new graph editor
 */
var EditorUi = function (editor, container) {
    mxEventSource.call(this);

    this.VERSION = '0.0.0.1';

    this.editor = editor || new Editor();
    this.communication = new Communication(this);
    this.formItems = new FormItems(this);


    this.container = container || document.body;
    var graph = this.editor.graph;
    graph.setCommunication(this.communication);


    //// Log Initial State
    //History.log('initial:', state.data, state.title, state.url);
    History.Adapter.bind(window, 'statechange', mxUtils.bind(this, function () {
        var state = History.getState();
        //History.log('statechange:', state.data, state.title, state.url);

        if (state.title === this.communication.apis.retrieveGraphModel) {
            if(History.ecDoRetrieveGraphModel !== false){
                this.communication.retrieveGraphModel(state.data, mxUtils.bind(this.editor, this.editor.setGraphModel));
                this.editor.setModified(false);

            }
            delete History.ecDoRetrieveGraphModel;


        }else if (state.title === '') {
            this.editor.setGraphModel({
                xml: this.editor.initXml,
                fileName: this.editor.initFileName
            });
        }

    }));


    // Pre-fetches submenu image
    new Image().src = mxPopupMenu.prototype.submenuImage;

    // Pre-fetches connect image
    if (mxConnectionHandler.prototype.connectImage != null) {
        new Image().src = mxConnectionHandler.prototype.connectImage.src;
    }

    // Disables graph and forced panning in chromeless mode
    if (this.editor.chromeless) {
        this.footerHeight = 0;
        graph.isEnabled = function () {
            return false;
        };
        graph.panningHandler.isForcePanningEvent = function () {
            return true;
        };

        // Overrides click handler to ignore graph enabled state
        graph.cellRenderer.createControlClickHandler = function (state) {
            var graph = state.view.graph;

            return function (evt) {
                var collapse = !graph.isCellCollapsed(state.cell);
                graph.foldCells(collapse, false, [state.cell], null, evt);
                mxEvent.consume(evt);
            };
        };
    }

    // Creates the user interface
    this.actions = new Actions(this);
    this.menus = new Menus(this);
    this.createDivs();
    this.createUi();
    this.refresh();

    // Disables HTML and text selection
    var textEditing = mxUtils.bind(this, function (evt) {
        if (evt == null) {
            evt = window.event;
        }

        if (this.isSelectionAllowed(evt)) {
            return true;
        }

        return graph.isEditing();
    });

    // Disables text selection while not editing and no dialog visible
    if (this.container == document.body) {
        this.menubarContainer.onselectstart = textEditing;
        this.menubarContainer.onmousedown = textEditing;
        this.toolbarContainer.onselectstart = textEditing;
        this.toolbarContainer.onmousedown = textEditing;
        this.diagramContainer.onselectstart = textEditing;
        this.diagramContainer.onmousedown = textEditing;
        this.sidebarContainer.onselectstart = textEditing;
        this.sidebarContainer.onmousedown = textEditing;
        this.propertyContainer.onselectstart = textEditing;
        //this.propertyContainer.onmousedown = textEditing;
        this.footerContainer.onselectstart = textEditing;
        this.footerContainer.onmousedown = textEditing;
    }

    // And uses built-in context menu while editing
    if (mxClient.IS_IE && (typeof(document.documentMode) === 'undefined' || document.documentMode < 9)) {
        mxEvent.addListener(this.diagramContainer, 'contextmenu', textEditing);
    } else {
        // Allows browser context menu outside of diagram and sidebar
        this.diagramContainer.oncontextmenu = textEditing;
    }

    // Contains the main graph instance inside the given panel
    graph.init(this.diagramContainer);

    var textMode = false;
    var nodes = null;

    var updateToolbar = mxUtils.bind(this, function () {
        if (textMode != graph.cellEditor.isContentEditing()) {
            var node = this.toolbar.container.firstChild;
            var newNodes = [];

            while (node != null) {
                var tmp = node.nextSibling;
                node.parentNode.removeChild(node);
                newNodes.push(node);
                node = tmp;
            }

            if (nodes == null) {
                this.toolbar.createTextToolbar();
            } else {
                for (var i = 0; i < nodes.length; i++) {
                    this.toolbar.container.appendChild(nodes[i]);
                }
            }

            textMode = graph.cellEditor.isContentEditing();
            nodes = newNodes;
        }
    });

    // Control-enter applies editing value
    // FIXME: Fix for HTML editing
    var cellEditorIsStopEditingEvent = graph.cellEditor.isStopEditingEvent;
    graph.cellEditor.isStopEditingEvent = function (evt) {
        return cellEditorIsStopEditingEvent.apply(this, arguments) ||
            (evt.keyCode == 13 && mxEvent.isControlDown(evt));
    };

    // Overrides cell editor to update toolbar
    var cellEditorStartEditing = graph.cellEditor.startEditing;
    graph.cellEditor.startEditing = function () {
        cellEditorStartEditing.apply(this, arguments);
        updateToolbar();
    };

    var cellEditorStopEditing = graph.cellEditor.stopEditing;
    graph.cellEditor.stopEditing = function (cell, trigger) {
        cellEditorStopEditing.apply(this, arguments);
        updateToolbar();
    };

    // Enables scrollbars and sets cursor style for the container
    graph.container.setAttribute('tabindex', '0');
    graph.container.style.cursor = 'default';
    graph.container.style.backgroundImage = 'url(' + editor.gridImage + ')';
    graph.container.style.backgroundPosition = '-1px -1px';

    var noBackground = (mxClient.IS_IE && document.documentMode >= 9) ? 'url(' + this.editor.transparentImage + ')' : 'none';
    graph.container.style.backgroundImage = noBackground;
    var bgImg = (!graph.pageVisible && graph.isGridEnabled()) ? 'url(' + this.editor.gridImage + ')' : noBackground;

    if (graph.view.canvas.ownerSVGElement != null) {
        graph.view.canvas.ownerSVGElement.style.backgroundImage = bgImg;
    } else {
        graph.view.canvas.style.backgroundImage = bgImg;
    }

    graph.container.focus();

    // Keeps graph container focused on mouse down
    var graphFireMouseEvent = graph.fireMouseEvent;
    graph.fireMouseEvent = function (evtName, me, sender) {
        //console.log(evtName);
        if (evtName == mxEvent.MOUSE_DOWN) {
            this.container.focus();
        }

        //++: user_ex: graph operation event enter point
        graphFireMouseEvent.apply(this, arguments);
    };

    // Configures automatic expand on mouseover
    graph.popupMenuHandler.autoExpand = true;

    // Installs context menu
    graph.popupMenuHandler.factoryMethod = mxUtils.bind(this, function (menu, cell, evt) {
        this.menus.createGraphPopupMenu(menu, cell, evt);
    });
    // Hides context menu
    mxEvent.addGestureListeners(document, mxUtils.bind(this, function (evt) {
        graph.popupMenuHandler.hideMenu();
    }));

    // Create handler for key events
    this.keyHandler = this.createKeyHandler(editor);

    // Getter for key handler
    this.getKeyHandler = function () {
        return keyHandler;
    };

    // Stores the current style and assigns it to new cells
    var styles = ['shadow', 'glass', 'dashed', 'dashPattern'];
    var connectStyles = ['shape', 'edgeStyle', 'curved', 'rounded', 'elbow'];

    // Sets the default edge style
    // !!
    var currentEdgeStyle = {'edgeStyle': 'orthogonalEdgeStyle', 'rounded': '1', 'html': '1','strokeColor':'#B3B3B3', 'strokeWidth': '3'};
    var currentStyle = (mxUi==='course_design') ? {gradientColor: "#9999FF"}:{};

    // Note: Everything that is not in styles is ignored (styles is augmented below)
    this.setDefaultStyle = function (cell) {
        var state = graph.view.getState(cell);

        if (cell != null) {
            // Ignores default styles
            var clone = cell.clone();
            clone.style = '';
            var defaultStyle = graph.getCellStyle(clone);
            var values = [];
            var keys = [];

            for (var key in state.style) {
                if (defaultStyle[key] != state.style[key]) {
                    values.push(state.style[key]);
                    keys.push(key);
                }
            }

            // Handles special case for value "none"
            var cellStyle = graph.getModel().getStyle(state.cell);
            var tokens = (cellStyle != null) ? cellStyle.split(';') : [];

            for (var i = 0; i < tokens.length; i++) {
                var tmp = tokens[i];
                var pos = tmp.indexOf('=');

                if (pos >= 0) {
                    var key = tmp.substring(0, pos);
                    var value = tmp.substring(pos + 1);

                    if (defaultStyle[key] != null && value == 'none') {
                        values.push(value);
                        keys.push(key);
                    }
                }
            }

            // Resets current style
            if (graph.getModel().isEdge(state.cell)) {
                currentEdgeStyle = {};
            } else {
                currentStyle = {}
            }

            this.fireEvent(new mxEventObject('styleChanged', 'keys', keys, 'values', values, 'cells', [state.cell]));
        }
    };

    this.clearDefaultStyle = function () {
        currentEdgeStyle = {'edgeStyle': 'orthogonalEdgeStyle', 'rounded': '1', 'html': '1','strokeColor':'#B3B3B3', 'strokeWidth': '3'};
        currentStyle = {};
    };

    // Constructs the style for the initial edge type defined in the initial value for the currentEdgeStyle
    // This function is overridden below as soon as any style is set in the app.
    var initialEdgeCellStyle = '';

    for (var key in currentEdgeStyle) {
        initialEdgeCellStyle += key + '=' + currentEdgeStyle[key] + ';';
    }

    // Uses the default edge style for connect preview
    graph.connectionHandler.createEdgeState = function (me) {
        var edge = graph.createEdge(null, null, null, null, null, initialEdgeCellStyle);

        return new mxCellState(graph.view, edge, graph.getCellStyle(edge));
    };

    // Keys that should be ignored if the cell has a value (known: new default for all cells is html=1 so
    // for the html key this effecticely only works for edges inserted via the connection handler)
    var valueStyles = ['fontFamily', 'fontSize', 'fontColor'];

    // Keys that always update the current edge style regardless of selection
    var alwaysEdgeStyles = ['edgeStyle', 'startArrow', 'startFill', 'startSize', 'endArrow', 'endFill', 'endSize'];

    // Keys that are ignored together (if one appears all are ignored)
    var keyGroups = [['startArrow', 'startFill', 'startSize', 'endArrow', 'endFill', 'endSize'],
        ['strokeColor', 'strokeWidth'],
        ['fillColor', 'gradientColor'],
        valueStyles,
        ['align'],
        ['html']];

    // Adds all keys used above to the styles array
    for (var i = 0; i < keyGroups.length; i++) {
        for (var j = 0; j < keyGroups[i].length; j++) {
            styles.push(keyGroups[i][j]);
        }
    }

    for (var i = 0; i < connectStyles.length; i++) {
        styles.push(connectStyles[i]);
    }

    this.communication.addListener('onEditorUiMessage', mxUtils.bind(this, function (message) {
        if (message.type === 'file_has_been_delete') {
            this.handleNonExistGraph();
        }
    }));
    // Implements a global current style for edges and vertices that is applied to new cells
    var insertHandler = function (cells) {
        graph.getModel().beginUpdate();
        try {
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];

                // Removes styles defined in the cell style from the styles to be applied
                var cellStyle = graph.getModel().getStyle(cell);
                var tokens = (cellStyle != null) ? cellStyle.split(';') : [];
                var appliedStyles = styles.slice();

                for (var j = 0; j < tokens.length; j++) {
                    var tmp = tokens[j];
                    var pos = tmp.indexOf('=');

                    if (pos >= 0) {
                        var key = tmp.substring(0, pos);
                        var index = mxUtils.indexOf(appliedStyles, key);

                        if (index >= 0) {
                            appliedStyles.splice(index, 1);
                        }

                        // Handles special cases where one defined style ignores other styles
                        for (var k = 0; k < keyGroups.length; k++) {
                            var group = keyGroups[k];

                            if (mxUtils.indexOf(group, key) >= 0) {
                                for (var l = 0; l < group.length; l++) {
                                    var index2 = mxUtils.indexOf(appliedStyles, group[l]);

                                    if (index2 >= 0) {
                                        appliedStyles.splice(index2, 1);
                                    }
                                }
                            }
                        }
                    }
                }

                // Applies the current style to the cell
                var value = graph.convertValueToString(cell);
                var edge = graph.getModel().isEdge(cell);
                var current = (edge) ? currentEdgeStyle : currentStyle;

                for (var j = 0; j < appliedStyles.length; j++) {
                    var key = appliedStyles[j];
                    var styleValue = current[key];

                    if (styleValue != null) {
                        // Special case: Connect styles are not applied here but in the connection handler
                        if (!edge || mxUtils.indexOf(connectStyles, key) < 0) {
                            graph.setCellStyles(key, styleValue, [cell]);
                        }
                    }
                }
            }
        }
        finally {
            graph.getModel().endUpdate();
        }
    };

    graph.addListener('cellsInserted', function (sender, evt) {
        insertHandler(evt.getProperty('cells'));
    });

    graph.connectionHandler.addListener(mxEvent.CONNECT, function (sender, evt) {
        var cells = [evt.getProperty('cell')];

        if (evt.getProperty('terminalInserted')) {
            cells.push(evt.getProperty('terminal'));
        }

        insertHandler(cells, true);
    });

    // This is used below and in Sidebar.dropAndConnect
    this.createCurrentEdgeStyle = function () {
        var style = 'edgeStyle=' + (currentEdgeStyle['edgeStyle'] || 'none') + ';';

        if (currentEdgeStyle['shape'] != null) {
            style += 'shape=' + currentEdgeStyle['shape'] + ';';
        }

        if (currentEdgeStyle['curved'] != null) {
            style += 'curved=' + currentEdgeStyle['curved'] + ';';
        }

        if (currentEdgeStyle['rounded'] != null) {
            style += 'rounded=' + currentEdgeStyle['rounded'] + ';';
        }

        // Special logic for custom property of elbowEdgeStyle
        if (currentEdgeStyle['edgeStyle'] == 'elbowEdgeStyle' && currentEdgeStyle['elbow'] != null) {
            style += 'elbow=' + currentEdgeStyle['elbow'] + ';';
        }

        if (currentEdgeStyle['html'] != null) {
            style += 'html=' + currentEdgeStyle['html'] + ';';
        } else {
            style += 'html=1;';
        }

        return style;
    };

    // Uses current edge style for connect preview
    // NOTE: Do not use "this" in here as it points to the UI
    graph.connectionHandler.createEdgeState = mxUtils.bind(this, function (me) {
        var style = this.createCurrentEdgeStyle();
        var edge = graph.createEdge(null, null, null, null, null, style);

        return new mxCellState(graph.view, edge, graph.getCellStyle(edge));
    });

    this.addListener('styleChanged', mxUtils.bind(this, function (sender, evt) {
        // Checks if edges and/or vertices were modified
        var cells = evt.getProperty('cells');
        var vertex = false;
        var edge = false;

        if (cells.length > 0) {
            for (var i = 0; i < cells.length; i++) {
                vertex = graph.getModel().isVertex(cells[i]) || vertex;
                edge = graph.getModel().isEdge(cells[i]) || edge;

                if (edge && vertex) {
                    break;
                }
            }
        } else {
            vertex = true;
            edge = true;
        }

        var keys = evt.getProperty('keys');
        var values = evt.getProperty('values');

        for (var i = 0; i < keys.length; i++) {
            var common = mxUtils.indexOf(valueStyles, keys[i]) >= 0;

            // Special case: Edge style and shape
            if (mxUtils.indexOf(connectStyles, keys[i]) >= 0) {
                if (edge || mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
                    currentEdgeStyle[keys[i]] = values[i];
                }
            } else if (mxUtils.indexOf(styles, keys[i]) >= 0) {
                if (vertex || common) {
                    currentStyle[keys[i]] = values[i];
                }

                if (edge || common || mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
                    currentEdgeStyle[keys[i]] = values[i];
                }
            }
        }

        if (this.toolbar != null) {
            var ff = currentStyle['fontFamily'] || Menus.prototype.defaultFont;
            this.toolbar.fontMenu.innerHTML = mxUtils.htmlEntities(ff);

            var fs = String(currentStyle['fontSize'] || Menus.prototype.defaultFontSize);
            this.toolbar.sizeMenu.innerHTML = mxUtils.htmlEntities(fs);

            // Updates toolbar icon for edge style
            var edgeStyleDiv = this.toolbar.edgeStyleMenu.getElementsByTagName('div')[0];

            if (currentEdgeStyle['edgeStyle'] == 'orthogonalEdgeStyle' && currentEdgeStyle['curved'] == '1') {
                edgeStyleDiv.className = 'geSprite geSprite-curved';
            } else if (currentEdgeStyle['edgeStyle'] == 'straight' || currentEdgeStyle['edgeStyle'] == 'none' ||
                currentEdgeStyle['edgeStyle'] == null) {
                edgeStyleDiv.className = 'geSprite geSprite-straight';
            } else if (currentEdgeStyle['edgeStyle'] == 'entityRelationEdgeStyle') {
                edgeStyleDiv.className = 'geSprite geSprite-entity';
            } else {
                edgeStyleDiv.className = 'geSprite geSprite-orthogonal';
            }

            // Updates icon for edge shape
            var edgeShapeDiv = this.toolbar.edgeShapeMenu.getElementsByTagName('div')[0];

            if (currentEdgeStyle['shape'] == 'link') {
                edgeShapeDiv.className = 'geSprite geSprite-linkedge';
            } else if (currentEdgeStyle['shape'] == 'flexArrow') {
                edgeShapeDiv.className = 'geSprite geSprite-arrow';
            } else if (currentEdgeStyle['shape'] == 'arrow') {
                edgeShapeDiv.className = 'geSprite geSprite-simplearrow';
            } else {
                edgeShapeDiv.className = 'geSprite geSprite-connection';
            }

            // Updates icon for optinal line start shape
            if (this.toolbar.lineStartMenu != null) {
                var lineStartDiv = this.toolbar.lineStartMenu.getElementsByTagName('div')[0];

                lineStartDiv.className = this.getCssClassForMarker('start',
                    currentEdgeStyle['shape'], currentEdgeStyle[mxConstants.STYLE_STARTARROW],
                    mxUtils.getValue(currentEdgeStyle, 'startFill', '0'));
            }

            // Updates icon for optinal line end shape
            if (this.toolbar.lineEndMenu != null) {
                var lineEndDiv = this.toolbar.lineEndMenu.getElementsByTagName('div')[0];

                lineEndDiv.className = this.getCssClassForMarker('end',
                    currentEdgeStyle['shape'], currentEdgeStyle[mxConstants.STYLE_ENDARROW],
                    mxUtils.getValue(currentEdgeStyle, 'endFill', '0'));
            }
        }
    }));

    // Update font size and font family labels
    if (this.toolbar != null) {
        var update = mxUtils.bind(this, function () {
            var ff = currentStyle['fontFamily'] || 'Helvetica';
            var fs = String(currentStyle['fontSize'] || '12');
            var state = graph.getView().getState(graph.getSelectionCell());

            if (state != null) {
                ff = state.style[mxConstants.STYLE_FONTFAMILY] || ff;
                fs = state.style[mxConstants.STYLE_FONTSIZE] || fs;

                if (ff.length > 10) {
                    ff = ff.substring(0, 8) + '...';
                }
            }

            this.toolbar.fontMenu.innerHTML = ff;
            this.toolbar.sizeMenu.innerHTML = fs;
        });

        graph.getSelectionModel().addListener(mxEvent.CHANGE, update);
        graph.getModel().addListener(mxEvent.CHANGE, update);
    }

    // Makes sure the current layer is visible when cells are added
    graph.addListener(mxEvent.CELLS_ADDED, function (sender, evt) {
        var cells = evt.getProperty('cells');
        var parent = evt.getProperty('parent');

        if (graph.getModel().isLayer(parent) && !graph.isCellVisible(parent) && cells != null && cells.length > 0) {
            graph.getModel().setVisible(parent, true);
        }
    });

    // Updates the editor UI after the window has been resized or the orientation changes
    // Timeout is workaround for old IE versions which have a delay for DOM client sizes.
    // Should not use delay > 0 to avoid handle multiple repaints during window resize
    mxEvent.addListener(window, 'resize', mxUtils.bind(this, function () {
        window.setTimeout(mxUtils.bind(this, function () {
            this.refresh();
        }), 0);
    }));

    mxEvent.addListener(window, 'orientationchange', mxUtils.bind(this, function () {
        this.refresh();
    }));

    // Workaround for bug on iOS see
    // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
    if (mxClient.IS_IOS && !window.navigator.standalone) {
        mxEvent.addListener(window, 'scroll', mxUtils.bind(this, function () {
            window.scrollTo(0, 0);
        }));
    }

    /**
     * Sets the initial scrollbar locations after a file was loaded.
     */
    this.editor.addListener('resetGraphView', mxUtils.bind(this, function () {
        // Timeout is a workaround for delay needed in older browsers and IE
        window.setTimeout(mxUtils.bind(this, function () {
            this.resetScrollbars();
        }), 0);
    }));

    // Escape key hides dialogs
    mxEvent.addListener(document, 'keydown', mxUtils.bind(this, function (evt) {
        // Cancels the editing if escape is pressed
        if (!mxEvent.isConsumed(evt) && evt.keyCode == 27 /* Escape */) {
            this.hideDialog();
        }
    }));

    // Resets UI, updates action and menu states
    this.editor.resetGraph();
    this.init();
    this.open();
    this.editor.initXml = mxUtils.getXml(this.editor.getGraphXml());
    this.editor.initFileName = this.editor.getOrCreateFilename();
    this.startEndAutoSave();
    //fz 11.25
    if (mxUi==='task_design') {
        var outlineWindow = new OutlineWindow(this, document.body.offsetWidth - 260, 100, 180, 180);
        outlineWindow.window.setVisible(true);
    }

};

// Extends mxEventSource
mxUtils.extend(EditorUi, mxEventSource);

/**
 * Specifies the size of the split bar.
 */
EditorUi.prototype.splitSize = (mxClient.IS_TOUCH || mxClient.IS_POINTER) ? 12 : 8;

/**
 * Specifies the height of the menubar. Default is 34.
 */
EditorUi.prototype.menubarHeight = 30;

/**
 * Specifies the width of the format panel should be enabled. Default is true.
 */
EditorUi.prototype.formatEnabled = true;

/**
 * Specifies the width of the format panel. Default is 240.
 */
EditorUi.prototype.formatWidth = 240;

/**
 * Specifies the height of the toolbar. Default is 36.
 */
EditorUi.prototype.toolbarHeight = 34;

/**
 * Specifies the height of the footer. Default is 28.
 */
EditorUi.prototype.footerHeight = 28;

/**
 * Specifies the height of the optional sidebarFooterContainer. Default is 34.
 */
EditorUi.prototype.sidebarFooterHeight = 34;

/**
 * Specifies the height of the horizontal split bar. Default is 204.
 */
EditorUi.prototype.hsplitPosition = 204;

/**
 * Specifies if animations are allowed in <executeLayout>. Default is true.
 */
EditorUi.prototype.allowAnimation = true;

/**
 * Installs the listeners to update the action states.
 */
EditorUi.prototype.init = function () {
    // Updates action states
    this.addUndoListener();
    this.addBeforeUnloadListener();

    this.editor.graph.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function () {
        this.updateActionStates();
    }));

    this.updateActionStates();
    this.initClipboard();
    this.initCanvas();
    this.communication.delayLoad();
};

/**
 * Private helper method.
 */
EditorUi.prototype.getCssClassForMarker = function (prefix, shape, marker, fill) {
    var result = '';

    if (shape == 'flexArrow') {
        result = (marker != null && marker != mxConstants.NONE) ?
        'geSprite geSprite-' + prefix + 'blocktrans' : 'geSprite geSprite-noarrow';
    } else {
        if (marker == mxConstants.ARROW_CLASSIC) {
            result = (fill == '1') ? 'geSprite geSprite-' + prefix + 'classic' : 'geSprite geSprite-' + prefix + 'classictrans';
        } else if (marker == mxConstants.ARROW_OPEN) {
            result = 'geSprite geSprite-' + prefix + 'open';
        } else if (marker == mxConstants.ARROW_BLOCK) {
            result = (fill == '1') ? 'geSprite geSprite-' + prefix + 'block' : 'geSprite geSprite-' + prefix + 'blocktrans';
        } else if (marker == mxConstants.ARROW_OVAL) {
            result = (fill == '1') ? 'geSprite geSprite-' + prefix + 'oval' : 'geSprite geSprite-' + prefix + 'ovaltrans';
        } else if (marker == mxConstants.ARROW_DIAMOND) {
            result = (fill == '1') ? 'geSprite geSprite-' + prefix + 'diamond' : 'geSprite geSprite-' + prefix + 'diamondtrans';
        } else if (marker == mxConstants.ARROW_DIAMOND_THIN) {
            result = (fill == '1') ? 'geSprite geSprite-' + prefix + 'thindiamond' : 'geSprite geSprite-' + prefix + 'thindiamondtrans';
        } else {
            result = 'geSprite geSprite-noarrow';
        }
    }

    return result;
};


/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.initClipboard = function () {
    // Overrides clipboard to update paste action state
    var paste = this.actions.get('paste');

    var updatePaste = mxUtils.bind(this, function () {
        paste.setEnabled(this.editor.graph.cellEditor.isContentEditing() || !mxClipboard.isEmpty());
    });

    var mxClipboardCut = mxClipboard.cut;
    mxClipboard.cut = function (graph) {
        if (graph.cellEditor.isContentEditing()) {
            document.execCommand('cut', false, null);
        } else {
            mxClipboardCut.apply(this, arguments);
        }

        updatePaste();
    };

    var mxClipboardCopy = mxClipboard.copy;
    mxClipboard.copy = function (graph) {
        if (graph.cellEditor.isContentEditing()) {
            document.execCommand('copy', false, null);
        } else {
            mxClipboardCopy.apply(this, arguments);
        }

        updatePaste();
    };

    var mxClipboardPaste = mxClipboard.paste;
    mxClipboard.paste = function (graph) {
        if (graph.cellEditor.isContentEditing()) {
            document.execCommand('paste', false, null);
        } else {
            mxClipboardPaste.apply(this, arguments);
        }

        updatePaste();
    };

    // Overrides cell editor to update paste action state
    var cellEditorStartEditing = this.editor.graph.cellEditor.startEditing;

    this.editor.graph.cellEditor.startEditing = function () {
        cellEditorStartEditing.apply(this, arguments);
        updatePaste();
    };

    var cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing;

    this.editor.graph.cellEditor.stopEditing = function (cell, trigger) {
        cellEditorStopEditing.apply(this, arguments);
        updatePaste();
    };

    updatePaste();
};

/**
 * Initializes the infinite canvas.
 */
EditorUi.prototype.initCanvas = function () {
    var graph = this.editor.graph;

    // Initial page layout view, scrollBuffer and timer-based scrolling
    var graph = this.editor.graph;
    graph.timerAutoScroll = true;

    /**
     * Specifies the size of the size for "tiles" to be used for a graph with
     * scrollbars but no visible background page. A good value is large
     * enough to reduce the number of repaints that is caused for auto-
     * translation, which depends on this value, and small enough to give
     * a small empty buffer around the graph. Default is 400x400.
     */
    graph.scrollTileSize = new mxRectangle(0, 0, 400, 400);

    /**
     * Returns the padding for pages in page view with scrollbars.
     */
    graph.getPagePadding = function () {
        return new mxPoint(Math.max(0, Math.round(graph.container.offsetWidth - 34)),
            Math.max(0, Math.round(graph.container.offsetHeight - 34)));
    };

    /**
     * Returns the size of the page format scaled with the page size.
     */
    graph.getPageSize = function () {
        return (this.pageVisible) ? new mxRectangle(0, 0, this.pageFormat.width * this.pageScale,
            this.pageFormat.height * this.pageScale) : this.scrollTileSize;
    };

    /**
     * Returns a rectangle describing the position and count of the
     * background pages, where x and y are the position of the top,
     * left page and width and height are the vertical and horizontal
     * page count.
     */
    graph.getPageLayout = function () {
        var size = (this.pageVisible) ? this.getPageSize() : this.scrollTileSize;
        var bounds = this.getGraphBounds();

        if (bounds.width == 0 || bounds.height == 0) {
            return new mxRectangle(0, 0, 1, 1);
        } else {
            // Computes untransformed graph bounds
            var x = Math.ceil(bounds.x / this.view.scale - this.view.translate.x);
            var y = Math.ceil(bounds.y / this.view.scale - this.view.translate.y);
            var w = Math.floor(bounds.width / this.view.scale);
            var h = Math.floor(bounds.height / this.view.scale);

            var x0 = Math.floor(x / size.width);
            var y0 = Math.floor(y / size.height);
            var w0 = Math.ceil((x + w) / size.width) - x0;
            var h0 = Math.ceil((y + h) / size.height) - y0;

            return new mxRectangle(x0, y0, w0, h0);
        }
    };

    // Fits the number of background pages to the graph
    graph.view.getBackgroundPageBounds = function () {
        var layout = this.graph.getPageLayout();
        var page = this.graph.getPageSize();

        return new mxRectangle(this.scale * (this.translate.x + layout.x * page.width),
            this.scale * (this.translate.y + layout.y * page.height),
            this.scale * layout.width * page.width,
            this.scale * layout.height * page.height);
    };

    // Scales pages/graph to fit available size
    var resize = null;

    if (this.editor.chromeless) {
        resize = mxUtils.bind(this, function (autoscale) {
            if (graph.container != null) {
                var b = (graph.pageVisible) ? graph.view.getBackgroundPageBounds() : graph.getGraphBounds();
                var tr = graph.view.translate;
                var s = graph.view.scale;

                // Normalizes the bounds
                b.x = b.x / s - tr.x;
                b.y = b.y / s - tr.y;
                b.width /= s;
                b.height /= s;

                var st = graph.container.scrollTop;
                var sl = graph.container.scrollLeft;
                var sb = (mxClient.IS_QUIRKS || document.documentMode >= 8) ? 20 : 14;

                if (document.documentMode == 8 || document.documentMode == 9) {
                    sb += 3;
                }

                var cw = graph.container.offsetWidth - sb;
                var ch = graph.container.offsetHeight - sb;

                var ns = (autoscale) ? Math.max(0.3, Math.min(1, cw / b.width)) : s;
                var dx = Math.max((cw - ns * b.width) / 2, 0) / ns;
                var dy = Math.max((ch - ns * b.height) / 4, 0) / ns;

                graph.view.scaleAndTranslate(ns, dx - b.x, dy - b.y);

                graph.container.scrollTop = st * ns / s;
                graph.container.scrollLeft = sl * ns / s;
            }
        });

        mxEvent.addListener(window, 'resize', mxUtils.bind(this, function () {
            resize(false);
        }));

        this.editor.addListener('resetGraphView', mxUtils.bind(this, function () {
            resize(true);
        }));

        // Workaround for clipping problem
        graph.getPreferredPageSize = function (bounds, width, height) {
            var pages = this.getPageLayout();
            var size = this.getPageSize();
            var s = this.view.scale;

            return new mxRectangle(0, 0, pages.width * size.width * s, pages.height * size.height * s);
        };

        // Adds zoom toolbar
        var zoomInBtn = mxUtils.button('', function (evt) {
            graph.zoomIn();
            resize(false);
            mxEvent.consume(evt);
        });
        zoomInBtn.className = 'geSprite geSprite-zoomin';
        zoomInBtn.setAttribute('title', mxResources.get('zoomIn'));
        zoomInBtn.style.outline = 'none';
        zoomInBtn.style.border = 'none';
        zoomInBtn.style.margin = '2px';

        var zoomOutBtn = mxUtils.button('', function (evt) {
            graph.zoomOut();
            resize(false);
            mxEvent.consume(evt);
        });
        zoomOutBtn.className = 'geSprite geSprite-zoomout';
        zoomOutBtn.setAttribute('title', mxResources.get('zoomOut'));
        zoomOutBtn.style.outline = 'none';
        zoomOutBtn.style.border = 'none';
        zoomOutBtn.style.margin = '2px';

        var zoomActualBtn = mxUtils.button('', function (evt) {
            resize(true);
            mxEvent.consume(evt);
        });
        zoomActualBtn.className = 'geSprite geSprite-actualsize';
        zoomActualBtn.setAttribute('title', mxResources.get('actualSize'));
        zoomActualBtn.style.outline = 'none';
        zoomActualBtn.style.border = 'none';
        zoomActualBtn.style.margin = '2px';

        var tb = document.createElement('div');
        tb.className = 'geToolbarContainer';
        tb.style.borderRight = '1px solid #e0e0e0';
        tb.style.padding = '2px';
        tb.style.left = '0px';
        tb.style.top = '0px';

        tb.appendChild(zoomInBtn);
        tb.appendChild(zoomOutBtn);
        tb.appendChild(zoomActualBtn);

        document.body.appendChild(tb);
    } else if (this.editor.extendCanvas) {
        graph.getPreferredPageSize = function (bounds, width, height) {
            var pages = this.getPageLayout();
            var size = this.getPageSize();

            return new mxRectangle(0, 0, pages.width * size.width, pages.height * size.height);
        };

        /**
         * Guesses autoTranslate to avoid another repaint (see below).
         * Works if only the scale of the graph changes or if pages
         * are visible and the visible pages do not change.
         */
        var graphViewValidate = graph.view.validate;
        graph.view.validate = function () {
            if (this.graph.container != null && mxUtils.hasScrollbars(this.graph.container)) {
                var pad = this.graph.getPagePadding();
                var size = this.graph.getPageSize();

                // Updating scrollbars here causes flickering in quirks and is not needed
                // if zoom method is always used to set the current scale on the graph.
                var tx = this.translate.x;
                var ty = this.translate.y;
                this.translate.x = pad.x / this.scale - (this.x0 || 0) * size.width;
                this.translate.y = pad.y / this.scale - (this.y0 || 0) * size.height;
            }

            graphViewValidate.apply(this, arguments);
        };

        var graphSizeDidChange = graph.sizeDidChange;
        graph.sizeDidChange = function () {
            if (this.container != null && mxUtils.hasScrollbars(this.container)) {
                var pages = this.getPageLayout();
                var pad = this.getPagePadding();
                var size = this.getPageSize();

                // Updates the minimum graph size
                var minw = Math.ceil(2 * pad.x / this.view.scale + pages.width * size.width);
                var minh = Math.ceil(2 * pad.y / this.view.scale + pages.height * size.height);

                var min = graph.minimumGraphSize;

                // LATER: Fix flicker of scrollbar size in IE quirks mode
                // after delayed call in window.resize event handler
                if (min == null || min.width != minw || min.height != minh) {
                    graph.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
                }

                // Updates auto-translate to include padding and graph size
                var dx = pad.x / this.view.scale - pages.x * size.width;
                var dy = pad.y / this.view.scale - pages.y * size.height;

                if (!this.autoTranslate && (this.view.translate.x != dx || this.view.translate.y != dy)) {
                    this.autoTranslate = true;
                    this.view.x0 = pages.x;
                    this.view.y0 = pages.y;

                    // NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE IS NO WAY AROUND THIS SINCE THE
                    // BOUNDS ARE KNOWN AFTER THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A REVALIDATION.
                    // SHOULD MOVE TRANSLATE/SCALE TO VIEW.
                    var tx = graph.view.translate.x;
                    var ty = graph.view.translate.y;

                    graph.view.setTranslate(dx, dy);
                    graph.container.scrollLeft += (dx - tx) * graph.view.scale;
                    graph.container.scrollTop += (dy - ty) * graph.view.scale;

                    this.autoTranslate = false;
                    return;
                }

                graphSizeDidChange.apply(this, arguments);
            }
        };
    }

    mxEvent.addMouseWheelListener(mxUtils.bind(this, function (evt, up) {
        if (mxEvent.isAltDown(evt) || graph.panningHandler.isActive()) {
            if (this.dialogs == null || this.dialogs.length == 0) {
                if (up) {
                    graph.zoomIn();
                } else {
                    graph.zoomOut();
                }

                if (resize != null) {
                    resize(false);
                }
            }

            mxEvent.consume(evt);
        }
    }));
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.isSelectionAllowed = function (evt) {
    return mxEvent.getSource(evt).nodeName == 'SELECT' || (mxEvent.getSource(evt).nodeName == 'INPUT' &&
        mxUtils.isAncestorNode(this.propertyContainer, mxEvent.getSource(evt)));
};

/**
 * Installs dialog if browser window is closed without saving
 * This must be disabled during save and image export.
 */
EditorUi.prototype.addBeforeUnloadListener = function () {
    // Installs dialog if browser window is closed without saving
    // This must be disabled during save and image export
    window.onbeforeunload = mxUtils.bind(this, function () {
        return this.onBeforeUnload();
    });
};

/**
 * Sets the onbeforeunload for the application
 */
EditorUi.prototype.onBeforeUnload = function () {
    if(mxUi === 'task_design' && urlParams['ch']) {
        var chatBox = this.chatDiv;
        var chatHistory = chatBox.getChatInfo();
        if (!this.editor.modified && chatHistory && this.editor.fileId) {
            this.saveModelFile(false);
        }
        if(urlParams['gFileId']) {
            var queryObj = {
                gFileId: urlParams['gFileId']
            };
            while(chatBox.messageDiv.hasChildNodes()){
                chatBox.messageDiv.removeChild(chatBox.messageDiv.firstChild);
            }
            this.communication.loadChatHistory(queryObj, mxUtils.bind(this, function (resData) {
                if (resData[0].chatHistory) {
                    var chatHistory = resData[0].chatHistory;
                    var msgLength = chatHistory.msgObj.length;
                    if(msgLength > 40){
                        var initLen = msgLength - 40;
                        var maxLen = 40;
                    }else{
                        var initLen = 0;
                        var maxLen = msgLength;
                    }
                    for(var i = initLen; i < maxLen;i++){
                        chatBox.addMessage(chatHistory.msgObj[i],true);
                    }
                }
            }));
        }
    }
    if (this.editor.modified ) {
        return mxResources.get('allChangesLost');
    }
};

/**
 * Opens the current diagram via the window.opener if one exists.
 */
EditorUi.prototype.open = function () {
    // Cross-domain window access is not allowed in FF, so if we
    // were opened from another domain then this will fail.
    try {
        if (window.opener != null && window.opener.openFile != null) {
            window.opener.openFile.setConsumer(mxUtils.bind(this, function (xml, filename) {
                try {
                    var doc = mxUtils.parseXml(xml);
                    this.editor.setGraphXml(doc.documentElement);
                    this.editor.setModified(false);
                    this.editor.undoManager.clear();

                    if (filename != null) {
                        this.editor.setFilename(filename);
                        this.editor.updateDocumentTitle();
                    }

                    return;
                }
                catch (e) {
                    //mxUtils.alert(mxResources.get('invalidOrMissingFile') + ': ' + e.message);
                    this.showDialog(new tipDialogBody(this, mxResources.get('invalidOrMissingFile') + ': ' + e.message), 300, null, true, true);
                }
            }));
        }
    }
    catch (e) {
        // ignore
    }

    // Fires as the last step if no file was loaded
    this.editor.graph.view.validate();

    // Required only in special cases where an initial file is opened
    // and the minimumGraphSize changes and CSS must be updated.
    this.editor.graph.sizeDidChange();
    this.editor.fireEvent(new mxEventObject('resetGraphView'));
};


/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.redo = function () {
    if (this.editor.graph.cellEditor.isContentEditing()) {
        document.execCommand('redo', false, null);
    } else {
        this.editor.graph.stopEditing(false);
        this.editor.undoManager.redo();
    }
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.undo = function () {
    if (this.editor.graph.cellEditor.isContentEditing()) {
        // Stops editing if undo doesn't change anything in the editing value
        var value = this.editor.graph.cellEditor.getCurrentValue();
        document.execCommand('undo', false, null);

        if (value == this.editor.graph.cellEditor.getCurrentValue()) {
            this.editor.graph.stopEditing(false);
        }
    } else {
        this.editor.graph.stopEditing(false);
        this.editor.undoManager.undo();
    }
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canRedo = function () {
    return this.editor.graph.cellEditor.isContentEditing() || this.editor.undoManager.canRedo();
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canUndo = function () {
    return this.editor.graph.cellEditor.isContentEditing() || this.editor.undoManager.canUndo();
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.getUrl = function (pathname) {
    var href = (pathname != null) ? pathname : window.location.pathname;
    var parms = (href.indexOf('?') > 0) ? 1 : 0;

    // Removes template URL parameter for new blank diagram
    for (var key in urlParams) {
        if (parms == 0) {
            href += '?';
        } else {
            href += '&';
        }

        href += key + '=' + urlParams[key];
        parms++;
    }

    return href;
};
//fz160324
//return the url for a new blank file(remain "ui" only)
EditorUi.prototype.getBlankUrl = function () {
    var href = window.location.pathname;
    href += '?ui=' + urlParams['ui'];
    return href;
};

/**
 * Specifies if the graph has scrollbars.
 */
EditorUi.prototype.setScrollbars = function (value) {
    var graph = this.editor.graph;
    var prev = graph.container.style.overflow;
    graph.scrollbars = value;
    this.editor.updateGraphComponents();

    if (prev != graph.container.style.overflow) {
        if (graph.container.style.overflow == 'hidden') {
            var t = graph.view.translate;
            graph.view.setTranslate(t.x - graph.container.scrollLeft / graph.view.scale, t.y - graph.container.scrollTop / graph.view.scale);
            graph.container.scrollLeft = 0;
            graph.container.scrollTop = 0;
            graph.minimumGraphSize = null;
            graph.sizeDidChange();
        } else {
            var dx = graph.view.translate.x;
            var dy = graph.view.translate.y;

            graph.view.translate.x = 0;
            graph.view.translate.y = 0;
            graph.sizeDidChange();
            graph.container.scrollLeft -= Math.round(dx * graph.view.scale);
            graph.container.scrollTop -= Math.round(dy * graph.view.scale);
        }
    }

    this.fireEvent(new mxEventObject('scrollbarsChanged'));
};

/**
 * Returns true if the graph has scrollbars.
 */
EditorUi.prototype.hasScrollbars = function () {
    return this.editor.graph.scrollbars;
};

/**
 * Resets the state of the scrollbars.
 */
EditorUi.prototype.resetScrollbars = function () {
    var graph = this.editor.graph;

    if (!this.editor.extendCanvas) {
        graph.container.scrollTop = 0;
        graph.container.scrollLeft = 0;

        if (!mxUtils.hasScrollbars(graph.container)) {
            graph.view.setTranslate(0, 0);
        }
    } else if (!this.editor.chromeless) {
        if (mxUtils.hasScrollbars(graph.container)) {
            if (graph.pageVisible) {
                var pad = graph.getPagePadding();
                graph.container.scrollTop = Math.floor(pad.y - this.editor.initialTopSpacing);
                graph.container.scrollLeft = Math.floor(Math.min(pad.x, (graph.container.scrollWidth - graph.container.clientWidth) / 2));
            } else {
                var bounds = graph.getGraphBounds();
                var width = Math.max(bounds.width, graph.scrollTileSize.width * graph.view.scale);
                var height = Math.max(bounds.height, graph.scrollTileSize.height * graph.view.scale);
                graph.container.scrollTop = Math.floor(Math.max(0, bounds.y - Math.max(20, (graph.container.clientHeight - height) / 4)));
                graph.container.scrollLeft = Math.floor(Math.max(0, bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2)));
            }
        } else {
            // This code is not actively used since the default for scrollbars is always true
            if (graph.pageVisible) {
                var b = graph.view.getBackgroundPageBounds();
                graph.view.setTranslate(Math.floor(Math.max(0, (graph.container.clientWidth - b.width) / 2) - b.x),
                    Math.floor(Math.max(0, (graph.container.clientHeight - b.height) / 2) - b.y));
            } else {
                var bounds = graph.getGraphBounds();
                graph.view.setTranslate(Math.floor(Math.max(0, Math.max(0, (graph.container.clientWidth - bounds.width) / 2) - bounds.x)),
                    Math.floor(Math.max(0, Math.max(20, (graph.container.clientHeight - bounds.height) / 4)) - bounds.y));
            }
        }
    }
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setBackgroundColor = function (value) {
    this.editor.graph.background = value;
    this.editor.updateGraphComponents();

    this.fireEvent(new mxEventObject('backgroundColorChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setFoldingEnabled = function (value) {
    this.editor.graph.foldingEnabled = value;
    this.editor.graph.view.revalidate();

    this.fireEvent(new mxEventObject('foldingEnabledChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageFormat = function (value) {
    this.editor.graph.pageFormat = value;

    if (!this.editor.graph.pageVisible) {
        this.actions.get('pageView').funct();
    } else {
        this.editor.updateGraphComponents();
        this.editor.graph.view.validateBackground();
        this.editor.graph.sizeDidChange();
    }

    this.fireEvent(new mxEventObject('pageFormatChanged'));
};


/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addUndoListener = function () {
    var undo = this.actions.get('undo');
    var redo = this.actions.get('redo');

    var undoMgr = this.editor.undoManager;

    var undoListener = mxUtils.bind(this, function () {
        undo.setEnabled(this.canUndo());
        redo.setEnabled(this.canRedo());
    });

    undoMgr.addListener(mxEvent.ADD, undoListener);
    undoMgr.addListener(mxEvent.UNDO, undoListener);
    undoMgr.addListener(mxEvent.REDO, undoListener);
    undoMgr.addListener(mxEvent.CLEAR, undoListener);

    // Overrides cell editor to update action states
    var cellEditorStartEditing = this.editor.graph.cellEditor.startEditing;

    this.editor.graph.cellEditor.startEditing = function () {
        cellEditorStartEditing.apply(this, arguments);
        undoListener();
    };

    var cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing;

    this.editor.graph.cellEditor.stopEditing = function (cell, trigger) {
        cellEditorStopEditing.apply(this, arguments);
        undoListener();
    };

    // Updates the button states once
    undoListener();
};

/**
 * Updates the states of the given toolbar items based on the selection.
 */
EditorUi.prototype.updateActionStates = function () {
    var graph = this.editor.graph;
    var selected = !graph.isSelectionEmpty();
    var singleSelected = (graph.getSelectionCount() === 1);
    var vertexSelected = false;
    var edgeSelected = false;

    var cells = graph.getSelectionCells();
    //console.log(cells.length);


    if (cells != null) {
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];

            if (graph.getModel().isEdge(cell)) {
                edgeSelected = true;
            }

            if (graph.getModel().isVertex(cell)) {
                vertexSelected = true;
            }

            if (edgeSelected && vertexSelected) {
                break;
            }
        }
    }

    // Updates action states for under the condition of single seclection
    var singleSelectionActions = ['editData', 'editTooltip', 'editStyle', 'editLink','editProperty','editChapterProperty'];
    for (var i = 0; i < singleSelectionActions.length; i++) {
        this.actions.get(singleSelectionActions[i]).setEnabled(singleSelected);
    }

    // Updates action states
    var actions = ['cut', 'copy', 'bold', 'italic', 'underline', 'delete', 'duplicate',
        'backgroundColor', 'borderColor', 'toFront', 'toBack', 'lockUnlock', 'solid', 'dashed',
        'dotted', 'fillColor', 'gradientColor', 'shadow', 'fontColor',
        'formattedText', 'rounded', 'sharp', 'strokeColor'];

    for (var i = 0; i < actions.length; i++) {
        this.actions.get(actions[i]).setEnabled(selected);
    }

    this.actions.get('setAsDefaultStyle').setEnabled(graph.getSelectionCount() == 1);
    this.actions.get('turn').setEnabled(!graph.isSelectionEmpty());
    this.actions.get('curved').setEnabled(edgeSelected);
    this.actions.get('rotation').setEnabled(vertexSelected);
    this.actions.get('wordWrap').setEnabled(vertexSelected);
    this.actions.get('autosize').setEnabled(vertexSelected);
    this.actions.get('collapsible').setEnabled(vertexSelected);
    this.actions.get('group').setEnabled(graph.getSelectionCount() > 1);
    this.actions.get('ungroup').setEnabled(graph.getSelectionCount() == 1 &&
        graph.getModel().getChildCount(graph.getSelectionCell()) > 0);
    var oneVertexSelected = vertexSelected && graph.getSelectionCount() == 1;
    this.actions.get('removeFromGroup').setEnabled(oneVertexSelected &&
        graph.getModel().isVertex(graph.getModel().getParent(graph.getSelectionCell())));

    // Updates menu states
    var menus = ['alignment', 'position', 'spacing', 'writingDirection', 'gradient', 'layout', 'fontFamily', 'fontSize', 'navigation'];

    for (var i = 0; i < menus.length; i++) {
        this.menus.get(menus[i]).setEnabled(selected);
    }

    var state = graph.view.getState(graph.getSelectionCell());

    this.menus.get('align').setEnabled(graph.getSelectionCount() > 1);
    this.menus.get('distribute').setEnabled(graph.getSelectionCount() > 1);
    this.menus.get('connection').setEnabled(edgeSelected);
    this.menus.get('waypoints').setEnabled(edgeSelected);
    this.menus.get('linestart').setEnabled(edgeSelected);
    this.menus.get('lineend').setEnabled(edgeSelected);
    this.menus.get('linewidth').setEnabled(!graph.isSelectionEmpty());
    this.menus.get('direction').setEnabled(vertexSelected || (edgeSelected && state != null && graph.isLoop(state)));
    this.actions.get('home').setEnabled(graph.view.currentRoot != null);
    this.actions.get('exitGroup').setEnabled(graph.view.currentRoot != null);
    this.actions.get('enterGroup').setEnabled(graph.getSelectionCount() == 1 && graph.isValidRoot(graph.getSelectionCell()));
    var foldable = graph.getSelectionCount() == 1 && graph.isCellFoldable(graph.getSelectionCell())
    this.actions.get('expand').setEnabled(foldable);
    this.actions.get('collapse').setEnabled(foldable);
    //this.actions.get('editLink').setEnabled(graph.getSelectionCount() == 1);
    this.actions.get('openLink').setEnabled(graph.getSelectionCount() == 1 &&
        graph.getLinkForCell(graph.getSelectionCell()) != null);
    this.actions.get('guides').setEnabled(graph.isEnabled());
    this.actions.get('grid').setEnabled(graph.isEnabled());
};

/**
 * Refreshes the viewport.
 */
EditorUi.prototype.refresh = function () {
    var quirks = mxClient.IS_IE && (document.documentMode == null || document.documentMode == 5);
    var w = this.container.clientWidth;
    var h = this.container.clientHeight;

    if (this.container == document.body) {
        w = document.body.clientWidth || document.documentElement.clientWidth;
        h = (quirks) ? document.body.clientHeight || document.documentElement.clientHeight : document.documentElement.clientHeight;
    }

    // Workaround for bug on iOS see
    // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
    // FIXME: Fix if footer visible
    var off = 0;

    if (mxClient.IS_IOS && !window.navigator.standalone) {
        if (window.innerHeight != document.documentElement.clientHeight) {
            off = document.documentElement.clientHeight - window.innerHeight;
            window.scrollTo(0, 0);
        }
    }

    if(mxUi === 'task_design'){
        this.hsplitPosition = 100;
    } else if (mxUi === 'subject_design'){
        this.hsplitPosition = 55;
    }
    var effHsplitPosition = Math.max(0, Math.min(this.hsplitPosition, w - this.splitSize - 20));

    var tmp = 0;

    if (this.menubar != null) {
        this.menubarContainer.style.height = this.menubarHeight + 'px';
        tmp += this.menubarHeight;
    }

    if (this.toolbar != null) {
        this.toolbarContainer.style.top = this.menubarHeight + 'px';
        this.toolbarContainer.style.height = this.toolbarHeight + 'px';
        tmp += this.toolbarHeight;
    }

    if (tmp > 0 && !mxClient.IS_QUIRKS) {
        tmp += 1;
    }

    var sidebarFooterHeight = 0;

    if (this.sidebarFooterContainer != null) {
        var bottom = this.footerHeight + off;
        sidebarFooterHeight = Math.max(0, Math.min(h - tmp - bottom, this.sidebarFooterHeight));
        this.sidebarFooterContainer.style.width = effHsplitPosition + 'px';
        this.sidebarFooterContainer.style.height = sidebarFooterHeight + 'px';
        this.sidebarFooterContainer.style.bottom = bottom + 'px';
    }

    var fw = (this.format != null) ? this.formatWidth : 0;
    this.sidebarContainer.style.top =  tmp + 'px';
    this.sidebarContainer.style.width = effHsplitPosition + 'px';
    this.propertyContainer.style.top = tmp + 'px';
    this.propertyContainer.style.width = fw + 'px';
    this.propertyContainer.style.display = (this.format != null) ? '' : 'none';

    this.diagramContainer.style.left = (this.hsplit.parentNode != null) ? ((mxUi==='task_design' || mxUi==='subject_design') ? '10px' : (effHsplitPosition + this.splitSize) + 'px') : '0px';
    this.diagramContainer.style.top = (tmp + ((mxUi==='task_design') ? 10 : 0)) + 'px';
    this.diagramContainer.style.right = (fw + ((mxUi==='task_design') ? 10 : 0)) + 'px';
    this.footerContainer.style.height = this.footerHeight + 'px';
    this.chatDivContainer.style.bottom = this.footerHeight + 'px';
    this.hsplit.style.top = this.sidebarContainer.style.top;
    this.hsplit.style.bottom = (this.footerHeight + off) + 'px';
    this.hsplit.style.left = effHsplitPosition + 'px';

    if (quirks) {
        this.menubarContainer.style.width = w + 'px';
        this.toolbarContainer.style.width = this.menubarContainer.style.width;
        var sidebarHeight = Math.max(0, h - this.footerHeight - this.menubarHeight - this.toolbarHeight);
        this.sidebarContainer.style.height = (sidebarHeight - sidebarFooterHeight) + 'px';
        this.propertyContainer.style.height = sidebarHeight + 'px';
        this.diagramContainer.style.width = (this.hsplit.parentNode != null) ? Math.max(0, w - effHsplitPosition - this.splitSize - fw) + 'px' : w + 'px';
        var diagramHeight = Math.max(0, h - this.footerHeight - this.menubarHeight - this.toolbarHeight);
        this.diagramContainer.style.height = diagramHeight + 'px';
        this.footerContainer.style.width = this.menubarContainer.style.width;
        this.hsplit.style.height = diagramHeight + 'px';
    } else {
        if (this.footerHeight > 0) {
            this.footerContainer.style.bottom = off + 'px';
        }

        this.sidebarContainer.style.bottom = (mxUi==='task_design' || mxUi==='subject_design') ? 'null' : (this.footerHeight + sidebarFooterHeight + off) + 'px';
        this.propertyContainer.style.bottom = (this.footerHeight + off) + 'px';
        this.diagramContainer.style.bottom = (this.footerHeight + off + ((mxUi==='task_design') ? 10 : 0)) + 'px';
    }

    this.editor.graph.sizeDidChange();
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createDivs = function () {
    this.menubarContainer = this.createDiv('geMenubarContainer');
    this.toolbarContainer = this.createDiv('geToolbarContainer');
    this.participantContainer = this.createDiv('geParticipantContainer');
    this.sidebarContainer = this.createDiv('geSidebarContainer');
    this.propertyContainer = this.createDiv('geSidebarContainer');
    this.diagramContainer = this.createDiv('geDiagramContainer');
    this.footerContainer = this.createDiv('geFooterContainer');
    this.chatDivContainer = this.createDiv('geChatDivContainer');
    this.hsplit = this.createDiv('geHsplit');

    // Sets static style for containers
    this.menubarContainer.style.top = '0px';
    this.menubarContainer.style.left = '0px';
    this.menubarContainer.style.right = '0px';
    this.toolbarContainer.style.left = '0px';
    this.toolbarContainer.style.right = '0px';
    this.sidebarContainer.style.left = (mxUi==='subject_design') ? '10px' :'0px';
    this.diagramContainer.style.backgroundColor = (mxUi==='course_design') ? '#FFFFCC' :'';
    this.propertyContainer.style.right = '0px';
    this.diagramContainer.style.right = ((this.format != null) ? this.formatWidth : 0) + 'px';
    this.footerContainer.style.left = '0px';
    this.footerContainer.style.right = '0px';
    this.footerContainer.style.bottom = '0px';
    this.footerContainer.style.zIndex = mxPopupMenu.prototype.zIndex - 2;
    this.hsplit.style.width = (mxUi==='task_design' || mxUi==='subject_design') ? 'null' : this.splitSize + 'px';

    // Only vertical scrollbars, no background in format sidebar
    this.propertyContainer.style.backgroundColor = 'whiteSmoke';
    this.propertyContainer.style.overflowX = 'hidden';
    this.propertyContainer.style.overflowY = 'auto';
    this.propertyContainer.style.fontSize = '12px';
    //fz 11.17---
    this.formatWidth=0;
    this.propertyContainer.style.display =  'none';
    this.refresh();
    //----
    this.sidebarFooterContainer = this.createSidebarFooterContainer();

    if (this.sidebarFooterContainer) {
        this.sidebarFooterContainer.style.left = '0px';
    }
};

/**
 * Hook for sidebar footer container. This implementation returns null.
 */
EditorUi.prototype.createSidebarFooterContainer = function () {
    return null;
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createUi = function () {
    // Creates menubar
    this.menubar = (this.editor.chromeless) ? null : this.menus.createMenubar(this.createDiv('geMenubar'));

    if (this.menubar != null) {
        this.logoContainer = this.createLogoContainer();
        this.menubarContainer.appendChild(this.logoContainer);
        this.menubarContainer.appendChild(this.menubar.container);
        this.menubarContainer.style.display = 'inline-flex';
    }

    // Adds status bar in menubar
    if (this.menubar != null) {
        this.statusContainer = this.createStatusContainer();
        this.menubarRListContainer = this.createMenubarRListContainer();
        this.fileNameContainer = this.createStatusRContainer();
        this.userNameContainer = this.createStatusRContainer();
        this.userNoticeContainer = this.createStatusRContainer();
        this.userNameContainer.innerHTML = userName;
        this.userNoticeContainer.innerHTML = mxResources.get('message');
        this.userNameContainer.style.backgroundColor = '#bce8f1';
        this.userNameContainer.style.color = '#31708f';
        this.userNameContainer.style.height = '18px';
        this.menubarRListContainer.appendChild(this.fileNameContainer);
        this.menubarRListContainer.appendChild(this.userNameContainer);
        this.menubarRListContainer.appendChild(this.userNoticeContainer);
        this.userNoticeContainer.setAttribute('style','color:#FFF;height:18px;background-color:#65B4F2;');
        //add new notice
        this.noticeNum = document.createElement('span');
        this.noticeNum.setAttribute('style','display:none;width: 13px;height: 13px;position: absolute;right: 0px;top: 0px;background-color: red;border-radius: 6.5px;text-align: center;font-size: 10px;color: white;line-height: 15px;');
        this.userNoticeContainer.appendChild(this.noticeNum);

        // Connects the status bar to the editor status
        this.editor.addListener('statusChanged', mxUtils.bind(this, function () {
            this.setStatusText(this.editor.getStatus());
        }));
        // Connects the file name bar to the fileNameContainer
        this.editor.addListener('fileNameChanged', mxUtils.bind(this, function () {
            var fileNameTag;
            if(getUrlParam(window.location.href)['isInstance'] === 'true'){
                fileNameTag = mxResources.get('instance')+':';
            } else if(mxUi === 'task_design') {
                fileNameTag = mxResources.get('typicalWorkTask')+':';
            } else if(mxUi === 'course_design') {
                fileNameTag = mxResources.get('course')+':';
            } else {
                fileNameTag = mxResources.get('courseModel')+':';
            }
            this.setFileNameText(fileNameTag,this.editor.getFilename());
        }));

        this.setStatusText(this.editor.getStatus());
        this.menubar.container.appendChild(this.statusContainer);
        this.menubar.container.appendChild(this.menubarRListContainer);


        // Inserts into DOM
        this.container.appendChild(this.menubarContainer);
    }

    // Creates the format sidebar
    this.format = (this.editor.chromeless || !this.formatEnabled) ? null : this.createFormat(this.propertyContainer);

    if (this.format != null) {
        this.container.appendChild(this.propertyContainer);
    }

    // Creates the footer
    var footer = (this.editor.chromeless) ? null : this.createFooter();

    if (footer != null) {
        this.footerContainer.appendChild(footer);
        //fz 11.25
        this.addChatDiv();
        //-------
        this.container.appendChild(this.footerContainer);
    }

    if (this.sidebar != null && this.sidebarFooterContainer) {
        this.container.appendChild(this.sidebarFooterContainer);
    }
    this.container.appendChild(this.diagramContainer);

    // Creates the sidebar
    this.sidebar = (this.editor.chromeless) ? null : this.createSidebar(this.sidebarContainer);

    if (this.sidebar != null) {
        this.container.appendChild(this.sidebarContainer);
    }
    this.chatDiv = (mxUi==='task_design') ? this.createChatDiv(this.chatDivContainer) : null;
    if(this.chatDiv != null) {
        this.chatDivContainer.style.display = 'none';
        this.container.appendChild(this.chatDivContainer);
    }

    // Creates toolbar
    this.toolbar = (this.editor.chromeless) ? null : this.createToolbar(this.createDiv('geToolbar'));

    if (this.toolbar != null) {
        this.participantContainer.setAttribute('style','height: 30px;float: right;display: inline-flex; padding: 0 5px;');
        /*this.addParticipant(1213,'testUser');
        this.addParticipant(1212,'测试User');*/
        //console.log(userName+'   userId    '+userId);
        this.toolbarContainer.appendChild(this.toolbar.container);
        this.toolbarContainer.appendChild(this.participantContainer);
        this.container.appendChild(this.toolbarContainer);
    }

    // HSplit
    if (this.sidebar != null) {
        this.container.appendChild(this.hsplit);

        this.addSplitHandler(this.hsplit, true, 0, mxUtils.bind(this, function (value) {
            this.hsplitPosition = value;
            this.refresh();
        }));
    }
};
EditorUi.prototype.getNoticeNum = function(){
    return this.noticeNum;
};
EditorUi.prototype.getUserNoticeContainer = function(){
    return this.userNoticeContainer;
};
EditorUi.prototype.addChatDiv = function () {
    var urlParams = getUrlParam(window.location.href);
    if (mxUi === 'task_design' && urlParams['ch']) {
        if (this.footerContainer.childNodes.length < 2){
            var chatBtn = document.createElement('span');
            chatBtn.innerHTML = mxResources.get('discuss', ['  ']);
            chatBtn.setAttribute('style', 'float: right;width: 100px;height: 24px;line-height: 24px;margin: 0 10px;cursor: pointer;text-align: center;border: 1px solid rgb(49, 112, 143);background-color: #BCE8F1;color: rgb(49, 112, 143);font-weight: bold;');
            this.msgNum = document.createElement('span');
            this.msgNum.setAttribute('style','display:none;width: 13px;height: 13px;position: absolute;right: 25px;top: 6px;background-color: red;border-radius: 6.5px;text-align: center;font-size: 10px;color: white;line-height: 15px;');
            chatBtn.appendChild(this.msgNum);
            this.footerContainer.appendChild(chatBtn);
            chatBtn.onclick = mxUtils.bind(this, function () {
                if (this.chatDivContainer.style.display === 'none') {
                    this.chatDivContainer.style.display = 'block';
                    this.msgNum.style.display = 'none';
                } else {
                    this.chatDivContainer.style.display = 'none';
                }
            });
        }
    }
};
EditorUi.prototype.dealMsgRemind = function(num) {
    if(num > 0) {
        this.msgNum.style.display = 'block';
        if(num > 9) {
            this.msgNum.innerHTML = '...';
        } else {
            this.msgNum.innerHTML = num ;
        }
    }
};
EditorUi.prototype.addParticipant = function (id, name) {
    var participantBox = document.createElement('div');
    participantBox.setAttribute('style', 'background: rgb(227, 227, 227);width: 24px;height: 24px;margin: 2px;border: 1px solid rgb(184, 184, 184);line-height: 24px;text-align: center;font-size: 20px;color: #7B7B7B;');
    participantBox.innerHTML = name[0];
    participantBox.title = name;
    participantBox.setAttribute('userId', id);
    this.participantContainer.appendChild(participantBox);
};
EditorUi.prototype.removeParticipant = function (id) {
    var nodes = this.participantContainer.childNodes;
    for(var i = 0;i < nodes.length; i ++ ) {
        if(nodes[i].attributes.userid.nodeValue === id) {
            this.participantContainer.removeChild(nodes[i]);
        }
    }
};
/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createStatusContainer = function () {
    var container = document.createElement('a');
    container.className = 'geItem geStatus';

    return container;
};
EditorUi.prototype.createLogoContainer = function () {
    var container = document.createElement('a');
    container.className = 'logo';
    container.href = 'http://' + loginHost;
    container.title = '回到学做网主页';
    return container;
};
EditorUi.prototype.createMenubarRListContainer = function () {
    var container = document.createElement('div');
    container.className = 'geRightBox';

    return container;
};
EditorUi.prototype.createStatusRContainer = function () {
    var container = document.createElement('a');
    container.className = 'geItem geStatusR';

    return container;
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.setStatusText = function (value) {
    this.statusContainer.innerHTML = value;

};
EditorUi.prototype.setFileNameText = function (fileNameTag,fileName) {
    this.fileNameContainer.innerHTML = fileNameTag + fileName;
    this.fileNameContainer.style.backgroundColor = 'rgb(201, 204, 240)';
    this.fileNameContainer.style.color = 'rgb(93, 96, 168)';
    this.fileNameContainer.style.height = '18px';
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createToolbar = function (container) {
    return new Toolbar(this, container);
};

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createSidebar = function (container) {
    return new Sidebar(this, container);
};

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createFormat = function (container) {
    return new PropertyForm(this, container);
};

/**
 * Creates and returns a new footer.
 */
EditorUi.prototype.createFooter = function () {
    return this.createDiv('geFooter');
};

EditorUi.prototype.createChatDiv = function (container) {
    return new ChatBox(this, container);
};
/**
 * Creates the actual toolbar for the toolbar container.
 */
EditorUi.prototype.createDiv = function (classname) {
    var elt = document.createElement('div');
    elt.className = classname;

    return elt;
};

/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addSplitHandler = function (elt, horizontal, dx, onChange) {
    var start = null;
    var initial = null;
    var ignoreClick = true;
    var last = null;

    // Disables built-in pan and zoom in IE10 and later
    if (mxClient.IS_POINTER) {
        elt.style.msTouchAction = 'none';
    }

    var getValue = mxUtils.bind(this, function () {
        var result = parseInt(((horizontal) ? elt.style.left : elt.style.bottom));

        // Takes into account hidden footer
        if (!horizontal) {
            result = result + dx - this.footerHeight;
        }

        return result;
    });

    function moveHandler(evt) {
        if (start != null) {
            var pt = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
            onChange(Math.max(0, initial + ((horizontal) ? (pt.x - start.x) : (start.y - pt.y)) - dx));

            if (initial != getValue()) {
                ignoreClick = true;
                last = null;
            }
        }
    };

    function dropHandler(evt) {
        moveHandler(evt);
        initial = null;
        start = null;
    };

    mxEvent.addGestureListeners(elt, function (evt) {
        start = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
        initial = getValue();
        ignoreClick = false;
        mxEvent.consume(evt);
    });

    mxEvent.addListener(elt, 'click', function (evt) {
        if (!ignoreClick) {
            var next = (last != null) ? last - dx : 0;
            last = getValue();
            onChange(next);
        }
    });

    mxEvent.addGestureListeners(document, null, moveHandler, dropHandler);
};

/**
 * Displays a print dialog.
 */
EditorUi.prototype.showDialog = function (dialogBody, w, h, modal, closable, onClose) {
    this.editor.graph.tooltipHandler.hideTooltip();
    if (dialogBody && dialogBody.isTipsDlg){
        if (this.tipsDialogs == null) {
            this.tipsDialogs = [];
        }
        this.tipsDialog = new Dialog(this, dialogBody, w, h, modal, dialogBody.closable, onClose);
        this.tipsDialogs.push(this.tipsDialog);
    } else {
        if (this.dialogs == null) {
            this.dialogs = [];
        }
        this.dialog = new Dialog(this, dialogBody, w, h, modal, closable, onClose);
        this.dialogs.push(this.dialog);
    }
};


/**
 * Displays a print dialog.
 */
EditorUi.prototype.hideDialog = function (isTipsDlg) {
    if (isTipsDlg===true){
        if (this.tipsDialogs && this.tipsDialogs.length){
            var dlg = this.tipsDialogs.pop();
            dlg.close();
        }
    } else {
        if (this.dialogs != null && this.dialogs.length > 0) {
            var dlg = this.dialogs.pop();

            if (dlg.getDialogBody().isNeedReloadApp) {
                this.handleNonExistGraph();
            }

            dlg.close();


            this.dialog = (this.dialogs.length > 0) ? this.dialogs[this.dialogs.length - 1] : null;

            if (this.dialog == null && this.editor.graph.container.style.visibility != 'hidden' && !this.tipsDialog) {
                this.editor.graph.container.focus();
            }

            this.editor.fireEvent(new mxEventObject('hideDialog'));
        }
    }
};

/**
 * Display a color dialog.
 */
EditorUi.prototype.pickColor = function (color, apply) {
    var graph = this.editor.graph;
    var selState = graph.cellEditor.saveSelection();

    var dlg = new ColorDialog(this, color || 'none', function (color) {
        graph.cellEditor.restoreSelection(selState);
        apply(color);
    }, function () {
        graph.cellEditor.restoreSelection(selState);
    });
    this.showDialog(dlg, 220, 400, true, false);
    dlg.init();
};

/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.showAllFiles = function (processId, isOpenNewWindow, graph, lockType,mxUi,callback) {
    var title;
    if (processId) {
        title = mxResources.get('instanceManager');
    } else {
        title = mxResources.get('fileManager');
    }
    //var allFileDialogBody = new FileManagerDialogBody(this, title, processId, isOpenNewWindow, graph);
    //fz 文件公共管理
    var allFileDialogBody = new FileManagerDialogBodyPro(this, title, processId, isOpenNewWindow, graph,  lockType,mxUi,callback);
    //this.isTrashSelected
    //new FileManagerDialogBody(this, title);

    this.showDialog(allFileDialogBody, 800, null, true, true, function () {

    });
};
/**
 * cautions: you must check whether your callback function's parameter is exsit
 */
EditorUi.prototype.showAllLearningResource = function (processId, isOpenNewWindow, graph, isCloseRichEditor, lockType, callback) {

    var title = mxResources.get(processId);
    //var allFileDialogBody = new LearningResourceDialogBody(this, title, processId, isOpenNewWindow, graph,callback);
    // fz 文件公共管理
    var allFileDialogBody = new FileManagerDialogBodyPro(this, title, processId, isOpenNewWindow, graph, lockType,mxUi,callback);

    allFileDialogBody.isCloseRichEditor = isCloseRichEditor;
    this.showDialog(allFileDialogBody, 800, null, true, true, function () {
    });
};

EditorUi.prototype.showAllRichTextsModel = function (processId, isOpenNewWindow, graph, lockType ,callback) {

    var title = mxResources.get(processId);
    //var allFileDialogBody = new LearningResourceDialogBody(this, title, processId, isOpenNewWindow, graph,function(data){
    //fz 文件公共管理
    var allFileDialogBody = new FileManagerDialogBodyPro(this, title, processId, isOpenNewWindow, graph, lockType,mxUi,callback);
    this.showDialog(allFileDialogBody, 800, null, true, true, function () {

    });
};
/**
 * cautions: you must check whether your callback function's parameter is exsit
 */
EditorUi.prototype.editLearningResource = function (processId, isOpenNewWindow, graph,usageType, callback) {
    var title = mxResources.get(processId);
    var cell = {
        value: 'to edit...'
    };
    var editLRPropertyDialogBody = new EditLRPropertyDialogBody(this, cell, title, usageType, function (resData) {
        if(callback) {
            if(resData) {
                callback(resData);
            } else {
                callback();
            }
        }
    });
    this.showDialog(editLRPropertyDialogBody, 700, null, true, true);

    if(usageType && usageType.trim() == 'richText'){
        var radioDOM = document.getElementsByName('editType');
        radioDOM[0].disabled = 'disabled';
        radioDOM[1].checked = 'checked';
    }

};

EditorUi.prototype.showLearningResource = function (fileEntity) {
    var showPath;
    if (fileEntity.filePath) {
        showPath = fileEntity.filePath;
    }else if (fileEntity.transformF) {
        showPath = fileEntity.transformF;
    }else {
        showPath = fileEntity.sourceF;
    }
    var ownerId = fileEntity.ownerId;
    var LRShowDialogBody = new LRShowDialogBody(this, fileEntity.fileName, fileEntity.materialsId, showPath,fileEntity.fileType, ownerId);

    this.showDialog(LRShowDialogBody, 870, null, true, true);

};

EditorUi.prototype.editVideo = function (fE, next) {
    var editVideoDialogBody = new EditVideoDialogBody(this,fE ,function (resData) {
            next(resData);
    });
    this.showDialog(editVideoDialogBody, 800, -1, true, true);

};
/**
 * Extracs the graph model from the given HTML data from a data transfer event.
 */
EditorUi.prototype.extractGraphModelFromHtml = function (data) {
    var result = null;

    try {
        var idx = data.indexOf('&lt;mxGraphModel ');

        if (idx >= 0) {
            var idx2 = data.lastIndexOf('&lt;/mxGraphModel&gt;');

            if (idx2 > idx) {
                result = data.substring(idx, idx2 + 21).replace(/&gt;/g, '>').
                    replace(/&lt;/g, '<').replace(/\n/g, '');
            }
        }
    }
    catch (e) {
        // ignore
    }

    return result;
};

/**
 * Returns true if the given string contains a compatible graph model.
 */
EditorUi.prototype.isCompatibleString = function (data) {
    return data.substring(0, 13) == '<mxGraphModel';
};

/**
 * Opens the given files in the editor.
 */
EditorUi.prototype.extractGraphModelFromEvent = function (evt) {
    var result = null;
    var data = null;

    if (evt != null) {
        var provider = (evt.dataTransfer != null) ? evt.dataTransfer : evt.clipboardData;

        if (provider != null) {
            if (document.documentMode == 10 || document.documentMode == 11) {
                data = provider.getData('Text');
            } else {
                data = (mxUtils.indexOf(provider.types, 'text/html') >= 0) ? provider.getData('text/html') : null;

                if (mxUtils.indexOf(provider.types, 'text/plain' && (data == null || data.length == 0))) {
                    data = provider.getData('text/plain');
                }
            }

            if (data != null) {
                data = this.editor.graph.zapGremlins(mxUtils.trim(data));

                // Tries parsing as HTML document with embedded XML
                var xml = this.extractGraphModelFromHtml(data);

                if (xml != null) {
                    data = xml;
                }
            }
        }
    }

    if (data != null && this.isCompatibleString(data)) {
        result = data;
    }

    return result;
};

EditorUi.prototype.removeModelFile = function (message, queryObj, resHandler) {
    var confirmDialog = new confirmDialogBody(this, message, queryObj, mxUtils.bind(this, function () {
        this.communication.removeFileCmc(queryObj, mxUtils.bind(this, function (resData) {
            resHandler();
        }));
    }));
    this.showDialog(confirmDialog, 300, null, true, true);
};

EditorUi.prototype.removeAllModelFile = function (message, fileEntityBoxList, resHandler) {
    var fileEntities = [];
    for (var i = 0; i < fileEntityBoxList.length; i++) {
        fileEntities[i] ={
            isInstance : fileEntityBoxList[i].getFileEntity().isInstance,
            gFileId : fileEntityBoxList[i].getFileEntity().gFileId
        }
    }
    var confirmDialog = new confirmDialogBody(this, message, fileEntities, mxUtils.bind(this, function (fileEntities) {
        this.communication.removeAllFileCmc(fileEntities, mxUtils.bind(this, function () {
            resHandler(fileEntities);
        }));
    }));
    this.showDialog(confirmDialog, 300, null, true, true);
};

EditorUi.prototype.trashModelFile = function (message, fileEntity, resHandler) {
    var confirmDialog = new confirmDialogBody(this, message, fileEntity, mxUtils.bind(this, function (fileEntity) {
        this.communication.trashFileCmc(fileEntity, mxUtils.bind(this, function () {
            resHandler(fileEntity);
        }));
    }));
    this.showDialog(confirmDialog, 300, null, true, true);
};

EditorUi.prototype.trashAllModelFile = function (message, fileEntityBoxList, resHandler) {
    var confirmDialog = new confirmDialogBody(this, message, fileEntityBoxList, mxUtils.bind(this, function (fileEntityBoxList) {
        var fileEntities = [];
        for (var i = 0; i < fileEntityBoxList.length; i++) {
            fileEntities[i] ={
                isInstance : fileEntityBoxList[i].getFileEntity().isInstance,
                gFileId : fileEntityBoxList[i].getFileEntity().gFileId
            }
        }
        // todo fileEntities = [] <- for iterate fileEntityBoxList[i].getFileEntity()
        this.communication.trashAllFileCmc(fileEntities, mxUtils.bind(this, function () {
            resHandler(fileEntities);
        }));
    }));
    this.showDialog(confirmDialog, 300, null, true, true);
};

EditorUi.prototype.restoreAllModelFile = function (fileEntityBoxList, resHandler) {
    var fileEntities = [];
    for (var i = 0; i < fileEntityBoxList.length; i++) {
        fileEntities[i] ={
            isInstance : fileEntityBoxList[i].getFileEntity().isInstance,
            gFileId : fileEntityBoxList[i].getFileEntity().gFileId
        }
    }
    this.communication.restoreAllFileCmc(fileEntities, mxUtils.bind(this, function () {
        resHandler(fileEntities);
    }));
};

EditorUi.prototype.trashToNormal = function (fileEntity, resHandler) {

    this.communication.trashToNormalCmc(fileEntity, mxUtils.bind(this, function () {
        resHandler(fileEntity);
    }));
};

EditorUi.prototype.deleteLR = function (message, fileEntity, resHandler) {
    var query = {materialsId: fileEntity.materialsId};
    var confirmDialog = new confirmDialogBody(this, message, query, mxUtils.bind(this, function (fileEntity) {
        var paramObj = {
            userId: fileEntity.ownerId,
            fileId: fileEntity.materialsId,
            createType: fileEntity.createType
        }
        this.communication.deleteLR(paramObj, mxUtils.bind(this, function () {
            resHandler(fileEntity);
        }));
    }));
    this.showDialog(confirmDialog, 300, null, true, true);
};
EditorUi.prototype.renameLR = function (fileEntity, resHandler) {
    console.log(fileEntity);
    var filenameDialogBody = new FilenameDialogBody2(this, fileEntity.fileName, mxResources.get('change'), mxUtils.bind(this, function (filename, resHandlerOfDialog) {
        var pattern = /^[ ]+$/gi;
        if (filename && !pattern.test(filename)) {
            var string = filename;
            filename = string.trim();
            fileEntity.fileName = filename;
            var updateObj = {
                "materialsId": fileEntity.materialsId,
                "fileName": filename
            };
            this.communication.renameLR(updateObj, mxUtils.bind(this, function (resData) {
                if (resData.ok > 0) {
                    resHandler(fileEntity);
                    resHandlerOfDialog(true);
                } else {
                    var message = mxResources.get('fileExists');
                    var tipDialog = new tipDialogBody(this,message);
                    this.showDialog(tipDialog, 300, null, true, true);
                }

            }));
        } else {
            //alert(mxResources.get('invalidName'));
            this.showDialog(new tipDialogBody(this, mxResources.get('invalidName')), 300, null, true, true);
        }
    }), mxResources.get('renameFile'));
    this.showDialog(filenameDialogBody, 300, null, true, true);
    filenameDialogBody.init();
};

EditorUi.prototype.delAllResFiles = function(message,fileEntityBoxList,resHandler) {
    var confirmDialog = new confirmDialogBody(this,message,fileEntityBoxList,mxUtils.bind(this,function(fileEntityBoxList) {
        var fileEntities = [];
        for(var i = 0;i<fileEntityBoxList.length;i ++) {
            fileEntities[i] = {
                materialsId: fileEntityBoxList[i].getFileEntity().materialsId
            };
        }
        this.communication.delAllResFileCmc(fileEntities,mxUtils.bind(this,function() {
            resHandler(fileEntities);
        }));
    }));
    this.showDialog(confirmDialog, 300, null, true, true);
};

/**
 * renameFile by Eamonn
 * @param message
 * @param fileEntity
 */

EditorUi.prototype.renameModelFile = function (fileEntity, resHandler) {
    console.log(fileEntity);
    var filenameDialogBody = new FilenameDialogBody2(this, fileEntity.fileName, mxResources.get('change'), mxUtils.bind(this, function (filename, resHandlerOfDialog) {
        var pattern = /^[ ]+$/gi;
        if (filename && !pattern.test(filename)) {
            var string = filename;
            filename = string.trim();

            fileEntity.fileName = filename;
            //console.log('jishia dsahidsa =='+filename);

            this.communication.renameFileCmc(fileEntity, mxUtils.bind(this, function (message) {
                if (message.success) {
                    //console.log('rename success');
                    resHandler(fileEntity);
                    resHandlerOfDialog(true);
                } else {
                    //console.log('file exist');
                    //mxUtils.confirm(mxResources.get('fileExists'));
                    var message = mxResources.get('fileExists');
                    var tipDialog = new tipDialogBody(this,message);
                    this.showDialog(tipDialog, 300, null, true, true);
                }

            }));
        } else {
            //alert(mxResources.get('invalidName'));
            this.showDialog(new tipDialogBody(this, mxResources.get('invalidName')), 300, null, true, true);
        }
    }), mxResources.get('renameFile'));
    this.showDialog(filenameDialogBody, 300, null, true, true);
    filenameDialogBody.init();
};
//EditorUi.prototype.timeRangeModeFile = function(){
//    var timeRangeDialogBody = new TimeRangeDialogBody(this,function(){
//
//    })
//    this.showDialog(timeRangeDialogBody,300, null, true, true);
//}

//eamonn
EditorUi.prototype.createOrEditRichTextsModel = function(callback){
    var cell = {
        value : 'Edit Form'
    };
    var editRichTextareaModelDialogBody = new EditRichTextareaModelDialogBody(this,cell,mxResources.get('createOrEditRichTextsModel'),mxUtils.bind(this,function(richTextData){
        var richTextModel = {};
        //console.log(modelType);
        //console.log(textValue);
        if(richTextData === undefined || richTextData === null){
            callback();
        }
        if(richTextData.modelType === 'form'){

            richTextModel.typeId=1;
        }else{
            richTextModel.typeId=99;
        }
        richTextModel.textContent=richTextData.textValue;
        richTextModel.name=richTextData.nameValue;
        richTextModel.description=richTextData.descValue;
        richTextModel.isSaveNew=richTextData.isSaveNew;
        richTextModel.id=richTextData.id;

        console.log(richTextModel);
        this.communication.saveRichTextareaModel(richTextModel,mxUtils.bind(this,function(){
            callback();
        }));
    }));
    this.showDialog(editRichTextareaModelDialogBody,850, null, true, true);
};

EditorUi.prototype.loadEditRichTextsModel = function(queryObj,callback){
    //var cell = {
    //    value : queryObj.textContent
    //};
    this.communication.loadRichTextsModel(queryObj,mxUtils.bind(this,function(richTextData){
        console.log(richTextData);
        var richTextModel = richTextData;
        richTextModel.value = richTextData.textContent;
        var editRichTextareaModelDialogBody = new EditRichTextareaModelDialogBody(this,richTextModel,mxResources.get('createOrEditRichTextsModel'),mxUtils.bind(this,function(richTextData){
            var richTextModel = {};
            console.log(richTextData);
            //console.log(textValue);
            if(richTextData === undefined || richTextData === null){
                callback();
            }
            if(richTextData.modelType === 'form'){

                richTextModel.typeId=1;
            }else{
                richTextModel.typeId=99;
            }
            richTextModel.textContent=richTextData.textValue;
            richTextModel.name=richTextData.nameValue;
            richTextModel.description=richTextData.descValue;
            richTextModel.isSaveNew=richTextData.isSaveNew;
            richTextModel.id=richTextData.id;

            console.log(richTextModel);
            this.communication.saveRichTextareaModel(richTextModel,mxUtils.bind(this,function(richTextData){
                callback(richTextData);
            }));
        }));
        this.showDialog(editRichTextareaModelDialogBody,850, null, true, true);
    }));


};

/**
 * Adds the label menu items to the given menu and parent.
 */
// name changed: saveFile to saveModelFile
EditorUi.prototype.saveModelFile = function (forceDialog, next) {
    var queryObj = appUtils.convertQueryStrToJSON();
    var mxUi = queryObj.ui;
    var isSaveNewFile = true;
    var paramObj = {};
    var xml = mxUtils.getXml(this.editor.getGraphXml());

    if (this.editor.graph.isEditing()) {
        this.editor.graph.stopEditing();
    }
    if (!forceDialog && this.editor.filename != null) {
        //update course
        //this.save(this.editor.getOrCreateFilename());
        isSaveNewFile = false;
        paramObj.isSaveNewFile = isSaveNewFile;
        paramObj.fileName = this.editor.getOrCreateFilename();
        paramObj.gFileId = this.editor.getFileId();
        paramObj.xml = xml;
        paramObj.fileType = mxUi;
        if(mxUi === 'task_design' && urlParams['ch']){
            var chatBox = this.chatDiv;
            var chatInfo = chatBox.getChatInfo();
            if(chatInfo){
                paramObj.chatHistory = JSON.stringify(chatInfo);
            }
        }
        if(mxUi === 'course_design'){
            paramObj.courseType = 'situation';
            this.communication.persistCourse(paramObj, mxUtils.bind(this, function (resMessage) {
                console.log(resMessage.msg);
                this.editor.setModified(false);
            }));
        } else {
            this.communication.persistModelFile(paramObj, mxUtils.bind(this, function (resMessage) {
                console.log(resMessage.msg);
                //console.log(paramObj);
                this.editor.setModified(false);
            }));
        }
    } else {
        isSaveNewFile = true;
        var filenameDialogBody = new FilenameDialogBody(this,mxResources.get('create'), true,null,mxUtils.bind(this, function (obj) {
            if (obj) {
                paramObj.isSaveNewFile = isSaveNewFile;
                paramObj.fileName = obj.fileName;
                paramObj.fileIcon = obj.fileIcon;
                paramObj.categoryId = obj.categoryId;
                paramObj.fileDesc = obj.fileDesc;
                paramObj.briefDes = obj.briefDes;
                paramObj.courseType = 'situation';
                //paramObj.isSingleSupported = obj.isSingleSupported;
                if(obj.boardId){
                    paramObj.boardId = obj.boardId;
                }
                if(obj.chatInfo){
                    paramObj.chatHistory = JSON.stringify(obj.chatInfo);
                }
                // Modify program in order to handle the case of gFileId==[''|null|undefined].
                if (forceDialog) {
                    this.editor.setFileId(null);
                }
                paramObj.gFileId = this.editor.getFileId();
                paramObj.xml = xml;
                if(this.editor.getFileType() === 'ople_design'){
                    paramObj.fileType = 'ople_design';
                }else if(this.editor.getFileType() === 'ople2_design'){
                    paramObj.fileType = 'ople2_design';
                }else{
                    paramObj.fileType = mxUi;
                }
                if (mxUi === 'course_design'){
                    this.communication.persistCourse(paramObj, mxUtils.bind(this, function (resMessage) {
                        console.log(resMessage.data);
                        if (resMessage.success){
                            this.hideDialog();
                            this.editor.setFilename(paramObj.fileName);
                            this.editor.setFileId(resMessage.data.gFileId);
                            this.editor.setFileType(resMessage.data.fileType);
                            this.editor.setModified(false);
                            this.editor.updateDocumentTitle();
                            if (next) {
                                next(resMessage.data);
                            }
                        } else {
                            this.editor.setStatus('Error saving file');
                        }
                    }));
                }else {
                    this.communication.persistModelFile(paramObj, mxUtils.bind(this, function (resMessage) {
                        console.log(resMessage.data);
                        if (resMessage.success === false) {
                            this.editor.setStatus('Error saving file');
                        } else if (resMessage.msg === 'exist') {
                            //mxUtils.confirm(mxResources.get('fileExists'));
                            var message = mxResources.get('fileExists');
                            var tipDialog = new tipDialogBody(this,message);
                            this.showDialog(tipDialog, 300, null, true, true);
                        } else {
                            this.hideDialog();
                            this.editor.setFilename(paramObj.fileName);
                            this.editor.setFileId(resMessage.data.gFileId);
                            this.editor.setFileType(resMessage.data.fileType);
                            if (resMessage.data.taskFileId) {
                                this.editor.setLinkTaskFileId(resMessage.data.taskFileId);
                            }
                            this.editor.setModified(false);
                            this.editor.updateDocumentTitle();
                            if (next) {
                                next(resMessage.data);
                            }
                        }
                    }));
                }
            } else {
                if (next) {
                    next();
                }
            }
        }));
        this.showDialog(filenameDialogBody, 700, null, true, false);
        filenameDialogBody.init();
    }
};
EditorUi.prototype.createSubCourse = function (next) {
    var filenameDialogBody = new FilenameDialogBody(this,mxResources.get('new'),true, null, mxUtils.bind(this, function(obj) {
        if (obj){
            var valueObj = {};
            valueObj.isUpdateFile = false;
            valueObj.name = obj.fileName;
            valueObj.parentId = this.editor.getFileId();
            valueObj.detailDes = obj.fileDesc;
            valueObj.courseType = 'situation';
            valueObj.fileIcon = obj.fileIcon;
            valueObj.isCooperation = false;
            valueObj.groupRange = obj.groupRange;
            valueObj.rolePool = JSON.stringify(this.getRolePool(true));
            valueObj.xml = editor.initXml;
            //console.log(valueObj);
            this.communication.persistSubCourse(valueObj, mxUtils.bind(this, function (resData) {
                if (resData){
                    //create new
                    var urlQueryObj = appUtils.convertQueryStrToJSON();
                    urlQueryObj.instanceId = resData.id;
                    urlQueryObj.isInstance = true;
                    History.ecDoRetrieveGraphModel = false;
                    History.pushState(urlQueryObj, this.communication.apis.retrieveGraphModel, appUtils. convertJSONToQueryStr(urlQueryObj, '?'));
                    this.hideDialog();
                    this.editor.setModified(false);
                    this.editor.setFilename(resData.name);
                    this.editor.setFileId(resData.id);
                    this.editor.setProcessId(resData.parentId);
                    this.editor.setFileType(mxUi);
                    this.editor.updateDocumentTitle();
                    if (next) {
                        next(resData);
                    }
                } else {
                    this.editor.setStatus('Error saving file');
                    next();
                }

            }));
        }
    }));
    this.showDialog(filenameDialogBody, 700, null, true, false);
}
EditorUi.prototype.updateInstance = function () {
    var paramObj = {};
    var xml = mxUtils.getXml(this.editor.getGraphXml());

    if (this.editor.graph.isEditing()) {
        this.editor.graph.stopEditing();
    }
    paramObj.fileId = this.editor.getFileId();
    paramObj.xml = xml;
    paramObj.rolePool = JSON.stringify(this.getRolePool());
    paramObj.isUpdateFile = true;
    this.communication.persistSubCourse(paramObj, mxUtils.bind(this, function (resData) {
        this.editor.setModified(false);
    }));

};
/**
 * Enable linking existing files or creating a new one when editing child process
 */
EditorUi.prototype.editSubProcess = function (graph) {
    var subProcessId = graph.getAttribute('subProcessId');
    if (subProcessId && subProcessId !== 'null') {
        //open the subprocess directly
        var queryObj = {};
        queryObj.ui = 'process_design';
        queryObj.instanceId = subProcessId;
        queryObj.isInstance = true;
        window.open(appUtils.convertJSONToQueryStr(queryObj, true));
    }
    else {
        var subprocessDialogBody = new SubProcessDialogBody(this, mxUtils.bind(this, function (subProHandler) {
            if (subProHandler === 'reuse') {
                //choose
                var isOpenNewWindow = true;
                this.showAllFiles(false, isOpenNewWindow, graph,'00100','process_design', function (fileData) {
                    if (fileData){
                        graph.setAttribute('subProcessId', fileData.gFileId);
                        this.editorUi.hideDialog();
                        this.editorUi.editor.setModified(true);
                        var queryObj = {};
                        queryObj.ui = 'process_design';
                        queryObj.instanceId = fileData.gFileId;
                        queryObj.isInstance = true;
                        window.open(appUtils.convertJSONToQueryStr(queryObj, true));
                    }
                });
                //this.editor.setModified(true);
            } else if (subProHandler === 'create') {
                //create a subprocess
                var fileName = this.editor.getFilename() + '_' + graph.getAttribute('label');
                var fileObj = {
                    fileType : 'process_design',
                    fileName : fileName
                };
                var filenameDialogBody = new FilenameDialogBody(this,mxResources.get('new'),true, fileObj, mxUtils.bind(this, function(obj) {
                    if (obj){
                        var valueObj = {};
                        valueObj.isUpdateFile = false;
                        valueObj.name = obj.fileName;
                        valueObj.parentId = this.editor.getFileId();
                        valueObj.detailDes = obj.fileDesc;
                        valueObj.courseType = 'situation';
                        valueObj.fileIcon = obj.fileIcon;
                        valueObj.isCooperation = false;
                        valueObj.groupRange = obj.groupRange;
                        valueObj.xml = editor.initXml;
                        valueObj.rolePool = JSON.stringify(this.getRolePool(true));
                        //console.log(valueObj);
                        this.communication.persistSubCourse(valueObj, mxUtils.bind(this, function (resData) {
                            //console.log(resData);
                            this.hideDialog();
                            graph.setAttribute('subProcessId', resData.id);
                            this.editor.setModified(true);
                            var queryObj = {};
                            queryObj.ui = 'process_design';
                            queryObj.instanceId = resData.id;
                            queryObj.isInstance = true;
                            window.open(appUtils.convertJSONToQueryStr(queryObj, true));
                        }));
                    }
                }));
                this.showDialog(filenameDialogBody, 700, null, true, false);
            } else if (subProHandler === 'copy'){
                var isOpenNewWindow = true;
                this.showAllFiles(false, isOpenNewWindow, graph,'00100','process_design', mxUtils.bind(this, function (fileData) {
                    if (fileData){
                        var fileType = 'process_design';
                        var fileName = this.editor.getFilename() + '_' + graph.getAttribute('label');
                        var fileObj = {
                            fileType : fileType,
                            fileName : fileName
                        };
                        var filenameDialogBody = new FilenameDialogBody(this,mxResources.get('new'),true, fileObj, mxUtils.bind(this, function(obj) {
                            if (obj){
                                var valueObj = {};
                                valueObj.isUpdateFile = false;
                                valueObj.name = obj.fileName;
                                valueObj.parentId = this.editor.getFileId();
                                valueObj.detailDes = obj.fileDesc;
                                valueObj.courseType = 'situation';
                                valueObj.fileIcon = obj.fileIcon;
                                valueObj.groupRange = obj.groupRange;
                                valueObj.xmlId = fileData.gFileId;
                                //console.log(valueObj);
                                this.communication.persistSubCourse(valueObj, mxUtils.bind(this, function (resData) {
                                    //console.log(resData);
                                    //close both 'create file dialog' and 'choose file dialog'
                                    this.hideDialog();
                                    this.hideDialog();
                                    graph.setAttribute('subProcessId', resData.id);
                                    this.editor.setModified(true);
                                    var queryObj = {};
                                    queryObj.ui = 'process_design';
                                    queryObj.instanceId = resData.id;
                                    queryObj.isInstance = true;
                                    window.open(appUtils.convertJSONToQueryStr(queryObj, true));
                                }));
                            }
                        }));
                        this.showDialog(filenameDialogBody, 700, null, true, false);
                    }
                }))
            }
        }));
        this.showDialog(subprocessDialogBody, 300, null, true, true);
    }
};

/**
 * separate the child process
 */
EditorUi.prototype.separateSubProcess = function (graph) {
    //todo fz
    var subProcessId = graph.getAttribute('subProcessId');
    this.showDialog(new confirmDialogBody(this, mxResources.get('sureToSeparate'), subProcessId, function () {
        graph.removeAttribute('subProcessId');
        this.editor.setModified(true);
    }), 300, null, true, true);
};

///**
// * Saves the current graph under the given filename.
// */
//EditorUi.prototype.save = function (name) {
//    if (name != null) {
//        if (this.editor.graph.isEditing()) {
//            this.editor.graph.stopEditing();
//        }
//
//        var xml = mxUtils.getXml(this.editor.getGraphXml());
//
//        try {
//            if (useLocalStorage) {
//                if (localStorage.getItem(name) != null && !mxUtils.confirm(mxResources.get('replace', [name]))) {
//                    return;
//                }
//
//                localStorage.setItem(name, xml);
//                this.editor.setStatus(mxResources.get('saved') + ' ' + new Date());
//            }
//            else {
//                if (xml.length < MAX_REQUEST_SIZE) {
//                    xml = encodeURIComponent(xml);
//                    //name = encodeURIComponent(name);
//                    //new mxXmlRequest(SAVE_URL, 'filename=' + name + '&xml=' + xml).simulate(document, '_blank');
//                    //++
//                    new mxXmlRequest(SAVE_URL, 'filename=' + name + '&xml=' + xml, 'POST', true).send(function (req) {
//                        console.log(req.request.response);
//                    });
//                }
//                else {
//                    mxUtils.alert(mxResources.get('drawingTooLarge'));
//                    mxUtils.popup(xml);
//
//                    return;
//                }
//            }
//
//            this.editor.setModified(false);
//            this.editor.setFilename(name);
//            this.updateDocumentTitle();
//        }
//        catch (e) {
//            this.editor.setStatus('Error saving file');
//        }
//    }
//};

/**
 * Executes the given layout.
 */
EditorUi.prototype.executeLayout = function (exec, animate, post) {
    var graph = this.editor.graph;

    if (graph.isEnabled()) {
        graph.getModel().beginUpdate();
        try {
            exec();
        }
        catch (e) {
            throw e;
        }
        finally {
            // Animates the changes in the graph model except
            // for Camino, where animation is too slow
            if (this.allowAnimation && animate && navigator.userAgent.indexOf('Camino') < 0) {
                // New API for animating graph layout results asynchronously
                var morph = new mxMorphing(graph);
                morph.addListener(mxEvent.DONE, mxUtils.bind(this, function () {
                    graph.getModel().endUpdate();

                    if (post != null) {
                        post();
                    }
                }));

                morph.startAnimation();
            } else {
                graph.getModel().endUpdate();
            }
        }
    }
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showImageDialog = function (title, value, fn, ignoreExisting) {
    var cellEditor = this.editor.graph.cellEditor;
    var selState = cellEditor.saveSelection();
    var newValue = mxUtils.prompt(title, value);
    cellEditor.restoreSelection(selState);

    if (newValue != null && newValue.length > 0) {
        var img = new Image();
        var me = this;
        img.onload = function () {
            fn(newValue, img.width, img.height);
        };
        img.onerror = function () {
            fn(null);
            //mxUtils.alert(mxResources.get('fileNotFound'));
            me.showDialog(new tipDialogBody(me, mxResources.get('fileNotFound')), 300, null, true, true);
        };

        img.src = newValue;
    } else {
        fn(null);
    }
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showLinkDialog = function (value, btnLabel, fn) {
    var dlg = new LinkDialog(this, value, btnLabel, fn);
    this.showDialog(dlg, 320, 90, true, true);
    dlg.init();
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.confirm = function (msg, okFn, cancelFn) {
    if (mxUtils.confirm(msg)) {
        if (okFn != null) {
            okFn();
        }
    } else if (cancelFn != null) {
        cancelFn();
    }
};
EditorUi.prototype.handleNonExistGraph = function () {
    // chenwenyan
    // promote a message dialog with one 'OK' button only, after clicking 'OK' the dialog
    // execute the following code. The message in the window is:
    // "Current graph doesn't exist anymore."
    // DONOT use "alert()"

    var msg = mxResources.get('currentGraphDoesNotExistAnymore');
    //var msg = "Current graph doesn't exist anymore.";
    var okDialog = new okDialogBody(this, msg);
    this.showDialog(okDialog, 300, null, true, true);
};
EditorUi.prototype.startEndAutoSave = function () {
    if (this.editor.autosave) {
        this.editor.autoSaveTask = window.setInterval(mxUtils.bind(this, function () {
            // todo
            if (this.editor.modified && this.editor.fileId) {
                var urlParams = getUrlParam(window.location.href);
                if (urlParams['isInstance'] && urlParams['isInstance']=='true') {
                    this.updateInstance();
                } else {
                    this.saveModelFile(false);
                }
                console.log(new Date());
            }
        }), 2000)
    } else {
        if (this.editor.autoSaveTask) {
            window.clearInterval(this.editor.autoSaveTask);
        }
    }
};
/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createOutline = function (wnd) {
    var outline = new mxOutline(this.editor.graph);
    outline.border = 20;

    mxEvent.addListener(window, 'resize', function () {
        outline.update();
    });

    return outline;
};
//EditorUi.prototype.addContextMenuListener = function(el){
//    if (el.addEventListener) {
//        el.addEventListener('contextmenu', function(e) {
//            alert("You've tried to open context menu"); //here you draw your own menu
//            e.preventDefault();
//        }, false);
//    } else {
//        el.attachEvent('oncontextmenu', function() {
//            alert("You've tried to open context menu");
//            window.event.returnValue = false;
//        });
//    }
//}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createKeyHandler = function (editor) {
    var graph = this.editor.graph;
    var keyHandler = new mxKeyHandler(graph);

    // Routes command-key to control-key on Mac
    keyHandler.isControlDown = function (evt) {
        return mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey);
    };

    // Helper function to move cells with the cursor keys
    function nudge(keyCode, stepSize) {
        if (!graph.isSelectionEmpty() && graph.isEnabled()) {
            stepSize = (stepSize != null) ? stepSize : 1;

            var dx = 0;
            var dy = 0;

            if (keyCode == 37) {
                dx = -stepSize;
            } else if (keyCode == 38) {
                dy = -stepSize;
            } else if (keyCode == 39) {
                dx = stepSize;
            } else if (keyCode == 40) {
                dy = stepSize;
            }

            graph.moveCells(graph.getSelectionCells(), dx, dy);
            graph.scrollCellToVisible(graph.getSelectionCell());
        }
    };

    // Binds keystrokes to actions
    keyHandler.bindAction = mxUtils.bind(this, function (code, control, key, shift) {
        var action = this.actions.get(key);

        if (action != null) {
            var actionCall = function () {
                if (action.isEnabled()) {
                    action.funct();
                }
            };

            if (control) {
                if (shift) {
                    keyHandler.bindControlShiftKey(code, actionCall);
                } else {
                    keyHandler.bindControlKey(code, actionCall);
                }
            } else {
                if (shift) {
                    keyHandler.bindShiftKey(code, actionCall);
                } else {
                    keyHandler.bindKey(code, actionCall);
                }
            }
        }
    });

    var ui = this;
    var keyHandleEscape = keyHandler.escape;
    keyHandler.escape = function (evt) {
        keyHandleEscape.apply(this, arguments);
    };

    // Ignores enter keystroke. Remove this line if you want the
    // enter keystroke to stop editing.
    keyHandler.enter = function () {
    };
    keyHandler.bindControlKey(36, function () {
        graph.foldCells(true);
    }); // Ctrl+Home
    keyHandler.bindControlKey(35, function () {
        graph.foldCells(false);
    }); // Ctrl+End
    keyHandler.bindControlShiftKey(36, function () {
        graph.exitGroup();
    }); // Ctrl+Shift+Home
    keyHandler.bindControlShiftKey(35, function () {
        graph.enterGroup();
    }); // Ctrl+Shift+End
    keyHandler.bindKey(36, function () {
        graph.home();
    }); // Home
    keyHandler.bindKey(35, function () {
        graph.refresh();
    }); // End
    keyHandler.bindKey(37, function () {
        nudge(37);
    }); // Left arrow
    keyHandler.bindKey(38, function () {
        nudge(38);
    }); // Up arrow
    keyHandler.bindKey(39, function () {
        nudge(39);
    }); // Right arrow
    keyHandler.bindKey(40, function () {
        nudge(40);
    }); // Down arrow
    keyHandler.bindShiftKey(37, function () {
        nudge(37, graph.gridSize);
    }); // Shift+Left arrow
    keyHandler.bindShiftKey(38, function () {
        nudge(38, graph.gridSize);
    }); // Shift+Up arrow
    keyHandler.bindShiftKey(39, function () {
        nudge(39, graph.gridSize);
    }); // Shift+Right arrow
    keyHandler.bindShiftKey(40, function () {
        nudge(40, graph.gridSize);
    }); // Shift+Down arrow
    keyHandler.bindControlKey(13, function () {
        graph.setSelectionCells(graph.duplicateCells(graph.getSelectionCells(), false));
    }); // Ctrl+Enter
    keyHandler.bindKey(9, function () {
        graph.selectNextCell();
    }); // Tab
    keyHandler.bindShiftKey(9, function () {
        graph.selectPreviousCell();
    }); // Shift+Tab
    keyHandler.bindControlKey(9, function () {
        graph.selectParentCell();
    }); // Ctrl++Tab
    keyHandler.bindControlShiftKey(9, function () {
        graph.selectChildCell();
    }); // Ctrl+Shift+Tab
    keyHandler.bindAction(8, false, 'delete'); // Backspace
    keyHandler.bindAction(46, false, 'delete'); // Delete
    keyHandler.bindAction(48, true, 'actualSize'); // Ctrl+0
    keyHandler.bindAction(49, true, 'fitWindow'); // Ctrl+1
    keyHandler.bindAction(50, true, 'fitPageWidth'); // Ctrl+2
    keyHandler.bindAction(51, true, 'fitPage'); // Ctrl+3
    keyHandler.bindAction(52, true, 'fitTwoPages'); // Ctrl+4
    keyHandler.bindAction(53, true, 'customZoom'); // Ctrl+5
    keyHandler.bindAction(82, true, 'turn'); // Ctrl+R
    keyHandler.bindAction(82, true, 'clearDefaultStyle', true); // Ctrl+Shift+R
    keyHandler.bindAction(79, true, 'open'); // Ctrl+O
    keyHandler.bindAction(83, true, 'save'); // Ctrl+S
    keyHandler.bindAction(83, true, 'saveAs', true); // Ctrl+Shift+S
    keyHandler.bindAction(107, true, 'zoomIn'); // Ctrl+Plus
    keyHandler.bindAction(109, true, 'zoomOut'); // Ctrl+Minus
    keyHandler.bindAction(65, true, 'selectAll'); // Ctrl+A
    keyHandler.bindAction(65, true, 'selectVertices', true); // Ctrl+Shift+A
    keyHandler.bindAction(69, true, 'selectEdges', true); // Ctrl+Shift+E
    keyHandler.bindAction(69, true, 'editStyle'); // Ctrl+E
    keyHandler.bindAction(66, true, 'toBack'); // Ctrl+B
    keyHandler.bindAction(70, true, 'toFront', true); // Ctrl+Shift+F
    keyHandler.bindAction(68, true, 'duplicate'); // Ctrl+D
    keyHandler.bindAction(68, true, 'setAsDefaultStyle', true); // Ctrl+Shift+D
    keyHandler.bindAction(90, true, 'undo'); // Ctrl+Z
    keyHandler.bindAction(90, true, 'autosize', true); // Ctrl+Shift+Z
    keyHandler.bindAction(89, true, 'redo'); // Ctrl+Y
    keyHandler.bindAction(88, true, 'cut'); // Ctrl+X
    keyHandler.bindAction(67, true, 'copy'); // Ctrl+C
    keyHandler.bindAction(81, true, 'connectionPoints'); // Ctrl+Q
    keyHandler.bindAction(86, true, 'paste'); // Ctrl+V
    keyHandler.bindAction(71, true, 'group'); // Ctrl+G
    keyHandler.bindAction(77, true, 'editData'); // Ctrl+M
    keyHandler.bindAction(71, true, 'grid', true); // Ctrl+Shift+G
    keyHandler.bindAction(76, true, 'lockUnlock'); // Ctrl+L
    keyHandler.bindAction(76, true, 'layers', true); // Ctrl+Shift+L
    keyHandler.bindAction(79, true, 'outline', true); // Ctrl+Shift+O
    keyHandler.bindAction(80, true, 'print'); // Ctrl+P
    keyHandler.bindAction(80, true, 'formatPanel', true); // Ctrl+Shift+P
    keyHandler.bindAction(85, true, 'ungroup'); // Ctrl+U
    keyHandler.bindAction(112, false, 'about'); // F1
    keyHandler.bindAction(116, true, 'nextStep'); // Ctrl+F5
    keyHandler.bindKey(113, function () {
        graph.startEditingAtCell();
    }); // F2

    return keyHandler;
};

EditorUi.prototype.genTimeRandId = function () {
    return (Date.now() - 1300000000000).toString(32) + Math.random().toString(32).slice(4);
};
EditorUi.prototype.chooseTaskType = function () {
    if(mxUi === 'process_design' && this.editor.linkTaskFileId) {
        this.communication.loadAllTaskType(this.editor.linkTaskFileId, mxUtils.bind(this, function(taskType){
            console.log(taskType);
            this.showDialog(new chooseTaskDialogBody(this, taskType, function (taskTypeString) {
                var taskTypeData = JSON.parse(taskTypeString);
                var currentCell = this.editor.graph.getSelectionCell();
                //need more setting
                for (var key in taskTypeData.$) {
                    if (taskTypeData.$.hasOwnProperty(key)) {
                        if(key ==='creator' || key === 'id' || key === 'type') {
                        } else {
                            var model = this.editor.graph.getModel();
                            model.beginUpdate();
                            currentCell.setAttribute(key, taskTypeData.$[key]);
                            model.endUpdate();
                            this.editor.graph.refresh();
                        }
                    }
                }
            }), 600, 200, true, true);
        }));
    }
};
EditorUi.prototype.errorMsg = function(errorType, msg){
    //删掉已有的error msg box
    //if (document.getElementsByClassName('errorMsg')){
    //    var oldErrorBoxs=document.getElementsByClassName('errorMsg');
    //    for (var i = 0; i < oldErrorBoxs.length; i++){
    //        oldErrorBoxs[i].parentNode.removeChild(oldErrorBoxs[i]);
    //    }
    //}
    var msgBox = document.createElement('span');
    msgBox.className = 'errorMsg ' + errorType;
    msgBox.innerHTML = msg;
    return msgBox;
};
EditorUi.prototype.tipMsg = function(tipType, msg, isDisappear){
    //删掉已有的tip msg box
    if (document.getElementsByClassName(tipType)){
        var oldTipBoxs=document.getElementsByClassName(tipType);
        for (var i = 0; i < oldTipBoxs.length; i++){
            oldTipBoxs[i].parentNode.removeChild(oldTipBoxs[i]);
        }
    }
    var msgBox = document.createElement('span');
    msgBox.className = 'tipMsg ' + tipType;
    msgBox.innerHTML = '>> ' + msg;
    if (isDisappear){
        setTimeout(function () {
            if (msgBox.parentNode){
                msgBox.parentNode.removeChild(msgBox);
            }
        }, 2000)
    }
    return msgBox;
};
EditorUi.prototype.isOffice = function(type){
    var typeArr = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];
    for (var i = 0; i < typeArr.length; i++){
        if (typeArr[i] === type) {
            return true;
            break;
        }
    }
    return false;
};
/**
 *
 * @param isInit : if true ,return default role pool;
 * @returns {Array}
 */
EditorUi.prototype.getRolePool = function(isInit){
    var rolePool = [];
    if (!isInit){
        var cellArray = this.editor.graph.findAllCellsUndParent();
        for (var i = 0; i < cellArray.length; i++){
            var cellType = cellArray[i].getAttribute('type');
            if (cellType === "bpmn.participant.pool" || cellType === "bpmn.participant.lane") {
                var roleLabel = cellArray[i].getAttribute('label');
                var labelStr = roleLabel.split('+');
                if (labelStr.length){
                    for (var j =0; j<labelStr.length; j++){
                        rolePool.push({
                            roleId: labelStr[j],
                            roleName: labelStr[j]
                        })
                    }
                    return rolePool;
                }
                break;
            }
        }
    }
    //无泳道时加上默认角色
    if (rolePool.length === 0){
        rolePool.push({
            roleId: '学生',
            roleName: '学生'
        })
    }
    return rolePool;
};

EditorUi.prototype.beforeSave = function(queryObj){
    var cellArray = this.editor.graph.findAllCellsUndParent();
    //是否有指向自己的箭头
    for (var i = 0; i < cellArray.length; i++){
        if (cellArray[i].target && cellArray[i].source && cellArray[i].target.id === cellArray[i].source.id) {
            var cell = cellArray[i].target;
            this.changeCellState(cell, true);
            console.log('流程图中有非法箭头');
            this.showDialog(new tipDialogBody(this, '流程图中有非法箭头，已删除,即将重新保存'), 300, null, true, true);
            this.editor.graph.deleteCell([cellArray[i]]);
            this.changeCellState(cell, false);
        }else {
            if (cellArray[i].getAttribute('isLocked')) {
                this.changeCellState(cellArray[i], false);
            }
        }
    }
};
EditorUi.prototype.changeCellState = function(cell, isLock){
    if (isLock){
        cell.setAttribute('isLocked', 1);
        this.editor.graph.setCellStyles('oldColor', this.editor.graph.getCellStyle(cell)[mxConstants.STYLE_STROKECOLOR], [cell]);
        this.editor.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#F00', [cell]);
        this.editor.setModified('break');
    } else {
        cell.removeAttribute('isLocked');
        this.editor.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, this.editor.graph.getCellStyle(cell)['oldColor'], [cell]);
        this.editor.setModified(true);
    }
};