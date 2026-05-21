import { useEffect, useState } from "react";
import "./App.css";

// components
import ClockComponent from "./assets/clock.component.jsx";
import TaskList from "./assets/taskList.component.jsx";

// API service
import { fetchTasks, createTask, updateTask } from "./services/api.js";

function App(){

    const [time,setTime] = useState(new Date());
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [date,setDate] = useState("")

    const [warningText,setWarningText] = useState("");
    const [warningModal,setWarningModal] = useState(false);

    const [data,setData] = useState(null);


    // update time
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        },1000);

        return () => clearInterval(interval);
    },[]);

    // Fetch tasks function
    const refetchTasks = async () => {
        try {
            const tasks = await fetchTasks();

            // Check due date
            tasks.forEach((e) => {
                const dueDate = new Date(e.dueDate);
                if (!Number.isNaN(dueDate.getTime()) && dueDate < time && e.status !== "finished") {
                    updateTask(e._id, {
                        ...e,
                        status: "missing"
                    });
                }
            });

            setData(tasks);
            console.log("Data fetched successfully");
        } catch(error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Initial fetch and polling
    useEffect(() =>  {
        refetchTasks();
        
        // Poll for updates every 5 seconds
        const pollInterval = setInterval(() => {
            refetchTasks();
        }, 5000);

        return () => clearInterval(pollInterval);
    }, []);

    const handlePostTask = async () => {
        if(!title && !date){
            setWarningText("Please Enter Title and Due Date")
            setWarningModal(true);
            return ;
        }
        else if(!date){
            setWarningText("Please Enter Due Date")
            setWarningModal(true);
            return ;
        }
        else if(!title){
            setWarningText("Please Enter Title")
            setWarningModal(true);
            return ;
        }
        try {
            await createTask({
                title: title,
                description: description,
                dueDate: date,
                status: "on-going"
            });
            setTitle("");
            setDescription("");
            setDate("");
            console.log("Post Successful");
            // Refetch tasks immediately after creating
            refetchTasks();
        } catch(error) {
            console.error("Error creating task:", error);
            setWarningText("Error creating task. Please try again.");
            setWarningModal(true);
        }
    }

    return (
        <div className="App">
            <ClockComponent timeData={time}/>
            <div className="taskWriter-wrapper">
                <h1> Task Manager </h1>
                <div className="taskWriter-inputs">
                    <input type="text" value={title} placeholder="Enter Title" onChange={(e) => setTitle(e.target.value)}/>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                    <input type="text" value={description} placeholder="Enter Description" onChange={(e) => setDescription(e.target.value)}/>
                    <button onClick={ handlePostTask }> Confirm </button>
                </div>
            </div>
            <TaskList data={data} onDataChange={refetchTasks}/>
            { warningModal && 
                <div className={`warningModal ${warningModal ? " " : "modal-close"}`}>
                    <h1> {warningText} </h1>
                    <button onClick={() => setWarningModal(false)}> ok </button>
                </div>
            }
        </div>
    )
}

export default App;