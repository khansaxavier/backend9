const express = require('express');
const app = express();
const session = require('express-session')
const mysql = require('mysql2')
const port = 3000;

app.use(express.json())
// app.use(express.urlencoded({extends: true}))

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'kuliah'   
});
connection.connect(error => {
    if(error) throw error;
    console.log('Terhubung ke database kuliah');
})

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

const authenticate = (req, res, next) => {
    if (req?.session.saveUninitialized) {
        next();
    } else {
        res.status(401).send('tidak terauntentifikasi');
    }
};
app.post('/register', (req, res) => {
    const {username, password} = req.body;
    connection.query(`INSERT INTO user VALUES ('${username}',PASSWORD('${password}'))`,
        (error,result)=>{
            if (error) throw error;
            res.json({message: 'Data berhasil ditambahkan', id : result.insertId });
    });
});

app.post('/login', (req,res) => {
    const {username, password} = req.body;

    connection.promise().query(`SELECT * FROM user WHERE username ='${username}' AND password = PASSWORD('${password}')`)
    .then((result)=>{
    if(result.length > 0) {
        req.session.saveUninitialized = true ;
        res.json({message : 'Berhasil Login'})
    } else {
        res.status(401).send('kredensial Tidak Valid');
    }
    })
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) =>{
        if(err) {
            console.log(err);
        } else {
            res.send('logout');
        }
    });
});

app.get('/open', (req,res) => {
    res.send('Anda masuk pada route tidak terproteksi')
})
app.get('/protected', authenticate, (req,res) => {
    res.send('Anda Masuk Pada Route Terproteksi (GET)');
});

app.post('/protected', authenticate, (req,res) => {
    res.send('Anda Masuk Pada Route Terproteksi (POST)');
});

app.put('/protected', authenticate, (req,res) => {
    res.send('Anda Masuk Pada Route Terproteksi (PUT)');
});

app.delete('/protected', authenticate, (req,res) => {
    res.send('Anda Masuk Pada Route Terproteksi (DELETE)');
});

app.listen(port, () => {
    console.log(`server berjalan pada localhost:${port}`)
});
