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
        res.status(500).redirect('error');
        return;
    }
});

router.get('/agree', async(req,res) => {
    try{
    const locals = {
        title: "Mister Smart | Пользовательское соглашение",
        description: "Приложение для изучения английского"
    };
    res.render('agree', {locals, layout: adminLayout}) ;
    return;
    } catch (err){
        console.log(err);
        res.status(500).redirect('error');
        return;
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
        res.status(409).redirect('error');
    }
}

/*Проверка MiddleWare */
const accessMiddleware = async (req,res, next) =>{    
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
        res.status(409).redirect('error');
        return;
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
        res.status(400).redirect('error');
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
        if (req.body.password !== req.body.password2){
            res.status(500).redirect('update-error');
            return;
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
            data = [userData];
            res.render('login', {locals, data, layout: adminLayout});   
            return;         
        } catch(err){
            if(err.code === 11000){
                res.status(409).redirect('register-error');
                return;
            } else{
                res.status(500).redirect('error');
                return;
            }
        }
    } catch (err){
        console.log(err)
        res.status(500).redirect('error');
        return;
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
            return;
        }        
    } catch(err){
        console.log(err)
        res.status(500).redirect('error');
        return;
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
        return;
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
            return;
        } catch(err){
            res.status(500).redirect('error');
            return;
        }         
    } catch (err){
        console.log(err);
        res.status(409).redirect('auth-error');
        return;
    }
});

router.get('/people', authMiddleware, accessMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Приложение для изучения английского"
        };
        const people = await User.find().sort({name:1});
        let data = await User.find({_id: req.userId});
        res.render('people', {locals,  people, data});  
        return; 
    } catch (err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }
});

router.get('/person/:id',  authMiddleware, accessMiddleware,  async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Приложение для изучения английского"
        };
        let slug = req.params.id;
        let data = await User.find({_id: req.userId});
        const userData = await User.findById({_id: slug});
        res.render('person', {locals, userData,  layout: lessonLayout, data});    
        return;    
    } catch (err){
        console.log(err);
        res.status(500).redirect('error');
        return;
        
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
        return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }
});



/*Добавление теста*/
router.get('/add-test',authMiddleware, accessMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('add-test', {locals, data});
        return;                 
    } catch (err){
        console.log(err);
        res.status(500).redirect('error');
        return;
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
            res.status(500).redirect('error');
            return
        }      
          
   } catch(err){
    console.log(err);
    res.status(500).redirect('error');
    return;
   }
});

/*Добавление темы*/
router.get('/add-theme',authMiddleware, accessMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Администрирование",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('add-theme', {locals, data});  
        return;               
    } catch (err){
        console.log(err);
        res.status(500).redirect('error');
        return;
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
     return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }
 });



 router.get('/profile', authMiddleware, async (req,res) => { 
    try{
        const locals = {
            title: "Mister Smart | Профиль",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('profile', {locals, data})
        return; 
    } catch(err){
        res.status(500).redirect('error');
        return;
    }  
});

router.get('/profile-updated', authMiddleware, async (req,res) => {    
    try{
        const locals = {
            title: "Mister Smart | Профиль",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('profile-updated', {locals, data})  
        return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }
});

router.get('/stats', authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Тесты",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('stats', {locals, data}) 
        return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }  
});

/*Тесты на уровень знания английского */
router.get('/english-level', authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Тесты",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('english-level', {locals, data}) 
        return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }      
});

router.get('/english-a1', authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Тест",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('english-a1', {locals, data})  
        return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }     
});

router.get('/english-a2', authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Тест",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('english-a2', {locals, data});
        return;  
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }     
});

router.get('/english-b1', authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Тест",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('english-b1', {locals, data})  
        return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }    
});

router.get('/english-b2', authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Тест",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('english-b2', {locals, data})  
        return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }     
});

router.get('/english-c1', authMiddleware, async (req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Тест",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('english-c1', {locals, data})  
        return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }     
});

router.get('/english-c2', authMiddleware, async (req,res) => {    
    try{
        const locals = {
            title: "Mister Smart | Тест",
            description: "Приложение для изучения английского"
        };
        let data = await User.find({_id: req.userId});
        res.render('english-c2', {locals, data});
        return;
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }     
});

router.post('/englishStatsUpdate',  async(req,res) => {
    try{     

        const locals = {
            title: "Mister Smart | Теория",
            description: "Приложение для изучения английского"
        }
        
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        let dataId = decoded.userId;
        let data = await User.find({_id: dataId});

        let newStats = String(req.body.level);
        await User.findOneAndUpdate({_id: dataId}, {$set: {level: newStats}});
        res.render('english-level', {locals, data}); 
        return;
        } catch(err){
        console.log(err)
        res.status(500).render('error');
        return;
    }
});

/*Теоретический раздел */
router.get('/theory', authMiddleware, async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Теория",
            description: "Теоретический материал"
        };
        let data = await User.find({_id: req.userId});
        const Theorydata = await Theory.find();
        res.render('theory', {locals, Theorydata, data});   
        return;     
    } catch(err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }      
});


router.get('/lesson/:id', authMiddleware, async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Теория",
            description: "Теоретический материал"
        };

        let slug = req.params.id;
        let data = await User.find({_id: req.userId});
        const Theorydata = await Theory.findById({_id: slug});
        res.render('lesson', {locals, Theorydata, layout: lessonLayout, data});    
        return;    
    } catch (err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }  
});


router.get('/tests', authMiddleware, async(req,res) => {
    const locals = {
        title: "Mister Smart | Тесты",
        description: "Тестовый материал"
    };
    try{
        let data = await User.find({_id: req.userId});
        const Testdata = await Tests.find();
        res.render('tests', {locals,Testdata, data});   
        return;     
    } catch (err){
        console.log(err);
        res.status(500).redirect('error');
        return;
    }  
});


router.get('/test/:id', authMiddleware, async(req,res) => {
    try{
        const locals = {
            title: "Mister Smart | Тест",
            description: "Тестовый материал",
        };
        let slug = req.params.id;
        let data = await User.find({_id: req.userId});
        const Testdata = await Tests.findById({_id: slug});
        res.render('test', {locals, Testdata, layout: lessonLayout, data});    
        return;    
    } catch (err){
        console.log(err);
        res.status(500).redirect('error');
        return;
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
        return;
        } catch(err){
        console.log(err)
        res.status(500).redirect('error');
        return;
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
        return;
        } catch(err){
        console.log(err)
        res.status(500).render('error');
        return;
    }
});

router.use((req,res) => {
    res.status(404).redirect('404');
});

module.exports = router;




