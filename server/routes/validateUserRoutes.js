const { Router } = require("express");
const route = Router();
const usersControllers = require("../controllers/usersControllers.js");
const { validateJWT } = require ("../src/middleware/validateJwt.js");

route.all("/", function(res, req, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET. POST, PUT, DELETE, OPTIONS");
    next();
});

route.post("/login", usersControllers.login);
route.post("/signup", usersControllers.signup);
route.get("/confirmAccount/:id", usersControllers.confirmAccount);
route.post("/renewAccount", usersControllers.renewPassword);
route.get("/changePasswordLink/:id", usersControllers.changePasswordLink);
route.post("/changePassword", usersControllers.changePassword);

module.exports = route;