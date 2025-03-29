const pool=require("./pool")

async function getAllCategories(){
    const {rows}=await pool.query("SELECT * FROM categories;")
    return rows
}
async function getCategoryById(id) {    
    const {rows}=await pool.query("SELECT * FROM categories WHERE id = $1;",[id])
    return rows[0];
}
async function addCategory(name,description){
    const item=await pool.query("INSERT INTO categories (name,description) values($1,$2)RETURNING id;",[name,description])
    return item.rows[0].id;
}
async function updateCategory(id,name,description){
    await pool.query("UPDATE  categories SET name=$2, description=$3 WHERE id= $1;",[id,name,description])
}
async function deleteCategory(id){
    await pool.query(`DELETE FROM categories WHERE id= $1;`,[id]);
    await pool.query(` DELETE FROM items
        WHERE id NOT IN (
            SELECT DISTINCT item_id 
            FROM categories_items
        )`)
}


async function getAllItems(){
    const {rows}=await pool.query("SELECT * FROM items;")
    return rows
}
async function getItem(id){
    const {rows}=await pool.query("SELECT * FROM items WHERE id = $1",[id])
    return rows[0];
}
async function getItemCategories(id){
    const {rows}=await pool.query("SELECT id FROM categories WHERE id in(SELECT category_id FROM categories_items WHERE item_id=$1);",[id])
    return rows
}

async function getAllItemsFromCategory(id){
    const {rows}=await pool.query("SELECT * FROM items WHERE id in (SELECT item_id AS id  FROM categories_items WHERE categories_items.category_id =$1 );",[id])
    return rows
}


async function addItem(name,description,quantity,price,categoriesIds){
    for (const catId of categoriesIds) {
        const category = await getCategoryById(catId);
        if (!category) {
            throw new Error(`Category with ID ${catId} does not exist`);
        }
    }

    const item = await pool.query(
        "INSERT INTO items (name,description,quantity,price) values($1,$2,$3,$4) RETURNING id;",
        [name,description,quantity,price]
    );
    const id = item.rows[0].id;

    for (const catId of categoriesIds) {
        await pool.query(
            "INSERT INTO categories_items (item_id, category_id) values($1,$2);",
            [id, catId]
        );
    }
    return id;
}

async function addItemToCategory(itemId, categoryId){
    await pool.query("DELETE from categories_items WHERE item_id=$1 and category_id=$2;",[itemId,categoryId])
    await pool.query('INSERT INTO categories_items (category_id, item_id) VALUES ($1, $2)',[categoryId, itemId]) // Fixed parameter order
}
//to test

async function getAllCategoryAndItems(){
    const {rows}=await pool.query("SELECT * FROM categories_items;")
    return rows
}
async function updateItem(id,name,description,quantity,price,categoriesIds){
    await pool.query("UPDATE items SET name=$1,description=$2,quantity=$3,price=$4 WHERE id=$5;",[name,description,quantity,price,id])
    await pool.query("DELETE FROM categories_items WHERE item_id=$1;",[id]);
    for(let i=0;i<categoriesIds.length;i++){
        await pool.query("INSERT INTO categories_items (item_id, category_id)  values($1,$2);",[id,categoriesIds[i]])
    }
}
async function deleteItem(id){
    await pool.query("DELETE FROM items WHERE id=$1;",[id])
}
async function deleteItemFromCategory(itemId,categoryId) {
    await pool.query("DELETE FROM categories_items WHERE item_id=$1, category_id=$2",[itemId,categoryId])
}
async function deleteAllCategoryItems(id) {
    await pool.query("DELETE FROM categories_items WHERE category_id=$1",[id])
}

module.exports={
    addCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory,
    addItem,
    getAllItems,
    getAllItemsFromCategory,
    addItem,
    deleteItem,
    getItem,
    updateItem,
    getItemCategories,
    addItemToCategory,
    deleteAllCategoryItems,
    deleteItemFromCategory

}