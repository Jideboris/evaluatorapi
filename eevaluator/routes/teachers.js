

exports.getschoolteachersubjects = function (req, res) {
    var raw = req.params.authdata;
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {

                var teacherdetails = processteacher(result);
                res.send(teacherdetails);
            }
        });
    });


};
exports.getallassignmentsdetails = function (req, res) {
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teacherstudentassignmentcollection', function (error, collect) {
                    collect.find({ teacherid: new ObjectID(teacherresult[0]._id), level: level, subject: selectedsubject }).toArray(function (err, resulted) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else if (resulted != null && typeof (resulted) != 'undefined' && resulted.length > 0) {
                            var assigments = [];
                            for (var i = 0; i <= resulted.length - 1; i++) {
                                var assignment = {};

                                var id = resulted[i]._id;
                                var assignmentdescription = resulted[i].assignmentdescription;

                                assignment = {
                                    id: id,
                                    assignmentdescription: assignmentdescription
                                }

                                assigments.push(assignment);
                            }
                            res.send(JSON.stringify(assigments));
                        }
                        else {
                            res.send('No record found');
                        }
                    });
                })
            }
        })
    })
}
exports.getanassignmentdetails = function (req, res) {
    var id = req.params.id;
    var studentteacherassignmentslist = [];
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teacherstudentassignmentcollection', function (error, collection) {
                    collection.find({ teacherid: new ObjectID(teacherresult[0]._id), _id: new ObjectID(id), level: level, subject: selectedsubject }).toArray(function (err, resulted) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else if (resulted != null && typeof (resulted) != 'undefined' && resulted.length > 0) {

                            res.send({
                                filename: resulted[0].filename,
                                filetype: resulted[0].imagetype
                            });

                        }
                        else {
                            res.send('No record found');
                        }
                    });
                })
            }
        })
    })
}
exports.getteachingmethodimage = function (req, res) {
    var id = req.params.id;
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teachingmethods', function (error, collection) {
                    collection.find({ _id: new ObjectID(id) }).toArray(function (err, resulted) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else if (resulted != null && typeof (resulted) != 'undefined' && resulted.length > 0) {
                            var targetPath = path.resolve('./public/images/' + resulted[0].filename);
                            fs.writeFile(targetPath, resulted[0].image.buffer, function (err) {
                                if (err) {
                                    return res.send(err);
                                }
                                res.writeHead(200, {
                                    'Content-Type': resulted[0].imagetype,
                                    'Content-Length': resulted[0].filesize,
                                    'Content-Disposition': resulted[0].filename
                                });

                                var filestream = fs.createReadStream(targetPath);
                                filestream.pipe(res);
                                fs.unlink(targetPath);

                            });
                        }
                        else {
                            res.send('No record found');
                        }
                    });
                })
            }
        })
    })
}
exports.getteacherquestionimage = function (req, res) {
    var id = req.params.id;
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('questionsfromteacher', function (error, collection) {
                    collection.find({ _id: new ObjectID(id) }).toArray(function (err, resulted) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else if (resulted != null && typeof (resulted) != 'undefined' && resulted.length > 0) {
                            var targetPath = path.resolve('./public/images/' + resulted[0].filename);
                            fs.writeFile(targetPath, resulted[0].image.buffer, function (err) {
                                if (err) {
                                    return res.send(err);
                                }
                                res.writeHead(200, {
                                    'Content-Type': resulted[0].imagetype,
                                    'Content-Length': resulted[0].filesize,
                                    'Content-Disposition': resulted[0].filename
                                });

                                var filestream = fs.createReadStream(targetPath);
                                filestream.pipe(res);
                                fs.unlink(targetPath);

                            });
                        }
                        else {
                            res.send('No record found');
                        }
                    });
                })
            }
        })
    })
}
exports.getanassignment = function (req, res) {
    var id = req.params.id;
    var studentteacherassignmentslist = [];
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teacherstudentassignmentcollection', function (error, collection) {
                    collection.find({ teacherid: new ObjectID(teacherresult[0]._id), _id: new ObjectID(id), level: level, subject: selectedsubject }).toArray(function (err, resulted) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else if (resulted != null && typeof (resulted) != 'undefined' && resulted.length > 0) {

                            var targetPath = path.resolve('./public/images/' + resulted[0].filename);
                            fs.writeFile(targetPath, resulted[0].image.buffer, function (err) {
                                if (err) {
                                    res.send(err);
                                }
                                res.writeHead(200, {
                                    'Content-Type': resulted[0].imagetype,
                                    'Content-Length': resulted[0].filesize,
                                    'Content-Disposition': resulted[0].filename
                                });

                                var filestream = fs.createReadStream(targetPath);
                                filestream.pipe(res);
                                fs.unlink(targetPath);

                            });
                        }
                        else {
                            res.send('No record found');
                        }
                    });
                })
            }
        })
    })
}
exports.deleteassignments = function (req, res) {
    var id = req.params.id;
    var studentteacherassignmentslist = [];
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teacherstudentassignmentcollection', function (error, collection) {
                    collection.remove({ teacherid: new ObjectID(teacherresult[0]._id), _id: new ObjectID(id) });

                })
            }
            res.send('done');
        })
    })
}
exports.gettodayteachersubjectassignment = function (req, res) {
    var studentteacherassignmentslist = [];
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teacherstudentassignmentcollection', function (error, collection) {
                    collection.find({ teacherid: new ObjectID(teacherresult[0]._id), level: level, subject: selectedsubject }).toArray(function (err, resulted) {

                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else if (resulted != null && typeof (resulted) != 'undefined' && resulted.length > 0) {

                            for (var i = 0; i <= resulted.length - 1; i++) {
                                var studentteacherassignments = {};
                                var attend = resulted[i].attendance;
                                var assignmentdescription = resulted[i].assignmentdescription;
                                var level = resulted[i].level;
                                var subject = resulted[i].subject;
                                var date = resulted[i].dateadded;
                                var id = resulted[i]._id;
                                var status = resulted[i].status;

                                studentteacherassignments = {
                                    attendance: attend,
                                    assignments: assignmentdescription,
                                    level: level,
                                    subject: subject,
                                    dateadded: date,
                                    id: id,
                                    status: status
                                }

                                studentteacherassignmentslist.push(studentteacherassignments);
                            }
                            res.send(JSON.stringify(studentteacherassignmentslist));

                        }
                        else {
                            res.send('No record found');
                        }
                    });
                })
            }
        })
    })
}
exports.getassignmentsscores = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var dateadded = common.gettodaydate();
        var raw = fields.authdata;
        var selectedlevel = fields.selectedlevel;
        var selectedsubject = fields.selectedsubject;
        var selectedassignment = fields.selectedassignment;
        var assignmentdetails = fields.assignmentdetails;
        var level = selectedlevel.replace('-', '/');
        var decoded = common.decode(raw);

        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                    var teacherid = new ObjectID(teacherresult[0]._id);
                    db.collection('teacherstudentassignmentscores', function (err, teacherstudentassignmentscores) {
                        teacherstudentassignmentscores.find({
                            teacherid: teacherid,
                            level: level,
                            selectedassignment: selectedassignment,
                            subject: selectedsubject

                        }).toArray(function (err, result) {
                            if (err) {
                                res.send({ 'error': 'An error has occurred' });
                            }
                            else if (result != null && typeof (result) != 'undefined' && result.length > 0) {
                                var data = {
                                    id: result[0]._id,
                                    teacherid: result[0].teacherid,
                                    subject: result[0].subject,
                                    level: result[0].level,
                                    totalscores: result[0].totalscores,
                                    selectedassignment: result[0].selectedassignment,
                                    assignmentdetails: result[0].assignmentdetails,
                                    dateadded: result[0].dateadded

                                }
                                res.send(data);
                            }

                        });
                    })
                }
            })
        })
    })
}
exports.saveassignmentsscores = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var dateadded = common.gettodaydate();
        var raw = fields.authdata;
        var selectedlevel = fields.selectedlevel;
        var selectedsubject = fields.selectedsubject;
        var selectedassignment = fields.selectedassignment;
        var assignmentdetails = fields.assignmentdetails;
        var totalscores = fields.totalscores;
        var level = selectedlevel.replace('-', '/');
        var decoded = common.decode(raw);

        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                    var teacherid = new ObjectID(teacherresult[0]._id);
                    db.collection('teacherstudentassignmentscores', function (err, teacherstudentassignmentscores) {
                        teacherstudentassignmentscores.find({
                            teacherid: teacherid,
                            level: level,
                            subject: selectedsubject,
                            dateadded: dateadded
                        }).toArray(function (err, result) {
                            if (err) {
                                res.send({ 'error': 'An error has occurred' });
                            }
                            if (result != null && typeof (result) != 'undefined' && result.length > 0) {
                                teacherstudentassignmentscores.remove({
                                    teacherid: teacherid,
                                    level: level,
                                    selectedassignment: selectedassignment,
                                    subject: selectedsubject,
                                    dateadded: dateadded
                                });
                            }
                            teacherstudentassignmentscores.insert({
                                teacherid: teacherid,
                                subject: selectedsubject,
                                level: level,
                                selectedassignment: selectedassignment,
                                assignmentdetails: assignmentdetails,
                                totalscores: totalscores,
                                dateadded: dateadded

                            }, { safe: true }, function (err, result) {
                                if (err) {
                                    res.send({ status: 'failed' });
                                } else {
                                    var data = {
                                        id: result.insertedIds[0],
                                        teacherid: teacherid,
                                        subject: selectedsubject,
                                        level: level,
                                        selectedassignment: selectedassignment,
                                        assignmentdetails: assignmentdetails,
                                        totalscores: totalscores,
                                        dateadded: dateadded

                                    }
                                    res.send(data);
                                }

                            });
                        });
                    })
                }
            })
        })
    })
}
exports.gettodayteachersubjecttest = function (req, res) {
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teachertodaysubjecttestsetupcollection', function (error, collect) {
                    collect.find({ teacherid: new ObjectID(teacherresult[0]._id), level: level, subject: selectedsubject }).toArray(function (err, resulted) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else if (resulted != null && typeof (resulted) != 'undefined' && resulted.length > 0) {
                            var assigments = [];
                            for (var i = 0; i <= resulted.length - 1; i++) {
                                var assignment = {};

                                var id = resulted[i]._id;
                                var assignmentdescription = resulted[i].assignmentdescription;

                                assignment = {
                                    id: id,
                                    assignmentdescription: assignmentdescription
                                }

                                assigments.push(assignment);
                            }
                            res.send(JSON.stringify(assigments));
                        }
                        else {
                            res.send('No record found');
                        }
                    });
                })
            }
        })
    })
}
exports.gettodayteachersubjecttest = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var todaytestsetup = {};
        var dateadded = common.gettodaydate();
        var raw = fields.authdata;
        var selectedlevel = fields.selectedlevel;
        var selectedsubject = fields.selectedsubject;
        var level = selectedlevel.replace('-', '/');
        var decoded = common.decode(raw);

        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {

                    db.collection('teachertodaysubjecttestsetupcollection', function (err, teachertodaysubjecttestsetupcollection) {
                        teachertodaysubjecttestsetupcollection.find({
                            teacherid: new ObjectID(teacherresult[0]._id),
                            level: level,
                            subject: selectedsubject,
                            dateadded: dateadded
                        }).toArray(function (err, result) {
                            if (err) {
                                res.send({ 'error': 'An error has occurred' });
                            } else if (result != null && typeof (result) != 'undefined' && result.length > 0) {
                                var attend = result[0].attendance;
                                var processedtopics = result[0].processedtopics;
                                var level = result[0].level;
                                var subject = result[0].subject;

                                todaytestsetup = {
                                    attendance: attend,
                                    processedtopics: processedtopics,
                                    level: level,
                                    subject: subject
                                }
                                res.send(todaytestsetup);

                            }
                            else {
                                res.send('No record found');
                            }
                        });
                    })
                }
            })
        })
    })
}
exports.getteacherstudentsubjecttest = function (req, res) {
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teachertodaysubjecttestsetupcollection', function (error, collect) {
                    collect.find({ teacherid: new ObjectID(teacherresult[0]._id), level: level, subject: selectedsubject }).toArray(function (err, resulted) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else if (resulted != null && typeof (resulted) != 'undefined' && resulted.length > 0) {
                            var testsetup = [];
                            for (var i = 0; i <= resulted.length - 1; i++) {
                                var indate = resulted[i].dateadded;
                                var inrange = common.comparedate(indate);
                                if (inrange) {
                                    var testset = {}
                                    testset.description = indate;
                                    testsetup.push(testset);
                                }
                            }
                            res.send(JSON.stringify(testsetup));

                        }
                        else {
                            res.send('No record found');
                        }
                    });
                })
            }
        })
    })
}

exports.checkassignmentdescription = function (req, res) {
    var description = req.params.description;
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teacherstudentassignmentscores', function (err, teacherstudentassignmentscores) {
                    teacherstudentassignmentscores.find({
                        teacherid: teacherresult[0]._id,
                        level: level,
                        subject: selectedsubject,
                        selectedassignment: description
                    }).toArray(function (err, r) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            if (r.length > 0 && r[0] != '' && typeof (r[0] != 'undefined')) {
                                res.send(true);
                            }
                            else {
                                res.send(false);
                            }
                        }
                    });
                })
            }
        })
    })
}
exports.getteacherstudentsubjectattendance = function (req, res) {
    var teacherstudentsubjectattendance = [];
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teachersubjectstudentattendancecollection', function (err, collection) {
                    collection.find({
                        teacherid: new ObjectID(teacherresult[0]._id),
                        selectedlevel: level,
                        selectedsubject: selectedsubject,
                        dateadded: dateadded
                    }).toArray(function (err, r) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            if (r.length > 0 && r[0] != '' && typeof (r[0] != 'undefined')) {
                                res.send(r[0].todayattendance);
                            }
                            else {
                                res.send("zero attendance");
                            }
                        }
                    });
                })
            }
        })
    })
}
exports.getteacherstudentlivesubjectattendance = function (req, res) {
    var teacherstudentsubjectattendance = [];
    var dateadded = common.gettodaydate();
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teacherstudentassignmentcollection', function (err, teacherstudentassignmentcollection) {
                    teacherstudentassignmentcollection.find({
                        teacherid: new ObjectID(teacherresult[0]._id),
                        level: level,
                        subject: selectedsubject,
                        dateadded: dateadded
                    }).toArray(function (err, r) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            if (r.length > 0 && r[0] != '' && typeof (r[0] != 'undefined')) {
                                res.send(r[0].attendance);
                            }
                            else {
                                res.send("zero attendance");
                            }
                        }
                    });
                })
            }
        })
    })
}
exports.getschoolstudentsbysubjectandlevel = function (req, res) {
    var schoolteacherstudent = {
        schoolstudent: [],
        teacherid: '',
        teacherstudents: []
    };
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {

                db.collection('schoolstudentcollection', function (err, collection) {
                    collection.find({
                        schoolid: new ObjectID(teacherresult[0].schoolid),
                        'schoolstudent.selectedlevel': level
                    }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {

                            schoolteacherstudent.schoolstudent = processstudent(result, selectedsubject);
                            schoolteacherstudent.teacherid = teacherresult[0]._id;
                            db.collection('schoolteacherstudentregistrationcollection', function (err, collection) {
                                collection.find({ teacherid: new ObjectID(teacherresult[0]._id), level: level }).toArray(function (err, result) {
                                    if (err) {
                                        res.send({ 'error': 'An error has occurred' });
                                    } else {
                                        if (typeof (result[0]) != 'undefined' && typeof (result[0].students) != 'undefined') {
                                            schoolteacherstudent.teacherstudents = result[0].students;
                                        }
                                        res.send(schoolteacherstudent);

                                    }
                                });
                            })


                        }
                    });
                })
            }
        })
    })
}
exports.processreassignment = function (req, res) {
    var raw = req.params.authdata;
    var dateadded = common.gettodaydate();

    var done = req.params.done;
    var live = req.params.live;
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, result) {
            if (err) {
                res.send('teacher not found!!');
            } else if (result[0] != '' && typeof (result[0] != 'undefined')) {
                db.collection('teacherstudentassignmentcollection', function (err, collection) {
                    collection.update({ '_id': new ObjectID(done) }, {
                        $set: { status: 'live', dateadded: dateadded }
                    }
                    );
                    collection.update({ '_id': new ObjectID(live) }, {
                        $set: { status: 'done' }
                    }
                    );
                });

                res.send('done');
            }
        })
    });
}
exports.upadateregistersubjectlevelstudents = function (req, res) {
    var raw = req.params.authdata;
    var dateadded = common.gettodaydate();
    var schoolteachersubjectstudent = req.body;
    var teacherstudents = schoolteachersubjectstudent.teacherstudents;
    var teacherstudentid = schoolteachersubjectstudent.teacherstudentid;
    var selectedlevel = schoolteachersubjectstudent.selectedlevel;
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, result) {
            if (err) {
                res.send('teacher not found!!');
            } else if (result[0] != '' && typeof (result[0] != 'undefined')) {

                var schoolid = result[0].schoolid;
                var teacherid = result[0]._id;
                var students = teacherstudents;

                db.collection('schoolteacherstudentregistrationcollection', function (err, collection) {
                    collection.update({ '_id': new ObjectID(teacherstudentid) }, {
                        $set: {
                            schoolid: schoolid,
                            teacherid: teacherid,
                            level: selectedlevel,
                            students: students,
                            dateadded: dateadded
                        }

                    }, { safe: true }, function (err, items) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(items);
                        }
                    });

                })
            }
        })
    })
}
exports.getleftoverteacherquestions = function (req, res) {
    var raw = req.params.authdata;
    var id = req.params.id;

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                if (id != '' && typeof (id) != 'undefined') {
                    db.collection('questionsfromteacher', function (err, collection) {
                        collection.remove({ _id: new ObjectID(id) });
                    });
                }

            }
        })
        res.send('deleted');
    })
}
exports.getteachersuggestionsbyid = function (req, res) {
    var raw = req.params.authdata;
    var selectedid = req.params.id;

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teachersuggestions', function (err, collection) {
                    collection.find({
                        _id: new ObjectID(selectedid)
                    }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(JSON.stringify(result));
                        }
                    });
                })
            }
        })
    })
}

exports.getteachingmethodbyid = function (req, res) {
    var raw = req.params.authdata;
    var selectedid = req.params.id;

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teachingmethods', function (err, collection) {
                    collection.find({
                        _id: new ObjectID(selectedid)
                    }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(JSON.stringify(result));
                        }
                    });
                })
            }
        })
    })
}
exports.getteacherquestionsbyid = function (req, res) {
    var raw = req.params.authdata;
    var selectedid = req.params.id;

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('questionsfromteacher', function (err, collection) {
                    collection.find({
                        _id: new ObjectID(selectedid)
                    }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(JSON.stringify(result));
                        }
                    });
                })
            }
        })
    })
}

exports.getteacherquestionsbydates = function (req, res) {
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var selecteddate = req.params.selecteddate.replace("-", "/").replace("-", "/");

    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('questionsfromteacher', function (err, collection) {
                    collection.find({
                        teacherid: new ObjectID(teacherresult[0]._id),
                        level: level,
                        subject: selectedsubject,
                        dateadded: { $gte: selecteddate }
                    }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(JSON.stringify(result));
                        }
                    });
                })
            }
        })
    })
}
exports.getteachingmethods = function (req, res) {
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;

    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teachingmethods', function (err, collection) {
                    collection.find({
                        teacherid: new ObjectID(teacherresult[0]._id),
                        level: level,
                        subject: selectedsubject
                    }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(JSON.stringify(result));
                        }
                    });
                })
            }
        })
    })
}
exports.getteachingmethoddetails = function (req, res) {
    var raw = req.params.authdata;
    var id = req.params.id;
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('teachingmethods', function (err, collection) {
                    collection.find({ _id: new ObjectID(id) }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            var output = {
                                imagetype: result[0].imagetype,
                                filename: result[0].filename,
                                filesize: result[0].filesize,
                                hasattachment: result[0].filesize > 0
                            }
                            res.send(output);
                        }
                    });
                })
            }
        })
    })
}
exports.getteacherquestions = function (req, res) {
    var raw = req.params.authdata;
    var selectedlevel = req.params.selectedlevel;
    var selectedsubject = req.params.selectedsubject;
    var selecteddate = req.params.selecteddate.replace("-", "/").replace("-", "/");
    var level = selectedlevel.replace('-', '/');
    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('questionsfromteacher', function (err, collection) {
                    collection.find({
                        teacherid: new ObjectID(teacherresult[0]._id),
                        level: level,
                        subject: selectedsubject,
                        dateadded: { $gte: selecteddate }
                    }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(JSON.stringify(result));
                        }
                    });
                })
            }
        })
    })
}
exports.getteacherquestionimagedetails = function (req, res) {
    var raw = req.params.authdata;
    var id = req.params.id;
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('questionsfromteacher', function (err, collection) {
                    collection.find({ _id: new ObjectID(id) }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            var output = {
                                imagetype: result[0].imagetype,
                                image: result[0].image,
                                filename: result[0].filename,
                                filesize: result[0].filesize,
                                hasattachment: result[0].filesize > 0
                            }
                            res.send(output);
                        }
                    });
                })
            }
        })
    })
}
exports.saveteachingmethod = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = 'None';
        var fsiz = 0;
        var tempPath = '';
        var filename = '';
        var targetPath = '';
        if (Object.keys(files).length > 0) {
            file = files.file;
            fsiz = file.size;
            tempPath = file.path;
            filename = file.name;
            targetPath = path.resolve('./public/images/' + filename);
        }
        var topic = fields.topic;
        var teachingmethodtext = fields.teachingmethodtext;
        var subject = fields.subject;
        var level = fields.level;
        var id = fields.teachingmethodid;
        var authdata = fields.authdata;

        var decoded = common.decode(authdata);
        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];
        var dateadded = common.gettodaydate();

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, result) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (result[0] != '' && typeof (result[0]) != 'undefined') {
                    if (targetPath != '' && tempPath != '') {
                        fs.rename(tempPath, targetPath, function (err) {
                            if (err) {
                                throw err
                            }
                            else {
                                var data = fs.readFileSync(targetPath);
                                var image = new Binary(data);
                                var imageType = file.type;
                                var imageName = file.name;
                                fs.unlink(targetPath);
                                if (id != '' && typeof (id) != 'undefined') {
                                    db.collection('teachingmethods', function (err, collection) {
                                        collection.remove({ _id: new ObjectID(id) });
                                    });
                                }
                                db.collection('teachingmethods', function (err, collection) {
                                    collection.insert(
                                        {
                                            teacherid: result[0]._id,
                                            subject: subject,
                                            level: level,
                                            teachingmethod: teachingmethodtext,
                                            topic: topic,
                                            imagetype: imageType,
                                            image: image,
                                            filename: imageName,
                                            filesize: fsiz,
                                            status: 'submitted',
                                            dateadded: dateadded
                                        }, { safe: true }, function (err, result) {
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
                    }
                    else {
                        if (id != '' && typeof (id) != 'undefined') {
                            db.collection('teachingmethods', function (err, collection) {
                                collection.remove({ _id: new ObjectID(id) });
                            });
                        }
                        db.collection('teachingmethods', function (err, collection) {
                            collection.insert(
                                {
                                    teacherid: result[0]._id,
                                    subject: subject,
                                    level: level,
                                    teachingmethod: teachingmethodtext,
                                    topic: topic,
                                    status: 'processing',
                                    dateadded: dateadded

                                }, { safe: true }, function (err, result) {
                                    if (err) {
                                        res.send({ 'error': 'An error has occurred' });
                                    }
                                    else {
                                        res.send(result);
                                    }
                                });
                        });
                    }
                }
            });

        });
    })
};
exports.getleftoverteachingmethod = function (req, res) {
    var raw = req.params.authdata;
    var id = req.params.id;

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                if (id != '' && typeof (id) != 'undefined') {
                    db.collection('teachingmethods', function (err, collection) {
                        collection.remove({ _id: new ObjectID(id) });
                    });
                }

            }
        })
        res.send('deleted');
    })
}

exports.savequestionfromteacher = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = 'None';
        var fsiz = 0;
        var tempPath = '';
        var filename = '';
        var targetPath = '';
        if (Object.keys(files).length > 0) {
            file = files.file;
            fsiz = file.size;
            tempPath = file.path;
            filename = file.name;
            targetPath = path.resolve('./public/images/' + filename);
        }
        var topic = fields.topic;
        var question = fields.question;
        var subject = fields.subject;
        var level = fields.level;
        var answer = fields.answer;
        var scale = fields.scale;
        var id = fields.teacherquestionid;
        var authdata = fields.authdata;

        var decoded = common.decode(authdata);
        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];
        var dateadded = common.gettodaydate();

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, result) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (result[0] != '' && typeof (result[0]) != 'undefined') {
                    if (targetPath != '' && tempPath != '') {
                        fs.rename(tempPath, targetPath, function (err) {
                            if (err) {
                                throw err
                            }
                            else {
                                var data = fs.readFileSync(targetPath);
                                var image = new Binary(data);
                                var imageType = file.type;
                                var imageName = file.name;
                                fs.unlink(targetPath);
                                if (id != '' && typeof (id) != 'undefined') {
                                    db.collection('questionsfromteacher', function (err, collection) {
                                        collection.remove({ _id: new ObjectID(id) });
                                    });
                                }
                                db.collection('questionsfromteacher', function (err, collection) {
                                    collection.insert(
                                        {
                                            teacherid: result[0]._id,
                                            subject: subject,
                                            level: level,
                                            question: question,
                                            answer: answer,
                                            topic: topic,
                                            scale: scale,
                                            imagetype: imageType,
                                            image: image,
                                            filename: imageName,
                                            filesize: fsiz,
                                            status: 'submitted',
                                            dateadded: dateadded
                                        }, { safe: true }, function (err, result) {
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
                    }
                    else {
                        if (id != '' && typeof (id) != 'undefined') {
                            db.collection('questionsfromteacher', function (err, collection) {
                                collection.remove({ _id: new ObjectID(id) });
                            });
                        }
                        db.collection('questionsfromteacher', function (err, collection) {
                            collection.insert(
                                {
                                    teacherid: result[0]._id,
                                    subject: subject,
                                    level: level,
                                    question: question,
                                    answer: answer,
                                    topic: topic,
                                    scale: scale,
                                    status: 'processing',
                                    dateadded: dateadded

                                }, { safe: true }, function (err, result) {
                                    if (err) {
                                        res.send({ 'error': 'An error has occurred' });
                                    }
                                    else {
                                        res.send(result);
                                    }
                                });
                        });
                    }
                }
            });

        });
    })
};
exports.getleftoverteachersuggestion = function (req, res) {
    var raw = req.params.authdata;
    var id = req.params.id;

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                if (id != '' && typeof (id) != 'undefined') {
                    db.collection('teachersuggestions', function (err, collection) {
                        collection.remove({ _id: new ObjectID(id) });
                    });
                }

            }
        })
        res.send('deleted');
    })
}
exports.getteachersuggestion = function (req, res) {
    var raw = req.params.authdata;
    var dateadded = common.gettodaydate();

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, result) {
            if (err) {
                res.send('teacher not found!!');
            } else if (result[0] != '' && typeof (result[0]) != 'undefined') {
                var teacherid = result[0]._id;
                db.collection('teachersuggestions', function (err, tcollection) {
                    tcollection.find({
                        teacherid: new ObjectID(teacherid)
                    }).toArray(function (err, output) {
                        res.send(output);
                    })
                })
            }
        })

    })
}
exports.addteachersuggestion = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var suggestion = fields.suggestion;
        var teachersuggestionid = fields.teachersuggestionid;
        var authdata = fields.authdata;
        var decoded = common.decode(authdata);
        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];
        var dateadded = common.gettodaydate();

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, result) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (result[0] != '' && typeof (result[0] != 'undefined')) {
                    db.collection('teachersuggestions', function (err, collection) {
                        if (typeof (teachersuggestionid) != 'undefined') {
                            collection.remove({
                                '_id': new ObjectID(teachersuggestionid)
                            })
                        }
                        collection.insert(
                            {
                                teacherid: result[0]._id,
                                suggestion: suggestion,
                                dateadded: dateadded
                            }, { safe: true }, function (err, result) {
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
        })
    })

};
exports.getnewslettersbydate = function (req, res) {
    var raw = req.params.authdata;
    var date = req.params.date;
    var level = req.params.level;

    var dateadded = date.replace(/-/g, '/');

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('schoolteachernewsletterscollection', function (err, collection) {
                    collection.find({
                        teacherid: new ObjectID(teacherresult[0]._id), dateadded: dateadded, level: level
                    }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(JSON.stringify(result));
                        }
                    });
                })
            }
        })
    })
}
exports.gettodaynewsletters = function (req, res) {
    var raw = req.params.authdata;
    var level = req.params.level;
    var dateadded = common.gettodaydate();
    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, teacherresult) {
            if (err) {
                res.send('teacher not found!!');
            } else if (teacherresult[0] != '' && typeof (teacherresult[0] != 'undefined')) {
                db.collection('schoolteachernewsletterscollection', function (err, collection) {
                    collection.find({
                        teacherid: new ObjectID(teacherresult[0]._id), level: level, dateadded: dateadded
                    }).toArray(function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(JSON.stringify(result));
                        }
                    });
                })
            }
        })
    })
}
exports.addtodaynewsletters = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = files.file;
        var fsiz = file.size;
        var tempPath = file.path;

        var title = fields.title;
        var message = fields.message;
        var level = fields.level;
        var authdata = fields.authdata;

        var decoded = common.decode(authdata);
        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];
        var dateadded = common.gettodaydate();

        var targetPath = path.resolve('./public/images/' + file.name);
        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, result) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (result[0] != '' && typeof (result[0] != 'undefined')) {
                    fs.rename(tempPath, targetPath, function (err) {
                        if (err) {
                            throw err
                        }
                        else {
                            var data = fs.readFileSync(targetPath);
                            var image = new Binary(data);
                            var imageType = file.type;
                            var imageName = file.name;
                            fs.unlink(targetPath);
                            db.collection('schoolteachernewsletterscollection', function (err, collection) {
                                collection.insert(
                                    {
                                        teacherid: result[0]._id,
                                        title: title,
                                        level: level,
                                        message: message,
                                        dateadded: dateadded,
                                        imageType: imageType,
                                        filename: imageName,
                                        filesize: fsiz,
                                        image: image
                                    }, { safe: true }, function (err, result) {
                                        if (err) {
                                            consol.log(err);
                                            res.send({ 'error': 'An error has occurred' });
                                        }
                                        else {
                                            collection.find({ dateadded: dateadded }).toArray(function (err, output) {
                                                res.send(output);
                                            })
                                        }
                                    });
                            });


                        }
                    });
                }
            });

        });
    })
};
exports.addtodayteachersubjectassignment = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = files.file;
        var fsiz = file.size;
        var tempPath = file.path;
        console.log(tempPath);
        var attendance = fields.attendance;
        var subject = fields.subject;
        var level = fields.level;
        var assignmentdescription = fields.assignmentdescription;
        var authdata = fields.authdata;

        var decoded = common.decode(authdata);
        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];
        var dateadded = common.gettodaydate();

        var targetPath = path.resolve('./public/images/' + file.name);
        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, result) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (result[0] != '' && typeof (result[0] != 'undefined')) {
                    fs.rename(tempPath, targetPath, function (err) {
                        if (err) {
                            throw err
                        }
                        else {
                            db.collection('teacherstudentassignmentcollection', function (err, collection) {
                                collection.update({ status: 'live' }, {
                                    $set: { status: 'done' }
                                }
                                );
                            });
                            var data = fs.readFileSync(targetPath);
                            var image = new Binary(data);
                            var imageType = file.type;
                            var imageName = file.name;
                            fs.unlink(targetPath);
                            db.collection('teacherstudentassignmentcollection', function (err, collection) {
                                collection.insert(
                                    {
                                        teacherid: result[0]._id,
                                        subject: subject,
                                        level: level,
                                        attendance: attendance,
                                        assignmentdescription: assignmentdescription,
                                        imagetype: imageType,
                                        image: image,
                                        filename: imageName,
                                        filesize: fsiz,
                                        status: 'live',
                                        dateadded: dateadded
                                    }, { safe: true }, function (err, result) {
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
                }
            });

        });
    })
};
exports.addschoolstudentsbysubjectandlevel = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var registeredstudents = fields.registeredstudents;
        var subject = fields.selsubject;
        var level = fields.selectedlevel;
        var teacherid = fields.teacherid;
        var authdata = fields.authdata;

        var decoded = common.decode(authdata);
        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];
        var dateadded = common.gettodaydate();

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, result) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (result[0] != '' && typeof (result[0]) != 'undefined') {
                    var teacherid = result[0]._id;
                    db.collection('schoolteacherstudentregistrationcollection', function (err, schoolteacherstudentregistrationcollection) {
                        schoolteacherstudentregistrationcollection.find({
                            teacherid: new ObjectID(teacherid),
                            selectedlevel: level,
                            selectedsubject: subject
                            // dateadded: dateadded
                        }).toArray(function (error, colresult) {
                            if (error) {
                                res.send({ 'error': 'An error has occurred' });
                            }
                            if (colresult[0] != '' && typeof (colresult[0]) != 'undefined' && colresult.length > 0) {
                                schoolteacherstudentregistrationcollection.remove({
                                    teacherid: teacherid,
                                    selectedlevel: level,
                                    selectedsubject: subject
                                    // dateadded: dateadded
                                });

                            }
                            schoolteacherstudentregistrationcollection.insert({
                                teacherid: teacherid,
                                selectedlevel: level,
                                selectedsubject: subject,
                                registeredstudents: registeredstudents,
                                dateadded: dateadded

                            }, function () { });

                        })

                        res.send('passed');
                    })
                }
            });

        });
    })
}





exports.addtodayteachersubjecttest = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var dateadded = common.gettodaydate();
        var attendance = fields.attendance;
        var subject = fields.subject;
        var level = fields.level;
        var processedtopics = fields.processedtopics;
        var authdata = fields.authdata;
        var decoded = common.decode(authdata);

        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, result) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (result[0] != '' && typeof (result[0]) != 'undefined') {
                    var teacherid = result[0]._id;
                    db.collection('teachertodaysubjecttestsetupcollection', function (err, collection) {
                        collection.find({
                            teacherid: new ObjectID(teacherid),
                            subject: subject,
                            level: level,
                            dateadded: dateadded
                        }).toArray(function (error, colresult) {
                            if (error) {
                                res.send({ status: 'failed' });
                            }
                            if (colresult[0] != '' && typeof (colresult[0]) != 'undefined' && colresult.length > 0) {
                                collection.remove({
                                    teacherid: teacherid,
                                    subject: subject,
                                    level: level,
                                    dateadded: dateadded
                                });

                            }
                            collection.insert({
                                teacherid: teacherid,
                                subject: subject,
                                level: level,
                                processedtopics: processedtopics,
                                attendance: attendance,
                                dateadded: dateadded

                            }, { safe: true }, function (err, result) {
                                if (err) {
                                    res.send({ status: 'failed' });
                                } else {
                                    var data = {
                                        id: result.insertedIds[0],
                                        teacherid: teacherid,
                                        subject: subject,
                                        level: level, processedtopics: processedtopics,
                                        attendance: attendance, dateadded: dateadded,
                                        status: 'passed'
                                    }
                                    res.send(data);
                                }

                            });

                        })

                    })
                }
            })
        })
    })

}

exports.gettodaytesttopics = function (req, res) {
    var raw = req.params.authdata;
    var subject = req.params.subject;

    var dateadded = common.gettodaydate();
    var level = req.params.level.replace('-', '/');

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, result) {
            if (err) {
                res.send('teacher not found!!');
            } else if (result[0] != '' && typeof (result[0]) != 'undefined') {
                var teacherid = result[0]._id;

                db.collection('todayteachertesttopicscollection', function (err, tcollection) {
                    tcollection.find({
                        teacherid: new ObjectID(teacherid),
                        level: level,
                        subject: subject,
                        dateadded: dateadded
                    }).toArray(function (err, output) {
                        res.send(output);
                    })
                })
            }
        })

    })
}
exports.gettodaytesttopicsafter = function (req, res) {
    var raw = req.params.authdata;
    var topid = req.params.topid;

    var dateadded = common.gettodaydate();

    var decoded = common.decode(raw);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];

    db.collection('schoolteachercollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, result) {
            if (err) {
                res.send('teacher not found!!');
            } else if (result[0] != '' && typeof (result[0]) != 'undefined') {
                var teacherid = result[0]._id;

                db.collection('todayteachertesttopicscollection', function (err, tcollection) {
                    tcollection.find({
                        '_id': new ObjectID(topid),
                        teacherid: new ObjectID(teacherid),
                        dateadded: dateadded
                    }).toArray(function (err, output) {
                        res.send(output);
                    })
                })
            }
        })

    })
}

exports.addteacherstudentsubjectattendance = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var todayattendance = fields.todayattendance;
        var selsubject = fields.selsubject;
        var selectedlevel = fields.selectedlevel;
        var raw = fields.authdata;
        var dateadded = common.gettodaydate();
        var decoded = common.decode(raw);
        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, result) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (result[0] != '' && typeof (result[0]) != 'undefined') {
                    var teacherid = result[0]._id;
                    db.collection('teachersubjectstudentattendancecollection', function (err, collection) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            collection.find({
                                teacherid: teacherid,
                                selectedlevel: selectedlevel,
                                selectedsubject: selsubject,
                                dateadded: dateadded
                            }).toArray(function (error, colresult) {
                                if (error) {
                                    res.send({ 'error': 'An error has occurred' });
                                }

                                if (colresult[0] != '' && typeof (colresult[0]) != 'undefined' && colresult.length > 0) {
                                    collection.remove({
                                        teacherid: teacherid,
                                        selectedlevel: selectedlevel,
                                        selectedsubject: selsubject,
                                        dateadded: dateadded
                                    });

                                }

                                collection.insert({
                                    teacherid: teacherid,
                                    selectedlevel: selectedlevel,
                                    selectedsubject: selsubject,
                                    todayattendance: todayattendance,
                                    dateadded: dateadded

                                }, function (finalerror, finalcollection) {
                                    if (!finalerror) {
                                        collection.find({
                                            teacherid: teacherid,
                                            selectedlevel: selectedlevel,
                                            selectedsubject: selsubject,
                                            dateadded: dateadded
                                        }).toArray(function (err, finalresult) {
                                            res.send(finalresult)
                                        })
                                    }
                                    else {
                                        res.send("error");
                                    }
                                });

                            })

                        }

                    })


                }

            })

        });

    })
};

exports.processstudent = processstudent;
exports.processteacher = processteacher;
exports.getschoolteacherstudentsubjectregistration = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var selectedsubject = fields.selectedsubject;
        var selectedlevel = fields.selectedlevel;
        var authdata = fields.authdata;

        var decoded = common.decode(authdata);
        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];
        var dateadded = common.gettodaydate();

        var level = selectedlevel.replace('-', '/');

        db.collection('schoolteachercollection', function (err, collection) {
            collection.find({ username: identity, password: password }).toArray(function (err, result) {
                if (err) {
                    res.send('teacher not found!!');
                } else if (result[0] != '' && typeof (result[0]) != 'undefined') {
                    var teacherid = result[0]._id;
                    db.collection('schoolteacherstudentregistrationcollection', function (err, collection) {
                        collection.find(
                            {
                                selectedlevel: level,
                                selectedsubject: selectedsubject,
                                teacherid: new ObjectID(teacherid)
                                // dateadded: dateadded
                            }
                        ).toArray(function (err, resout) {
                            if (err) {
                                res.send({ 'error': 'An error has occurred' });
                            } else {
                                res.send(JSON.stringify(resout));
                            }
                        });
                    })
                }
            })
        })
    })
};


function processstudent(items, selectedsubject) {
    var outdata = [];
    for (var i = 0; i < items.length; i++) {
        var id = items[i]._id;
        var schoolstudent = items[i].schoolstudent;

        var include = processtoinclude(schoolstudent.studentregisteredsubjects, selectedsubject);

        if (include) {
            outdata.push({ id: id, schoolstudent: schoolstudent });

        }
    }
    return outdata;
}
function processteacher(items) {
    var outdata = [];
    for (var i = 0; i < items.length; i++) {
        var subjects = items[i].schoolteacher.teachersubjects;
        var levels = items[i].schoolteacher.teacherlevels;
        outdata.push({ subjects: subjects, levels: levels });
    }

    return outdata;
}
function processtoinclude(studentsubjects, selectedsubject) {
    var isvalid = false;
    var allsubjects = JSON.parse(studentsubjects);
    for (var i = 0; i < allsubjects.length; i++) {

        if (allsubjects[i] == selectedsubject) {
            isvalid = true;
        }
    }
    return isvalid;
}



