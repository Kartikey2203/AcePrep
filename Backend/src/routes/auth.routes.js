const {Router}=require("express")
const authController=require("../controllers/auth.controller")
const router=Router();
const authMiddleware=require("../middlewares/auth.middleware")

/**
 * @description register user
 * @route POST /api/auth/register
 * @access public
 */

router.post("/register",authController.registerUserController)


/**
 * @description login user
 * @route POST /api/auth/login
 * @access public
 */

router.post("/login",authController.loginUserController)
 

/**
 * @description logout user
 * @route GET /api/auth/logout
 * @access public
 */

router.get("/logout",authController.logoutUserController)

/**
 * @description get current user
 * @route GET /api/auth/me
 * @access private
 */

router.get("/get-me",authMiddleware,authController.getCurrentUserController)


module.exports=router