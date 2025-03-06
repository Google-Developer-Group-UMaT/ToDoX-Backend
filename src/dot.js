// D.O.T. – Do. Organize. Track
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function createTask(date , task){

    return ({
        date , task
    })
}



async function taskBrief(date){
    // mock data
    return ([

        "Organize the core team meeting" ,
        "Review the project proposal" ,
        "Prepare for the client presentation"
    ])


    
}


async function findTask(task){


    return [
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
    
}




const DOT_TOOLS =  {
    createTask : ({date , task}) => {
        return createTask(date , task)
    } , 

    taskBrief : ({date}) => {
        return taskBrief(date)
    },

    findTask : ({task}) => {
        return findTask(task)
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










function get_dot_prompt(query){

    return `You are Dot (Do. Organize. Track.), an AI assistant in a to-do app TODOX. Your role is to help users efficiently manage their tasks through natural conversations. You can perform the following actions:  
- Create new tasks for a specific date.  
- Provide a summary of tasks scheduled for a selected date.  
- Search for existing tasks based on keywords. 
- Should be able to conver date strings like tomorrow , yesterday to actual date in YYYY-MM-DD format.

When interacting with users:  
- Be concise and clear in responses.  
- Ask clarifying questions if needed before executing actions.  
- Use friendly and professional language.  
- Confirm actions before modifying or adding tasks.  

If a user asks something outside your scope, politely redirect them to focus on task management.

query : ${query}
`

}



function createContext(history , query){

    const context = []

    for(const chat of history){
        context.push({
            role : chat.from , 
            parts : [
                {
                    text : chat.message
                }
            ]
        })
    }


    return context
}




async function runDOT(history , query){


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
        history : createContext(history , query) ,

    })

    const result = await chat.sendMessage(get_dot_prompt(query))
   
    const calls = result.response.functionCalls()

    const toolResponse = []
  

    if(calls?.length){

    


        for(call of calls){



            const tool_did = await DOT_TOOLS[call.name](call.args)

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