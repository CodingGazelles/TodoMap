
// squeleton of a node, contains the persitant properties of a node
TdNode.basic = {
    "header": "",
    "index": 0,
    "weight": 0,
    "nodes": null
};
// squeleton of a node, contains the extended (client side) properties of a node
TdNode.extended = {
    "parent": null,
    "treeIndex": 0,
    "treeWeight": 0,
    "bgcolor": "",
    "hueRange": 0,
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

    path: function() {
        return this.parent ? this.parent.path() + "/" + this.index : "/" + this.index;
    },

    level: function(){
        return this.parent ? this.parent.level() + 1 : 0;
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

    rebuildChildNodeIndex: function() {
        this.nodes.forEach(function(node, index) {
            node.index = index;
        });
    },

    rebaseChildNodeWeight: function() {
        var totalWeight = 0;
        this.nodes.forEach(function(node) {
            totalWeight += node.weight;
        });
        this.nodes.forEach(function(node) {
            node.weight = Math.round( node.weight * 100 / totalWeight * 1000) / 1000;
        });
    },

    toString: function(recursive, tab) {
        recursive = recursive || false;
        tab = tab || "";
        if(!recursive){
            return "[object TdNode (path: " + this.path() + ", header:" + this.header + ", weight: " + this.weight + ")]";
        }else{
            var log = tab + this.toString();
            if(angular.isArray(this.nodes)){ 
                this.nodes.forEach(function(childNode){
                    log += '\r\n' + childNode.toString(true, tab + "  ")
                });
            }
            return log;
        }
    }
};




