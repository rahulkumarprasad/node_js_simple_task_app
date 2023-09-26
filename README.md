############### Node-Js Task App ##############33
This app is used for keeping record of tasks details

############## Steps to follow for setting app ##################
1) create folder and  clone git project https://github.com/rahulkumarprasad/node_js_simple_task_app.git
2) after cloning configure mysql database by providing details in config/config.json file
    "development": {
        "username": "root",
        "password": "root",
        "database": "node_app",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }

    Edit username, password, databse, and host for letting app to make connection to database

3) Now we need to install all the packages by running npm install
    >> npm install
    This will install all required packages

4) now we can start our app on port 3000 or we can edit the port in app.js file

5) Now we need to run below code for starting our application
    >> node app.js

######### This app has following api's and we can call thos as show below ########

GET: http://localhost:3000/get-task
    query_params:
        name = task_name of a task
        page = page number and each page will have 10 data

POST: http://localhost:3000/create-task
    request_body:
        {"name":"task name to create"}
    headers:
        {"Content-Type":"application/json"}

PATCH: http://localhost:3000/update-task/{id}
    url_params:
        id = id of the task
    request_body:
        {"status":"status of a task to update from list ["PENDING","INPROGRESS","COMPLETED"]"}
    headers:
        {"Content-Type":"application/json"}

DELETE: http://localhost:3000/delete-task/{id}
    url_params:
        id = id of the task

GET: http://localhost:3000/metrics
    query_params:
        type = type of the metric it has 2 value ["count","timeline"]