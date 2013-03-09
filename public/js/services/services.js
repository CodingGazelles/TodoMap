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
        markNodeToRedraw: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            node.redraw++;
        },

        increaseWeightNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            node.weight = node.weight * 1.01;
            node.parent.rebaseWeight();
            // node.parent.redraw++;
        },

        getNextNode: function(node) {
            if(!node) throw new Error("Node can't be null or undefined");
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

        getPreviousNode: function(node) {
            if(!node) throw new Error("Node can't be null or undefined");
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
            console.log("$treeManager: Loading tree succeeded");
            var tree = $injector.get('$treeManager')._extendTree( data);
            $appScope.topScope().taskTree = tree;
        },

        _onLoadingFailed: function(data){
            console.log("$treeManager: Loading tree failed");
        },

        saveTree: function(successFn, failureFn){
            successFn = successFn || function(){};
            failureFn = failureFn || function(){};
            if(this.db_saveTree){
                this.db_saveTree(successFn, failureFn);
            } else {
                this.db_saveTree = $debounce( this._saveTree, 5000, false);
                this.db_saveTree(successFn, failureFn);
            }
        },

        db_saveTree: null,

        _saveTree: function(successFn, failureFn){
            console.log("$treeManager: Save tree");
            var data = this._flattenTree( $appScope.topScope().taskTree);
            $storage.saveTree( data, successFn, failureFn);
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
.factory('$mapManager', ['$treeManager', '$appScope', '$injector', function($treeManager, $appScope, $injector) {
    return {

        markNodeToRedraw: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Make to redraw node: " + node);
            $appScope.safeApply(function(){
                $treeManager.markNodeToRedraw(node);
            });
        },

        saveMap: function(){
            console.log("$mapManager: Save map");
            var successFn = this._onSaveSuccess;
            var failureFn = this._onSaveFailure;
            $appScope.safeApply(function(){
                $appScope.topScope().savedState = "Saving ...";
                $treeManager.saveTree(successFn,failureFn);
            }); 
        },

        _onSaveSuccess: function(){
            console.log("$mapManager: Saving tree succeeded");
            $appScope.topScope().savedState = "Saved";
        },

        _onSaveFailure: function(data){
            console.log("$mapManager: Saving failed");
        },

        modifyingNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Modifying node");
            var $manager = this;
            $appScope.safeApply(function(){
                $manager.saveMap();
            }); 
        },

        deleteNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Delete node: " + node);
            var nextNode = $treeManager.getPreviousNode(node);
            var $manager = this;
            $appScope.safeApply( function(){ 
                $treeManager.deleteNode(node);
                $manager.saveMap();
                $manager.unselectNode();
                $manager.selectNode(nextNode);
                $treeManager.markNodeToRedraw(node.parent);
            });
            this.focusOnSelectedNode();
        },

        createSibling: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Create sibling to node: " + node);
            var newNode;
            var $manager = this;
            $appScope.safeApply( function(){ 
                newNode = $treeManager.createSibling(node);
                $manager.saveMap();
                $manager.unselectNode();
                $manager.selectNode(newNode);
                $treeManager.markNodeToRedraw(newNode.parent);
            });
            this.focusOnSelectedNode();
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

        increaseNodeWeight: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Increase weight node: " + node);
            var $manager = this;
            $appScope.safeApply( function(){ 
                $treeManager.increaseNodeWeight(node);
                $manager.saveMap();
                $manager._markNodeToRedraw(node.parent);
            });
        },

        selectNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Select node: " + node);
            var $manager = this;
            $appScope.safeApply( function(){ 
                node.selected = true;
                $appScope.topScope().selectedNode = node;
                $treeManager.markNodeToRedraw(node);
            });
            this.focusOnSelectedNode();
        },

        selectNextNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            this.unselectNode();
            var nextNode = $treeManager.getNextNode(node);
            this.selectNode(nextNode);
        },

        selectPreviousNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            this.unselectNode();
            var previousNode = $treeManager.getPreviousNode(node);
            this.selectNode(previousNode);
        },

        focusOnSelectedNode: function(){
            // this function may be called while angular has not already redraw the map
            // so the element is not ready to get the focus
            if($appScope.topScope().selectedNode){
                if($appScope.topScope().selectedNode.element){
                    if(!$appScope.topScope().$$phase){
                        $appScope.topScope().selectedNode.element.find('input')[0].focus();
                    }
                }
            }
        },

        unselectNode: function(){
            console.log("$mapManager: Unselect node: " + $appScope.topScope().selectedNode);
            if($appScope.topScope().selectedNode){
                $appScope.safeApply( function(){ 
                    var node = $appScope.topScope().selectedNode;
                    $appScope.topScope().selectedNode = null;
                    node.selected = false;
                    $treeManager.markNodeToRedraw(node);
                });
                
            }
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
        }
    };
}])

// filters user events
.factory('$eventManager', ['$mapManager', '$treeManager', '$appScope',  function($mapManager, $treeManager, $appScope) {
    return {
        

        onClick: function(event, scope, element){
            console.log("$eventManager: Catch event: " + event.type + " on node: " + scope.node);

            // select node
            this._stopEventPropagation(event);
            console.log("$eventManager: Launch select node action: " + scope.node);
            $mapManager.unselectNode();
            $mapManager.selectNode(scope.node);
        },

        onChange: function(event, scope, element) {
            console.log("$eventManager: Catch event label change");
            console.log("$eventManager: No action");
        },

        onKeydown: function(event, scope, element) {
            console.log("$eventManager: Catch event: " + event.toString + " on node: " + scope.node);
            
            // alt key
            if(event.altKey){

                // increase weight
                if(event.keyCode === TdKeyboard.ARROW_UP){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Launch increase node weight action: " + scope.node);
                    $mapManager.increaseWeightNode(scope.node);
                }

                else{
                    console.log("$eventManager: No action");
                };
            } 

            // shift key
            else if(event.shiftKey){
                
                // exp
                if( true){

                }

                else{
                    console.log("$eventManager: No action");
                };
            } 

            // ctrl key
            else if(event.ctrlKey){

                // exp
                if( true){

                }

                else{
                    console.log("$eventManager: No action");
                };
            } 

            // no special keys
            else {

                // delete node
                if((event.keyCode === TdKeyboard.BACK_SPACE || event.keyCode === TdKeyboard.DELETE) 
                    && event.target.value === ""
                ){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Launch delete node action: " + scope.node);
                    $mapManager.deleteNode(scope.node);
                } 

                // move to next node
                else if(event.keyCode === TdKeyboard.ARROW_DOWN){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Catch move to next node event: " + scope.node);
                    $mapManager.selectNextNode(scope.node);
                } 

                // move to previous node
                else if(event.keyCode === TdKeyboard.ARROW_UP){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Catch move to previous node event: " + scope.node);
                    $mapManager.selectPreviousNode(scope.node);
                } 

                // increase/decrease node level
                else if(event.keyCode === TdKeyboard.TAB){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Launch increase node level action: " + scope.node);
                    $mapManager.moveLevelDown(scope.node);
                }

                // unselect node
                else if(event.keyCode === TdKeyboard.ESCAPE) {
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Launch unselect node action");
                    $mapManager.unselectNode();
                }

                else{
                    console.log("$eventManager: No action");
                };
            }
        },

        onKeypress: function(event, scope, element) {
            console.log("$eventManager: Catch event: " + event.toString + " on node: " + scope.node);

            // create sibling
            if(event.keyCode === TdKeyboard.ENTER) {
                this._stopEventPropagation(event);
                console.log("$eventManager: Launch create sibling node action: " + scope.node);
                $mapManager.createSibling(scope.node);
            }

            else{
                console.log("$eventManager: No action");
            };
        },

        onInput: function(event, scope, element) {
            console.log("$eventManager: Catch event: " + event.toString + " on node: " + scope.node);

            // modifying a node
            this._stopEventPropagation(event);
            console.log("$eventManager: Launch modifying node action: " + scope.node);
            $mapManager.modifyingNode(scope.node); 
        },

        onFocus: function(event, scope, element){
            console.log("$eventManager: Catch event " + event.type + " on node: " + scope.node);
            console.log("$eventManager: No action");
        },

        onBlur: function(event, scope, element){
            console.log("$eventManager: Catch event " + event.type + " on node: " + scope.node);

            // unselect node
            this._stopEventPropagation(event);
            console.log("$eventManager: Launch unselect node action");
            $mapManager.unselectNode();
        },

        // stop event propagation
        _stopEventPropagation: function(event){
            if(event.preventDefaut) event.preventDefault();
            if(event.returnValue) event.returnValue = false;
            event.stopPropagation();
        }
    };
}])

;