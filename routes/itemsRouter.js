const {Router}=require("express")
const itemsRouter=Router();
const itemsController=require("../controllers/itemsController")

itemsRouter.get("/get/:id",itemsController.itemsDetailsGet);

itemsRouter.post("/delete/:id",itemsController.deleteItemPost);
itemsRouter.get("/create",itemsController.addItemGet);
itemsRouter.post("/create",itemsController.addItemPost);
itemsRouter.get("/update/:id",itemsController.updateItemGet);
itemsRouter.post("/update/:id",itemsController.updateItemPost);

module.exports=itemsRouter;