import React, { Component }from 'react';
import Button from 'react-bootstrap/Button';
import {getUserData, findUserEP, findUserE, findUserLN, findUserFN} from '../features/ResquestUserData';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { findAllSyllabus } from '../features/RequestSyllabusData';
import { clearConflicts, findAllEvents, findConflictsByUser, findEventN, findInstructorsEvents, findStudentsEvents, updateConflicts } from '../features/RequestEventData';
import { addGenericNotification, addNotification, findAllNotifications } from '../features/RequestNotificationData';
import { findApprovedE } from '../features/RequestManager';

//Adds user data specific elements to the page upon loading
async function generatePage(){
    //let data = await getUserData();
}

async function fbcu(deletingRequest, email){
    //put the email of the requesting user in the database call

    let emailobj = {
        email: email
    }
    let list = await findConflictsByUser(emailobj);
    list = list.conflictedEvents;
    console.log(list);
    for(let i = 0; i < list.length; i++){
        let eventStart = list[i].startDate.split('T')[0];
        let eventEnd = list[i].endDate.split('T')[0];
        console.log(eventStart)
        console.log(eventEnd)
        let reqStart = deletingRequest.dateRequested.split('T')[0];
        console.log(reqStart)
        let reqEnd = deletingRequest.dateRequestedEnd.split('T')[0];

        //If this if is true, we found a conflict, and need to remove it.
        if(((reqStart <= eventStart) && (reqEnd >= eventStart)) || ((reqStart <= eventEnd) && (reqEnd  >= eventEnd))){
            
            console.log("conflict")

            let newConflictArray = [];
            for(let j = 0; j < list[i].conflicts.length; j++){
                if(list[i].conflicts[j].email !== email){
                    newConflictArray.push(list[i].conflicts[j]);
                }
            }
            
            let eventConObj = {
                eventId: list[i]._id,
                conflictArray: newConflictArray
            }
            //Data retrieved from database
            await updateConflicts(eventConObj);
            let conflictNotifObj = {
                recipient: "General",
                recipientType: "faculty",
                subject: "Conflict Resolved",
                message: ("A conflict has been resolved in " + (list[i].name) + ".")
            }
            await addGenericNotification(conflictNotifObj);
            
           console.log(newConflictArray)
        }
    }
}

async function callfb(){
    let req = {  
        dateRequested: "2023-11-03T00:00:00.000+00:00",
        dateRequestedEnd: "2023-11-04T00:00:00.000+00:00"
    }
    let email = "faculty@faculty.com";
    await fbcu(req, email);
}

function firstLetterCapital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function searchTable(data) {
    let searchTable = document.getElementById("searchTable");

    //Removes search results if you press search again
    while (searchTable.firstChild) {
        searchTable.removeChild(searchTable.firstChild);
    }

    for(let i = 0; i < data.length; i++){
        console.log(data[i]);
        let user = data[i];
        let string = "";
        if(user.lastName){
            string += firstLetterCapital(user.lastName);
            if(user.firstName){
                string += ", " + firstLetterCapital(user.firstName) + " - ";
            }
        }
        else if(user.firstName){
            string += firstLetterCapital(user.lastName) + " - ";
        }

        if(user.crewPosition){
            string += user.crewPosition.toUpperCase() + " - ";
        }

        string += user.email;

        let tr = document.createElement("tr");
        tr.innerHTML = string;
        document.getElementById("searchTable").appendChild(tr);
    }
}

async function clearAllConflicts(){
    await clearConflicts();
    let conflictNotifObj = {
        recipient: "General",
        recipientType: "faculty",
        subject: "All Conflicts Cleared",
        message: ("All conflicts have been cleared.")
    }
    await addGenericNotification(conflictNotifObj);
}

export default class DebugMenu extends Component {

    //Checks if the page is fully loaded
    componentDidMount() {
        generatePage();
      }

    //Debug button. Prints some info on the user
    userData = async (e)=>{
        let data = await getUserData();
        console.log(data.userType);
        if(!data.firstName){
            console.log("You have no name!")
            
        }
        else{
            console.log("Your name is " + data.firstName);

        }
        console.log("Your email is " + data.email);

    }

    searchLastName = async (e)=>{
        //Dom
        let field = document.getElementById("debugText").value;

        //Object for sending to the DB
        let lastNameObj = {
            lastName: field
        }

        //Data retrieved from database
        let data = await findUserLN(lastNameObj);
        searchTable(data);
    }

    updateConflict = async (e)=>{
        //Grabs input from first textbox in this case I am searching by name, but ID is probably easier since it returns just the event and not an array.
        let field = document.getElementById("debugText").value;

        //Grabs the array of events by that name
        let events = await findEventN({name: field});

        //Grabs first element of that array
        let event = events[0];

        //Gets conflict array from that event
        let conflicts = event.conflicts;
        console.log(conflicts);
        if(!conflicts){conflicts = []}

        //Pushes a new conflict to the array
        conflicts.push({
            message: "This is a new conflict",
            email: "test@test.com"
        })
        console.log(conflicts);

        //Makes an object with the event ID and the conflict array to send to the database
        let conflictObj = {
            eventId: event._id,
            conflictArray: conflicts
        }
        console.log(conflictObj);

        //Data retrieved from database
        await updateConflicts(conflictObj);
    }

    createNotif = async (e)=>{
        //Grabs input from first textbox in this case I am searching by name, but ID is probably easier since it returns just the event and not an array.

        let notifObj = {
            recipient: "gabisgr8@gmail.com",
            subject: "Add to class",
            message: "This is the best notification you have or will ever recieve"
        }
        console.log(notifObj);

        //Data retrieved from database
        await addNotification(notifObj);
        let n = await findAllNotifications();
        console.log(n);
    }

    createGenericNotif = async (e)=>{
        //Grabs input from first textbox in this case I am searching by name, but ID is probably easier since it returns just the event and not an array.

        let notifObj = {
            recipient: "Generic",
            subject: "Add to class",
            message: "This is the best notification you have or will ever recieve",
            recipientType: "admin"
        }
        console.log(notifObj);

        //Data retrieved from database
        await addGenericNotification(notifObj);
        let n = await findAllNotifications();
        console.log(n);
    }

    searchFirstName = async (e)=>{
        //Dom
        let field = document.getElementById("debugText").value;

        //Object for sending to the DB
        let firstNameObj = {
            firstName: field
        }

        //Data retrieved from database
        let data = await findUserFN(firstNameObj);
        searchTable(data);
    }

    //Debug button. Finds data on some hardcoded in user using email and password
    findByEP = async (e)=>{
        let field = document.getElementById("debugText").value;
        let emailPassObj = {
            email: "gabisgr8@gmail.com",
            password: "cookie"
        }
        //The EP in findUserEP stands for email and password as in searching with email and password together
        let data1 = await findUserEP(emailPassObj);
        console.log(data1.email);

        let emailObj = {
            email: field,
        }
        //The E in findUserE stands for email as in just searching with email
        let data2 = await findUserE(emailObj);
        console.log(data2.firstName);

    }

    searchEmail = async (e)=>{
        let field = document.getElementById("debugText").value;
        let emailPassObj = {
            email: field
        }
        //The EP in findUserEP stands for email and password as in searching with email and password together
        let data = await findUserE(emailPassObj);
        console.log(data);

    }

    addRequest = async (e)=>{

        //BEGIN DELETE

        let dateRequested = document.getElementById("requestedDate").value;
        let dateRequestedEnd = document.getElementById("requestedDateEnd").value;

        //Making the request isn't necessary when approving the request
        //Replace this with a search up of the approved request instead to get the dates and creator email mostly.
        if(!dateRequested || !dateRequestedEnd){
            return;
        }
        let request = {
            requestingUser:     "regtest@regtest.com",
            dateRequested:      dateRequested,
            dateRequestedEnd:   dateRequestedEnd,
            description:        "none"

        }
        //End of making request 

        //END DELETE

        //let request = CALL THE REQUEST FROM DATABASE. IF ITS AN ARRAY THEN ASSIGN THIS VALUE THE [0] INDEX OF IT

        //Email object for searching for involved events by email
        let emailObj = {
            email: request.requestingUser
        }
        
        let events = [];
    
        //Searches and returns events involved as either instructor or student
        let allEventsStu = await findStudentsEvents(emailObj);
        
        let allEventsInsta = await findInstructorsEvents(emailObj);
        
        for(let i = 0; i < allEventsStu.length; i++){
            events.push(allEventsStu[i]);
        }
        
        let same = false;
        
        for(let i = 0; i < allEventsInsta.length; i++){
            same = false;
            for(let j = 0; j < allEventsStu.length; j++){
                if(allEventsStu[j]._id === allEventsInsta[i]._id){
                    same = true;
                }
            }
            if(same === false){
                events.push(allEventsInsta[i]);
            }
        }
        console.log("Here are all the searched user's events:");
        console.log(events);

        let requestStart = request.dateRequested.split('T')[0];
        let requestEnd = request.dateRequestedEnd.split('T')[0];
        

        //Compares the dates of the events and the request and checks for conflicts
        for(let i = 0; i < events.length; i++){
            let eventStart = events[i].startDate.split('T')[0];
            let eventEnd = events[i].endDate.split('T')[0];
            //If this if is true, we found a conflict
            if(((requestStart <= eventStart) && (requestEnd  >= eventStart)) || ((requestStart <= eventEnd) && (requestEnd  >= eventEnd))){
                console.log("conflict!");

                //Gets conflict array from that event
                let conflicts = events[i].conflicts;

                if(!conflicts){conflicts = []}

                console.log(conflicts);

                //Pushes a new conflict to the array
                conflicts.push({
                    message: "Conflict created on Event: " + events[i].name + " regarding " + request.requestingUser + "!",
                    email: request.requestingUser
                })
                console.log(conflicts);

                //Makes an object with the event ID and the conflict array to send to the database
                let conflictObj = {
                    eventId: events[i]._id,
                    conflictArray: conflicts
                }
                console.log(conflictObj);

                //Data retrieved from database
                await updateConflicts(conflictObj);

                let notifObj = {
                    recipient: "Generic",
                    subject: "Conflict in Event!",
                    message: "Conflict created on Event: " + events[i].name + " regarding " + request.requestingUser + "!",
                    recipientType: "faculty"
                }
                console.log(notifObj);
        
                //Data retrieved from database
                await addGenericNotification(notifObj);
            }
        }
    }

    forceLowercase = async (e)=>{
        let field = document.getElementById("debugText").value;
        let field2 = document.getElementById("debugText2").value;
        document.getElementById("debugText").value = field.toLowerCase();
        document.getElementById("debugText2").value = field2.toLowerCase();
    }

    findRequest = async (e) =>{
        e.preventDefault();
        let emailObj = {
            email: "retryagain"
        }
        let list = await findApprovedE(emailObj);
        console.log(list);
    }

    findAllSyllabi = async (e)=>{
        let data = await findAllSyllabus();
        console.log(data);
    }

    studentEvents = async (e)=>{
        let data = await getUserData();
        let emailObj = {
            email: data.email
        }
        let events = await findStudentsEvents(emailObj);
        console.log(events);
    }

    instructorEvents = async (e)=>{
        let data = await getUserData();
        let emailObj = {
            email: data.email
        }
        let events = await findInstructorsEvents(emailObj);
        console.log(events);
    }

    findAllEvents = async (e)=>{
        let data = await findAllEvents();
        console.log(data);
    }


    //The jsx
    render() {
        return(
            <center>
                <div id="noNameAlert" hidden>
                </div>
                <h1>
                    Debug Menu!
                </h1>
                <p>Console log only right now!</p>
                <Link to="/"><Button>Back</Button></Link>
                <Button onClick={clearAllConflicts}>clear conflicts</Button>
                <Button onClick={this.studentEvents}>See my student events!</Button>
                <Button onClick={this.instructorEvents}>See my instructor events!</Button>
                <Button onClick={this.findByEP}>Find a user by EP!</Button>
                <Button onClick={this.searchLastName}>Search by Last Name</Button>
                <Button onClick={this.searchFirstName}>Search by First Name</Button>
                <Button onClick={this.searchEmail}>Search by Email</Button>
                <Button onClick={this.updateConflict}>Update Conflicts</Button>
                <Button onClick={this.findAllSyllabi}>Find all syllabi</Button>
                <Button onClick={this.findAllEvents}>Find all events</Button>
                <Button onClick={this.createNotif}>Notification</Button>
                <Button className="btn btn-danger" onClick={this.addRequest}>Add request(Doesn't actually)</Button>
                <Button className="btn btn-danger" onClick={this.findRequest}>Find request</Button>
                <Button onClick={this.createGenericNotif}>Generic Notification</Button>
                <Form.Control onChange={this.forceLowercase} id="debugText" className="input" placeholder="Enter info here, then press a button!"></Form.Control>
                <Form.Control onChange={this.forceLowercase} id="debugText2" className="input" placeholder="Extra textbox for secondary input"></Form.Control>
                <Form.Control type="date" id="requestedDate" ></Form.Control>
                <Form.Control type="date" id="requestedDateEnd" ></Form.Control>
                <div id="searchDiv">
                    <table id="searchTable">  
                    </table>
                </div>
                <h1 style={{ color: 'blue'}}>HELLLOOOO</h1>
            </center>
        )
    }
}