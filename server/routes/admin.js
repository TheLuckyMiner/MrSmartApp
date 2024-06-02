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

router.get('/login-error' , async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Ошибка входа",
            description: "Приложение для изучения английского"
        };
        res.render('login-error', {locals, layout: adminLayout });
        } catch (err){
            console.log(err);
        }
});

router.get('/register-error' , async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Ошибка регистрации",
            description: "Приложение для изучения английского"
        };
        res.render('register-error', {locals, layout: adminLayout });
        } catch (err){
            console.log(err);
        }
}); 

router.get('/update-error' , async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Ошибка изменения данных",
            description: "Приложение для изучения английского"
        };
        res.render('update-error', {locals, layout: adminLayout });
        } catch (err){
            console.log(err);
        }
});

router.get('/access-error' , async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Ошибка",
            description: "Приложение для изучения английского"
        };
        res.render('access-error', {locals, layout: adminLayout });
        } catch (err){
            console.log(err);
        }
});

router.get('/404' , async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Ошибка",
            description: "Приложение для изучения английского"
        };
        res.render('404', {locals, layout: adminLayout });
        } catch (err){
            console.log(err);
        }
});

/*Проверка MiddleWare */
const authMiddleware = (req,res, next) =>{
    const locals = {
        title: "Mister Smart | Ошибка",
        description: "Приложение для изучения английского"
    };

    try{
        const token = req.cookies.token;
        if(!token){
            res.status(401).redirect('auth-error');
            return;
    }    
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(err){
        // res.status(401).json({message: "Нет доступа"});
        res.status(409).redirect('error');
    }
}

/*Проверка MiddleWare */
const accessMiddleware = async (req,res, next) =>{
    const token = req.cookies.token;
    const locals = {
        title: "Mister Smart",
        description: "Приложение для изучения английского"
    };
    try{
        const token = req.cookies.token;
        if(!token){
            res.status(401).redirect('auth-error');
            return;
    }        
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        let data = await User.findOne({_id: dataId});

        if(data.role == "Admin"){
            next();
        } else{
            res.status(403).redirect('access-error');
            return;
        }
        
    } catch(err){
        // res.status(401).json({message: "Нет доступа"});
        res.status(409).redirect('error');
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
        let userId, data;
        try{
            userId = user._id;
            data = [user];
        } catch(err){
            res.status(401).redirect('login-error');
            return;
        }
        
        if(!user){
            res.status(401).redirect('login-error');
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            res.status(401).redirect('login-error');
            return;
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly:true});
        res.status(200).render('index', {locals, userId, data});
        return;
    } catch (err){
        console.log(err);
        res.status(400).render('error');
        return;
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
            res.render('login', {locals, data, layout: adminLayout});            
        } catch(err){
            console.log(err);
            if(err.code === 11000){
                res.status(409).redirect('register-error');
            } else{
                res.status(500).redirect('error');
            }

        }
            
        // res.render('login', {locals, layout: adminLayout })
    } catch (err){
        console.log(err);
    }
});

router.post('/updateInfo',  async(req,res) => {
    try{      

        const locals = {
            title: "Mister Smart | Профиль",
            description: "Приложение для изучения английского"
        }
        
        if(req.body.password !== req.body.password2 || req.body.password.length < 3){
            res.status(400).redirect('/update-error');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            _id: req.body.id
        }        

        data = await User.find({_id: userData._id});

        if (data.password !== hashedPassword){
            await User.findOneAndUpdate({_id: userData._id}, {$set: {password: hashedPassword}});
            res.render('profile-updated', {locals, data}); 
        }        
    } catch(err){
        console.log(err)
        res.status(500).render('error');
    }
});

router.post('/profileExit',  async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Профиль",
            description: "Приложение для изучения английского"
        }

        res.clearCookie('token');
        res.redirect('/');
    } catch(err){
        console.log(err)
        res.status(500).redirect('error');
    }
});



router.get('/admin',authMiddleware, accessMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Приложение для изучения английского"
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
            res.render('admin', {locals, Infodata, data});  
        } catch(err){
            res.redirect('error');
        }         
    } catch (err){
        console.log(err);
        res.status(409).redirect('auth-error');
    }
});

router.get('/people', authMiddleware, accessMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Приложение для изучения английского"
        };
        const people = await User.find().sort({name:1});
        let data;
        try{
            data = await User.find({_id: req.userId});
        } catch(err){
            data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
        }
        res.render('people', {locals,  people, data});   
    } catch (err){
        console.log(err);
        res.redirect('error');
    }
});

router.get('/person/:id',  authMiddleware, accessMiddleware,  async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Приложение для изучения английского"
        };
        let slug = req.params.id;
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        let data = await User.find({_id: dataId});
        const userData = await User.findById({_id: slug});
        res.render('person', {locals, userData, data});        
    } catch (err){
        console.log(err);
        res.status(400).redirect('error');
    }
});

router.post('/becomeAdmin', authMiddleware, accessMiddleware,  async(req,res) => {
    try{      

        const locals = {
            title: "Mister Smart | Профиль",
            description: "Приложение для изучения английского"
        }
        
        const userId = req.body.id;
        let userData = await User.find({_id: userId});

        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        data = await User.find({_id: dataId});
        const people = await User.find().sort({name:1});

        if (userData[0].role == 'Admin'){
            await User.findOneAndUpdate({_id: userId}, {$set: {role: "Student"}});            
        } else if (userData[0].role == 'Student'){
            await User.findOneAndUpdate({_id: userId}, {$set: {role: "Admin"}});
        }   
        res.render('people-updated', {locals, data, people});  
    } catch(err){
        console.log(err)
        res.status(500).render('error');
    }
});



/*Добавление теста*/
router.get('/add-test',authMiddleware, accessMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Приложение для изучения английского"
        };
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        data = await User.find({_id: dataId});
        res.render('add-test', {locals, data});   
    } catch (err){
        console.log(err);
    }
});

router.post('/add-test', authMiddleware, async(req,res) => {
   try{
    const locals = {
        title: "Mister Smart | Администрирование",
        description: "Приложение для изучения английского"
    };

    let data1 = {
        title: req.body.title,
        type: req.body.type,
        description: req.body.description,
        body: req.body.body,
        createdAt: new Date()
    }

    await Tests.create(data1);
    let TestId = await Tests.findOne({title: data1.title});
    let testCode;
    let startCode = `const questions = ${data1.body}`;
    fs.readFile('./test.js', 'utf-8', (err,data1) => {
        if (err) throw err;
        testCode = data1;
        fs.writeFile(`./public/questions/${TestId._id}.js`, startCode + testCode, (err) => {
            if (err) throw err;
        });
    });
    
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret);
    let dataId = decoded.userId;
        try{
            let data = await User.findOne({_id: dataId});
            data = [data];
            res.render('add-test', {locals, data}); 
            return 
        } catch(err){
            res.redirect('error');
            return
        }      
          
   } catch(err){
    console.log(err);
    res.status(400).redirect('error');
   }
});

/*Добавление темы*/
router.get('/add-theme',authMiddleware, accessMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Приложение для изучения английского"
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

router.post('/add-theme', authMiddleware, async(req,res) => {
    try{
     const locals = {
         title: "Mister Smart | Администрирование",
         description: "Приложение для изучения английского"
     };
     const data = {
         title: req.body.title,
         level: req.body.level,
         type: req.body.type,
         description: req.body.description,
         body: req.body.body,
         createdAt: new Date()
     }
 
     await Theory.create(data);
     res.render('add-theme', {locals})
    } catch(err){
     console.log(err);
    }
 });



 router.get('/profile', authMiddleware, async (req,res) => {
    const locals = {
        title: "Mister Smart | Профиль",
        description: "Приложение для изучения английского"
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

router.get('/profile-updated', authMiddleware, async (req,res) => {
    const locals = {
        title: "Mister Smart | Профиль",
        description: "Приложение для изучения английского"
    };

    const token = req.cookies.token;
    
    const decoded = jwt.verify(token, jwtSecret);
    let data1 = decoded.userId;

    try{
        data = await User.find({_id: data1});
    } catch(err){
        res.render('error');
    }
    
    res.render('profile-updated', {locals, data})   
});

router.get('/stats', authMiddleware, async (req,res) => {
    const locals = {
        title: "Mister Smart | Профиль",
        description: "Приложение для изучения английского"
    };
    try{
        data = await User.find({_id: req.userId});
    } catch(err){
        data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
    }
    res.render('stats', {locals, data})   
});



router.get('/theory', authMiddleware, async(req,res) => {
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


router.get('/lesson/:id', authMiddleware, async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Теория",
            description: "Теоретический материал"
        };

        let slug = req.params.id;
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        let data = await User.find({_id: dataId});

        const Theorydata = await Theory.findById({_id: slug});
        res.render('lesson', {locals, Theorydata, layout: lessonLayout, data});        
    } catch (err){
        console.log(err);
    }  
});


router.get('/tests', authMiddleware, async(req,res) => {
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


router.get('/test/:id', authMiddleware, async(req,res) => {
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



router.post('/theoryStatsUpdate',  async(req,res) => {
    try{     

        const locals = {
            title: "Mister Smart | Теория",
            description: "Приложение для изучения английского"
        }
        
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        let data = await User.find({_id: dataId});

        let newStats = Number(req.body.count) + 1;
        await User.findOneAndUpdate({_id: dataId}, {$set: {lessonComplete: newStats}});
        const Theorydata = await Theory.find();
        res.render('theory', {locals, Theorydata, data}); 
        } catch(err){
        console.log(err)
        res.status(500).render('error');
    }
});

router.post('/testStatsUpdate',  async(req,res) => {
    try{     

        const locals = {
            title: "Mister Smart | Теория",
            description: "Приложение для изучения английского"
        }
        
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        let data = await User.find({_id: dataId});
        let newStats = Number(req.body.count) + 1;
        await User.findOneAndUpdate({_id: dataId}, {$set: {testComplete: newStats}});
        const Testdata = await Tests.find();
        res.render('tests', {locals,Testdata, data});
        } catch(err){
        console.log(err)
        res.status(500).render('error');
    }
});



router.use((req,res) => {
    res.status(404).redirect('404');
});

module.exports = router;




