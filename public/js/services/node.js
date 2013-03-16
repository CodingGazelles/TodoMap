
// squeleton of a node, contains the persitant properties of a node
TdNode.basic = {
    "header": "",
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

    rebuildIndex: function() {
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

    toString: function() {
        return "[object TdNode (path: " + this.path() + ", label:" + this.label + ", weight: " + this.weight + ")]";
    },

    printBranch: function(tab){
        tab = tab || "";
        console.log(tab + this);
        if(angular.isArray(this.nodes)){ 
            this.nodes.forEach(function(childNode){
                childNode.printBranch(tab + " ");
            });
        }
    }
};




