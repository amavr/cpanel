const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const log4js = require('log4js');
const log = log4js.getLogger('app');
const hb = require("express-handlebars");

const apiRouter = require('./routes/api');

const app = express();

const ofs = 10;
console.log("".padEnd(32, '='));
console.log("Platform:".padStart(ofs), process.platform);
console.log("Version:".padStart(ofs), process.version);
console.log("Arch:".padStart(ofs), process.arch);
console.log("Secret:".padStart(ofs), process.env.SECRET);
console.log("".padEnd(32, '='));

// console.log(process.env);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("hbs", hb(
    {
        layoutsDir: path.join(__dirname, 'views/layouts'),
        partialsDir: path.join(__dirname, 'views/partials'),
        defaultLayout: "main",
        extname: "hbs"
    }
));
app.set("view engine", ".hbs");

// app.use(log4js.connectLogger(log, { level: 'info' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', (req, res, next) => {
    const fpath = path.resolve('./views/auth.html');
    res.sendFile(fpath);
    // next();
});

app.use('/template', (req, res, next) => {
    const fpath = path.resolve('./views/template.html');
    res.sendFile(fpath);
    // next();
});

app.use('/api', apiRouter);

const Utils = require('./helpers/utils');

app.use("*", function (req, res) {
    const menu = Utils.makeSidebar('admin', req.url);
    console.log(menu);
    res.render("index", {sidebar: { sections: menu }});
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    log.error(`${err.statusCode} ${err.message}`);
    // render the error page
    res
        .status(err.status || 500)
        .render('msg', { layout: 'error', data: { title: 'Заголовок с ошибкой', code: err.statusCode, msg: 'Не нашли такую страничку (' } });
});

module.exports = app;
