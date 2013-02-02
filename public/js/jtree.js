function TdNode(data) {
    _.defaults(this, TdNode.basic, TdNode.extended);
    this.childNodes = new TdNodeList(this);
    data = data || {};
    var key;
    for (key in data) {
        this[key] = data[key];
    }
}

function TdNodeList(node) {
    if (!node) throw new Error("Node can't be null");

    this.node = node;
    this.nodes = [];
}

// squeleton of a node, contains the persitant properties of a node
TdNode.basic = {
    "label": "",
    "weight": 0,
    "opened": true,
    "index": "",
    "childNodes": null,
};
// squeleton of a node, contains the extended (client side) properties of a node
TdNode.extended = {
    "parent": null,
    "next": null,
    "previous": null,
    "bgcolor": "#ffffff",
    "hueRange": 360,
    "labelElement": null
};

TdNodeList.prototype = {
    pushNode: function(node) {
        if (this.length() === 0) {}
        else {
            this.tail().next = node;
            node.previous = this.tail;
        }
        this.nodes.push(node);
        this.indexNodes();
    },
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
                previous.next = node;
                node.previous = previous;
            }

            if (next) {
                next.previous = node;
                node.next = next;
            }
            this.nodes.splice(index, 0, node);
            this.indexNodes();
        }
    },
    deleteNode: function(index) {
        if (index < 0) throw new RangeError("Index of node to delete can't be negative");
        if (index > this.length) throw new RangeError("Index of node to delete can't be higher than list length");

        var previous = this.nodes[index - 1],
            next = this.nodes[index];

        if (previous && next) {
            previous.next = next;
            next.previous = previous;
        }
        else if (previous) {
            previous.next = null;
        }
        else if (next) {
            next.previous = null;
        }
        this.nodes.splice(index, 1);
        this.indexNodes();
    },
    moveNode: function(node, index) {

    },
    indexNodes: function() {
        this.nodes.forEach(function(node, index) {
            node.index = index;
        });
    },
    getNode: function(index) {
        return this.nodes[index];
    },
    length: function() {
        return this.nodes.length;
    },
    head: function() {
        return this.nodes[0];
    },
    tail: function() {
        return this.nodes.last;
    }
};

TdNode.prototype = {
    path: function() {
        return this.parent ? this.parent.path() + "/" + this.index : "/" + this.index;
    },
    isRoot: function() {
        return this.parent === null;
    },
    isTerminal: function() {
        return this.childNodes.length === 0;
    },
    nodes: function() {
        return this.childNodes.nodes;
    },
    insertChild: function(node, at) {
        node.parent = this;
        this.childNodes.insertNode(node, at);
        this.rebaseWeight();
    },
    deleteChild: function(at) {
        this.childNodes.deleteNode(at);
        this.rebaseWeight();
    },
    createSibling: function() {
        var newNode = new TdNode();
        newNode.weight = this.weight;
        this.parent.insertChild(newNode, this.index + 1);
        return newNode;
    },
    delete: function() {
        this.parent.deleteChild(this.index);
    },
    rebaseWeight: function() {
        var totalWeight = 0;
        this.nodes().forEach(function(node) {
            totalWeight += node.weight;
        });
        this.nodes().forEach(function(node) {
            node.weight = node.weight * 100 / totalWeight;
        });
    },
    focus: function() {
        if (this.labelElement) {
            this.labelElement[0].focus();
        }
    },
    toString: function() {
        return "[TdNode " + this.path() + ", " + this.label + "]";
    }
};

// Build an extended node tree
var TdTree = function() {};

TdTree.buildTree = function(data) {
    var root;
    var getNodeData = function(node) {
        var attr, nodeData = {};
        for (attr in node) {
            if (attr !== "childNodes") nodeData[attr] = node[attr];
        }
        return nodeData;
    };

    (function walkDown(node, parent) {
        var newNode;

        if (!parent) {
            newNode = root = new TdNode(getNodeData(node));
        }
        else {
            newNode = new TdNode(getNodeData(node));
            newNode.parent = parent;
            parent.childNodes.pushNode(newNode);
        }

        if ("childNodes" in node) {
            for (var i = 0; i < node.childNodes.length; i++) {
                walkDown(node.childNodes[i], newNode);
            }
        }
    })(data);

    return root;
};

// remove non persistent properties from the node tree
TdTree.filterTree = function(data) {
    var root;

    (function walkDown(node, parent) {
        var newNode;

        if (!parent) {
            newNode = root = _.pick(node, _.keys(TdNode.basic), "_id");
            newNode.childNodes = [];
        }
        else {
            newNode = _.pick(node, _.keys(TdNode.basic));
            newNode.childNodes = [];
            parent.childNodes.push(newNode);
        }

        if ("childNodes" in node) {
            for (var i = 0; i < node.nodes().length; i++) {
                walkDown(node.nodes()[i], newNode);
            }
        }
    })(data);

    return root;
};
