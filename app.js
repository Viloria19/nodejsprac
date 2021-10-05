//server side code

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { render } = require('ejs');

// express app
const app = express();

// connect to mongoDB
const dbURI = 'mongodb+srv://chas:1234@nodejspractice.obdgp.mongodb.net/nodePrac?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>app.listen(3000))       // REASON FOR TRANSFER: only listen for requests when database is connected
.catch((err)=>console.log(err));        // connecting to database takes longer

// register view engine
app.set('view engine', 'ejs');          // default; ejs looks into views folder automatically
//app.set('views', 'folder-name');      // for ejs to look into another file, use this syntax     

// listen for requests
//app.listen(3000);                     // transfered to line 13

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));           // needed when getting data from a form
app.use(morgan('dev'));

/*
// mongoose and mongo sandbox routes

// adding blogs
app.get('/add-blog', (req, res)=>{
    const blog = new Blog({
        title: 'new blog two',
        snippet:'about my new blog',
        body:'more about my new blog'
    });

    blog.save()                         // saves to the database
        .then((result)=>{
         res.send(result)
    })
    .catch((err)=>{
        console.log(err);
    });
});

//  collecting all blogs
app.get('/all-blogs', (req, res)=>{
    Blog.find()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        });
});

// retrives one blog
app.get('/single-blog', (req, res)=>{
    Blog.findById('61586eed2b7f4be00aba134a')
    .then((result)=>{
        res.send(result)
    })
    .catch((err)=>{
        console.log(err);
    });
});
*/

/*
app.use((req, res, next)=>{
    console.log('new request made: ');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next();
});

app.use((req, res, next)=>{
    console.log('in the next middleware');
    next();
})
*/

// Routes

// homepage
app.get('/', (req, res) =>{

    //res.send('<p>Itzy Homepage</p>');
    //res.sendFile('./views/index.html', {root:__dirname});

    /*
    const blogs = [
        {title: 'Ryujin whips her hips' , snippet: 'She dances to the beat'},
        {title: 'Lia hits her peak' , snippet: 'She sings to the song'},
        {title: 'Chaeryoung smiles to her team' , snippet: 'She finds them funny'},
    ];
        
    res.render('index', {title: 'Home', blogs});
    */

    res.redirect('/blogs');
});

// about page
app.get('/about', (req, res) =>{
    //res.send('<p>Itzy About page</p>');
    //res.sendFile('./views/about.html', {root:__dirname});
    res.render('about', {title: 'About ITZY'});
});

// blog routes
app.get('/blogs', (req, res)=>{
    Blog.find().sort({createAt: -1})                                // collects created blogs and sorts them into descending order of creation
    .then((result)=>{
        res.render('index', {title: 'All Blogs', blogs: result})   
    })
    .catch((err)=>{
        console.log(err)
    })
});

app.post('/blogs', (req, res)=>{                                    
    const blog = new Blog(req.body);                                // requests the info inside the form in create page
    blog.save()                                                     // saves to the database
    .then((result)=>{                                               
        res.redirect('/blogs');                                     // redirects to blogs page to see the new posted blog
    })
    .catch((err)=>{
        console.log(err);        
    })
});

app.get('/blogs/:id',(req, res)=>{
    const id = req.params.id;
    Blog.findById(id)
    .then(result=>{
        res.render('details', {blog: result, title: 'Blog Details'});
    })
    .catch(err =>{
        console.log(err);
    })
})

app.delete('/blogs/:id', (req,res)=>{
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({redirect: '/blogs' });
    })
    .catch(err =>{
        console.log(err);
    })
})

// create page
app.get('/blogs/create', (req, res)=>{
    res.render('create', {title: 'Create a new Blog'});
});

/*
// redirects
app.get('/about-us', (req, res)=>{
    res.redirect('/about');
});
*/

// 404 page
app.use((req, res)=>{
    res.status(404).render('404', {title: 'Error'});
});
