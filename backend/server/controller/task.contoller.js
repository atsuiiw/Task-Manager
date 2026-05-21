import mongoose from "mongoose"
import express from "express"

import Task from "../model/task.model.js"

export const getTask = async (req,res) => {
    try{
        const task = await Task.find({});
        res.status(200).json({success:true, data: task});
    } catch(error) {
        console.log(error.message)
        res.status(error.status);
    }
}

export const postTask = async (req,res) => {
    const task = req.body || {};

    if(!task.title){
        return res.status(400).json({success:false, message:"Please provide Title!"});
    }
    if(!task.dueDate){
        return res.status(400).json({success:false, message:"Please provide due date!"});
    }
    
    const newTask = new Task(task)

    try{
        await newTask.save();
        res.status(201).json({success:true, data:newTask});
    } catch(error){
        res.status(400).json({success:false, message:error.message});
    }
}

export const putTask = async (req,res) => {
    const { id } = req.params;
    const task = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Invalid Task Id"});
    }

    try{
        const updatedTask = await Task.findByIdAndUpdate(id, task);
        res.status(200).json({success: true, data: updatedTask});
    } catch(error){
        res.status(500).json({success: false, message: "Server Error" + error.message});
    }
};

export const deleteTask = async (req,res) => {
    const { id } = req.params;

    try{
        await Task.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Task deleted"});
    } catch(error){
        res.status(404).json({success: false, message: "Task not found"});
    }
}