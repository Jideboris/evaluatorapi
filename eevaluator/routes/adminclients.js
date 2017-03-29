exports.deleteschool = function (req, res) {
    var id = req.params.id;
    console.log('Deleting school: ' + id);
    db.collection('schoolcollection', function (err, collection) {
        collection.remove({ '_id': new ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' school(s) deleted');
                res.send(req.body);
            }
        });
    });
};
exports.addschool = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = files.file;
        var ceofullname = fields.ceofullname;
        var schooldescription = fields.schooldescription;
        var registeredname = fields.registeredname;
        var locationaddress = fields.locationaddress;
        var regnumber = fields.regnumber;
        var contactemailadmin = fields.contactemailadmin;
        var contacttelephoneadmin = fields.contacttelephoneadmin;
        var websiteurl = fields.websiteurl;
        var brandcolor = fields.brandcolor;
        var schoolpasscode = fields.schoolpasscode;
        var tempPath = '';
        var targetPath = '';
        var data = '';
        if (file != null) {
            tempPath = file.path;
            targetPath = path.resolve('./public/images/' + file.name);

            fs.rename(tempPath, targetPath, function (err) {
                if (err) {
                    throw err
                }
                else {

                    data = fs.readFileSync(targetPath);

                    var imageType = file.type;
                    var imageName = file.name;

                    fs.unlink(targetPath);

                }
            })
        }

        db.collection('schoolcollection', function (err, collection) {
            collection.insert(
                {
                    ceofullname: ceofullname,
                    schooldescription: schooldescription,
                    registeredname: registeredname,
                    locationaddress: locationaddress,
                    regnumber: regnumber,
                    contactemailadmin: contactemailadmin,
                    contacttelephoneadmin: contacttelephoneadmin,
                    websiteurl: websiteurl,
                    brandcolor: brandcolor,
                    schoolpasscode: schoolpasscode,
                    locked: 0,
                    modellocked: Boolean(false),
                    logo: data

                }, { safe: true }, function (err, result) {
                    if (err) {
                        res.send({ 'error': 'An error has occurred' });
                    } else {

                        console.log('Success: ' + JSON.stringify(result.insertedIds[0]));
                        res.send(JSON.stringify(result));

                    }
                });
        });


    });

};
exports.addschoolaccount = function (req, res) {
    var mail = req.params.mail;
    var passcode = req.params.passcode;
    var schoolname = req.params.schoolname;
    var username = req.params.username;
    var license = req.params.license;

    db.collection('schoolaccountcollection', function (err, collection) {
        collection.insert({
            adminemail: mail,
            passcode: passcode,
            schoolname: schoolname,
            username: username,
            license: license,
            locked: false
        }, { safe: true }, function (err, result) {
            if (err) {
                console.log('school account: ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' school account(s) updated');
                res.send(result);
            }
        });
    });
};

exports.updateschool = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = files.file;
        var ceofullname = fields.ceofullname;
        var schooldescription = fields.schooldescription;
        var registeredname = fields.registeredname;
        var locationaddress = fields.locationaddress;
        var regnumber = fields.regnumber;
        var contactemailadmin = fields.contactemailadmin;
        var contacttelephoneadmin = fields.contacttelephoneadmin;
        var websiteurl = fields.websiteurl;
        var brandcolor = fields.brandcolor;
        var schoolpasscode = fields.schoolpasscode;
        var locked = fields.locked;
        var modellocked = Boolean(fields.modellocked);
        var id = fields.id;

        var tempPath = '';
        var targetPath = '';
        var data = '';
        if (file != null) {
            tempPath = file.path;
            targetPath = path.resolve('./public/images/' + file.name);

            fs.rename(tempPath, targetPath, function (err) {
                if (err) {
                    throw err
                }
                else {

                    data = fs.readFileSync(targetPath);

                    var imageType = file.type;
                    var imageName = file.name;

                    console.log(imageType);
                    console.log(imageName);

                    console.log(file.name + " upload complete for user: ");
                    fs.unlink(targetPath);
                    console.log("file now deleted");

                }
            })
        }

        db.collection('schoolcollection', function (err, collection) {
            collection.update({ '_id': new ObjectID(id) }, {
                ceofullname: ceofullname,
                schooldescription: schooldescription,
                registeredname: registeredname,
                locationaddress: locationaddress,
                regnumber: regnumber,
                contactemailadmin: contactemailadmin,
                contacttelephoneadmin: contacttelephoneadmin,
                websiteurl: websiteurl,
                brandcolor: brandcolor,
                schoolpasscode: schoolpasscode,
                locked: locked,
                modellocked: modellocked,
                logo: data
            }, { safe: true }, function (err, result) {
                if (err) {
                    console.log('Error updating question: ' + err);
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log('' + result + ' school(s) updated');
                    res.send(JSON.stringify(result));
                }
            });
        });


    });

};
exports.updateaccount = function (req, res) {
    var id = req.params.id;
    var locked = parseInt(req.params.updatedlocked);
    console.log(locked);
    var lock = JSON.parse(req.params.lock);
    console.log(lock);
    console.log('Updating schools accounts: ' + id);
    console.log(JSON.stringify(locked));
    db.collection('schoolcollection', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, { $set: { locked: locked, modellocked: lock } }, { safe: true }, function (err, result) {
            if (err) {
                console.log('Error updating accounts: ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('passed ');
                db.collection('schoolcollection', function (err, collection) {
                    collection.find().toArray(function (err, items) {
                        res.send(items);
                    });
                });

            }
        });
    });
}
exports.findschool = function (req, res) {
    var lock = req.params.chklocked;

    db.collection('schoolcollection', function (err, collection) {
        collection.find({ locked: { $eq: parseInt(lock) } }).toArray(function (err, items) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(items);
                res.send(items);
            }

        });
    });
};
exports.findalllockedschool = function (req, res) {
    console.log('findalllockedschool');
    var lock = JSON.parse(req.params.locked);
    console.log(JSON.parse(req.params.locked));

    db.collection('schoolcollection', function (err, collection) {
        collection.find({ modellocked: lock }).toArray(function (err, items) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(items);
                res.send(items);
            }

        });
    });
};
exports.clientidentity = function (req, res) {
    var category = req.params.category;
    var identity = req.params.identity;
    var parameter = ''
    switch (category) {
        case 'school':
            parameter = identity.toString();
            db.collection('schoolcollection', function (err, collection) {
                collection.find({ regnumber: parameter, locked: 0 }).toArray(function (err, items) {
                    res.send(items);
                });
            });
            break;

        case 'admin':
            parameter = identity;
            db.collection('admincollection', function (err, collection) {
                collection.find({ username: parameter, locked: false }).toArray(function (err, items) {
                    res.send(items);
                });
            });
            break;
        case 'teacher':
            parameter = identity;
            db.collection('schoolteachercollection', function (err, collection) {
                collection.find({ username: parameter, "schoolteacher.suspended": false }).toArray(function (err, items) {
                    res.send(items);
                });
            });
            break;
        case 'student':
            parameter = identity;
            db.collection('schoolstudentcollection', function (err, collection) {
                collection.find({ username: parameter, "schoolstudent.suspended": false }).toArray(function (err, items) {
                    res.send(items);
                });
            });
            break;
        case 'parent':
            parameter = identity;
            console.log(parameter);
            db.collection('schoolstudentcollection', function (err, collection) {
                collection.find({ parentusername: parameter, "schoolstudent.suspended": false }).toArray(function (err, items) {
                    res.send(items);
                });
            });
            break;
    }

};
exports.findallschool = function (req, res) {
    console.log('getting all schools');
    var final = [];
    db.collection('schoolcollection', function (err, collection) {
        collection.find().toArray(function (err, items) {
            items.forEach(function (element) {
                element.locked = JSON.parse(element.locked);
                console.log(element.locked);
                final.push(element);
            }, this);

            res.send(final);
        });
    });
};
exports.findschoolbyid = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving school: ' + id);
    db.collection('schoolcollection', function (err, collection) {
        collection.findOne({ '_id': new ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};
