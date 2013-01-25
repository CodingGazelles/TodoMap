function TdNode(parent, data) {
    this.parent = parent || null;
    this.data = data || {};

    var key;
    for (key in data) {
        this[key] = data[key];
    }

    this.children = [];
}

TdNode.childrenAttr = "childNodes";
TdNode.parse = function(data) {
    var root;
    var getNodeData = function(node) {
        var attr, nodeData = {};
        for (attr in node) {
            if (attr !== TdNode.childrenAttr) nodeData[attr] = node[attr];
        }
        return nodeData;
    };

    (function walkDown(node, parent) {
        var newNode;
        
        if (!parent) {
            newNode = root = new TdNode(null, getNodeData(node));
        } else {
            newNode = parent.appendChild( getNodeData(node));
        }
        
        if (TdNode.childrenAttr in node) {
            for (var i = 0; i < node[TdNode.childrenAttr].length; i++) {
                walkDown(node[TdNode.childrenAttr][i], newNode);
            }
        }
    })(data);

    return root;
};

TdNode.prototype = {
    isRoot: function() {
        return this.parent === null;
    },
    isTerminal: function() {
        return this[TdNode.childrenAttr] === undefined || this[TdNode.childrenAttr].length === 0;
    },
    
    appendChild: function(data){
        var newNode = new TdNode( this , data);
        parent[TdNode.childrenAttr].push(newNode);
        
        return newNode;
    }
};