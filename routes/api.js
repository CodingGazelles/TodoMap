//TODO: remove file

exports.tree = function(req, res) {

    var tree = {
        item: {
            label: "root"
        },
        split: 'h',
        childNodes: [{
            item: {
                label: "courses"
            },
            weight: 7,
            split: 'v',
            childNodes: [{
                item: {
                    label: "samedi"
                },
                weight: 7,
                split: 'h',
                childNodes: [{
                    item: {
                        label: "poulet"
                    },
                    weight: 7,
                    childNodes: []
                }, {
                    item: {
                        label: "legumes"
                    },
                    weight: 7,
                    childNodes: []
                }, {
                    item: {
                        label: "chocolat"
                    },
                    weight: 7,
                    childNodes: []
                }, {
                    item: {
                        label: "yaourts"
                    },
                    weight: 7,
                    childNodes: []
                }]
            }, {
                item: {
                    label: "dimanche"
                },
                weight: 7,
                split: 'h',
                childNodes: [{
                    item: {
                        label: "boeuf"
                    },
                    weight: 7,
                    childNodes: []
                }, {
                    item: {
                        label: "fruits"
                    },
                    weight: 7,
                    childNodes: []
                }, {
                    item: {
                        label: "biscuits"
                    },
                    weight: 7,
                    childNodes: []
                }, {
                    item: {
                        label: "perrier"
                    },
                    weight: 7,
                    childNodes: []
                }]
            }]
        }, {
            item: {
                label: "boulot"
            },
            weight: 17,
            split: 'v',
            childNodes: [{
                item: {
                    label: "Work Bandits"
                },
                weight: 12,
                split: 'h',
                childNodes: [{
                    item: {
                        label: "Business Plan"
                    },
                    weight: 12,
                    split: 'v',
                    childNodes: [{
                        item: {
                            label: "slide 1"
                        },
                        weight: 4,
                        childNodes: []
                    }, {
                        item: {
                            label: "slide 2"
                        },
                        weight: 1,
                        childNodes: []
                    }, {
                        item: {
                            label: "slide 3"
                        },
                        weight: 2,
                        childNodes: []
                    }, {
                        item: {
                            label: "slide 4"
                        },
                        weight: 5,
                        childNodes: []
                    }]
                }, {
                    item: {
                        label: "Financial Forecast"
                    },
                    weight: 12,
                    split: 'v',
                    childNodes: [{
                        item: {
                            label: "slide 1"
                        },
                        weight: 4,
                        childNodes: []
                    }, {
                        item: {
                            label: "slide 2"
                        },
                        weight: 1,
                        childNodes: []
                    }, {
                        item: {
                            label: "slide 3"
                        },
                        weight: 2,
                        childNodes: []
                    }, {
                        item: {
                            label: "slide 4"
                        },
                        weight: 5,
                        childNodes: [{
                            item: {
                                label: "slide 1"
                            },
                            weight: 2,
                            split: 'h',
                            childNodes: []
                        }, {
                            item: {
                                label: "slide 2"
                            },
                            weight: 2,
                            split: 'h',
                            childNodes: []
                        }]
                    }, {
                        item: {
                            label: "slide 5"
                        },
                        weight: 2,
                        childNodes: []
                    }, {
                        item: {
                            label: "slide 6"
                        },
                        weight: 5,
                        childNodes: []
                    }]
                }]
            }, {
                label: "White CRM",
                item: {
                    label: "slide 6"
                },
                weight: 5,
                split: 'h',
                childNodes: [{
                    item: {
                        label: "Marketing Plan"
                    },
                    weight: 4,
                    childNodes: []
                }, {
                    item: {
                        label: "Dev Plan"
                    },
                    weight: 4,
                    childNodes: []
                }, {
                    item: {
                        label: "Strat Plan"
                    },
                    weight: 4,
                    split: 'v',
                    childNodes: [{
                        item: {
                            label: "Plan 1"
                        },
                        weight: 4,
                        childNodes: []
                    }, {
                        item: {
                            label: "Plan 2"
                        },
                        weight: 4,
                        childNodes: []
                    }]
                }, {
                    item: {
                        label: "Job Plan"
                    },
                    weight: 4,
                    childNodes: []
                }, {
                    item: {
                        label: "Tech Plan"
                    },
                    weight: 4,
                    split: 'v',
                    childNodes: [{
                        item: {
                            label: "Plan 1"
                        },
                        weight: 4,
                        childNodes: []
                    }, {
                        item: {
                            label: "Plan 2"
                        },
                        weight: 4,
                        childNodes: []
                    }, {
                        item: {
                            label: "Plan 3"
                        },
                        weight: 4,
                        childNodes: []
                    }]
                }]
            }]
        }, {
            item: {
                label: "City"
            },
            weight: 17,
            split: 'v',
            childNodes: [{
                item: {
                    label: "San Diego"
                },
                weight: 4,
                childNodes: []
            }, {
                item: {
                    label: "Epinay"
                },
                weight: 4,
                childNodes: []
            }, {
                item: {
                    label: "Paris"
                },
                weight: 4,
                split: 'h',
                childNodes: [{
                    item: {
                        label: "Blomet"
                    },
                    weight: 4,
                    childNodes: []
                }, {
                    item: {
                        label: "Tracy"
                    },
                    weight: 4,
                    childNodes: []
                }, {
                    item: {
                        label: "Réaumur"
                    },
                    weight: 4,
                    childNodes: []
                }, {
                    item: {
                        label: "Vaugirard"
                    },
                    weight: 4,
                    childNodes: []
                }]
            }, {
                item: {
                    label: "Londres"
                },
                weight: 4,
                childNodes: []
            }, {
                item: {
                    label: "Bangkok"
                },
                weight: 4,
                childNodes: []
            }]
        }, {
            item: {
                label: "People"
            },
            weight: 17,
            split: 'v',
            childNodes: [{
                item: {
                    label: "John"
                },
                weight: 4,
                childNodes: []
            }, {
                item: {
                    label: "Kiko"
                },
                weight: 4,
                childNodes: []
            }, {
                item: {
                    label: "Inigo"
                },
                weight: 4,
                childNodes: []
            }, {
                item: {
                    label: "Cuesta"
                },
                weight: 4,
                childNodes: []
            }]
        }]
    };
    res.json(tree);
};