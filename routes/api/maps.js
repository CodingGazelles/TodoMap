var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

//mongodb://<user>:<password>@linus.mongohq.com:10013/todomap
//mongodb://<dbuser>:<dbpassword>@ds047037.mongolab.com:47037/todomap

var server = new Server('ds047037.mongolab.com', 47037, { auto_reconnect: true });
var db = new Db('todomap', server, {native_parser:false});


db.open(function(err, db) {
    console.log("Connecting to DB");
    if (err) {
        console.log("Connection failed: " + err);
    }
    console.log("Connecting to DB done");
    
    db.authenticate( "todoapp", "todoapp", function( err, result){ 
        console.log("Authentication to DB");
        if(err){
            console.log("Authentication failed: " + err);
        }
        console.log("Authentication to DB done");
    });
});



//                db.collection('maps', {safe: true}, function(err, collection) {
//                    if (!err) {
//                        
//                        console.log("Populating collection 'maps'");
//                        collection.insert(maps, {
//                            safe: true
//                        }, function(err, result) {
//                            
//                            if (!err) {
//                                console.log("Done: " + result);
//                                db.close();
//                            }else{
//                                console.log("Error: " + err);
//                            }
//                        });
//                    }else{
//                        console.log("Collection 'maps' doesn't exist: " + err);
//                    }
//                });

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving map: ' + id);
    db.collection('maps', function(err, collection) {
        if(err) throw err;
        collection.findOne({
            '_id': new BSON.ObjectID(id)
        }, function(err, item) {
            if(err) throw err;
            res.send(item);
        });
    });
};

//var populateDB = function() {
//
//    var maps = [
//        {
//        item: {
//            label: "root"
//        },
//        split: 'h',
//        childNodes: [{
//            item: {
//                label: "courses"
//            },
//            weight: 7,
//            split: 'v',
//            childNodes: [{
//                item: {
//                    label: "samedi"
//                },
//                weight: 7,
//                split: 'h',
//                childNodes: [{
//                    item: {
//                        label: "poulet"
//                    },
//                    weight: 7,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "legumes"
//                    },
//                    weight: 7,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "chocolat"
//                    },
//                    weight: 7,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "yaourts"
//                    },
//                    weight: 7,
//                    childNodes: []
//                }]
//            }, {
//                item: {
//                    label: "dimanche"
//                },
//                weight: 7,
//                split: 'h',
//                childNodes: [{
//                    item: {
//                        label: "boeuf"
//                    },
//                    weight: 7,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "fruits"
//                    },
//                    weight: 7,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "biscuits"
//                    },
//                    weight: 7,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "perrier"
//                    },
//                    weight: 7,
//                    childNodes: []
//                }]
//            }]
//        }, {
//            item: {
//                label: "boulot"
//            },
//            weight: 17,
//            split: 'v',
//            childNodes: [{
//                item: {
//                    label: "Work Bandits"
//                },
//                weight: 12,
//                split: 'h',
//                childNodes: [{
//                    item: {
//                        label: "Business Plan"
//                    },
//                    weight: 12,
//                    split: 'v',
//                    childNodes: [{
//                        item: {
//                            label: "slide 1"
//                        },
//                        weight: 4,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "slide 2"
//                        },
//                        weight: 1,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "slide 3"
//                        },
//                        weight: 2,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "slide 4"
//                        },
//                        weight: 5,
//                        childNodes: []
//                    }]
//                }, {
//                    item: {
//                        label: "Financial Forecast"
//                    },
//                    weight: 12,
//                    split: 'v',
//                    childNodes: [{
//                        item: {
//                            label: "slide 1"
//                        },
//                        weight: 4,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "slide 2"
//                        },
//                        weight: 1,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "slide 3"
//                        },
//                        weight: 2,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "slide 4"
//                        },
//                        weight: 5,
//                        childNodes: [{
//                            item: {
//                                label: "slide 1"
//                            },
//                            weight: 2,
//                            split: 'h',
//                            childNodes: []
//                        }, {
//                            item: {
//                                label: "slide 2"
//                            },
//                            weight: 2,
//                            split: 'h',
//                            childNodes: []
//                        }]
//                    }, {
//                        item: {
//                            label: "slide 5"
//                        },
//                        weight: 2,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "slide 6"
//                        },
//                        weight: 5,
//                        childNodes: []
//                    }]
//                }]
//            }, {
//                label: "White CRM",
//                item: {
//                    label: "slide 6"
//                },
//                weight: 5,
//                split: 'h',
//                childNodes: [{
//                    item: {
//                        label: "Marketing Plan"
//                    },
//                    weight: 4,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "Dev Plan"
//                    },
//                    weight: 4,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "Strat Plan"
//                    },
//                    weight: 4,
//                    split: 'v',
//                    childNodes: [{
//                        item: {
//                            label: "Plan 1"
//                        },
//                        weight: 4,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "Plan 2"
//                        },
//                        weight: 4,
//                        childNodes: []
//                    }]
//                }, {
//                    item: {
//                        label: "Job Plan"
//                    },
//                    weight: 4,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "Tech Plan"
//                    },
//                    weight: 4,
//                    split: 'v',
//                    childNodes: [{
//                        item: {
//                            label: "Plan 1"
//                        },
//                        weight: 4,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "Plan 2"
//                        },
//                        weight: 4,
//                        childNodes: []
//                    }, {
//                        item: {
//                            label: "Plan 3"
//                        },
//                        weight: 4,
//                        childNodes: []
//                    }]
//                }]
//            }]
//        }, {
//            item: {
//                label: "City"
//            },
//            weight: 17,
//            split: 'v',
//            childNodes: [{
//                item: {
//                    label: "San Diego"
//                },
//                weight: 4,
//                childNodes: []
//            }, {
//                item: {
//                    label: "Epinay"
//                },
//                weight: 4,
//                childNodes: []
//            }, {
//                item: {
//                    label: "Paris"
//                },
//                weight: 4,
//                split: 'h',
//                childNodes: [{
//                    item: {
//                        label: "Blomet"
//                    },
//                    weight: 4,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "Tracy"
//                    },
//                    weight: 4,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "Réaumur"
//                    },
//                    weight: 4,
//                    childNodes: []
//                }, {
//                    item: {
//                        label: "Vaugirard"
//                    },
//                    weight: 4,
//                    childNodes: []
//                }]
//            }, {
//                item: {
//                    label: "Londres"
//                },
//                weight: 4,
//                childNodes: []
//            }, {
//                item: {
//                    label: "Bangkok"
//                },
//                weight: 4,
//                childNodes: []
//            }]
//        }, {
//            item: {
//                label: "People"
//            },
//            weight: 17,
//            split: 'v',
//            childNodes: [{
//                item: {
//                    label: "John"
//                },
//                weight: 4,
//                childNodes: []
//            }, {
//                item: {
//                    label: "Kiko"
//                },
//                weight: 4,
//                childNodes: []
//            }, {
//                item: {
//                    label: "Inigo"
//                },
//                weight: 4,
//                childNodes: []
//            }, {
//                item: {
//                    label: "Cuesta"
//                },
//                weight: 4,
//                childNodes: []
//            }]
//        }]
//    }];
//
//    console.log('Populating collection maps');
//    db.collection('maps', function(err, collection) {
//        console.log("In progress");
//        collection.insert(maps, {
//            safe: true
//        }, function(err, result) {
//            console.log("Done");
//            if (err) {
//                console.log("Error: " + err);
//            }
//        });
//    });
//
//};

//populateDB();