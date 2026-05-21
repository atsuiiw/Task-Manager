import { useEffect, useState } from "react";
import "./clock.component.css"

function ClockComponent({ timeData }){

    const months = [
        "January",
        "Febuary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "Decenber"
    ]

    const formatDate = () => {
        return `${String(timeData.getDate()).padStart(2,'0')} ${months[(timeData.getMonth())]} ${String(timeData.getFullYear()).padStart(2,'0')}`;
    }
    const formatTime = () =>{
        return `${String(timeData.getHours()).padStart(2,'0')} : ${String(timeData.getMinutes()).padStart(2,'0')} : ${String(timeData.getSeconds()).padStart(2,'0')}`
    }

    return (
        <div className="clock-wrapper">
            <h1> {formatDate()} </h1>
            <h2> [ Time ⇒ {formatTime()} ] </h2>
        </div>
    )
}

export default ClockComponent;