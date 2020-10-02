const express = require("express");

const AdminController = require('../controllers/adminController');
const admincontroller = new AdminController();
const Helper = require('../helpers/helper');
const helper = new Helper();

const app = express();
const adminRoute = express.Router();

adminRoute.post("/logout",function(req, res){
	admincontroller.logout(req,res);
});


module.exports = adminRoute;