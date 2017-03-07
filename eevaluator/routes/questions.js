
exports.addlackedskillsets = function (req, res) {
    var lackedskillset = req.body;
    console.log('Adding Lacked Skill Sets: ' + JSON.stringify(lackedskillset));
    db.collection('lackedskillsetcollection', function (err, collection) {
        collection.insert(lackedskillset, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                console.log('getting question lacked skill set');
                db.collection('lackedskillsetcollection', function (err, collection) {
                    collection.find().toArray(function (err, items) {
                        res.send(items);
                    });
                });
            }
        });
    });
}
exports.deletelackedskillset = function (req, res) {
    var id = req.params.id;
    console.log('Deleting lackedskillset: ' + id);
    db.collection('lackedskillsetcollection', function (err, collection) {
        collection.remove({ '_id': new ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
exports.updatefileuploaded = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = files.file;

        var questionno = fields.questionno;
        var id = fields.imageid;
        var tempPath = file.path;
        var targetPath = path.resolve('./public/images/' + file.name);

        fs.rename(tempPath, targetPath, function (err) {
            if (err) {
                throw err
            }
            else {

                var data = fs.readFileSync(targetPath);

                var imageType = file.type;
                var imageName = file.name;
                fs.unlink(targetPath);
                console.log("file now deleted");

                db.collection('questionimagecollection', function (err, collection) {
                    collection.update({ '_id': new ObjectID(id) }, { questionno: questionno, imagename: imageName, imagetype: imageType, image: data }, { safe: true }, function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        }
                        else {

                            res.send(result);
                        }
                    });
                });
            }
        });

    });

}


exports.uploadAvatar = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = files.file;
        var fsiz = file.size;
        var questionno = fields.questionno;
        var tempPath = file.path;

        var targetPath = path.resolve('./public/images/' + file.name);
        
        fs.rename(tempPath, targetPath, function (err) {
            if (err) {
                throw err
            }
            else {
                var data = fs.readFileSync(targetPath);
                var imageType = file.type;
                var imageName = file.name;
                fs.unlink(targetPath);
                db.collection('questionimagecollection', function (err, collection) {
                    collection.insert({ questionno: questionno, imagename: imageName, imagetype: imageType, image: data }, { safe: true }, function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        }
                        else {

                            res.send(result);
                        }
                    });
                });


            }
        });
    });

};
exports.findquestionavatarbyid = function (req, res) {
    var id = req.params.id;
    db.collection('questionimagecollection', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });

    });
};


exports.fileUpload = function (req, res) {
    var file = req.body;
    db.collection('questionimagecollection', function (err, collection) {
        collection.insert(file, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
exports.updatequestion = function (req, res) {
    var id = req.params.id;
    var question = req.body;
    db.collection('questioncollection', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, question, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(question);
            }
        });
    });
}
exports.addquestion = function (req, res) {
    var question = req.body;
    db.collection('questioncollection', function (err, collection) {
        collection.insert(question, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result[0]);
            }
        });
    });
}

exports.findLackedSkillSets = function (req, res) {
    db.collection('lackedskillsetcollection', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};
exports.deletequestion = function (req, res) {
    var id = req.params.id;
    db.collection('questioncollection', function (err, collection) {
        collection.remove({ '_id': new ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
exports.findquestionbyid = function (req, res) {
    var id = req.params.id;
    db.collection('questioncollection', function (err, collection) {
        collection.findOne({ '_id': new ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};

exports.findAllQuestions = function (req, res) {
    db.collection('questioncollection', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};
exports.questioncount = function (req, res) {
    db.collection('questioncollection', function (err, collection) {
        collection.count(function (err, item) {
            console.log('Score' + item);
            res.send(JSON.stringify(item));
        });
    });
};