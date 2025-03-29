const db = require("../db/queries");
const { body, validationResult } = require("express-validator")
const validateCategory = [
   body("name")
      .trim()
      .matches(/^[a-zA-z0-9\s\_]+$/)
      .withMessage("name must be alphabetic or number or _")
      .isLength({ min: 1, max: 60 })
      .withMessage("name must be between 1 to 60 characters"),

   body("description")
      .trim()
      .matches(/^[a-zA-z0-9\s\_]+$/)
      .withMessage("description must be alphabetic or number or _")
      .isLength({ min: 1, max: 200 })
      .withMessage("description must be between 1 to 200 characters"),

   body("items")
      .trim()
      .optional({ values: "falsy" })
]
module.exports.categoryItemsGet=async function (req, res) {
   const id = req.params.id;
   const category = await db.getCategoryById(id);
   const items = await db.getAllItemsFromCategory(id);

   res.render("categoryDetails", { category: category, items: items })
}
module.exports.deleteCategoryPost=async function (req, res) {
   const id = req.params.id;
   await db.deleteCategory(id);
   res.redirect("/");
}
module.exports.addCategoryGet=async function (req, res) {
   const allItems = await db.getAllItems();
   res.render("addCategoryForm", { title: "Create new category", allItems: allItems });
}
module.exports.addCategoryPost = [
   validateCategory,
   async function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const allItems = await db.getAllItems();
         res.status(400).render("addCategoryForm", { title: "Create new category", allItems: allItems,errors: errors.array() });      
      } else {
         const name = req.body.name;
         const description = req.body.description;
         const items = req.body.items;
         const id = await db.addCategory(name, description);
         if (items) {
            for (let i = 0; i < items.length; i++) {
               await db.addItemToCategory(items[i], id)
            }
         }
         res.redirect("/")
      }

   }
]
module.exports.updateCategoryGet=async function updateCategoryGet(req, res) {
   const id = req.params.id;
   const categoryItems = await db.getAllItemsFromCategory(id);
   const categoryItemsIds = [];
   if (categoryItems) {
      for (let i = 0; i < categoryItems.length; i++) {
         categoryItemsIds.push(categoryItems[i].id)
      }
   }

   const items = await db.getAllItems();
   const oldCategory = await db.getCategoryById(id);
   res.render("updateCategoryForm", { title: "Update category", oldCategory: oldCategory, items: items, categoryItemsIds: categoryItemsIds })
}
module.exports. updateCategoryPost = [
   validateCategory,
   async function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const id = req.params.id;
         const categoryItems = await db.getAllItemsFromCategory(id);
         const categoryItemsIds = [];
         if (categoryItems) {
            for (let i = 0; i < categoryItems.length; i++) {
               categoryItemsIds.push(categoryItems[i].id)
            }
         }
         const items = await db.getAllItems();
         const oldCategory = await db.getCategoryById(id);
          res.status(400).render("updateCategoryForm", { title: "Update category", oldCategory: oldCategory, items: items, categoryItemsIds: categoryItemsIds, errors: errors.array() })
      } else {
         const id = req.params.id;
         const name = req.body.name;
         const description = req.body.description;
         const items = req.body.items;
         await db.deleteAllCategoryItems(id)
         if (items) {
            for (let i = 0; i < items.length; i++) {
               await db.addItemToCategory(items[i], id)
            }
         }

         await db.updateCategory(id, name, description)
         res.redirect("/")
      }
   }
]
