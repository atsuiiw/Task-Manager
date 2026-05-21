import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/task";

export const fetchTasks = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const res = await axios.post(API_URL, taskData);
    return res.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const res = await axios.put(`${API_URL}/${taskId}`, taskData);
    return res.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const res = await axios.delete(`${API_URL}/${taskId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
