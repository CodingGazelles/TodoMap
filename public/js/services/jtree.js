
// squeleton of a node, contains the persitant properties of a node
TdNode.basic = {
    "label": "",
    "weight": 0,
    "opened": true,
    "index": 0,
    "nodes": null
};
// squeleton of a node, contains the extended (client side) properties of a node
TdNode.extended = {
    "parent": null,
    "bgcolor": "#ffffff",
    "hueRange": 360,
    "labelElement": null,
    "element": null,
    "selected": false,
    "redraw": 0
};

function TdNode(data) {
    _.defaults(this, TdNode.basic, TdNode.extended);
    this.nodes = [];
    data = data || {};
    var key;
    for (key in data) {
        this[key] = data[key];
    }
}

TdNode.prototype = {
    
    head: function() {
        return this.nodes[0] ? this.nodes[0] : null;
    },

    tail: function() {
        return this.nodes.length != 0 ? this.nodes.last : null;
    },

    nextSibling: function(){
        if( this.isRoot()){
            return null;
        } else if( this.parent.nodes.length - this.index > 1) {
            return this.parent.node( this.index + 1)
        } else {
            return null;
        }
    },

    previousSibling: function(){
        if( this.isRoot()){
            return null;
        } else if( this.index > 0){
            var prev = this.parent.nodes[ this.index - 1];
            return prev;
        } else{
            return null;
        }
    },

    path: function() {
        return this.parent ? this.parent.path() + "/" + this.index : "/" + this.index;
    },

    isRoot: function() {
        return this.parent === null;
    },

    isTerminal: function() {
        return this.nodes.length === 0;
    },

    node: function( i) {
        return this.nodes[i];
    },

    insertChild: function(node, index) {
        if(index === null || index === undefined) throw new Error("Index can't be null or undefined: " + index);
        if(typeof index !== "number") throw new Error("Index must be a positive integer, not: " + index);
        if(Math.round(index) !== index)throw new Error("Index must be a positive integer, not: " + index);
        if (index < 0) throw new RangeError("Index of node to insert can't be negative");
        if (index > this.length) throw new RangeError("Index of node to insert can't be higher than list length");

        node.parent = this;
        this.nodes.splice(index, 0, node);
        this._reindexNodes();
        this.rebaseWeight();
    },

    deleteChild: function(index) {
        if(index === null || index === undefined) throw new Error("Index can't be null or undefined: " + index);
        if(typeof index !== "number") throw new Error("Index must be a positive integer, not: " + index);
        if(Math.round(index) !== index)throw new Error("Index must be a positive integer, not: " + index);
        if(index < 0) throw new RangeError("Index must be a positive integer, not: " + index);
        if(index > this.length) throw new RangeError("Index of node to insert can't be higher than list length");

        var node = this.nodes[index];
        // node.parent = null;
        this.nodes.splice(index, 1);
        this._reindexNodes();
        this.rebaseWeight();
        return node;
    },

    _reindexNodes: function() {
        this.nodes.forEach(function(node, index) {
            node.index = index;
        });
    },

    rebaseWeight: function() {
        var totalWeight = 0;
        this.nodes.forEach(function(node) {
            totalWeight += node.weight;
        });
        this.nodes.forEach(function(node) {
            node.weight = Math.round( node.weight * 100 / totalWeight * 1000) / 1000;
        });
    },

    _pushChild: function(node) {
        if(!node) throw new Error("Node can't be null or undefined");

        this.nodes.push(node);
        this._reindexNodes();
        // this.rebaseWeight();
    },

    toString: function() {
        return "[object TdNode " + this.path() + " (" + this.label + ")]";
    }
};




