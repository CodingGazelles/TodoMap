'use strict';

var TdKeyboard = {
    BACK_SPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    DELETE: 46
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

// contains services to deal with the model
.factory('$treeManager', ['$storage', '$appScope', '$injector', '$debounce', function($storage, $appScope, $injector, $debounce) {
    return {
        walkNext: function(node) {
            var nextNode;

            if(node.head()) {
                nextNode = node.head();     // first child node
            } else if(node.nextSibling()) {
                nextNode = node.nextSibling();     // next node
            } else {
                var tmp = node;
                do {
                    tmp = tmp.parent;
                } while (!tmp.nextSibling() && !tmp.isRoot())  // find first parent having a next node or root node
                if(tmp.isRoot()) {
                    nextNode = tmp.head();
                } else {
                    nextNode = tmp.nextSibling();
                }
            }
            return nextNode;
        },

        walkPrevious: function(node) {
            var nextNode;

            if(node.previousSibling()) {
                nextNode = node.previousSibling();
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

        moveLevelDown: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            if(!node.previousSibling()) throw new Error("Can't move down level of node that has no previous sibling: " + node);
            console.log("$treeManager: Move down level of node: " + node);
            this.moveNodeTo(node, node.previousSibling(), node.previousSibling().tail().index + 1);
        },

        moveLevelUp: function(node){
            if(!node) throw new Error("Node can't be null or undefined");

        },

        moveIndexUp: function(node){
            if(!node) throw new Error("Node can't be null or undefined");

        },

        moveIndexDown: function(node){
            if(!node) throw new Error("Node can't be null or undefined");

        },

        moveNodeTo: function(node, parent, index){
            if(!node) throw new Error("Node can't be null or undefined");
            if(!parent) throw new Error("Parent can't be null or undefined");
            if(!index) throw new Error("Index can't be null or undefined");
            console.log("$treeManager: Move node: " + node + " to index:" + index + " of node:" + parent);
            node.parent.deleteChild(node.index);
            parent.insertChild(node, index);
        },

        deleteNode: function(node){
            if( !node) throw new Error("Node can't be null or undefined");
            if( node.isRoot()){
                console.log('WARN: try to delete root');
                throw new Error("Can't delete root");
            }
            console.log("$treeManager: Delete node: " + node);
            node.parent.deleteChild(node.index);
        },

        createSibling: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            if(node.isRoot()){ 
                console.log('WARN: try to create a sibling of root');
                throw new Error("Can't create a sibling of root");
            }
            console.log("$treeManager: Create sibling of node: " + node);

            var newNode = new TdNode();
            newNode.weight = node.weight;
            node.parent.insertChild(newNode, node.index + 1);
            return newNode;
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

// contains services to deal with the map (the view)
.factory('$mapManager', ['$treeManager', '$appScope', function($treeManager, $appScope) {
    return {

        modifiedNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.saveTree();
        },

        deleteNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.deleteNode( node);
            $treeManager.saveTree();
        },

        createSibling: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            var newNode = $treeManager.createSibling(node);
            $treeManager.saveTree();
            return newNode;
        },

        moveLevelDown: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.moveLevelDown(node);
            $treeManager.saveTree();
        },

        moveLevelUp: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.moveLevelUp(node);
            $treeManager.saveTree();
        },

        moveIndexDown: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.moveIndexDown(node);
            $treeManager.saveTree();
        },

        moveIndexUp: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.moveIndexUp(node);
            $treeManager.saveTree();
        },

        colorizeBranch: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            if(node.nodes.length === 0) return;

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
            if(!node) throw new Error("Node can't be null or undefined");
            if(!rectangle) throw new Error("Rectangle can't be null or undefined");
            var mapBuilder = new MapBuilder(node.nodes, rectangle);
            mapBuilder.squarify(); 
        },

        toHexString: function(color){
            return tinycolor("hsv (" + color.h + " " + color.s + " " + color.v + ")").toHexString();
        },

        selectNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            this.unselectNode();
            node.selected = true;
            $appScope.topScope().selectedNode = node;
        },

        unselectNode: function(){
            if($appScope.topScope().selectedNode){
                $appScope.topScope().selectedNode.selected = false;
                $appScope.topScope().selectedNode = null;
            }
        },

        focusNode: function(node) {
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Focus on node: " + node);
            node.element.find('input')[0].focus();
        }
    };
}])

// filters user events
.factory('$eventManager', ['$mapManager', '$treeManager', '$appScope',  function($mapManager, $treeManager, $appScope) {
    return {
        onClick: function(event, scope, element){
            console.log("$eventManager: Catch event mouse click on node: " + scope.node);

            // stop event propagation
            if(event.preventDefaut) event.preventDefault();
            if(event.returnValue) event.returnValue = false;
            event.stopPropagation();

            $appScope.safeApply( function(){ $mapManager.selectNode(scope.node)});
            $mapManager.focusNode(scope.node);
        },

        onChange: function(event, scope, element) {
            console.log("$eventManager: Catch event label change");
        },

        onKeydown: function(event, scope, element) {
            console.log("$eventManager: Catch event keydown: " + event + " on node: " + scope.node);
            
            // delete node
            if((event.keyCode === TdKeyboard.BACK_SPACE || event.keyCode === TdKeyboard.DELETE) 
                && event.target.value === ""
            ){
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;

                console.log("$eventManager: Catch delete node event: " + scope.node);

                // todo: remove call to safeApply
                $appScope.safeApply( function(){ $mapManager.deleteNode(scope.node)});
                if(scope.node.previousSibling()) {
                    $mapManager.focusNode(scope.node.previousSibling());
                } else if(scope.node.parent & !scope.node.parent.isRoot()) {
                    $mapManager.focusNode(scope.node.parent);
                } else if(scope.node.nextSibling()) {
                    $mapManager.focusNode(scope.node.nextSibling());
                }
            } 

            // move to next node
            else if(event.keyCode === TdKeyboard.ARROW_DOWN){
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;

                console.log("$eventManager: Catch move to next node event: " + scope.node);

                var nextNode = $treeManager.walkNext(scope.node);
                $appScope.safeApply( function(){ $mapManager.selectNode(nextNode)});
                $mapManager.focusNode(nextNode);
                
            } 

            // move to previous node
            else if(event.keyCode === TdKeyboard.ARROW_UP){
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;

                console.log("$eventManager: Catch move to previous node event: " + scope.node);

                var previousNode = $treeManager.walkPrevious(scope.node);
                $appScope.safeApply( function(){ 
                    $mapManager.selectNode(previousNode)
                });
                $mapManager.focusNode(previousNode);
            } 

            // increase/decrease node level
            else if(event.keyCode === TdKeyboard.TAB){
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;

                console.log("$eventManager: Catch increase node level: " + scope.node);
                $mapManager.moveLevelDown(scope.node);
            }

            // unselect node
            else if(event.keyCode === TdKeyboard.ESCAPE) {
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;
                console.log("$eventManager: Catch unselect node event");
                $appScope.safeApply( function(){ 
                    $mapManager.unselectNode();
                });
            };
        },

        onKeypress: function(event, scope, element) {
            console.log("$eventManager: Catch event keypress on node: " + scope.node);

            // create sibling
            if(event.keyCode === TdKeyboard.ENTER) {
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;
                console.log("$eventManager: Catch create sibling event: " + scope.node);
                var newNode;
                $appScope.safeApply( function(){ 
                    newNode = $mapManager.createSibling(scope.node);
                    $mapManager.selectNode(newNode);
                });
                $mapManager.focusNode(newNode);
            };
        },

        onInput: function(event, scope, element) {
            console.log("$eventManager: Catch event input on node: " + scope.node);

            // modify node
            if(event.preventDefaut) event.preventDefault();
            if(event.returnValue) event.returnValue = false;
            console.log("$eventManager: Catch modified node event: " + scope.node);
            $appScope.safeApply( function(){ $mapManager.modifiedNode(scope.node)}); 
        },

        onFocus: function(event, scope, element){
            console.log("$eventManager: Catch event focus on node: " + scope.node);   
        },

        onBlur: function(event, scope, element){
            console.log("$eventManager: Catch event blur on node: " + scope.node);
            if(event.preventDefaut) event.preventDefault();
            if(event.returnValue) event.returnValue = false;
            console.log("$eventManager: Catch unselect node event");
            $appScope.safeApply( function(){ 
                $mapManager.unselectNode(scope.node);
            });
        }
    };
}])

;