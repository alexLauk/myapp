const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const corsesRoutes = require('./routes/courses');

const User = require('./models/user');


const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use( async (req, res, next) => {
    try {
        const user = await User.findById('5dbf25eff0026709d847fea0');
    req.user = user;
    next();
    }  catch (e) {
        console.log(e);
    }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', corsesRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        const url
        ='mongodb+srv://AlexFinch:nGC9e3q33w3fcux4@cluster0-hfqo3.mongodb.net/shop';
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
     })

     const candidate = await User.findOne()
     if (!candidate) {
         const user = new User({
             email:'alex@gmail.com',
             name:'Alex',
             cart: {items:[]}
         });

         await user.save();
     }
     app.listen(PORT, () => {
        console.log(`Server is running ${PORT}`)
        });
    } catch (e) {
        console.log(e)
    }
}

start();
