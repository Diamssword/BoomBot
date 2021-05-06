require('dotenv').config({ path: '.env' });
const express = require('express'),
    http = require('http'),
    socketio = require('socket.io'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    sharedsession = require('express-socket.io-session'),
    sass = require('node-sass-middleware'),
    path = require('path'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session'),
    fileUpload = require('express-fileupload'),
    mongoose = require('mongoose'),
    routerMod= require('./router.js');

const { genRandom } = require('./utils');
const { ensureAuthenticated } = require('./config/auth');

http.globalAgent.maxSockets = Infinity;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3001;
require('./config/passport')(passport);               
mongoose.connect(
    encodeURI(process.env.dbConnect), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}
).then(() => console.log("[MongoDB] ► Connexion à MongoDB établie"))
.catch(err => console.log(err));

const vsession = session({
    secret: `${genRandom(15)}`,
    resave: false,
    saveUninitialized: false,
    unset: 'keep',
    cookie: { secure: "auto", maxAge: 43200000 }
});

app.set('trust proxy' , 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(fileUpload());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views/pages'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(vsession);
app.use(passport.initialize());                 
app.use(passport.session());                   
app.use(flash());
app.use(sass({
    src: __dirname + '/style',
    dest: __dirname + '/style',
    debug: false,
    force: true
}));

app.get('/' , async (req , res) => res.redirect('/connexion'));

app.use("/", async (req, res, next) => {
    if(req && res && res.locals){
        res.locals.breadcrumbs= routerMod.getAriane(req.path.substring(1))
    }
    
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/files' , express.static(path.join(__dirname, 'shared_files')));


app.use(function (req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    res.locals.error = req.flash('error');
    next();
});

io.use(sharedsession(vsession, {
    autoSave: true
}));
io.on('connection', socket => {
    for(let s in routerMod.sockets)
    {
        routerMod.sockets[s](socket);
    }
});

routerMod.routing();
app.use('/', routerMod.router);

app.use(ensureAuthenticated , function (req, res) {
    res.status(404).render('404.ejs');
});

app.use(ensureAuthenticated ,function (req, res) {
    res.status(500).render('500.ejs');
});

server.listen(PORT , () => {
    console.clear();
    console.log("[SERVER] ► http://localhost:" + PORT);
});
require('./bot/botmain');
