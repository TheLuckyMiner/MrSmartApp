const express = require('express');
const router = express.Router();
const Theory = require('../models/theory');
const Tests = require('../models/test');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let fs = require('fs');
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

router.get('/', async (req,res) => {
    const locals = {
        title: "Mister Smart",
        description: "Приложение для изучения английского"
    };
     
    let data2 = await User.find({_id: "65fe0bf6604b74d06872ec48"});
    let data = [data2];
    try{

        const token = req.cookies.token;
        if(!token){        
            // res.render('login', {locals,  layout: adminLayout });
            data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
            res.render('index', {locals, data,  layout: adminLayout });
        } else{
            const decoded = jwt.verify(token, jwtSecret);
            let dataId = decoded.userId;
            data = await User.find({_id: dataId});
            // data = [data];
            res.render('index', {locals, data })   
        }
        
    } catch(err){
        data = await User.find({_id: "65fe0bf6604b74d06872ec48"});
        res.render('index', {locals,  layout: adminLayout , data});
    }
    // res.render('index', {locals, data,  layout: adminLayout })   
});

// router.get('/profile', async (req,res) => {
//     const locals = {
//         title: "Mister Smart | Профиль",
//         description: "Simple Blog"
//     };
//     data = await User.findById('65fde0124b123dc6a471b76b');
//     res.render('profile', {locals, data})   
// });


// router.get('/stats', async (req,res) => {
//     const locals = {
//         title: "Mister Smart | Профиль",
//         description: "Simple Blog"
//     };
//     data = await User.findById('65fde0124b123dc6a471b76b');
//     res.render('stats', {locals, data})   
// });

// router.get('/theory', async(req,res) => {
//     const locals = {
//         title: "Mister Smart | Теория",
//         description: "Теоретический материал"
//     };
//     try{
//         const data = await Theory.find();
//         res.render('theory', {locals, data});

        
//     } catch (err){
//         console.log(err);
//     }  
// });


// router.get('/lesson/:id', async(req,res) => {
//     try{
//         const locals = {
//             title: "Mister Smart | Теория",
//             description: "Теоретический материал"
//         };

//         let slug = req.params.id;

//         const data = await Theory.findById({_id: slug});
//         res.render('lesson', {locals, data, layout: lessonLayout});        
//     } catch (err){
//         console.log(err);
//     }  
// });


// router.get('/tests', async(req,res) => {
//     const locals = {
//         title: "Mister Smart | Тесты",
//         description: "Тестовый материал"
//     };
//     try{
//         const data = await Tests.find();
//         res.render('tests', {locals, data});

        
//     } catch (err){
//         console.log(err);
//     }  
// });


// router.get('/test/:id', async(req,res) => {
//     try{
//         const locals = {
//             title: "Mister Smart | Тест",
//             description: "Тестовый материал",
//         };

//         let slug = req.params.id;

//         const data = await Tests.findById({_id: slug});
//         res.render('test', {locals, data, layout: lessonLayout});        
//     } catch (err){
//         console.log(err);
//     }  
// });


// router.get('/admin', async (req,res) => {
//     try{
//         const locals = {
//             title: "Mister Smart | Администрирование",
//             description: "Simple Blog"
//         };
//         const theoryCount = await Theory.find().count();
//         const testCount = await Tests.find().count();
//         const data = {
//             Lessons: theoryCount,
//             Tests: testCount};
//         res.render('admin', {locals, data});   
//     } catch (err){
//         console.log(err);
//     }
// });

// router.get('/add-test', async (req,res) => {
//     try{
//         const locals = {
//             title: "Mister Smart | Администрирование",
//             description: "Simple Blog"
//         };
//         const data = await Theory.find().count();
//         res.render('add-test', {locals,  data});   
//     } catch (err){
//         console.log(err);
//     }
// });

// router.post('/add-test', async(req,res) => {
//    try{
//     const locals = {
//         title: "Mister Smart | Администрирование",
//         description: "Simple Blog"
//     };

//     const data = {
//         title: req.body.title,
//         type: req.body.type,
//         description: req.body.description,
//         body: req.body.body,
//         createdAt: new Date()
//     }

//     await Tests.create(data);
//     let TestId = await Tests.findOne({title: data.title});
//     let testCode;
//     let startCode = `const questions = ${data.body}`;
//     fs.readFile('./test.js', 'utf-8', (err,data) => {
//         if (err) throw err;
//         testCode = data;
//         fs.writeFile(`./public/questions/${TestId._id}.js`, startCode + testCode, (err) => {
//             if (err) throw err;
//         });
//     });

//     res.render('add-test', {locals})
//    } catch(err){
//     console.log(err);
//    }
// });

// router.get('/add-theme', async (req,res) => {
//     try{
//         const locals = {
//             title: "Mister Smart | Администрирование",
//             description: "Simple Blog"
//         };
//         const data = await Theory.find().count();
//         res.render('add-theme', {locals, data});   
//     } catch (err){
//         console.log(err);
//     }
// });

// router.post('/add-theme', async(req,res) => {
//     try{
//      const locals = {
//          title: "Mister Smart | Администрирование",
//          description: "Simple Blog"
//      };
//      // const body = JSON.stringify(req.body);
//      const data = {
//          title: req.body.title,
//          level: req.body.level,
//          type: req.body.type,
//          description: req.body.description,
//          body: req.body.body,
//          createdAt: new Date()
//      }
 
//      await Theory.create(data);
//      console.log(data);
//      res.render('add-theme', {locals})
//     } catch(err){
//      console.log(err);
//     }
//  });

module.exports = router;

