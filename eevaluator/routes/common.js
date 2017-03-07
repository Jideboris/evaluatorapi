var xlsx = require('xlsx');
var xlsjs = require('xlsjs');
var nodexlsx = require('node-xlsx');


exports.excelbatchprocessing = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = files.file;
        var authdata = fields.authdata;
        var tempPath = file.path;
        var targetPath = path.resolve('./public/tempdata/' + file.name);
        var decoded = decode(authdata);
        var identity = decoded.split(':')[0];
        var password = decoded.split(':')[1];
        db.collection('schoolcollection', function (err, collection) {
            collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
                if (items != '') {
                    var clientid = items[0]._id
                    console.log(clientid);
                    fs.rename(tempPath, targetPath, function (err) {
                        if (err) {
                            console.log(err)
                        }
                        else {

                            var obj = nodexlsx.parse(targetPath);
                            var arr = JSON.parse(JSON.stringify(obj[0]));
                            console.log(arr["data"].length);
                            console.log(arr["data"]);
                            var filetype = file.type;
                            console.log(filetype);

                            var headerfullname = arr["data"][0][0];
                            var headerdateofbirth = arr["data"][0][1];
                            var headerlevel = arr["data"][0][2];
                            var headerpersonalemail = arr["data"][0][3];
                            var headerparentemail = arr["data"][0][4];
                            var parentnumber = arr["data"][0][5];
                            var headersubjects = arr["data"][0][6];

                            var output = batchvalidator(arr["data"][0].length, arr["data"]);
                            var dateadded = gettodaydate();
                            console.log(output);

                            if (output.isvalid) {
                                for (var index = 1; index < arr["data"].length - 1; index++) {
                                    var fullname = arr["data"][index][0];
                                    var dateofbirth = arr["data"][index][1];
                                    var level = arr["data"][index][2];
                                    var personalemail = arr["data"][index][3];
                                    var parentemail = arr["data"][index][4];
                                    var parentnumber = arr["data"][index][5];
                                    var subjects = arr["data"][index][6];
                                    var jsonsubjects = JSON.stringify(subjects);
                                    console.log(jsonsubjects);
                                    console.log(fullname + '|' + dateofbirth + '|' + level + '|' + personalemail + '|' + parentemail);
                                    if (fullname != null && typeof (fullname) != 'undefined') {
                                        var username = fullname.replace(/ /g, "");
                                        var item = username + dateofbirth + personalemail;
                                        var studentpassword = makeid(item.toUpperCase());
                                        var schoolstudent = {};
                                        schoolstudent.fullname = fullname;
                                        schoolstudent.dateofbirth = dateofbirth;
                                        schoolstudent.selectedlevel = level;
                                        schoolstudent.personalemail = personalemail;
                                        schoolstudent.parentemail = parentemail;
                                        schoolstudent.parentnumber = parentnumber;
                                        schoolstudent.studentregisteredsubjects = jsonsubjects;
                                        schoolstudent.suspended = false;
                                        db.collection('schoolstudentcollection', function (err, collection) {
                                            collection.insert({
                                                schoolstudent: schoolstudent,
                                                schoolid: clientid,
                                                username: username,
                                                password: studentpassword,
                                                dateadded: dateadded

                                            }, { safe: true }, function (err, result) {
                                                if (err) {
                                                    res.send({ 'error': 'An error has occurred' });
                                                } else {

                                                    emailer(personalemail, fullname, result.insertedIds[0], username, studentpassword);
                                                    console.log('student inserted successfully');
                                                }
                                            });
                                        });
                                    }
                                }
                                fs.unlink(targetPath);
                                console.log("file now deleted");
                                res.send("completed!");

                            }
                            else {
                                res.send(JSON.stringify(output));
                            }
                        }
                    });

                }
            });

        });


    });

}
exports.decode = decode;
exports.makeid = makeid;
exports.emailer = emailer;
exports.batchvalidator = batchvalidator;
exports.gettodaydate = gettodaydate;
exports.comparedate = comparedate;
exports.validateemail = validateemail;
exports.validatedate = validatedate;

function validatedate(dateitem) {
    var dobpattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if (!dobpattern.test(dateitem)) {
        return false;
    }
    else {
        return true;
    }
}
function validateemail(email) {
    var emailpattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailpattern.test(email)) {
        return false;
    }
    else {
        return true;
    }
}
function batchvalidator(leng, arr) {
    var dobpattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    var emailpattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var errMessage = '';
    var messages = {
        isvalid: true,
        errormessage: ''
    };
    if (leng == 7 || leng > 7) {
        var headerfullname = arr[0][0].toLowerCase();
        var headerdateofbirth = arr[0][1].toLowerCase();
        var headerlevel = arr[0][2].toLowerCase();
        var headerpersonalemail = arr[0][3].toLowerCase();
        var headerparentemail = arr[0][4].toLowerCase();
        var headerparentnumber = arr[0][5].toLowerCase();
        var headersubjects = arr[0][6].toLowerCase();

        if (typeof (arr) != 'undefined' && headerfullname == 'fullname' && headerdateofbirth == 'dob'
            && headerlevel == 'level' && headerpersonalemail == 'personalemail'
            && headerparentemail == 'parentemail' && headerparentnumber == 'parentnumber' && headersubjects == 'subjects') {

            for (var index = 1; index < arr.length - 1; index++) {
                var fullname = arr[index][0];
                var dateofbirth = arr[index][1];
                var level = arr[index][2];
                var personalemail = arr[index][3];
                var parentemail = arr[index][4];
                var parentnumber = arr[index][5];
                var subjects = arr[index][6];
                var jsonsubjects = JSON.stringify(subjects);
                if (typeof (dateofbirth) == 'undefined' || dateofbirth == '' || !dobpattern.test(dateofbirth)) {
                    errMessage += "Invalid date of birth=" + dateofbirth;

                }
                if (!emailpattern.test(personalemail)) {
                    errMessage += "Invalid personal email" + personalemail;
                }
                if (!emailpattern.test(parentemail)) {
                    errMessage += "Invalid parent email" + parentemail;
                }
                if (!isNaN(fullname) || !isNaN(level) || !isNaN(subjects)) {
                    errMessage += "Invalid fullname OR level OR subjects" + fullname + '/' + level + '/' + subjects;
                }
                if (isNaN(parentnumber)) {
                    errMessage += "Invalid parent number" + parentnumber;
                }

            }
            if (errMessage != '') {
                messages.isvalid = false;
                messages.errormessage = errMessage;
            }
        }
    }
    else {
        messages.isvalid = false;
        messages.errormessage = 'current length is=' + leng + 'instead of 6 and most likely a column or more is(are) missing in your template';
    }

    return messages;
}
function makeid(schoolnameregnumber) {
    var text = "";
    var possible = schoolnameregnumber;
    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
function decode(input) {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        window.alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return output;
};

function gettodaydate() {
    var today = new Date();
    var dd = today.getUTCDate();
    var mm = today.getUTCMonth() + 1; //January is 0!
    var yyyy = today.getUTCFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;

    return today;
}
function comparedate(inputdate) {
    var today = new Date();
    var dd = today.getUTCDate();
    var mm = today.getUTCMonth() + 1; //January is 0!
    var yyyy = today.getUTCFullYear();
    var inpdate = inputdate.split('/');
    var day = inpdate[1];
    var month = inpdate[0];
    var year = inpdate[2];
    if (yyyy - year <= 1 && Math.abs(mm - month) < 2 && Math.abs(dd - day) <= 20) {
        return true;
    }
    return false;
}
function emailer(mailto, schoolname, maillicense, mailusername, mailpassword) {
    var targetPath = path.resolve('./templates/emails/welcome/html.html');
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'g.generics@gmail.com',
            pass: 'Computer1234567'
        }
    });

    var sendPwdReminder = transporter.templateSender({
        subject: schoolname + 'Starter Pack!',
        //  text: 'Hello, {{username}}, Your password is: {{ password }}',
        html: fs.readFileSync(targetPath),
    }, {
            from: 'g.generics"gmail.com',
        });

    // use template based sender to send a message
    sendPwdReminder({
        to: mailto
    }, {
            school: schoolname,
            license: maillicense,
            username: mailusername,
            passwordpassphrase: mailpassword
        }, function (err, info) {
            if (err) {
                console.log('Error');

            } else {
                console.log('starter pack sent:' + schoolname);

            }
        });
}
exports.sendemail = function (req, res) {
    var mailto = req.params.mail;
    var mailschool = req.params.schoolname;
    var maillicense = req.params.license;
    var mailusername = req.params.username;
    var mailpassword = req.params.passcode;
    var targetPath = path.resolve('./templates/emails/welcome/html.html');
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'g.generics@gmail.com',
            pass: 'Computer1234567'
        }
    });

    var sendPwdReminder = transporter.templateSender({
        subject: mailschool + 'Starter Pack!',
        //  text: 'Hello, {{username}}, Your password is: {{ password }}',
        html: fs.readFileSync(targetPath),
    }, {
            from: 'g.generics"gmail.com',
        });

    // use template based sender to send a message
    sendPwdReminder({
        to: mailto
    }, {
            school: mailschool,
            license: maillicense,
            username: mailusername,
            passwordpassphrase: mailpassword
        }, function (err, info) {
            if (err) {
                console.log('Error');
                res.send('failed');
            } else {
                console.log('starter pack sent');
                res.send('done');
            }
        });
}


