module.exports = (sequelize, DataTypes) =>{
    const Task = sequelize.define("Task", {
        task_name:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        task_status:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        createdAt:{
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    })

    return Task;
}