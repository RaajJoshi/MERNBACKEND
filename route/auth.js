const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express');
const router = express.Router();

require('../conn');
const Regst = require('../schema/useSchema');
const AdRs = require('../schema/AddInfoSchema');
const AdRsCls = require('../schema/AddInfoClass');
const TsSc = require('../schema/testschema');
const AdIf = require('../schema/admnSchema');
const AddCmp = require('../schema/CompSchema');
const Fdbk = require('../schema/FeedbackSchema');

router.get('/', (req, res) => {
    res.send(`Hello wolrd from node auth.js`);
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

router.post('/regtr', async (req, res) => {

    const { fname, lname, userID, email, phone, password, cnfpasswd } = req.body;
    if (!fname || !lname || !userID || !email || !phone || !password || !cnfpasswd) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {
        const userExist = await Regst.findOne({ email: email });
        if (userExist) {
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

router.post('/usrlogin', async (req, res) => {
    try {
        const { userID, password } = req.body;
        if (!userID || !password) {
            return res.status(400).json({ error: 'plz, filled all data' });
        }

        const userLogin = await Regst.findOne({ userID: userID });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);


            if (!isMatch) {
                res.status(400).json({ error: "signin error" });
            } else {
                const token = await userLogin.generateAuthToken();

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });
                res.json({ message: "signin successfully" });
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

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });
                res.json({ message: "signin successfully" });
            }
        } else {
            res.status(400).json({ error: "signin error" });
        }

    } catch (err) {
        console.log(err);
    }

})

router.get("/readadmn", async (req, res) => {
    AdIf.find({}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.post('/addreso', async (req, res) => {

    const { labno, pcno, chrno, acno, fanno, lightno, ethr, projc } = req.body;
    if (!labno || !pcno || !chrno || !acno || !fanno || !lightno || !ethr || !projc) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {
        const labExist = await AdRs.findOne({ labno: labno });
        if (labExist) {
            return res.status(422).json({ error: 'Lab already exist' });
        } else {
            const newlab = new AdRs({ labno, pcno, chrno, acno, fanno, lightno, ethr, projc });
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

router.post('/feedback', async (req, res) => {

    const { feedback } = req.body;
    if (!feedback) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {

        const newfdbk = new Fdbk({ feedback });
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

    const { classno, benchno, fannno, tubelightno, projec } = req.body;
    if (!classno || !benchno || !fannno || !tubelightno || !projec) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {
        const labExist = await AdRsCls.findOne({ classno: classno });
        if (labExist) {
            return res.status(422).json({ error: 'Classroom already exist' });
        } else {
            const newlab = new AdRsCls({ classno, benchno, fannno, tubelightno, projec });
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

/*
let laab;
router.post("/readlabbyno", async (req, res) => {
    laab = req.body.labno;
});
*/
router.get("/readlabbyno", async (req, res) => {
    AdRs.find({ labno: '2' }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.put("/updatelab", async (req, res) => {
    const newPcno = req.body.newPcno;
    const id = req.body.id;
    try {
        await AdRs.findById(id, (error, ageToUpdate) => {
            ageToUpdate.pcno = newPcno;
            ageToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send("updated");
})

router.post('/addcomp', async (req, res) => {

    const { comptype, resno, eqtype, abeq, status } = req.body;
    if (!comptype || !resno || !eqtype || !abeq || !status) {
        return res.status(422).json({ error: 'plz, filled all data' });
    }

    try {
        const newcomp = new AddCmp({ comptype, resno, eqtype, abeq, status });
        const saveornot = await newcomp.save();
        if (saveornot) {
            res.status(201).json({ message: 'Add Complain Successfully' });
        } else {
            res.status(500).json({ error: 'Failed to Add Complain' });
        }

    } catch (err) {
        console.log(err);
    }

    //console.log(req.body); 
    //res.json({message:req.body});
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

router.get("/readcompinp", async (req, res) => {
    AddCmp.find({ status: 'inprogress' }, (err, result) => {
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