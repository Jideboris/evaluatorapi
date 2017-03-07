

exports.deleteadmin = function (req, res) {
    var id = req.params.id;

    db.collection('admincollection', function (err, collection) {
        collection.remove({ '_id': new ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                res.send(req.body);
            }
        });
    });
}
exports.findAdminById = function (req, res) {
    var id = req.params.id;
    db.collection('admincollection', function (err, collection) {
        collection.findOne({ '_id': new ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};
exports.findAllAdmins = function (req, res) {
    db.collection('admincollection', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};
exports.addadmin = function (req, res) {
    var admin = req.body;
    db.collection('admincollection', function (err, collection) {
        collection.insert(admin, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result[0]);
            }
        });
    });
}
exports.updateadmin = function (req, res) {
    var id = req.params.id;
    var admin = req.body;

    db.collection('admincollection', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, admin, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(admin);
            }
        });
    });
}
exports.findLocationById = function (req, res) {
    var id = req.params.id;
    db.collection('locationcollection', function (err, collection) {
        collection.findOne({ '_id': new ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};
exports.findsubjectbyid = function (req, res) {
    var id = req.params.id;
    db.collection('subjectcollection', function (err, collection) {
        collection.findOne({ '_id': new ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};

exports.findtopicbyid = function (req, res) {
    var id = req.params.id;
    db.collection('topicscollection', function (err, collection) {
        collection.findOne({ '_id': new ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};
exports.getsubjecttopics = function (req, res) {
    var selectedsubject = req.params.selectedsubject;
    db.collection('topicscollection', function (err, collection) {
        collection.find({ subject: selectedsubject }).toArray(function (err, items) {
            res.send(items);
        });
    });
}
exports.findAllTopics = function (req, res) {
    var level1 = req.params.level1;
    var level2 = req.params.level2;

    db.collection('topicscollection', function (err, collection) {
        collection.find({ level: { $in: [level1, level2] } }).toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.findAllSubjectTopics = function (req, res) {
    var selectedsubject = req.params.selectedsubject;
    var selectedlevel = req.params.selectedlevel;
    var level = selectedlevel.replace('-', '/');
    db.collection('topicscollection', function (err, collection) {
        collection.find({ subject: selectedsubject, level: level }).toArray(function (err, items) {
            res.send(items);
        });
    });
};



exports.findAllSubjects = function (req, res) {
    var level1 = req.params.level1;
    var level2 = req.params.level2;
    var level3 = req.params.level3;

    db.collection('subjectcollection', function (err, collection) {
        collection.find({ level: { $in: [level1, level2, level3] } }).toArray(function (err, items) {
            res.send(items);
        });

    });
};

exports.findAllLocations = function (req, res) {
    db.collection('locationcollection', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.addtopic = function (req, res) {
    var topic = req.body;

    db.collection('topicscollection', function (err, collection) {
        collection.insert(topic, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result[0]);
            }
        });
    });
}

exports.addlocation = function (req, res) {
    var location = req.body;

    db.collection('locationcollection', function (err, collection) {
        collection.insert(location, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result[0]);
            }
        });
    });
}
exports.addsubject = function (req, res) {
    var subject = req.body;
    db.collection('subjectcollection', function (err, collection) {
        collection.insert(subject, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result[0]);
            }
        });
    });
}

exports.updatetopic = function (req, res) {
    var id = req.params.id;
    var topic = req.body;

    db.collection('topicscollection', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, topic, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(topic);
            }
        });
    });
}

exports.updatelocation = function (req, res) {
    var id = req.params.id;
    var location = req.body;

    db.collection('locationcollection', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, location, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(location);
            }
        });
    });
}
exports.updatesubject = function (req, res) {
    var id = req.params.id;
    var subject = req.body;
    db.collection('subjectcollection', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, subject, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(subject);
            }
        });
    });
}

exports.deletetopic = function (req, res) {
    var id = req.params.id;

    db.collection('topicscollection', function (err, collection) {
        collection.remove({ '_id': new ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {

                res.send(req.body);
            }
        });
    });
}

exports.deletelocation = function (req, res) {
    var id = req.params.id;

    db.collection('locationcollection', function (err, collection) {
        collection.remove({ '_id': new ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                res.send(req.body);
            }
        });
    });
}

exports.deletesubject = function (req, res) {
    var id = req.params.id;
    db.collection('subjectcollection', function (err, collection) {
        collection.remove({ '_id': new ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                res.send(req.body);
            }
        });
    });
};









