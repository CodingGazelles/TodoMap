
// squeleton of a node, contains the persitant properties of a node
TdNode.basic = {
    "label": "",
    "weight": 0,
    "opened": true,
    "index": 0,
    "childNodes": null
};
// squeleton of a node, contains the extended (client side) properties of a node
TdNode.extended = {
    "parent": null,
    "bgcolor": "#ffffff",
    "hueRange": 360,
    "labelElement": null
};

function TdNode(data) {
    _.defaults(this, TdNode.basic, TdNode.extended);
    this.nodes = [];
    // this.childNodes = new TdNodeList(this);
    data = data || {};
    var key;
    for (key in data) {
        this[key] = data[key];
    }
}

function TdNodeList(node) {
    // if (!node) throw new Error("Node can't be null");
    // this.node = node;
    // this.nodes = [];
}



TdNodeList.prototype = {
    
    insertNode: function(node, index) {
        if (index < 0) throw new RangeError("Index of node to insert can't be negative");
        if (index > this.length) throw new RangeError("Index of node to insert can't be higher than list length");

        if (index === this.length) {
            this.pushNode(node);
        }
        else {
            var previous = this.nodes[index - 1],
                next = this.nodes[index];

            if (previous) {
                // previous.next = node;
                // node.previous = previous;
            }

            if (next) {
                // next.previous = node;
                // node.next = next;
            }
            this.nodes.splice(index, 0, node);
            this.indexNodes();
        }
    },
    // deleteNode: function(index) {
    //     if (index < 0) throw new RangeError("Index of node to delete can't be negative");
    //     if (index > this.length) throw new RangeError("Index of node to delete can't be higher than list length");

    //     var previous = this.nodes[index - 1],
    //         next = this.nodes[index];

    //     if (previous && next) {
    //         // previous.next = next;
    //         // next.previous = previous;
    //     }
    //     else if (previous) {
    //         // previous.next = null;
    //     }
    //     else if (next) {
    //         // next.previous = null;
    //     }
    //     this.nodes.splice(index, 1);
    //     this.indexNodes();
    // },
    // moveNode: function(node, index) {

    // },
    
    // getNode: function(index) {
    //     return this.nodes[index];
    // },
    // length: function() {
    //     return this.nodes.length;
    // },
    // head: function() {
    //     return this.nodes[0];
    // },
    // tail: function() {
    //     return this.nodes.last;
    // }
};

TdNode.prototype = {
    
    head: function() {
        return this.nodes[0] ? this.nodes[0] : null;
    },

    tail: function() {
        return this.nodes.length != 0 ? this.nodes.last : null;
    },

    next: function(){
        if( this.isRoot()){
            return null;
        } else if( this.parent.nodes.length - this.index > 1) {
            return this.parent.node( this.index + 1)
        } else {
            return null;
        }
    },

    previous: function(){
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

    insertChild: function(node, at) {
        node.parent = this;
        this.nodes.insertNode(node, at);
        this.rebaseWeight();
    },

    createSibling: function() {
        var newNode = new TdNode();
        newNode.weight = this.weight;
        this.parent.insertChild(newNode, this.index + 1);
        return newNode;
    },

    delete: function() {
        this.parent._deleteChild(this.index);
        this.parent = null;
    },

    _pushNode: function(node) {
        this.nodes.push(node);
        this._indexNodes();
    },

    _deleteChild: function(index) {
        this.nodes.splice(index, 1);
        this._indexNodes();
        this._rebaseWeight();
    },

    _indexNodes: function() {
        this.nodes.forEach(function(node, index) {
            node.index = index;
        });
    },

    _rebaseWeight: function() {
        var totalWeight = 0;
        this.nodes.forEach(function(node) {
            totalWeight += node.weight;
        });
        this.nodes.forEach(function(node) {
            node.weight = node.weight * 100 / totalWeight;
        });
    },
    // focus: function() {
    //     if (this.labelElement) {
    //         this.labelElement[0].focus();
    //     }
    // },
    toString: function() {
        return "TdNode " + this.path() + " (" + this.label + ")";
    }
};




