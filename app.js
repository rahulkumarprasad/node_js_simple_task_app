const express = require("express");
const app = express();

const db = require("./models");

const {Task} = require("./models");
const sequelize = db.sequelize;

const PENDING = "PENDING";
const INPROGRESS = "INPROGRESS";
const COMPLETED = "COMPLETED";
const DEFAULT_PAGE_SIZE = 10;

app.use(express.json());

app.get("/get-task",async (req,res)=>{
    var query = {}
    var page = parseInt(req.query.page) || 1

    if(Object.keys(req.query).includes("name")){
        query["where"] = {}
        query["where"]["task_name"] = req.query.name
    }
    const total_count = await Task.count(query);
    var total_pages = parseInt(total_count/DEFAULT_PAGE_SIZE);
    if (total_count % DEFAULT_PAGE_SIZE != 0){
        total_pages+=1;
    }

    var ofset = (page-1) * DEFAULT_PAGE_SIZE

    query["offset"] = ofset
    query["limit"] = DEFAULT_PAGE_SIZE
    var data = await Task.findAll(query);
    
    resp_data = {}

    resp_data["page"] = page;
    resp_data["total"] = total_count;
    resp_data["data_count"] = data.length;
    resp_data["total_pages"] = total_pages;
    resp_data["data"] = data
    if(page > total_pages){
        res.status(404)
    }
    res.json(resp_data);
});

app.post("/create-task",async (req,res)=>{
    try{
        const name = req.body["name"]
        const inst = await Task.create({
            task_name:name,
            task_status:PENDING
        });
    }
    catch (exp){
        res.status(500)
        res.send("Error occured, please try after sometime.")
    }
    res.send("inserted")
});

app.patch("/update-task/:id",async(req,res)=>{
    const id = req.params.id
    const task_status = req.body["status"] || "not";
    if(![PENDING,COMPLETED,INPROGRESS].includes(task_status)){
        res.status(403);
        return res.send("please provide status name in capital letter");
    };

    try {

        const result = await Task.update(
          { task_status: task_status },
          { where: { id: id} }
        );
        res.status(200);
        res.send("Successfully updated");
      } 
    catch (err) {
        res.status(500);
        res.send("Internal server error, please try after sometime");
      }
});

app.delete("/delete-task/:id",async(req,res)=>{
    const id = req.params.id;
    try{

        const de_res = await Task.destroy({
            where: {
                id:id
            }
        });
        res.status(204);
        res.send("Deleted");
    }
    catch (err){
        res.status(404);
        res.send("No data to delete");
    }
});

app.get("/metrics",async(req,res)=>{
    try{
        const m_type = req.query.type || "count"
        var resp_data = {}
        if(m_type == "count"){
            var data = await Task.findAll({
                attributes: [
                    "task_status",
                    [sequelize.fn('COUNT', sequelize.col('task_name')), 'count']
                ],
                group: ['task_status']
            });
            for(let i=0;i<data.length;i++) {
                resp_data[`${data[i].dataValues.task_status}`] = data[i].dataValues.count;
            }

        }else if(m_type == "timeline"){
            var data = await Task.findAll({
                attributes: [
                    "createdAt",
                    "task_status",
                    [sequelize.literal(`DATE("createdAt")`), 'month'],
                    [sequelize.fn('COUNT', sequelize.col('task_status')), 'count']
                ],
                group: ['month','task_status']
            });

            for(let i=0;i<data.length;i++) {
                let key =  `${data[i].dataValues.createdAt.toLocaleString('default', { month: 'long'})} ${data[i].dataValues.createdAt.getFullYear()}`
                if(Object.keys(resp_data).includes(key)){
                    resp_data[`${key}`][`${data[i].dataValues.task_status}`] = data[i].dataValues.count
                }else{
                    resp_data[`${key}`] = {}
                    resp_data[`${key}`][`${data[i].dataValues.task_status}`] = data[i].dataValues.count
                }
            }
        }
        res.status(200);
        res.json(resp_data);
    }
    catch (err){
        res.status(404);
        res.send("Data not found");
    }
});

db.sequelize.sync().then((req) => {
    app.listen(3000,() =>{
        console.log("Node app started");
    });
})
