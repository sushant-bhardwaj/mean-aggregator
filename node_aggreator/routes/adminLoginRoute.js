const express = require("express");

const AdminController = require('../controllers/adminController');
const admincontroller = new AdminController();
const Helper = require('../helpers/helper');
const helper = new Helper();

const app = express();
const adminLoginRoute = express.Router();

adminLoginRoute.post("/login", function(req, res) {
	admincontroller.login(req, res);
});

module.exports = adminLoginRoute;