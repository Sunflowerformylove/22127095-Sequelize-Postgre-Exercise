const router = require('express').Router();
const { init } = require('../controllers/blogController');
const {showList, showDetails} = require('../controllers/blogController');

router.use("/", init);
router.get("/", showList);
router.get("/:id", showDetails);

module.exports = router;