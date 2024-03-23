const express = require('express');
const router = express.Router();
const Theory = require('../models/theory');
const Tests = require('../models/test');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let fs = require('fs');
const adminLayout = '../views/layouts/admin';
const lessonLayout = '../views/layouts/lesson';
const jwtSecret = process.env.JWT_SECRET;

router.get('/login', async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Вход",
            description: "Приложение для изучения английского"
        };
        res.render('login', {locals, layout: adminLayout })
    } catch (err){
        console.log(err);
    }
});

router.get('/agree', async(req,res) => {
    try{
    const locals = {
        title: "Mister Smart | Пользовательское соглашение",
        description: "Приложение для изучения английского"
    };
    res.render('agree', {locals, layout: adminLayout }) 
    } catch (err){
        console.log(err);
    }
});

router.get('/auth-error' , async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Ошибка доступа",
            description: "Приложение для изучения английского"
        };
        res.render('auth-error', {locals, layout: adminLayout });
        } catch (err){
            console.log(err);
        }
});

router.get('/error' , async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Ошибка",
            description: "Приложение для изучения английского"
        };
        res.render('error', {locals, layout: adminLayout });
        } catch (err){
            console.log(err);
        }
});


/*Проверка MiddleWare */
const authMiddleware = (req,res, next) =>{
    const token = req.cookies.token;
    if(!token){
        res.status(409).redirect('auth-error');
    }
    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(err){
        // res.status(401).json({message: "Нет доступа"});
        res.status(409).redirect('error');
    }
}

/*Проверка MiddleWare */
const useMiddleware = (req,res, next) =>{
    const token = req.cookies.token;
    const locals = {
        title: "Mister Smart",
        description: "Приложение для изучения английского"
    };
    if(!token){        
        next();
    }
    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(err){
        // res.status(401).json({message: "Нет доступа"});
        next();
    }
}

/*Авторизация */
router.post('/login', async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Профиль",
            description: "Приложение для изучения английского"
        };
        const {email, password} = req.body;
        const user = await User.findOne({email});
        const userId = user._id;
        const data = [user];
        if(!user){
            return res.status(401).json({message: "Неверный логин или пароль"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            return res.status(401).json({message: "Неверный логин или пароль"});
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly:true});
        res.status(200).render('index', {locals, userId, data});
        // res.render('login', {locals, layout: adminLayout })
    } catch (err){
        console.log(err);
        res.status(400).render('error');
    }
});

/*Регистрация */
router.post('/register', async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Вход",
            description: "Приложение для изучения английского"
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            level: req.body.level,
            testComplete:0, 
            lessonComplete:0, 
            role:"Student"
        }        
        
        try {
            const user = await User.create(userData);
            // res.status(201).json({message: 'User created', user});
            // res.render('auth-error');
            data = [userData];
            res.render('profile', {locals, data});
        } catch(err){
            console.log(err);
            if(err.code === 11000){
                res.status(409).json({message: "Пользователь уже существует"});
            } else{
                res.status(500).redirect('error');
            }

        }
            
        // res.render('login', {locals, layout: adminLayout })
    } catch (err){
        console.log(err);
    }
});


router.get('/admin',authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Simple Blog"
        };
        const theoryCount = await Theory.find().count();
        const testCount = await Tests.find().count();
        const userCount = await User.find().count();
        const Infodata = {
            Lessons: theoryCount,
            Tests: testCount,
            Users: userCount};
        try{
            data = await User.find({_id: req.userId});
        } catch(err){
            data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
        }
        res.render('admin', {locals, Infodata, data});   
    } catch (err){
        console.log(err);
        res.status(409).redirect('auth-error');
    }
});

router.get('/people', async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Simple Blog"
        };
        const people = await User.find();
        let data;
        try{
            data = await User.find({_id: req.userId});
        } catch(err){
            data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
        }
        res.render('people', {locals,  people});   
    } catch (err){
        console.log(err);
        res.redirect('error');
    }
});

/*Добавление теста*/
router.get('/add-test',authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Simple Blog"
        };
        let data = await Theory.find().count();
         
        try{
            data = await User.find({_id: req.userId});
        } catch(err){
            data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
        } 
        res.render('add-test', {locals,  data}); 
    } catch (err){
        console.log(err);
    }
});

router.post('/add-test', async(req,res) => {
   try{
    const locals = {
        title: "Mister Smart | Администрирование",
        description: "Simple Blog"
    };

    const data = {
        title: req.body.title,
        type: req.body.type,
        description: req.body.description,
        body: req.body.body,
        createdAt: new Date()
    }

    await Tests.create(data);
    let TestId = await Tests.findOne({title: data.title});
    let testCode;
    let startCode = `const questions = ${data.body}`;
    fs.readFile('./test.js', 'utf-8', (err,data) => {
        if (err) throw err;
        testCode = data;
        fs.writeFile(`./public/questions/${TestId._id}.js`, startCode + testCode, (err) => {
            if (err) throw err;
        });
    });

    res.render('add-test', {locals})
   } catch(err){
    console.log(err);
   }
});

/*Добавление темы*/
router.get('/add-theme',authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Simple Blog"
        };
        let data = await Theory.find().count();
        try{
            data = await User.find({_id: req.userId});
        } catch(err){
            data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
        }
        res.render('add-theme', {locals, data});   
    } catch (err){
        console.log(err);
    }
});

router.post('/add-theme', async(req,res) => {
    try{
     const locals = {
         title: "Mister Smart | Администрирование",
         description: "Simple Blog"
     };
     // const body = JSON.stringify(req.body);
     const data = {
         title: req.body.title,
         level: req.body.level,
         type: req.body.type,
         description: req.body.description,
         body: req.body.body,
         createdAt: new Date()
     }
 
     await Theory.create(data);
    //console.log(data);
     res.render('add-theme', {locals})
    } catch(err){
     console.log(err);
    }
 });

 router.get('/profile', async (req,res) => {
    const locals = {
        title: "Mister Smart | Профиль",
        description: "Simple Blog"
    };

    const token = req.cookies.token;
    if(!token){        
        res.render('login');
    }
    const decoded = jwt.verify(token, jwtSecret);
    let data1 = decoded.userId;

    try{
        data = await User.find({_id: data1});
    } catch(err){
        data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
    }
    
    res.render('profile', {locals, data})   
});

router.get('/stats', useMiddleware, async (req,res) => {
    const locals = {
        title: "Mister Smart | Профиль",
        description: "Simple Blog"
    };
    try{
        data = await User.find({_id: req.userId});
    } catch(err){
        data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
    }
    res.render('stats', {locals, data})   
});



router.get('/theory', async(req,res) => {
    const locals = {
        title: "Mister Smart | Теория",
        description: "Теоретический материал"
    };

    try{
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        data = await User.find({_id: dataId});
        const Theorydata = await Theory.find();
        res.render('theory', {locals, Theorydata, data});        
    } catch (err){
        console.log(err);
    }  
});


router.get('/lesson/:id', async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Теория",
            description: "Теоретический материал"
        };

        let slug = req.params.id;

        const Theorydata = await Theory.findById({_id: slug});
        res.render('lesson', {locals, Theorydata, layout: lessonLayout});        
    } catch (err){
        console.log(err);
    }  
});


router.get('/tests', async(req,res) => {
    const locals = {
        title: "Mister Smart | Тесты",
        description: "Тестовый материал"
    };
    try{
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        let data = await User.find({_id: dataId});

        const Testdata = await Tests.find();
        res.render('tests', {locals,Testdata, data});

        
    } catch (err){
        console.log(err);
    }  
});


router.get('/test/:id', async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Тест",
            description: "Тестовый материал",
        };

        let slug = req.params.id;
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        let data = await User.find({_id: dataId});

        const Testdata = await Tests.findById({_id: slug});
        res.render('test', {locals, Testdata, layout: lessonLayout, data});        
    } catch (err){
        console.log(err);
    }  
});


module.exports = router;




