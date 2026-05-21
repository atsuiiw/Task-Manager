import "./taskList.component.css"
import { useState } from "react";
import { deleteTask, updateTask } from "../services/api.js";

function TaskList({ data, onDataChange }) {

    const [editData,setEditData] = useState(null);
    const [editModal,setEditModal] = useState(false);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDate, setEditDate] = useState("");

    
    const [filterSorter,setFilterSorter] = useState("title");
    const [reverseSorter,setReverseSorter] = useState(1);
    function filterFunction(a,b) {
        const valueA = a[filterSorter];
        const valueB = b[filterSorter];
        let result = 0;
        if (valueA < valueB) result = -1;
        else if (valueA > valueB) result = 1;
        return result * reverseSorter;
    }

    const FeedBox = ({ element }) => {

        async function changeStatus( status ) {
            try{
                const updatedData = {
                    ...element,
                    status:status
                }
                console.log(updatedData);
                await updateTask(updatedData._id, updatedData);
                if (onDataChange) onDataChange();

            } catch(error){
                    console.error("Error updating task:", error);
            }
        }

        const ChangeStatusInput = () => {
            const FinsihedBtn = () => (
                <button onClick={() => changeStatus("finished")}> ✓ </button>
            )
            const OnGoingBtn = () => (
                <button onClick={() => changeStatus("on-going")}> ⚒ </button>
            )
            const MissingBtn = () => (
                <button onClick={() => changeStatus("missing")}> ⨯ </button>
            )
            if(element.status==="on-going"){
                return (
                    <div className="changeStatus-wrapper">
                        <FinsihedBtn />
                        <MissingBtn />
                    </div>
                )
            }
            else if(element.status==="finished"){
                return (
                    <div className="changeStatus-wrapper">
                        <OnGoingBtn />
                        <MissingBtn />
                    </div>
                )
            }
            else if(element.status==="missing"){
                return (
                    <div className="changeStatus-wrapper">
                        <OnGoingBtn />
                        <FinsihedBtn />
                    </div>
                )
            }
        }

        return (
            <div className="feed-wrapper">
                <div className="feed-content">
                    <h1> {element.title} </h1>
                    <h2> {element.description} </h2>
                    <h2> {element.dueDate.slice(0,10)} </h2>
                </div>
                <div className="feed-buttons">
                    <ChangeStatusInput />
                    <button onClick={() => {
                        setEditModal(true);
                        setEditTitle(element.title);
                        setEditDescription(element.description);
                        setEditDate(element.dueDate);
                        setEditData(element);
                    }}> Edit </button>
                    <button onClick={async () => {
                        try {
                            await deleteTask(element._id);
                            console.log("Task deleted successfully");
                            if (onDataChange) onDataChange();
                        } catch(error) {
                            console.error("Error deleting task:", error);
                        }
                    }}> Delete </button>
                </div>
            </div>
        )
    }

    const TaskGroup = ({ header, status }) => {
        const tasks = (data || []).filter((t) => t.status === status);
        return (
            <div className="taskgroup">
                <h1> {header} </h1>
                {tasks.length > 0 ? (
                    tasks
                        .sort((a,b) => filterFunction(a,b))
                        .map((e, index) => (
                            <FeedBox element={e}/>
                        ))
                ) : (
                    <p className="empty">No tasks</p>
                )}
            </div>
        )
    }

    return (
        <div>
            <div className="sort-wrapper">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                    id="sort-select"
                    value={filterSorter}
                    onChange={(e) => setFilterSorter(e.target.value)}
                >
                    <option value="title">Name</option>
                    <option value="createdAt">Time Added</option>
                    <option value="dueDate">Due Date</option>
                </select>
                <button onClick={() => setReverseSorter(reverseSorter * -1)}> ⇳ </button>
            </div>
            <div className="tasklist-wrapper">
                <TaskGroup header={"On-Going"} status={"on-going"} />
                <TaskGroup header={"Finished"} status={"finished"} />
                <TaskGroup header={"Missing"} status={"missing"} />
            </div>
            { editModal && 
                <div className="editModal">
                    <h1> Edit Task </h1>
                    <input type="text" value={editTitle} onChange={(e)=>{setEditTitle(e.target.value);}}/>
                    <input type="text" value={editDescription} onChange={(e)=>{setEditDescription(e.target.value)}}/>
                    <input type="date" value={editDate.slice(0,10)} onChange={(e)=>{setEditDate(e.target.value)}}/>
                    <button onClick={async () => {
                        try {
                            const updatedData = {
                                ...editData,
                                title:editTitle,
                                description:editDescription,
                                dueDate:editDate
                            }
                            console.log(updatedData);
                            await updateTask(updatedData._id, updatedData);
                            setEditModal(false);
                            if (onDataChange) onDataChange();
                        } catch(error) {
                            console.error("Error updating task:", error);
                        }
                    }}>Confirm</button>
                    <button onClick={() => { setEditModal(false) }}> Cancel </button>
                </div>
            }
        </div>
    )
}

export default TaskList;