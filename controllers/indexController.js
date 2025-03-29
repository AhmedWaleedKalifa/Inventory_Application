const db=require("../db/queries")

async function homePage(req,res){
    const categories= await db.getAllCategories();
    res.render("homePage",{categories:categories})
}
module.exports={
    homePage
}