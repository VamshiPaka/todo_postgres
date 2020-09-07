const express=require('express');
const app=express();
const pool=require('./db');

app.use(express.json())

//ROUTES//

//GET all todos

app.get("/todos",async(req,res)=>{
    try{
        const allTodos=await pool.query("select * from todo");
        res.json(allTodos.rows);
    }catch(err){
        console.error(err.message);
    }
})

//get a todo

app.get("/todos/:id",async(req,res)=>{
    const {id}=req.params;
    try{
        const todo=await pool.query("select * from todo where todo_id=$1",[id]);
        res.json(todo.rows[0]);
    }catch(err){
        console.error(err.message);
    }
})

//create a todo
app.post('/todos',async(req,res)=>{
try{
    const {description}=req.body;
    const newTodo= await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description] );

    res.json(newTodo.rows[0]);
}catch(err) { 
    console.error(err.message)
}
});
//update a todo

app.put('/todos/:id',async(req,res)=>{
    try{
        const{id}=req.params; //where
        const {description}=req.body; //set

        const updateTodo=await pool.query("update todo SET description=$1 where todo_id=$2",[description,id]);

        res.json("todo was updated");
    }catch(err){
        console.error(err.message);
    }
})

//delete a todo

app.delete("/todos/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const deleteTodo=await pool.query("delete from todo where todo_id=$1",[id])

        res.json("todo was successfully deleted");
    }catch(err){
        console.error(err.message)
    }
})

//listen on server
app.listen(5000,()=>{
    console.log('server started on port no 5000')
})