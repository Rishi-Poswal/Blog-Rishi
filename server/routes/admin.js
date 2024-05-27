const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
// const user = require('../models/user');


const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

//check login 
const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
        return res.status(401).json({message: 'Unauthorized-2'});
    }

}



//GET Admin-login
router.get('/admin' , async (req,res)=>{
    
    try{

        const locals = {
            title : "Admin",
            descrip : "testing bro"
        }
        
        res.render("admin/index", {locals , layout: adminLayout});   

    }catch(error){
        console.log(error);
    }
});


//POST... admin check login
router.post('/admin' , async (req,res)=>{
    
    try{

        const {username , password} = req.body;

        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: 'invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'invalid credentials'});
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});



        res.redirect('/dashboard');   

    }catch(error){
        console.log(error);
    }
});



//POST... admin register
router.post('/register' , async (req,res)=>{
    
    try{

        const {username , password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try{
            const user = await User.create({username, password: hashedPassword});
           
            
            res.redirect('/admin');
            

        }catch(error){

            if(error.code ===11000){
                res.status(409).json({message: 'user already in use'});
            }
            
            console.log(error);
            res.status(500).json({message:'Internal server error'});

        }

        
        // res.render("admin/index", {locals , layout: adminLayout});   

    }catch(error){
        console.log(error);
    }
});


router.get('/dashboard' ,authMiddleware ,async (req,res)=>{
    
    try{
         const locals = {
            title:'Dashboard',
            description : 'ehaaaaaaaahhh'
         }

         const data = await Post.find().sort({createdAt : -1});
         res.render('admin/dashboard', {locals,data,layout: adminLayout});
    }catch(error){
         console.log(error);
    }
    
})


//GET
//Admin add post
router.get('/add-post' ,authMiddleware ,async (req,res)=>{
    
    try{
         const locals = {
            title:'Add Post ',
            description : 'add the post mofo'
         }


         res.render('admin/add-post', {locals,layout: adminLayout});
    }catch(error){
         console.log(error);
    }
    
})

//POST
//admin add-post
router.post('/add-post' ,authMiddleware ,async (req,res)=>{
    
    try{
        
        try{
             const newPost = new Post({
                title: req.body.title,
                body: req.body.body
             });

             await Post.create(newPost);
             res.redirect('/dashboard');

        }catch(error){
             console.log(error);
        }

    
    }catch(error){
         console.log(error);
    }
    
})

//GET
//Admin edit post
router.get('/edit-post/:id' ,authMiddleware ,async (req,res)=>{
    
    try{
        const locals = {
            title:'Edit Post ',
            description : 'edit the post mofo'
         }
         const data = await Post.findOne({_id : req.params.id});

         res.render('admin/edit-post', {locals,data,layout: adminLayout});

    }catch(error){
         console.log(error);
    }
    
})

//PUT
//admin edit post
router.put('/edit-post/:id' ,authMiddleware ,async (req,res)=>{
    
    try{
          await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
          })

        res.redirect(`/edit-post/${req.params.id}`);
         
    }catch(error){
         console.log(error);
    }
    
})

//DELETE
//Admin delete post
router.delete('/delete-post/:id' ,authMiddleware ,async (req,res)=>{
    
    try{
                 
         await Post.deleteOne({_id : req.params.id});

         res.redirect('/dashboard');
    }catch(error){
         console.log(error);
    }
    
})

//Get
//admin logout
router.get('/logout', (req,res)=>{
   res.clearCookie('token');

   res.redirect('/');
});




module.exports = router;