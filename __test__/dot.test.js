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