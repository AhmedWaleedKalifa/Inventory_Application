const { render } = require("ejs");
const db=require("../db/queries");
const { body, validationResult } = require("express-validator")
const validateItem = [
   body("name")
      .trim()
      .matches(/^[a-zA-z0-9\s\_]+$/)
      .withMessage("name must be alphabetic or number or _")
      .isLength({ min: 1, max: 60 })
      .withMessage("name must be between 1 to 60 characters"),

   body("description")
      .trim()
      .matches(/^[a-zA-z0-9\s\_\,\.\:]+$/)
      .withMessage("description must be alphabetic or number or, _.")
      .isLength({ min: 1, max: 200 })
      .withMessage("description must be between 1 to 200 characters"),

    body("quantity")
    .trim()
    .isInt({min:0,max:100000})
    .withMessage(`quantity must be between 0 to 100000 `)
    .toInt(),

    body("price")
    .trim()
    .isInt({min:0,max:100000})
    .withMessage(`price must be between 0 to 100000 `)
    .toInt(),
   
]
module.exports.itemsDetailsGet=async function(req,res){
    const id=req.params.id;
    const item=await db.getItem(id);
    res.render("itemDetails",{title:"Item details",item:item})
}
module.exports.deleteItemPost=async function (req,res) {
    const id=req.params.id;
    const categoryId=req.body.categoryId;
    await db.deleteItem(id);
    res.redirect(`/categories/get/${categoryId}`)
}
module.exports.addItemGet=async function (req,res) {
    const categories=await db.getAllCategories();
    
    res.render("addItemForm",{title:"Create item",categories:categories})
}

module.exports.addItemPost=[
    validateItem,
    async function (req,res) {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const categories=await db.getAllCategories();
    
    res.status(400).render("addItemForm",{title:"Create item",categories:categories,errors:errors.array()})
    }else{
        const name=req.body.name;
        const description=req.body.description
        const quantity=req.body.quantity;
        const price=req.body.price;
        let categories=req.body.category;
        if (!categories) {
            categories = []; 
        } else if (!Array.isArray(categories)) {
            categories = [categories]; 
        }
        await db.addItem(name,description,quantity,price,categories)
        res.redirect("/")
    }
}
]
module.exports.updateItemGet=async function (req,res) {
    const id=req.params.id;
    const categories=await db.getAllCategories();
    const item=await db.getItem(id);
    const itemCategories=await db.getItemCategories(id);
    const arr=[];
    for(let i =0;i<itemCategories.length;i++){
        arr.push(itemCategories[i].id)
    }
    res.render("updateItemForm",{title:"Update Item",item:item,categories:categories,itemCategories:arr})
}
module.exports.updateItemPost=[
    validateItem,
    async function (req,res) {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const id=req.params.id;
        const categories=await db.getAllCategories();
        const item=await db.getItem(id);
        const itemCategories=await db.getItemCategories(id);
        const arr=[];
        for(let i =0;i<itemCategories.length;i++){
            arr.push(itemCategories[i].id)
        }
        res.status(400).render("updateItemForm",{title:"Update Item",item:item,categories:categories,itemCategories:arr,errors:errors.array()})
    }else{
        const id=req.body.id;
        const name=req.body.name;
        const description=req.body.description
        const quantity=req.body.quantity;
        const price=req.body.price;
        let categories = req.body.category;
        if (!categories) {
            categories = [];
        } else if (!Array.isArray(categories)) {
            categories = [categories];
        }    await db.updateItem(id,name,description,quantity,price,categories)
        res.redirect("/")
    }
    
}
]
