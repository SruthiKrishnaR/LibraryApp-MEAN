const express = require('express');
const BookData = require('./src/model/Bookdata');
const AuthorData = require('./src/model/Authordata');
const Signupdata = require('./src/model/Signupdata');
const Admindata = require('./src/model/Admindata');
const cors = require('cors');
const jwt = require('jsonwebtoken');
var bodyparser = require('body-parser');
const path = require('path');
var app = new express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparser.json());
app.use(express.static('./dist/LibraryApp'));



app.get('/api/books',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    BookData.find()
        .then(function(books){
            // console.log(books);
            res.send(books);
        });
});

app.get('/api/books/:id',(req,res)=>{
    const id = req.params.id;
    // console.log(id);
    BookData.findOne({"_id":id})
    .then((book)=>{
        // console.log(book);
        res.send(book);
    });
});

app.get('/api/authors',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    AuthorData.find()
        .then(function(authors){
            // console.log(authors);
            res.send(authors);
        });
});

app.get('/api/authors/:id',(req,res)=>{
    const id = req.params.id;
    // console.log(id);
    AuthorData.findOne({"_id":id})
    .then((author)=>{
        // console.log(author);
        res.send(author);
    });
});

app.post('/api/addbook',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var book = {
        title : req.body.item.title,
        author : req.body.item.author,
        genre : req.body.item.genre,
        image : req.body.item.image
    }

    var book = new BookData(book);
    book.save();
});

app.put('/api/updatebook',verifyToken,(req,res)=>{
    console.log(req.body);
    id = req.body._id;
    title = req.body.title;
    author = req.body.author;
    genre = req.body.genre;
    image = req.body.image;
    BookData.findByIdAndUpdate({"_id":id},
                                    {$set:{"title":title,
                                    "author":author,
                                    "genre":genre,
                                    "image":image
                                    }})
                .then(function(data){
                    console.log(data);
                    res.send();
                });
});


app.post('/api/addauthor',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var author = {
        name : req.body.item.name,
        country : req.body.item.country,
        works : req.body.item.works,
        dob : req.body.item.dob,
        image : req.body.item.image
    }

    var author = new AuthorData(author);
    author.save();
});

app.put('/api/updateauthor',verifyToken,(req,res)=>{
    console.log(req.body);
    id = req.body._id;
    name = req.body.name;
    country = req.body.country;
    works = req.body.works;
    dob = req.body.dob;
    image = req.body.image;
    BookData.findByIdAndUpdate({"_id":id},
                                    {$set:{"name":name,
                                    "country":country,
                                    "works":works,
                                    "dob" :dob,
                                    "image":image
                                    }})
                .then(function(data){
                    console.log(data);
                    res.send();
                });
});


app.delete('/api/removebook/:id',verifyToken,(req,res)=>{
    id = req.params.id;
    BookData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log("book deleted");
        res.send();
    });
});

app.delete('/api/removeauthor/:id',verifyToken,(req,res)=>{
    id = req.params.id;
    AuthorData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log("author deleted ");
        res.send();
    });
});

app.post('/api/signup',(req,res)=>{
    console.log(req.body);
    var details = {
        username : req.body.username,
        email : req.body.email,
        pass : req.body.password,
        number : req.body.number
    }
    console.log(details);
    var data = Signupdata(details);
    data.save();
    let payload = {subject:username+password};
    let token = jwt.sign(payload,'secretKey');
    res.status(200).send({token});
})

username="admin";
password="1234";

function verifyToken(req,res,next){
    if(!req.headers.authorization)
    {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null')
    {
        return res.status(401).send('Unauthorized request');
    }
    let payload = jwt.verify(token,'secretKey');
    console.log(payload);
    if(!payload)
    {
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    next();
}

app.post('/api/login',(req,res)=>{

    details = req.body;
    console.log(details);
        Signupdata.findOne({'username':details.username},(err,user)=>{
                 if(password == user.pass){
                        console.log('User Entered');
                        res.send();
                    
                }else if(!user){
            Admindata.find({'username':details.username},(err,admin)=>{
                    if(admin){
                        if(password === '12345'){
                            console.log('Admin entered');
                            res.send();
                        }else{
                            console.log('Wrong pwd');
                            res.send();
                        }
                    }else{
                        console.log('Not an Admin!!!');
                    }
                });
            }
        });

});

app.get('/*',function(req,res){
    res.sendFile(path.join(_dirname + '/dist/LibraryApp/index.html'));
})


app.listen(port, function(){
    console.log('listening to port http://localhost:3000');
});