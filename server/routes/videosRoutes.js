const { Router } = require("express");
const route = Router();
const videosControllers = require("../controllers/videosControllers");
// const {validateJWT} = require ("../src/middleware/validateJwt");

route.all("/", function(res, req, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET. POST, PUT, DELETE, OPTIONS");
    next();
});

route.get("/getAllVideos:userId", videosControllers.getAllVideos);
route.post("/neVideo", videosControllers.newVideo);
route.put("/editVideo:Id", videosControllers.editVideo);
route.delete("/deleteVideo:id", videosControllers.deleteVideo);
// route.post("/getAllVideos:userId", validateJWT, videosControllers.getAllVideos);
// route.post("/newVideo, validateJWT, videosControllers.newVideo);
// route.put("/editVideo:Id", validateJWT, videosControllers.editVideo);
// route.delete("/deleteVideo:id", validateJWT, videosControllers.deleteVideo);

module.exports = route;