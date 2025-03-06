const runDOT = require("../src/dot")



// date formats to test
// natural language date 'yesterday' , 'today' , 'tomorrow' , 'next week' , 'next month' , 'next year'
// specific worded date 6th of march , 7th of march , 8th of march
// specific date format 2023-03-06 , 2023-03-07 , 2023-03-08 , 4th july


test("Test task creation flow" , async ()=>{


    const query  = "Remind me on the 6th of march to organize the core team meeting"
    const result = await runDOT([] , query)
 
    console.log(result)

    expect(result).toBeTruthy()

   
    

})



test("Test get task brief" , async ()=>{

    const query =  "What is on my tasklist for 29th February"
    const result = await runDOT([] , query)

    console.log(result)

    expect(result).toBeTruthy()
})




test("Test find task" , async ()=>{

    const query = "Do I have any upcoming conferences" 
    // const query = "When is the IndabaX conference"
    const result = await runDOT([] , query)

    console.log(result)


    // test ability to identify IndabaX as task
    expect(result).toMatch(/IndabaX conference/)
})




test("Multiple task" , async ()=>{
    const query = "Remind me on the 6th of march to organize the core team meeeting and show me the list of conferences ahead"

    const result = await runDOT([] , query)

    console.log(result)

    expect(result).toBeTruthy()
})


test("Conversation history" , async ()=>{
    const history = []

    const ask_1 = "Create a reminder to setup the storage cleanup microservice"
    const result_1 = await runDOT(history , ask_1)

    history.push({
        from : "user" , 
        message : ask_1
    } , {
        from : "dot" , 
        message : result_1
    })

    const ask_2 = "For 25th October"
    const result_2 = await runDOT(history , ask_2)

    history.push({
        from : "user" , 
        message : ask_2
    } , {
        from : "dot" , 
        message : result_2
    })

    const ask_3 = "2025"
    const result_3 = await runDOT(history , ask_3)

    history.push({
        from : "user" , 
        message : ask_3
    } , {
        from : "dot" , 
        message : result_3
    })

    console.log(history)


    expect(history.length).toBeGreaterThan(0)

} , testTimeout = 10000)