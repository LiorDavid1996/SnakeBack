const router = require("express").Router()
const {register,login,getAll,updateScore} =require("../controllers/userCtr")

router.post("/register", register)
router.post("/login",login )
router.get("/getAll", getAll)
router.put("/updateScore",updateScore)



module.exports = router