const express = require("express")
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended : false}))

const cors = require("cors")
app.use(cors())
//const test= require("../frontend/public")

const objectid = require("objectid")

const multer = require('multer'),
uuid = require('uuid'),
DIR = './public/';;
//DIR = '../frontend/public/';;
console.log(DIR)
app.use(express.static(DIR))
/*=================================
        Database
===================================*/
const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://shebaBabu:P%40ssw0rd77Mo@cluster0.j73n9we.mongodb.net/test",{
    useNewUrlParser: true,
    useUnifiedTopology : true,
}).then(()=>{
    console.log("Connection Successfull")
}).catch((err)=>{
    console.log(err)
})
/************schema*********** */
const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : {
        type: String,
        // required :true,
        unique : true,
    },
    password : String,
    repassword : String,
    profileImg:String
    
})
const UserModel = new mongoose.model("UserModel",userSchema)

/*=================================
       image upload to public folder/db
===================================*/

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuid.v4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


/*=================================
        get and post
===================================*/
// app.get("/",(req,res)=>{
//     res.send("App is Runing")
// })
app.post("/register",(req,res)=>{
     console.log(req.body) 
    const {firstName,lastName,email,password,repassword} = req.body;
    UserModel.findOne({email: email},(err,user)=>{
            if(user){
                res.send({message : "This email id already Register"})
            }
            else{
                const user = new UserModel({
                    firstName,
                    lastName,
                    email,
                    password,
                    repassword,
                })
                user.save();
                res.send({message : "Successfull Register"})
            }
    })

})

app.post("/login",(req,res)=>{
    console.log(req.body)
    const {email,password} = req.body
    UserModel.findOne({email : email},(err,user)=>{
            if(user){
                if(password == user.password){
                    res.send({message : "Login SuccessFull",user})
                }
                else{
                    res.send({message : "Password didn't match"})
                }
            }
            else{
                res.send({message : "This email id is not register"})
            }
    })
})

app.post("/uploadImage", upload.single('profileImg'),async(req,res)=>{
    console.log("Inside img upload");
    const url = req.protocol + '://' + req.get('host')
    console.log(req)
    console.log(req.body,req.file)
    console.log(req.body._id)
    // let ImgPath = url + '/public/' + req.file.filename
    let ImgPath = '/public/' + req.file.filename
    const doc = await UserModel.findOne({_id:req.body._id})
    doc.updateOne({"profileImg":ImgPath}).then(result => {
       // res.send({message : "This email id is not register"})    
       res.sendFile("/public/'+req.file.filename+'",{root:'.'})
    res.status(201).send({
            message: "Image uploaded!",
            
            
        })
    }
    ).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })

})
app.get("/previewImage",(req,res)=>{
    console.log("preview")
    res.sendFile("/public/778b0390-c271-4d7e-9886-dc3fc2082f9c-image-3.jpg",{root:'.'})
})


/*============================
        listen
=============================*/
app.listen(8000,()=>{
    console.log("Server is runing at port 8000")
    console.log(__dirname+DIR)
})