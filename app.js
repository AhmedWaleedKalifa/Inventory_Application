const express=require("express");
const categoriesRouter=require("./routes/categoriesRouter")
const itemsRouter=require("./routes/itemsRouter")
const indexRouter=require("./routes/indexRouter")
const app=express();
require("dotenv").config();
const path=require("node:path")
const PORT=process.env.PORT;
app.use(express.static(path.join(__dirname,"static")));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}))
app.use("/",indexRouter)
app.use("/categories",categoriesRouter)
app.use("/items",itemsRouter)



app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})

