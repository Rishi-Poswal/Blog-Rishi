const express = require('express');
const router = express.Router();
const Post = require('../models/post');


//get home
router.get('' , async (req,res)=>{

    try{
        const locals = {
            title : "N",
            description : "testing bro"
        }


        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ {$sort: {createdAt: -1}}])
                               .skip(perPage*page - perPage)
                               .limit(perPage)
                               .exec();
        
        const count = await Post.countDocuments();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);
        
        res.render('index',{
           locals,
           data,
           current: page,
           nextPage: hasNextPage ? nextPage : null 
        });


    }catch(error){
        console.log(error);
    }

    
});



// router.get('' , async (req,res)=>{
//     const locals = {
//         title : "n blog",
//         descrip : "testing bro"
//     }
//     try{
//         const data = await Post.find();
//         res.render("index", {locals, data});   
//     }catch(error){
//         console.log(error);
//     }
// });


//GET Post :id
router.get('/post/:id' , async (req,res)=>{
    
    try{
        const locals = {
            title : "n blog",
            descrip : "testing bro"
        }

        let slug = req.params.id;

        const data = await Post.findById({_id: slug});
        res.render("post", {locals, data});   
    }catch(error){
        console.log(error);
    }
});


//POST - search
router.post('/search' , async (req,res)=>{
    
    try{
        const locals = {
            title : "n blog",
            descrip : "testing bro"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        
        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            ]
        });

        res.render("search", {data,locals});
        
    }catch(error){
        console.log(error);
    }
});




router.get('/about', (req,res)=>{
    res.render('about');
});


module.exports = router;













// function insertPostData(){
//     Post.insertMany([
//         {
//             title: "building a blog",
//             body: "xyz"
//         },
//         {
//             title: "goli beta",
//             body: "masti nahi"
//         },
//         {
//             title: "abc",
//             body: "hhdfhdgjjj"
//         },
//         {
//             title: "goli beta",
//             body: "masti nahi"
//         },
//         {
//             title: "goli beta",
//             body: "masti nahi"
//         },
//         {
//             title: "goli beta",
//             body: "masti nahi"
//         },
//         {
//             title: "goli beta",
//             body: "masti nahi"
//         },
//         {
//             title: "goli beta",
//             body: "masti nahi"
//         }
//     ])
// }

// insertPostData();
