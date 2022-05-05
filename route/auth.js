const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const rt = express();
const authenticate = require('../middleware/authenticate');
const bodyParser = require('body-parser');
const path = require('path');
const XLSX = require('xlsx');
const multer = require('multer');

require('../conn');
const Regst = require('../schema/useSchema');
const AdRs = require('../schema/AddInfoSchema');
const AdRsCls = require('../schema/AddInfoClass');
const TsSc = require('../schema/testschema');
const AdIf = require('../schema/admnSchema');
const FaIf = require('../schema/FacultySchema');
const AddCmp = require('../schema/CompSchema');
const Fdbk = require('../schema/FeedbackSchema');
const OtSc = require('../schema/OtpSchema');

router.get('/aboutus', authenticate, (req, res) => {
    res.send(req.rootUset);
});

// Using promisis
/*
router.post('/reg',(req,res)=>{

    const {fname,lname,userID,email,phone,password,cnfpasswd} = req.body;
    if(!fname || !lname || !userID || !email || !phone || !password || !cnfpasswd){
        return res.status(422).json({error:'plz, filled all data'});
    }

    Regst.findOne({email:email})
        .then((userExist)=>{
            if(userExist){
                return res.status(422).json({error:'Email already exist'});
            }
            
            const newreg = new Regst({fname,lname,userID,email,phone,password,cnfpasswd});

            newreg.save().then(()=>{
                res.status(201).json({message:'Registrated successfully'});
            }).catch((err)=> res.status(500).json({error:'Failed to register'}));

        }).catch(err=>{console.log(err);})

    //console.log(req.body); 
    //res.json({message:req.body});
})
*/

/* Send OTP*/

// router.post('/send', async (req, res) => {
//     email = req.body.email;

//     let transporter = nodemailer.createTransport({
//         service: 'Gmail',

//         auth: {
//             user: 'joshiraj282002@gmail.com',
//             pass: 'Raj#2002',
//         }

//     });

//     // generate the otp
//     var otp = Math.random();
//     otp = otp * 1000000;
//     otp = parseInt(otp);
//     console.log(otp);

//     const newotp = new OtSc({ email, otp });
//     const saveornot = await newotp.save();
//     if (saveornot) {
//         res.status(201).json({ message: 'OTP saved successfully' });
//     } else {
//         res.status(500).json({ error: 'Failed to save OTP' });
//     }

//     // send mail with defined transport object
//     var mailOptions = {
//         to: req.body.email,
//         subject: "Otp for registration is: ",
//         html: "<h3 style='font-weight:bold;'>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         res.render('otp');
//     });
// });

// router.post('/verify', async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         const userLogin = await OtSc.findOne({ email: email });

//         if (userLogin) {
//             var isMatch = 0;
//             if (otp === userLogin.otp) {
//                 isMatch = 1;
//             }


//             if (isMatch === 0) {
//                 res.status(400).json({ error: "OTP error" });
//             } else {
//                 const uemail = await userLogin.email;

//                 res.status(201).json([uemail]);
//             }
//         } else {
//             res.status(400).json({ error: "OTP error" });
//         }

//     } catch (err) {
//         console.log(err);
//     }
// });

// router.put("/updatepass", async (req, res) => {
//     try {
//         const email = req.body.email;
//         req.body.pass = await bcrypt.hash(req.body.pass,12);
//         req.body.cpass = await bcrypt.hash(req.body.cpass,12);
//         const userLogin = await Regst.findOne({ email: email });
//         if (userLogin) {
//             userLogin.password = req.body.pass;
//             console.log(userLogin.password);
//             userLogin.cnfpasswd = req.body.cpass;
//             const saveornot = await userLogin.save();

//             if (saveornot) {
//                 res.status(201).json({ message: 'Password successfully' });
//             } else {
//                 res.status(500).json({ error: 'Failed to save password' });
//             }
//         }
//     } catch (err) {
//         console.log(err);
//     }
// })


router.post('/regtr', async (req, res) => {

    const { fname, lname, userID, email, phone, password, cnfpasswd } = req.body;
    if (!fname || !lname || !userID || !email || !phone || !password || !cnfpasswd) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {
        const userExist = await Regst.findOne({ email: email });
        const userExistId = await Regst.findOne({ userID: userID });
        if (userExist || userExistId) {
            return res.status(422).json({ error: 'Email already exist' });
        } else if (password != cnfpasswd) {
            return res.status(422).json({ error: 'Both password are different' });
        } else {
            const newreg = new Regst({ fname, lname, userID, email, phone, password, cnfpasswd });
            const saveornot = await newreg.save();
            if (saveornot) {
                res.status(201).json({ message: 'Registrated successfully' });
            } else {
                res.status(500).json({ error: 'Failed to register' });
            }
        }

    } catch (err) {
        console.log(err);
    }

    //console.log(req.body); 
    //res.json({message:req.body});
})


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  var upload = multer({ storage: storage });
  
  rt.use(bodyParser.urlencoded({ extended: false }));
  // rt.set("view engine", "ejs");
  rt.use(express.static(path.resolve(__dirname, "public")));
  
  router.post("/addst", upload.single("stdata"), (req, res) => {
    //const dfile = req.file.filename;
    console.log(req.file);
    var workbook = XLSX.readFile(req.file.path);
    var sheet_namelist = workbook.SheetNames;
    var x = 0;
    sheet_namelist.forEach((element) => {
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
      Regst.insertMany(xlData, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
      x++;
    });
  });

  router.get("/readstd", async (req, res) => {
    Regst.find({}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.post('/usrlogin', async (req, res) => {
    try {
        const { userID, password } = req.body;
        if (!userID || !password) {
            return res.status(400).json({ error: 'plz, filled all data' });
        }

        const userLogin = await Regst.findOne({ userID: userID });
        let isMatch = false;

        if (userLogin) {

            if(userLogin.password === password){
                isMatch = true;
            }
            //const isMatch = Buffer.compare(password, userLogin.password);


            if (!isMatch) {
                res.status(400).json({ error: "signin error" });
            } else {
                const token = await userLogin.generateAuthToken();
                const _id = await userLogin._id;
                const userID = await userLogin.userID;
                const fname = await userLogin.fname;
                const lname = await userLogin.lname;
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });
                res.json([token, _id, userID, fname, lname]);
            }
        } else {
            res.status(400).json({ error: "signin error" });
        }

    } catch (err) {
        console.log(err);
    }

})

router.post('/admnregtr', async (req, res) => {

    const { fname, lname, userID, email, phone, password, cnfpasswd } = req.body;
    if (!fname || !lname || !userID || !email || !phone || !password || !cnfpasswd) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {
        const userExist = await AdIf.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: 'Email already exist' });
        } else if (password != cnfpasswd) {
            return res.status(422).json({ error: 'Both password are different' });
        } else {
            const newreg = new AdIf({ fname, lname, userID, email, phone, password, cnfpasswd });
            const saveornot = await newreg.save();
            if (saveornot) {
                res.status(201).json({ message: 'Registrated successfully' });
            } else {
                res.status(500).json({ error: 'Failed to register' });
            }
        }

    } catch (err) {
        console.log(err);
    }

    //console.log(req.body); 
    //res.json({message:req.body});
})

router.post('/facregtr', async (req, res) => {

    const { fname, lname, userID, email, phone, password, cnfpasswd, isIncharge, lab, classroom } = req.body;
    if (!fname || !lname || !userID || !email || !phone || !password || !cnfpasswd || !isIncharge) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {
        const userExist = await FaIf.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: 'Email already exist' });
        } else if (password != cnfpasswd) {
            return res.status(422).json({ error: 'Both password are different' });
        } else {
            const newreg = new FaIf({ fname, lname, userID, email, phone, password, cnfpasswd, isIncharge, lab, classroom });
            const saveornot = await newreg.save();
            if (saveornot) {
                res.status(201).json({ message: 'Registrated successfully' });
            } else {
                res.status(500).json({ error: 'Failed to register' });
            }
        }

    } catch (err) {
        console.log(err);
    }

    //console.log(req.body); 
    //res.json({message:req.body});
})

router.post('/admnlogin', async (req, res) => {
    //console.log(req.body);
    //res.json({message:'sign up'});
    try {
        const { userID, password } = req.body;
        if (!userID || !password) {
            return res.status(400).json({ error: 'plz, filled all data' });
        }

        const userLogin = await AdIf.findOne({ userID: userID });

        if (userLogin) {

            const isMatch = await bcrypt.compare(password, userLogin.password);
            if (!isMatch) {
                res.status(400).json({ error: "signin error" });
            } else {

                const token = await userLogin.generateAuthToken();
                const _id = await userLogin._id;
                const userID = await userLogin.userID;
                const fname = await userLogin.fname;
                const lname = await userLogin.lname;

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });
                res.json([token, _id, userID, fname, lname]);
            }
        } else {
            res.status(400).json({ error: "signin error" });
        }

    } catch (err) {
        console.log(err);
    }

})

router.post('/faclogin', async (req, res) => {
    //console.log(req.body);
    //res.json({message:'sign up'});
    try {
        const { userID, password } = req.body;
        if (!userID || !password) {
            return res.status(400).json({ error: 'plz, filled all data' });
        }

        const userLogin = await FaIf.findOne({ userID: userID });

        if (userLogin) {

            const isMatch = await bcrypt.compare(password, userLogin.password);
            if (!isMatch) {
                res.status(400).json({ error: "signin error" });
            } else {

                const token = await userLogin.generateAuthToken();
                const _id = await userLogin._id;
                const userID = await userLogin.userID;
                const fname = await userLogin.fname;
                const lname = await userLogin.lname;
                const isIncharge = await userLogin.isIncharge;
                const lab = await userLogin.lab;
                const classroom = await userLogin.classroom;

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });
                res.json([token, _id, userID, fname, lname, isIncharge, lab, classroom]);
            }
        } else {
            res.status(400).json({ error: "signin error" });
        }

    } catch (err) {
        console.log(err);
    }

})

router.get("/readadmnbyid/:id", async (req, res) => {
    const uid = req.params.id;
    AdIf.find({ userID: uid }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/readusrbyid/:id", async (req, res) => {
    const uid = req.params.id;
    Regst.find({ userID: uid }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/readfacbyid/:id", async (req, res) => {
    const uid = req.params.id;
    FaIf.find({ userID: uid }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.post('/addreso', async (req, res) => {

    const { labno, pcno, chrno, acno, fanno, lightno, ethr, projc, projno, projnm1, projnm2, Incharge } = req.body;
    // if (!labno || !pcno || !chrno || !acno || !fanno || !lightno || !ethr || !projc || !Incharge) {
    //     return res.status(422).json({ error: 'plz, filled all data' });
    // }

    try {
        const labExist = await AdRs.findOne({ labno: labno });
        if (labExist) {
            return res.status(422).json({ error: 'Lab already exist' });
        } else {
            const newlab = new AdRs({ labno, pcno, chrno, acno, fanno, lightno, ethr, projc, projno, projnm1, projnm2, Incharge });
            const saveornot = await newlab.save();
            if (saveornot) {
                res.status(201).json({ message: 'Add Resource Successfully' });
            } else {
                res.status(500).json({ error: 'Failed to Add Resource' });
            }
        }


    } catch (err) {
        console.log(err);
    }

    //console.log(req.body); 
    //res.json({message:req.body});
})

router.post('/feedbackbe/:id', async (req, res) => {
    userID = req.params.id;
    const { feedback, fname, lname } = req.body;
    if (!feedback) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {

        const newfdbk = new Fdbk({ feedback, userID, fname, lname });
        const saveornot = await newfdbk.save();
        if (saveornot) {
            res.status(201).json({ message: 'Add Feedback Successfully' });
        } else {
            res.status(500).json({ error: 'Failed to Add Feedback' });
        }
    } catch (err) {
        console.log(err);
    }
})

router.get("/readfeedback", async (req, res) => {
    Fdbk.find({}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.post('/addresoclass', async (req, res) => {

    const { classno, benchno, fannno, tubelightno, projec, Inchargeclass } = req.body;
    if (!classno || !benchno || !fannno || !tubelightno || !projec || !Inchargeclass) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {
        const labExist = await AdRsCls.findOne({ classno: classno });
        if (labExist) {
            return res.status(422).json({ error: 'Classroom already exist' });
        } else {
            const newlab = new AdRsCls({ classno, benchno, fannno, tubelightno, projec, Inchargeclass });
            const saveornot = await newlab.save();
            if (saveornot) {
                res.status(201).json({ message: 'Add Resource Successfully' });
            } else {
                res.status(500).json({ error: 'Failed to Add Resource' });
            }
        }


    } catch (err) {
        console.log(err);
    }

    //console.log(req.body); 
    //res.json({message:req.body});
})

router.delete('/deletelab/:id', async (req, res) => {

    try {
        await AdRs.findByIdAndRemove(req.params.id).exec();
        if (!req.params.id) {
            return res.status(400).send();
        }
        res.send("deleted");
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get("/readlab", async (req, res) => {
    AdRs.find({}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
router.get("/readlabbyid/:id", async (req, res) => {
    const id = req.params.id;
    AdRs.find({ labno: id }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/readclass", async (req, res) => {
    AdRsCls.find({}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
router.get("/readclassbyid/:id", async (req, res) => {
    const id = req.params.id;
    AdRsCls.find({ classno: id }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

/*
let laab;
router.post("/readlabbyno", async (req, res) => {
    laab = req.body.labno;
});

router.get("/readlabbyno/:id", async (req, res) => {
    labid = req.params.id;
    AdRs.find({ labno: labid }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
*/

router.put("/updatelabpc", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRs.findById(id, (error, pcToUpdate) => {
            pcToUpdate.pcno = req.body.newPcno;
            pcToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})

router.put("/updatelabchr", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRs.findById(id, (error, chrToUpdate) => {
            chrToUpdate.chrno = req.body.newChrno;
            chrToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})
router.put("/updatelabac", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRs.findById(id, (error, acToUpdate) => {
            acToUpdate.acno = req.body.newAcno;
            acToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})
router.put("/updatelabfan", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRs.findById(id, (error, fanToUpdate) => {
            fanToUpdate.fanno = req.body.newFanno;
            fanToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})
router.put("/updatelablght", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRs.findById(id, (error, lghtToUpdate) => {
            lghtToUpdate.lightno = req.body.newLghtno;
            lghtToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})
router.put("/updatelabethr", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRs.findById(id, (error, ethrToUpdate) => {
            ethrToUpdate.ethr = req.body.newEthr;
            ethrToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})
router.put("/updatelabprojc", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRs.findById(id, (error, projcToUpdate) => {
            projcToUpdate.projc = req.body.newProjc;
            projcToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})
router.put("/updateclassbch", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRsCls.findById(id, (error, bchToUpdate) => {
            bchToUpdate.benchno = req.body.newBenchno;
            bchToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})
router.put("/updateclassfan", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRsCls.findById(id, (error, fanToUpdate) => {
            fanToUpdate.fannno = req.body.newFannno;
            fanToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})
router.put("/updateclasslight", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRsCls.findById(id, (error, lightToUpdate) => {
            lightToUpdate.tubelightno = req.body.newLightno;
            lightToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})
router.put("/updateclassproj", async (req, res) => {
    const id = req.body.id;
    try {
        await AdRsCls.findById(id, (error, projToUpdate) => {
            projToUpdate.projec = req.body.newProj;
            projToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})

router.post('/addcomp', async (req, res) => {

    const { comptype, resno, eqtype, abeq, eqno, status, userID, eid } = req.body;
    /*
    if (!comptype || !resno || !abeq || !status || !userID) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }
    */
    console.log(eid);
    try {
        const newcomp = new AddCmp({ comptype, resno, eqtype, abeq, eqno, status, userID });
        const saveornot = await newcomp.save();
        if (saveornot) {
            res.status(201).json({ message: 'Add Complain Successfully' });
        } else {
            res.status(500).json({ error: 'Failed to Add Complain' });
        }

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'joshiraj282002@gmail.com',
                pass: 'Raj#2002',
            }
        });
        var mailOptions = {
            to: eid,
            subject: "About Complaint",
            html: "<h3 style={{font-weight:'bold',color:'black'}}>One complaint raised about your Lab/Classroom</h3><br>" +
                "<h4 style={{display:'inline',color:'black'}}>Complaint Type : " + comptype + "</h4>" +
                "<h4 style={{display:'inline',color:'black'}}>Resource no. : " + resno + "</h4>" +
                "<h4 style={{display:'inline',color:'black'}}>Equipment Type : " + eqtype + "</h4>" +
                "<h4 style={{display:'inline',color:'black'}}>Equipment no. : " + eqno + "</h4>" +
                "<h4 style={{display:'inline',color:'black'}}>Description : " + abeq + "</h4>"
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.render('eid');
        });

    } catch (err) {
        console.log(err);
    }

})

router.get("/readcomp", async (req, res) => {
    AddCmp.find({ status: 'pending' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/readcompno/:id", async (req, res) => {
    const id = req.params.id;
    AddCmp.find({ userID: id, status: 'pending' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
router.get("/readcompnoinp/:id", async (req, res) => {
    const id = req.params.id;
    AddCmp.find({ userID: id, status: 'inprogress' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
router.get("/readcompnounp/:id", async (req, res) => {
    const id = req.params.id;
    AddCmp.find({ userID: id, status: 'under process' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
router.get("/readcompnocpt/:id", async (req, res) => {
    const id = req.params.id;
    AddCmp.find({ userID: id, status: 'completed' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/readcompbyid/:id", async (req, res) => {
    const id = req.params.id;
    AddCmp.find({ userID: id }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/readcompbyidclass/:id", async (req, res) => {
    const id = req.params.id;
    AddCmp.find({ userID: id, comptype: 'classroom' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.put("/updatecomp", async (req, res) => {
    const id = req.body.id;
    try {
        await AddCmp.findById(id, (error, abeqToUpdate) => {
            abeqToUpdate.abeq = req.body.newDescr;
            abeqToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})

router.get("/readcompinp", async (req, res) => {
    AddCmp.find({ status: 'inprogress' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/readcompinpbyresl/:id", async (req, res) => {
    const lab = req.params.id;
    AddCmp.find({comptype: 'lab', resno: lab, status: 'inprogress' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
router.get("/readcompinpbyresc/:id", async (req, res) => {
    const lab = req.params.id;
    AddCmp.find({comptype: 'classroom', resno: lab, status: 'inprogress' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
router.get("/readcompinpbyresol/:id", async (req, res) => {
    const lab = req.params.id;
    
    AddCmp.find({comptype: 'lab', resno: lab ,status: 'inprogress' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
router.get("/readcompinpbyresoc/:id", async (req, res) => {
    const classroom = req.params.id;

    AddCmp.find({comptype: 'classroom', resno: classroom ,status: 'inprogress' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/readcompup", async (req, res) => {
    AddCmp.find({ status: 'under process' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/readcompcmp", async (req, res) => {
    AddCmp.find({ status: 'completed' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.put("/updatecompsts", async (req, res) => {
    const newStatus = req.body.newStatus;
    const id = req.body.id;
    try {
        await AddCmp.findById(id, (error, stsToUpdate) => {
            stsToUpdate.status = newStatus;
            stsToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})

router.get("/read", async (req, res) => {
    TsSc.find({}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.put("/update", async (req, res) => {
    const newPcno = req.body.newPcno;
    const id = req.body.id;
    try {
        await TsSc.findById(id, (error, ageToUpdate) => {
            ageToUpdate.pcno = newPcno;
            ageToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})

router.delete('/delete/:id', async (req, res) => {

    try {
        await TsSc.findByIdAndRemove(req.params.id).exec();
        if (!req.params.id) {
            return res.status(400).send();
        }
        res.send("deleted");
    } catch (err) {
        res.status(500).send(err);
    }
})

router.post("/add", async (req, res) => {
    const labno = req.body.labno;
    const pcno = req.body.pcno;
    const laab = new TsSc({ labno: labno, pcno: pcno });
    await laab.save();
    res.send(laab);
});

module.exports = router;