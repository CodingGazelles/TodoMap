'use strict';

angular.module('App.Services.Tree', ['ngResource'])

// contains services to deal with the model
.factory('$treeManager', ['$storage', '$appScope', '$injector', '$debounce', function($storage, $appScope, $injector, $debounce) {
    return {

        toArray: function(){
            var array = [];
            var node = root.head();
            while(!node.isRoot()){
                array.push(node);
                node = node.getNextNode();
            }
            return array;
        },

        signalToRedrawNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            node.redraw++;
            console.log("$treeManager: Signal to redraw node: " + node + ', :' + node.redraw);
        },

        increaseNodeWeight: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            node.weight = node.weight * 1.05;
            node.parent.rebaseWeight();
        },

        decreaseNodeWeight: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            node.weight = node.weight * 0.95;
            node.parent.rebaseWeight();
        },

        getNextSiblingNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            if( node.isRoot()){
                return null;
            } else if( node.parent.nodes.length - node.index > 1) {
                return node.parent.node( node.index + 1)
            } else {
                return null;
            }
        },

        getPreviousSiblingNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            if( node.isRoot()){
                return null;
            } else if( node.index > 0){
                var prev = node.parent.nodes[ node.index - 1];
                return prev;
            } else{
                return null;
            }
        },

        getNextNode: function(node) {
            if(!node) throw new Error("Node can't be null or undefined");
            var nextNode;

            if(node.head()) {
                nextNode = node.head();     // first child node
            } else if(getNextSiblingNode(node)) {
                nextNode = getNextSiblingNode(node);     // next node
            } else {
                var tmp = node;
                do {
                    tmp = tmp.parent;
                } while (!getNextSiblingNode(tmp) && !tmp.isRoot())  // find first parent having a next node or root node
                if(tmp.isRoot()) {
                    nextNode = tmp.head();
                } else {
                    nextNode = getNextSiblingNode(tmp);
                }
            }
            return nextNode;
        },

        getPreviousNode: function(node) {
            if(!node) throw new Error("Node can't be null or undefined");
            var nextNode;

            if(getPreviousSiblingNode(node)) {
                nextNode = getPreviousSiblingNode(node);
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
            if(!getPreviousSiblingNode(node)) throw new Error("Can't move down level of node that has no previous sibling: " + node);
            console.log("$treeManager: Move down level of node: " + node);
            this.moveNodeTo(node, getPreviousSiblingNode(node), getPreviousSiblingNode(node).tail().index + 1);
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

        insertChild: function(parent, node, index) {
            if(index === null || index === undefined) throw new Error("Index can't be null or undefined: " + index);
            if(typeof index !== "number") throw new Error("Index must be a positive integer, not: " + index);
            if(Math.round(index) !== index)throw new Error("Index must be a positive integer, not: " + index);
            if (index < 0) throw new RangeError("Index of node to insert can't be negative");
            if (index > parent.length) throw new RangeError("Index of node to insert can't be higher than list length");

            node.parent = parent;
            parent.nodes.splice(index, 0, node);
            parent.rebuildIndex();
            parent.rebaseWeight();
        },

        deleteChild: function(parent, index) {
            if(index === null || index === undefined) throw new Error("Index can't be null or undefined: " + index);
            if(typeof index !== "number") throw new Error("Index must be a positive integer, not: " + index);
            if(Math.round(index) !== index)throw new Error("Index must be a positive integer, not: " + index);
            if(index < 0) throw new RangeError("Index must be a positive integer, not: " + index);
            if(index > parent.length) throw new RangeError("Index of node to insert can't be higher than list length");

            var node = parent.nodes[index];
            // node.parent = null;
            parent.nodes.splice(index, 1);
            parent.rebuildIndex();
            parent.rebaseWeight();
            return node;
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
            $storage.loadTree(id, this._onLoadingSuccess, this._onLoadingFailed);
        },

        _onLoadingSuccess: function(data){
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
                    parent.nodes.push(newNode);
                    parent.rebuildIndex();
                }

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

;