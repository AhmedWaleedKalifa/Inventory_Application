const {Router}=require("express")
const categoriesRouter=Router();
const categoriesController=require("../controllers/categoriesController")

categoriesRouter.get("/get/:id",categoriesController.categoryItemsGet);
categoriesRouter.post("/delete/:id",categoriesController.deleteCategoryPost);

categoriesRouter.get("/create",categoriesController.addCategoryGet);
categoriesRouter.post("/create",categoriesController.addCategoryPost);

categoriesRouter.get("/update/:id",categoriesController.updateCategoryGet);
categoriesRouter.post("/update/:id",categoriesController.updateCategoryPost);


module.exports=categoriesRouter;