const express = require('express');
const router = express.Router();
const userController = require('../controller/usercontroller');
const multer = require('multer');

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for creating a new product
router.post('/products', upload.single('design'), userController.createProduct);
router.post('/pvcpersonal',upload.single('profile_picture'), userController.createPvcpersonal);
router.post('/companyinfo',upload.single('profile_picture'), userController.createcompanyinfo);
router.post('/paymentinfo', userController.createPaymentinfo);
router.get('/', userController.getAllUsers);
router.get('/personal', userController.getPersonal);
router.get('/personal/:id', userController.getProfilePictureById);
router.get('/companyinfo/:id', userController.getCompanyInfo);
router.get('/paymentinfo/:id', userController.getpaymentById);
router.get('/products/:productId', userController.getImage);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
