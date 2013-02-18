'use strict';

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
            console.log("Load tree");

            successFn = successFn || function(){};
            failureFn = failureFn || function(){};

            this.store.getMap(
                {id: mapId},
                function( data){
                    console.log("Load map succeeded");
                    // console.log("$scope.todoTree: " + JSON.stringify(data));
                    successFn(data);
                },
                function( data){
                    console.log("Load map failed");
                    console.log("Returned data: " + data);
                    failureFn(data);
                   // console.log("$scope.mapData: " + JSON.stringify(data));
                }
            );
        },

        saveTree: function(tree, successFn, failFn){
            console.log("Save tree");

            successFn = successFn || function(){};
            failFn = failFn || function(){};
            
            
            // console.log("$scope.mapData: " + JSON.stringify( todoData));
            
            this.store.saveMap(
                {id: tree._id},
                tree,
                function(data) { // SUCCESS
                    console.log("call api maps.saveMap succeed");
                    //console.log("$scope.mapData: " + JSON.stringify(data));
                    successFn();
                },
                function(data) { // FAILURE
                    console.log("call api maps.saveMap failed");
                    //console.log("$scope.mapData: " + JSON.stringify(data));
                    failFn();
                }
            );
        },

        
    };
}])

// updates the model
.factory('$treeManager', ['$storage', '$appScope', '$injector', function($storage, $appScope, $injector) {
    return {
        deleteNode: function(node){
            if( !node) throw new Error("Node can't be null or undefined");
            if( node.isRoot()){
                console.log('WARN: tried to delete root');
                throw new Error("Can't delete root");
            }
            console.log("Delete node: " + node);
            node.delete();
        },

        createSibling: function(node){
            if( !node) throw new Error("Argument can't be undefined");
            if( node.isRoot()){ 
                console.log('WARN: tried to create a sibling of root');
                throw new Error("Can't create a sibling to root");
            }
            console.log("Create sibling to node: " + node);
            return node.createSibling();
        },

        loadTree: function(id){
            console.log("Load tree");
            $storage.loadTree(id, this._onLoadedTree, this._onLoadingFailed);
        },

        _onLoadedTree: function(data){
            console.log("Loaded tree");
            var tree = $injector.get('$treeManager')._extendTree( data);
            $appScope.topScope().todoTree = tree;
        },

        _onLoadingFailed: function(data){
            console.log("Loading tree failed");
        },

        saveTree: function(){
            console.log("Save tree");
            this._onSavingTree();
            var data = this._flattenTree( $appScope.topScope().todoTree);
            $storage.saveTree( data, this._onSavedTree, this._onSavingFailed);
        },

        _onSavingTree: function(){
            console.log("Saving tree");
            $appScope.topScope().savedState = "Saving ...";
        },

        _onSavedTree: function(){
            console.log("Saved tree");
            $appScope.topScope().savedState = "Saved";
        },

        _onSavingFailed: function(data){
            console.log("Saving tree failed");
        },

        _extendTree: function(data) {
            console.log("Extend tree");

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
            console.log("flatten tree");

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
        deleteNode: function(node){
            $treeManager.deleteNode( node);
            $treeManager.saveTree();

            this._redrawNode(node.parent);
            if(node.previous()) {
                this._focusOnNode(node.previous());
            } else if(node.parent) {
                this._focusOnNode(node.parent);
            } else if(node.next()) {
                this._focusOnNode(node.next());
            }
        },

        createSibling: function(node){
            var newNode = $treeManager.createSibling(node);
            $treeManager.saveTree();

            this._redrawNode(node.parent);
            this._focusOnNode(newNode);
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

        _redrawNode: function(node) {
            console.log("Throw event redraw node: " + node);
            $appScope.topScope().$broadcast('redrawNode', {
                "targetPath": node.path()
            });
        },

        _focusOnNode: function(node) {
            console.log("Throw event focus on node: " + node);
            $appScope.topScope().$broadcast('focusOnLabel', {
                "targetPath": node.path()
            });
            
        }
    };
}])

// filters the user event
.factory('$eventManager', ['$mapManager', '$appScope',  function($mapManager, $appScope) {
    return {
        onChange: function(event, node) {
            console.log("Catch event label change");
            
            if(event.preventDefaut) event.preventDefault();
            if(event.returnValue) event.returnValue = false;
            
            // todo: remove call to safeApply
            $appScope.safeApply( function(){ $mapManager.onChangedNode()});
        },

        onKeydown: function(event, node) {
            console.log("Catch event label keydown");
            if((event.keyCode === TdKeyboard.BACK_SPACE || event.keyCode === TdKeyboard.DELETE) 
                && event.target.value === ""
            ){
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;

                console.log("Catch delete node event: " + node);

                // todo: remove call to safeApply
                $appScope.safeApply( function(){ $mapManager.deleteNode(node)});
            };
        },

        onKeypress: function(event, node) {
            console.log("Catch event label keypress");

            if(event.keyCode === TdKeyboard.ENTER) {
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;
                
                console.log("Catch create sibling event: " + node);

                // todo: remove call to safeApply
                $appScope.safeApply( function(){ $mapManager.createSibling(node)});
            };
        },

        onInput: function(event, node) {
            console.log("Catch event label input");
        }
    };
}])

;