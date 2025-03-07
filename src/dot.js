// D.O.T. – Do. Organize. Track
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const {getTaskByName , addTask , getTasksByDate} = require("./service")
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function createTask(date , task , user_id = null){

    
    const mock_data = {
        date : date , 
        task : task 
    }


    if(!user_id) return mock_data

    const do_create_task = await addTask({
        name : task , 
        date : new Date(date) , 
        userId : user_id
    })



  
    
    return ({
        task  : do_create_task.name , 
        date : new Date(do_create_task).toLocaleDateString(undefined , {
            month : "long" , 
            day : "numeric" , 
            year : "2-digit"
        })
    })
}



async function taskBrief(date , user_id = null){
    // mock data

    if(!user_id) return ([

        "Organize the core team meeting" ,
        "Review the project proposal" ,
        "Prepare for the client presentation"
    ])


    let schedule = await getTasksByDate(user_id , new Date(date))


    schedule = schedule.map(task => task.name)



    return schedule




    
}


async function findTask(task , user_id = null){



    console.log(task)
    if(!user_id )  return [
        {
            task : "DevFest conference" ,
            date : "2023-03-06"
        } , 

        {
            task : "IndabaX conference" , 
            date : "2023-03-08"
        },

        {
            task : "Google I/O conference" , 
            date : "2023-03-10"
        }
    ]


    const tasks = await getTaskByName(task,user_id )
    console.log( new Date(tasks[0].date.toDate()).toLocaleDateString(undefined , {
        month : "long" , 
        day : "numeric" , 
        year : "numeric"
    }).toString())
    return JSON.stringify(tasks.map(task =>{
        const date_string = new Date(task.date.toDate()).toLocaleDateString(undefined , {
            month : "long" , 
            day : "numeric" , 
            year : "numeric"
        }).toString()
        return ({
        task : task.name , 
        date : date_string

    })}))






    
}




const DOT_TOOLS =  {
    createTask : ({date , task} , user_id) => {
        return createTask(date , task , user_id)
    } , 

    taskBrief : ({date} , user_id) => {
        return taskBrief(date , user_id)
    },

    findTask : ({task} , user_id) => {
        return findTask(task , user_id)
    }
  }




const createTaskFunctionDeclaration = {
    name: "createTask",
    parameters: {
      type: "OBJECT",
      description: "Create a task entry for a specific date.",
      properties: {
        date: {
          type: "STRING",
          description: "The date for the task in YYYY-MM-DD format."
        },
        task: {
          type: "STRING",
          description: "The description of the task."
        }
      },
      required: ["date", "task"]
    }
  };



const taskBriefFunctionDeclaration = {
    name: "taskBrief",
    parameters: {
        type: "OBJECT",
        description: "Provide a summary of tasks scheduled for a selected date.",
        properties: {
            date: {
                type: "STRING",
                description: "The date for which the task summary is requested in YYYY-MM-DD format."
            }
        },
        required: ["date"]
    }
};



const findTaskFunctionDeclaration = {
    name: "findTask",
    parameters: {
        type: "OBJECT",
        description: "Search for existing tasks based on keywords.",
        properties: {
            task: {
                type: "STRING",
                description: "The keyword to search for in the task list."
            }
        },
        required: ["task"]
    }
};










function getDOTPrompt(query){

    return `You are Dot (Do. Organize. Track.), an AI assistant in a to-do app TODOX. Your role is to help users efficiently manage their tasks through natural conversations. You can perform the following actions:  
- Todays date is ${new Date().toLocaleDateString(undefined , {
    month : "long",
    day : "numeric",
    year : "numeric"
})}
- Use this date to resolve dates like today , tommorrow , next week etc int actual date in YYYY-MM-DD format.
- Output dates inside response in natural format like ${new Date().toLocaleDateString(undefined) , {
    month : "long" , 
    day : "numeric" , 
    year : "numeric"
}}
- Date passed to tools should be in YYYY-MM-DDD
- Create new tasks for a specific date.  
- Provide a summary of tasks scheduled for a selected date.  
- Search for existing tasks based on keywords. 

When interacting with users:  
- Be concise and clear in responses.  
- Ask clarifying questions if needed before executing actions.  
- Use friendly and professional language.  
- Confirm actions before modifying or adding tasks.  
- Output dates inside response in natural format like ${new Date().toLocaleDateString(undefined) , {
    month : "long" , 
    day : "numeric" , 
    year : "numeric"
}}

If a user asks something outside your scope, politely redirect them to focus on task management.

query : ${query}
`

}



function createContext(history ){

    const context = []

    for(const chat of history){
        context.push({
            role : chat.from == "user" ? "user" : "model" , 
            parts : [
                {
                    text : chat.message
                }
            ]
        })
    }


    return context
}




/**
 * Executes a DOT (Dynamic Operations Task) using a generative AI model.
 *
 * @param {Array} history - The conversation history to provide context for the generative model.
 * @param {string} query - The query to be processed by the generative model.
 * @param {string} user_id - The ID of the user making the request.
 * @returns {Promise<string>} - The response text generated by the model.
 *
 * @throws {Error} - Throws an error if the generative model fails to process the query.
 */
async function runDOT(history , query , user_id = null ){

    
    const generativeModel = genAI.getGenerativeModel({
        model : "gemini-2.0-flash" , 
        tools :{
            functionDeclarations : [
                createTaskFunctionDeclaration , 
                taskBriefFunctionDeclaration , 
                findTaskFunctionDeclaration
            ]
        }
    })

        
    const chat = generativeModel.startChat({
        history : createContext(history) ,

    })

    const result = await chat.sendMessage(getDOTPrompt(query))
   
    const calls = result.response.functionCalls()

    const toolResponse = []
  

    if(calls?.length){

    


        for(call of calls){



            const tool_did = await DOT_TOOLS[call.name](call.args , user_id)

            toolResponse.push({
                
                    functionResponse : {
                        name : call.name , 
                        response :  {structValue: {
                            fields: { result: { 
                                stringValue: JSON.stringify(tool_did)
                            }
                        }
                    }
                }
                    }
                

            })

        }



        const reply = await chat.sendMessage(toolResponse)

        return reply.response.text()
    }

    return result.response.text()

    
}


module.exports = runDOT