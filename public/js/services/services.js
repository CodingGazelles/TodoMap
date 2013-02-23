'use strict';

var TdKeyboard = {
    BACK_SPACE: 8,
    DELETE: 46,
    ENTER: 13,
    ARROW_DOWN: 40,
    ARROW_UP: 38
}

angular.module('App.Services', ['ngResource'])

.factory('$storage', [ '$resource', function($resource) {
    return {
        store:  $resource(
            '/api/maps/:id', 
            {id: '@id'}, 
            {
                getMap: {method: 'GET'},
                saveMap: {method: 'PUT'}
            }
        ),

        loadTree: function( mapId, successFn, failureFn){
            console.log("$storage: Load tree");

            successFn = successFn || function(){};
            failureFn = failureFn || function(){};

            this.store.getMap(
                {id: mapId},
                function( data){
                    console.log("$storage: Load map succeeded");
                    // console.log("$storage: $scope.todoTree: " + JSON.stringify(data));
                    successFn(data);
                },
                function( data){
                    console.log("$storage: Load map failed");
                    console.log("$storage: Returned data: " + data);
                    failureFn(data);
                   // console.log("$storage: $scope.mapData: " + JSON.stringify(data));
                }
            );
        },

        saveTree: function(tree, successFn, failFn){
            console.log("$storage: Save tree");

            successFn = successFn || function(){};
            failFn = failFn || function(){};
            
            
            // console.log("$storage: $scope.mapData: " + JSON.stringify( todoData));
            
            this.store.saveMap(
                {id: tree._id},
                tree,
                function(data) { // SUCCESS
                    console.log("$storage: call api maps.saveMap succeed");
                    //console.log("$storage: $scope.mapData: " + JSON.stringify(data));
                    successFn();
                },
                function(data) { // FAILURE
                    console.log("$storage: call api maps.saveMap failed");
                    //console.log("$storage: $scope.mapData: " + JSON.stringify(data));
                    failFn();
                }
            );
        },

        
    };
}])

// updates the model
.factory('$treeManager', ['$storage', '$appScope', '$injector', '$debounce', function($storage, $appScope, $injector, $debounce) {
    return {
        walkNext: function(node) {
            var nextNode;

            if(node.head()) {
                nextNode = node.head();     // first child node
            } else if(node.next()) {
                nextNode = node.next();     // next node
            } else {
                var tmp = node;
                do {
                    tmp = tmp.parent;
                } while (!tmp.next() && !tmp.isRoot())  // find first parent having a next node or root node
                if(tmp.isRoot()) {
                    nextNode = tmp.head();
                } else {
                    nextNode = tmp.next();
                }
            }
            return nextNode;
        },

        walkPrevious: function(node) {
            var nextNode;

            if(node.previous()) {
                nextNode = node.previous();
                while(nextNode.tail()){
                    nextNode = nextNode.tail()
                }
            }else {
                nextNode = node.parent;
                if(nextNode.isRoot()){
                    while(nextNode.tail()){
                        nextNode = nextNode.tail()
                    }
                }
            }
            return nextNode;
        },

        deleteNode: function(node){
            if( !node) throw new Error("Node can't be null or undefined");
            if( node.isRoot()){
                console.log('WARN: tried to delete root');
                throw new Error("Can't delete root");
            }
            console.log("$treeManager: Delete node: " + node);
            node.delete();
        },

        createSibling: function(node){
            if( !node) throw new Error("Argument can't be undefined");
            if( node.isRoot()){ 
                console.log('WARN: tried to create a sibling of root');
                throw new Error("Can't create a sibling to root");
            }
            console.log("$treeManager: Create sibling to node: " + node);
            return node.createSibling();
        },

        loadTree: function(id){
            console.log("$treeManager: Load tree");
            $storage.loadTree(id, this._onLoadedTree, this._onLoadingFailed);
        },

        _onLoadedTree: function(data){
            console.log("$treeManager: Loaded tree");
            var tree = $injector.get('$treeManager')._extendTree( data);
            $appScope.topScope().todoTree = tree;
        },

        _onLoadingFailed: function(data){
            console.log("$treeManager: Loading tree failed");
        },

        saveTree: function(){
            if(this.db_saveTree){
                this.db_saveTree();
            } else {
                this.db_saveTree = $debounce( this._saveTree, 5000, false);
                this.db_saveTree();
            }
        },

        db_saveTree: null,

        _saveTree: function(){
            console.log("$treeManager: Save tree");
            this._onSavingTree();
            var data = this._flattenTree( $appScope.topScope().todoTree);
            $storage.saveTree( data, this._onSavedTree, this._onSavingFailed);
        },

        _onSavingTree: function(){
            console.log("$treeManager: Saving tree");
            $appScope.topScope().savedState = "Saving ...";
        },

        _onSavedTree: function(){
            console.log("$treeManager: Saved tree");
            $appScope.topScope().savedState = "Saved";
        },

        _onSavingFailed: function(data){
            console.log("$treeManager: Saving tree failed");
        },

        _extendTree: function(data) {
            console.log("$treeManager: Extend tree");

            var root;
            var getNodeData = function(node) {
                var attr, nodeData = {};
                for(attr in node) {
                    if(attr !== "nodes") nodeData[attr] = node[attr];
                }
                return nodeData;
            };

            (function walkDown(node, parent) {
                var newNode;

                if(!parent) {
                    newNode = root = new TdNode(getNodeData(node));
                } else {
                    newNode = new TdNode(getNodeData(node));
                    newNode.parent = parent;
                    parent._pushChild(newNode);
                }

                // if("childNodes" in node) {
                //     for(var i = 0; i < node.childNodes.length; i++) {
                //         walkDown(node.childNodes[i], newNode);
                //     }
                // } else 
                if("nodes" in node) {
                    for(var i = 0; i < node.nodes.length; i++) {
                        walkDown(node.nodes[i], newNode);
                    }
                } 
            })(data);

            return root;
        },

        // flatten the tree, ie, remove non persistent properties from the node tree
        _flattenTree: function(data) {
            console.log("$treeManager: flatten tree");

            var root;

            (function walkDown(node, parent) {
                var newNode;

                if(!parent) {
                    newNode = root = _.pick(node, _.keys(TdNode.basic), "_id");
                    newNode.nodes = [];
                } else {
                    newNode = _.pick(node, _.keys(TdNode.basic));
                    newNode.nodes = [];
                    parent.nodes.push(newNode);
                }

                if("nodes" in node) {
                    for(var i = 0; i < node.nodes.length; i++) {
                        walkDown(node.nodes[i], newNode);
                    }
                }
            })(data);

            return root;
        }
    };
}])

.factory('$mapManager', ['$treeManager', '$appScope', function($treeManager, $appScope) {
    return {
        selectNode: function(node){
            if($appScope.topScope().selectedNode) 
                $appScope.topScope().selectedNode.selected = false;

            node.selected = true;
            $appScope.topScope().selectedNode = node;
        },

        onChangedNode: function(node){
            $treeManager.saveTree();
        },

        deleteNode: function(node){
            $treeManager.deleteNode( node);
            $treeManager.saveTree();
        },

        createSibling: function(node){
            var newNode = $treeManager.createSibling(node);
            $treeManager.saveTree();
            return newNode;
        },

        colorizeBranch: function(node){
            if( !node) throw new Error("Node can't be null");
            if( node.nodes.length === 0) return;

            var parentColor, hueRange, hueOffset;

            if( node.bgcolor.h && node.bgcolor.s && node.bgcolor.v){
                parentColor =  {
                    h: node.bgcolor.h, 
                    s: node.bgcolor.s * 0.65, 
                    v: node.bgcolor.v
                };
            } else {
                parentColor = {h: 0, s: 0.9, v: 1};
            }

            hueRange = node.hueRange || 360;
            hueOffset = hueRange / node.nodes.length;

            node.nodes.forEach( function( child, index) {
                child.bgcolor = {
                    h: (parentColor.h + hueOffset * index) % 360,
                    s: parentColor.s,
                    v: parentColor.v
                };
                child.hueRange = hueOffset;
            });
        },

        squarifyBranch: function(node, rectangle){
            var mapBuilder = new MapBuilder(node.nodes, rectangle);
            mapBuilder.squarify();
        },

        toHexString: function(color){
            return tinycolor("hsv (" + color.h + " " + color.s + " " + color.v + ")").toHexString();
        },

        focusOnNode: function(node) {
            console.log("$mapManager: Throw event focus on node: " + node);
            node.element.find('input')[0].focus();
        }
    };
}])

// filters the user event
.factory('$eventManager', ['$mapManager', '$treeManager', '$appScope',  function($mapManager, $treeManager, $appScope) {
    return {
        onClick: function(event, scope, element){
            console.log("$eventManager: Catch event click node: " + scope.node);

            // stop event propagation
            if(event.preventDefaut) event.preventDefault();
            if(event.returnValue) event.returnValue = false;
            event.stopPropagation();

            $appScope.safeApply( function(){ $mapManager.selectNode(scope.node)});
            $mapManager.focusOnNode(scope.node);
        },

        onChange: function(event, scope, element) {
            console.log("$eventManager: Catch event label change");
        },

        onKeydown: function(event, scope, element) {
            console.log("$eventManager: Catch event label keydown: " + scope.node);
            if((event.keyCode === TdKeyboard.BACK_SPACE || event.keyCode === TdKeyboard.DELETE) 
                && event.target.value === ""
            ){
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;

                console.log("$eventManager: Catch delete node event: " + scope.node);

                // todo: remove call to safeApply
                $appScope.safeApply( function(){ $mapManager.deleteNode(scope.node)});
                if(scope.node.previous()) {
                    $mapManager.focusOnNode(scope.node.previous());
                } else if(scope.node.parent & !scope.node.parent.isRoot()) {
                    $mapManager.focusOnNode(scope.node.parent);
                } else if(scope.node.next()) {
                    $mapManager.focusOnNode(scope.node.next());
                }
            }else if(event.keyCode === TdKeyboard.ARROW_DOWN){
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;

                console.log("$eventManager: Catch move to next node event: " + scope.node);

                var nextNode = $treeManager.walkNext(scope.node);
                $appScope.safeApply( function(){ $mapManager.selectNode(nextNode)});
                $mapManager.focusOnNode(nextNode);
                
            }else if(event.keyCode === TdKeyboard.ARROW_UP){
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;

                console.log("$eventManager: Catch move to previous node event: " + scope.node);

                var previousNode = $treeManager.walkPrevious(scope.node);
                $appScope.safeApply( function(){ 
                    $mapManager.selectNode(previousNode)
                });
                $mapManager.focusOnNode(previousNode);
            };
        },

        onKeypress: function(event, scope, element) {
            console.log("$eventManager: Catch event label keypress: " + scope.node);

            if(event.keyCode === TdKeyboard.ENTER) {
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;
                
                console.log("$eventManager: Catch create sibling event: " + scope.node);

                var newNode;
                $appScope.safeApply( function(){ 
                    newNode = $mapManager.createSibling(scope.node);
                    $mapManager.selectNode(newNode);
                });
                $mapManager.focusOnNode(newNode);
            };
        },

        onInput: function(event, scope, element) {
            console.log("$eventManager: Catch event label input: " + scope.node);

            if(event.preventDefaut) event.preventDefault();
            if(event.returnValue) event.returnValue = false;
            
            $appScope.safeApply( function(){ $mapManager.onChangedNode(scope.node)}); 
        },

        onFocus: function(event, scope, element){
            console.log("$eventManager: Catch event label focus: " + scope.node);   
        }
    };
}])

;