import React, { Component }from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
//import {Modal} from '@daypilot/modal';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import { addEvent, deleteAll, deleteEvent, findAllEvents, findAllEventsOrdered, findEventID, findEventN, updateAttendingInstructors, updateAttendingStudents, updateConflicts, updateEvent } from '../features/RequestEventData';
//import Form from 'react-bootstrap/Form';
import { findAllUsers, findUserCP, findUserE, findUserFN, findUserLN, findUserS, getUserData } from '../features/ResquestUserData';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { findAllSyllabus } from '../features/RequestSyllabusData';
import { addGenericNotification, addNotification } from '../features/RequestNotificationData';
import { findApprovedE } from '../features/RequestManager';

function formatName(name) {

    if(!name){
        return;
    }

    // Check if the name contains a comma
    if (name.includes(',')) {
      // Split the name into last name and first name
      const names = name.split(', ');
  
      // Capitalize the first letter of each name
      const formattedLastName = names[0].charAt(0).toUpperCase() + names[0].slice(1);
      const formattedFirstName = names[1].charAt(0).toUpperCase() + names[1].slice(1);
  
      // Combine the formatted names
      return formattedLastName + ", " + formattedFirstName;
    } else {
      // Split the name into individual names
      const names = name.split(' ');
  
      // Capitalize the first letter of each name
      const formattedNames = names.map((namePart) => namePart.charAt(0).toUpperCase() + namePart.slice(1));
  
      // Combine the formatted names
      return formattedNames.join(' ');
    }
  }

  function capitalizeSentences(paragraph) {
    // Split the paragraph into sentences
    var sentences = paragraph.split('. ');

    // Capitalize the first letter of each sentence
    var capitalizedSentences = sentences.map(function (sentence) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    });

    // Join the sentences back together
    var result = capitalizedSentences.join('. ');

    return result;
}
function nothing(){
    return;
}

const styles = { /* CSS for the Calendar*/
    wrap: {
        display: "flex",
    },
    left: { /* 2 monthly views */
        marginRight: "10px",
        marginBottom: "10px",
        position: "relative",
        top: "80px",      
        left: "5px",
       
    },
    main: { /* Weekly view*/
        marginTop: "20px",
        marginBottom: "10px",
        marginRight: "5px",
        marginLeft: "5px",
        position: "relative",
        flexGrow: "1"
    }
};

let months = 2
if(window.innerWidth < 550){
   months = 1;
   console.log("");
}

async function hideAlert(){
    let alert = document.getElementById("alertMS");
    if(alert.getAttribute("hidden") !== null){
        console.log(" unnecessary hide")
    }
    else{
        alert.setAttribute("hidden", true);
    }
}

async function deleteAllEvents(){
    let userData = await getUserData();
    let alert = document.getElementById("alertMSText")
    let success = document.getElementById("successMSText")
    let password = prompt("Be aware that this cannot be undone! Enter your password below to proceed with deleting ALL events in the system:");
    if (password !== userData.password) {
        if(password === null){
            alert.innerHTML = "Cancelled!"
        }
        else{
            alert.innerHTML = ("Incorrect Password!");
        }
        unHideAlert();
    }
    else{
        unhideLoad();
        let result = await deleteAll();
        if(result.status === true){
            searchDeleteTableAll();
            success.innerHTML = ("Deleted!");
            unHideSuccess();
        }
        else{
            alert.innerHTML = ("Error deleting all events!");
            unHideAlert();
        }

    }
}


async function hideSuccess(){
    let alert = document.getElementById("successMS");
    if(alert.getAttribute("hidden") !== null){
        console.log(" unnecessary hide")
    }
    else{
        alert.setAttribute("hidden", true);
    }
}

async function unHideAlert(){
    let alert = document.getElementById("alertMS");
    let alert2 = document.getElementById("successMS");
    let load = document.getElementById("loadMS");
    
    if(alert.getAttribute("hidden") !== null){
        alert.removeAttribute("hidden"); 
        alert2.setAttribute("hidden", true);
        load.setAttribute("hidden", true);
    }
}

async function unhideLoad(){
    let alert = document.getElementById("alertMS");
    let alert2 = document.getElementById("successMS");
    let load = document.getElementById("loadMS");
    
    if(load.getAttribute("hidden") !== null){
        load.removeAttribute("hidden"); 
        alert2.setAttribute("hidden", true);
        alert.setAttribute("hidden", true);
    }
}

async function unHideSuccess(){
    let alert = document.getElementById("successMS");
    let alert2 = document.getElementById("alertMS");
    let load = document.getElementById("loadMS");
    if(alert.getAttribute("hidden") !== null){
        alert.removeAttribute("hidden"); 
        alert2.setAttribute("hidden", true);
        load.setAttribute("hidden", true);
    }
}

if(window.innerWidth > 1950){
    styles.left.top = "100px";

    styles.main.top = "50px";
    styles.main.width = "600px";
}
if(window.innerWidth > 2150){
    styles.wrap.marginTop = "40px";

    styles.left.scale = "130%";
    styles.left.maxWidth = "70%";
    styles.left.top = "100px";
    styles.left.left = "60px";

    styles.main.scale = "120%";
    styles.main.maxWidth ="70%";

    styles.main.top = "40px";
    styles.main.left = "250px";
}
if(window.innerWidth >= 2349){
    
    styles.wrap.marginTop = "8%";
    styles.wrap.MaxWidth = "40%";

    styles.left.scale = "160%";
    styles.left.maxWidth = "65%";
    styles.left.top = "50px";
    styles.left.left = "4%";
    styles.left.margin = "0%";

    styles.main.scale = "160%";
    styles.main.maxWidth ="50%";
    styles.main.maxHeight ="25%";

    styles.main.margin = "0%";
    styles.main.top = "30px";
    styles.main.left = "23%";
}
if(window.innerWidth >= 2349 && window.innerHeight < 1350){
    
    styles.wrap.marginTop = "8%";
    styles.wrap.MaxWidth = "40%";

    styles.left.scale = "160%";
    styles.left.maxWidth = "65%";
    styles.left.top = "50px";
    styles.left.left = "4%";
    styles.left.margin = "0%";

    styles.main.scale = "140%";
    styles.main.maxWidth ="58%";
    

    styles.main.margin = "0%";
    styles.main.top = "-35px";
    styles.main.left = "19%";
}
if(window.innerWidth >= 2550 && window.innerHeight < 1350){
    
    styles.wrap.marginTop = "8%";
    styles.wrap.MaxWidth = "40%";

    styles.left.scale = "160%";
    styles.left.maxWidth = "65%";
    styles.left.top = "50px";
    styles.left.left = "4%";
    styles.left.margin = "0%";

    styles.main.scale = "140%";
    styles.main.maxWidth ="58%";
    

    styles.main.margin = "0%";
    styles.main.top = "-50px";
    styles.main.left = "19%";
}

if(window.innerWidth < 550){ //If mobile screen
    styles.wrap.display = "grid";
    styles.wrap.width = "fill";
    styles.wrap.height = "none";

    styles.left.top = "10px";
    styles.left.left = "5px";
    styles.left.margin = "auto";
    styles.left.height = "none";
    
    styles.main.marginBottom = "20px";
    styles.main.top = "10px";
    styles.main.marginTop = "10px";
    styles.main.height = "none";
    
}

if(window.innerWidth < 300){ /* Reload page for smaller screens to let the monthly view get into position*/
    styles.left.left ="0px";
}

let once = false;

async function generatePage(){
    if(once === true){
        return;
    }
    fillSyllabusCodeSelect();
    searchDeleteTableAll();
    searchEditTableAll();
}

async function generateEvents(){

    let events = await findAllEvents();

    let user = await getUserData();
    let userType = user.userType;

    if(userType === "student"){
        document.getElementById("schedulePage").setAttribute("hidden", true);
        return;
    }
    if(userType === 'faculty'){
        document.getElementById("EditEventBTN").setAttribute("hidden", true);
        document.getElementById("EditDeleteBTN").setAttribute("hidden", true);
        document.getElementById("Create-Events").setAttribute("hidden", true); 
    }

    const PageEvents = [];
    
    const tempMyObj = Object.assign({}, object);
 
    for(var i=0; i<events.length; i++){  
        var object = {
            id: "z", 
            text: "TemplateText", // This is what show ups foro utside view of event
            name: "TemplateName",
            title: "TemplateTitle",
            start: "2023-03-08T09:30:00",
            end: "2023-03-08T11:30:00",
            description: "No description",
            StudentList: [],
            InstructorList: [],
            STime: events[i].startTime, /* For the description, start time */
            SDate: events[i].startDate.substr(0, 10), /* For the description, start date */
            ETime: events[i].endTime, /* For the description, ebd time */
            EDate: events[i].endDate.substr(0, 10), /* For the description, end date */
            backColor: "#f1c232"
        };

        /* Creates the object from the database */
        object.id = events[i]._id;

        object.name = formatName(events[i].name);
        object.title = formatName(events[i].title);
        object.text = formatName(events[i].name) + ", " + formatName(events[i].title);

        if(events[i].description != null){ /* Edits the description */
            object.description = "Description: " + capitalizeSentences(events[i].description);
        }

        object.start = events[i].startDate.substr(0, 11) ; /*Start Date/Time for auto population on calendar */
        object.start = object.start + events[i].startTime + ":00" ; /* Input needs to follow this format, this makes it 
                                                                             so that it follows the format with the current input system */

        object.end = events[i].endDate.substr(0, 11) ;  /*End Date/Time for auto population on calendar */
        object.end = object.end + events[i].endTime + ":00" ;


        for(var j=0; j<events[i].students.length; j++){ /* Populates student list to the object */
            var StudentObject = { /* Temp student object, being pushed to student array */
                name: formatName(events[i].students[j].name) + " - "  + events[i].students[j].email, 
                id: events[i].students[j].name + " - "  + events[i].students[j].email
            };

            object.StudentList.push(StudentObject);
        }

        for(var k=0; k<events[i].instructors.length; k++){ /* Populates Instructors list to the object */
            var InstructorObject = { /* Temp instructor object, being pushed to instructor array */
                name: formatName(events[i].instructors[k].name)  + " - "  + events[i].instructors[k].email, 
                id: events[i].instructors[k].name  + " - "  + events[i].instructors[k].email
            };

            object.InstructorList.push(InstructorObject);
        }


        /* AM/PM For Start time/end time*/
        if(object.STime.substr(0, 2) >= 12){ /* For Start Time, adds PM/AM */
            object.STime = object.STime.concat(' PM');
            console.log()
        }
        else{
            object.STime = object.STime.concat(' AM');
        }

        if(object.ETime.substr(0, 2) >= 12){ /* For End Time, adds PM/AM */
            object.ETime =object.ETime.concat(' PM');
        }
        else{
            object.ETime = object.ETime.concat(' AM');
        }


        if(events[i].type === "classroom_brief"){ /* Changes color for classroom brief events */
            object.backColor = "#3399ff";
        }
        if(events[i].type === "vault_brief"){ /* Changes color for vault brief events */
            object.backColor = "#66ffcc" ;
        }
        if(events[i].type === "test"){ /* Changes color for test events */
            object.backColor ="#ffff00" ;
        }
        if(events[i].type === "final"){ /* Changes color for  final events */
           object.backColor = "#c38bf7" ;
        }
       

        PageEvents.push(object); /* Adds the object to the array */
    }
    return PageEvents;
}

function toggleCreateEventsPage(){
    let createEventsPage = document.getElementById("createEventsPage");
    let schedulePage = document.getElementById("schedulePage");
    fillSyllabusCodeSelect();

    //If the create events screen was hidden before, unhide it
    if(createEventsPage.getAttribute("hidden") !== null){
        createEventsPage.removeAttribute("hidden"); 
        schedulePage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the schedule page
    else{
        schedulePage.removeAttribute("hidden"); 
        createEventsPage.setAttribute("hidden", true);
        window.location.reload(false);
    }
}

function toggleEditASEventsSearch(){
    let editEventsMenu = document.getElementById("editEventMenu");
    let editASEventsSearch = document.getElementById("editASEventsSearch");

    //If the edit event search screen was hidden before, unhide it
    if(editASEventsSearch.getAttribute("hidden") !== null){
        editASEventsSearch.removeAttribute("hidden"); 
        editEventsMenu.setAttribute("hidden", true);
        searchEditASTableALL();
    }
    //otherwise, hide everything and show the schedule page
    else{
        editEventsMenu.removeAttribute("hidden"); 
        editASEventsSearch.setAttribute("hidden", true);
    }
}

function toggleEditEventsMenu(){
    let editEventsMenu = document.getElementById("editEventMenu");
    let schedulePage = document.getElementById("schedulePage");

    //If the create events screen was hidden before, unhide it
    if(editEventsMenu.getAttribute("hidden") !== null){
        editEventsMenu.removeAttribute("hidden"); 
        schedulePage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the schedule page
    else{
        schedulePage.removeAttribute("hidden"); 
        editEventsMenu.setAttribute("hidden", true);
        window.location.reload(false);
    }
}

function toggleEditEventsPage(){
    let editEventsMenu = document.getElementById("editEventMenu");
    let editEventsPage = document.getElementById("editEventsPage");

    //If the create events screen was hidden before, unhide it
    if(editEventsPage.getAttribute("hidden") !== null){
        editEventsPage.removeAttribute("hidden"); 
        editEventsMenu.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the schedule page
    else{
        editEventsMenu.removeAttribute("hidden"); 
        editEventsPage.setAttribute("hidden", true);
    }
}

function toggleEditEventsDiv(){
    let editEventsDiv = document.getElementById("editEventsDiv");
    let editEventsPage = document.getElementById("editEventsPage");

    //If the create events screen was hidden before, unhide it
    if(editEventsDiv.getAttribute("hidden") !== null){
        editEventsDiv.removeAttribute("hidden"); 
        editEventsPage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the schedule page
    else{
        editEventsPage.removeAttribute("hidden"); 
        editEventsDiv.setAttribute("hidden", true);
    }
}
//-----------------------------no delete just note
function toggleEditAttendingStudentsPage(){
    let editASEventsSearch = document.getElementById("editASEventsSearch");
    let editAttendingI = document.getElementById("editAttendingInstructorsPage");
    let editAttendingS = document.getElementById("editAttendingStudentsPage");

    //If the edit attending students checklist screen was hidden before, unhide it
    if(editAttendingS.getAttribute("hidden") !== null){
        editAttendingS.removeAttribute("hidden"); 
        editASEventsSearch.setAttribute("hidden", true);
        editAttendingI.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the schedule page
    else{
        editASEventsSearch.removeAttribute("hidden"); 
        editAttendingI.setAttribute("hidden", true);
        editAttendingS.setAttribute("hidden", true);
        searchEditASTableALL();
    }
}

function toggleEditAttendingInstructorsPage(){
    let editAttendingI = document.getElementById("editAttendingInstructorsPage");
    let editAttendingS = document.getElementById("editAttendingStudentsPage");

    //If the edit attending instructors checklist screen was hidden before, unhide it
    if(editAttendingI.getAttribute("hidden") !== null){
        editAttendingI.removeAttribute("hidden"); 
        editAttendingS.setAttribute("hidden", true);
    }
}

function toggleEditAttendingInstructorsPageBack(){
    let editASEventsSearch = document.getElementById("editASEventsSearch");
    let editAttendingI = document.getElementById("editAttendingInstructorsPage");
    let editAttendingS = document.getElementById("editAttendingStudentsPage");

    //If the edit attending instructors checklist screen was hidden before, unhide it
    if(editAttendingI.getAttribute("hidden") !== null){
        editAttendingI.removeAttribute("hidden"); 
        editASEventsSearch.setAttribute("hidden", true);
        editAttendingS.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the schedule page
    else{
        editASEventsSearch.removeAttribute("hidden"); 
        editAttendingI.setAttribute("hidden", true);
        editAttendingS.setAttribute("hidden", true);
        searchEditASTableALL();
    }
}

function toggleDeleteEventsPage(){
    let editEventsMenu = document.getElementById("editEventMenu");
    let deleteEventsPage = document.getElementById("deleteEventsPage");

    //If the create events screen was hidden before, unhide it
    if(deleteEventsPage.getAttribute("hidden") !== null){
        deleteEventsPage.removeAttribute("hidden"); 
        editEventsMenu.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the schedule page
    else{
        editEventsMenu.removeAttribute("hidden"); 
        deleteEventsPage.setAttribute("hidden", true);
    }
}

//Generates table to show all users of the system
async function searchAllUsersAS(){
    //Manipulate the header DONT CHANGE
    let header = document.getElementById("searchStudentAdd");
    header.innerHTML = "All Users";

    //Fill the table with all users of the system
    let userData = await findAllUsers();
    
    userTableFill(userData);
}

async function searchAllUsersAI(){
    //Manipulate the header DONT CHANGE
    let header = document.getElementById("searchInstructorAdd");
    header.innerHTML = "All Users";

    //Fill the table with all users of the system
    let userData = await findAllUsers();
    userTableFillAI(userData);
}

function firstLetterCapital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function userTableFill(data) {
    let userTable = document.getElementById("studentSearchTable");
    let eventId = document.getElementById("editASId").value;
    let checkedString = "";

    data.sort((a, b) => {
        const lastNameA = a.lastName || 'zz'; // Default to an empty string if lastName is null/undefined
        const lastNameB = b.lastName || 'zz'; // Default to an empty string if lastName is null/undefined
    
        return lastNameA.localeCompare(lastNameB);
    });

    let idObj = {
        id: eventId
    }

    let eventDatas = await findEventID(idObj);
    let eventData = eventDatas[0];
    let conflicts = eventData.conflicts;

    //Clears the table before generating new rows
    while (userTable.firstChild) {
        userTable.removeChild(userTable.firstChild);
    }

    //Creates a row saying "No users found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No users found!";
        document.getElementById("studentSearchTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th id = 'tableth'>Attending</th><th id = 'tableth'>Name</th><th id = 'tableth'>Crew Position</th><th id = 'tableth'>Syllabus</th><th id = 'tableth'>Email</th><th id = 'tableth'>Permissions</th></tr>";
    //Creates a new element "table row"
    let trH = document.createElement("tr");
    //Sets that element's innerHTML to the string we created
    trH.innerHTML = stringH;
    //Appends the new row to the bottom of the table
    document.getElementById("studentSearchTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        checkedString = "";
        //Grabs the single bit of data
        let user = data[i];

        let length = eventData.students.length;

        for(let j = 0; j < length; j++){
            if(user.email === eventData.students[j].email){
                checkedString = "checked";
            }
        }

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+="<td>";
        //Adds last name if the user has one
        if(user.lastName){
            string += firstLetterCapital(user.lastName);
            //Adds the first name if the user has one
            if(user.firstName){
                string += ", " + firstLetterCapital(user.firstName);
            }
        }
        //If the user has no last name, but has a first name, it is added to the string
        else if(user.firstName){
            string += firstLetterCapital(user.lastName);
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds crew position to the string if they have one
        if(user.crewPosition){
            string += user.crewPosition.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds syllabus to the string if they have one
        if(user.syllabus){
            string += user.syllabus.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        //Adds email to the string. They have to have an email, so no if statement
        string+="<td>";
        string += user.email;
        string+="</td>";

        //Adds user type to the string if they have one
        if(user.userType){
            string+="<td>";
            string += user.userType.toUpperCase();
            string+="</td>";
        }

        //Creates a new element "table row"
        let tr = document.createElement("tr");

        //Sets that element's innerHTML to the string we created
        let checkId = "attending" + user.email + "+" + user.firstName + "+" + user.lastName + "+" + user.crewPosition;

        for(let j = 0; j < conflicts.length; j++){
            if(user.email === conflicts[j].email && checkedString === "checked"){
                tr.style.backgroundColor = "tomato";
                //Sets that element's innerHTML to the string we created
                checkId = "attendingConflict" + user.email + "+" + user.firstName + "+" + user.lastName + "+" + user.crewPosition;
            }
        }
        
        tr.innerHTML = "<td><input " + checkedString + " name='addStudentCheckbox' type='checkbox' id= '" + checkId + "'></input></td>" + string;
        //Appends the new row to the bottom of the table
        document.getElementById("studentSearchTable").appendChild(tr);
    }
}

async function userTableFillAI(data) {
    let userTable = document.getElementById("instructorSearchTable");
    
    data.sort((a, b) => {
        const lastNameA = a.lastName || 'zz'; // Default to an empty string if lastName is null/undefined
        const lastNameB = b.lastName || 'zz'; // Default to an empty string if lastName is null/undefined
    
        return lastNameA.localeCompare(lastNameB);
    });

    let eventId = document.getElementById("editASId").value;
    document.getElementById("editAIId").value = eventId;

    let checkedString = "";

    let idObj = {
        id: eventId
    }

    let eventDatas = await findEventID(idObj);
    let eventData = eventDatas[0];
    let conflicts = eventData.conflicts;

    //Clears the table before generating new rows
    while (userTable.firstChild) {
        userTable.removeChild(userTable.firstChild);
    }

    //Creates a row saying "No users found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No users found!";
        document.getElementById("instructorSearchTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th id = 'tableth'>Attending</th><th id = 'tableth'>Name</th><th id = 'tableth'>Crew Position</th><th id = 'tableth'>Syllabus</th><th id = 'tableth'>Email</th><th id = 'tableth'>Permissions</th></tr>";
    //Creates a new element "table row"
    let trH = document.createElement("tr");
    //Sets that element's innerHTML to the string we created
    trH.innerHTML = stringH;
    //Appends the new row to the bottom of the table
    document.getElementById("instructorSearchTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){

        checkedString = "";
        //Grabs the single bit of data
        let user = data[i];

        let length = eventData.instructors.length;

        for(let j = 0; j < length; j++){
            if(user.email === eventData.instructors[j].email){
                checkedString = "checked";
            }
        }

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+="<td>";
        //Adds last name if the user has one
        if(user.lastName){
            string += firstLetterCapital(user.lastName);
            //Adds the first name if the user has one
            if(user.firstName){
                string += ", " + firstLetterCapital(user.firstName);
            }
        }
        //If the user has no last name, but has a first name, it is added to the string
        else if(user.firstName){
            string += firstLetterCapital(user.lastName);
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds crew position to the string if they have one
        if(user.crewPosition){
            string += user.crewPosition.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds syllabus to the string if they have one
        if(user.syllabus){
            string += user.syllabus.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        //Adds email to the string. They have to have an email, so no if statement
        string+="<td>";
        string += user.email;
        string+="</td>";

        //Adds user type to the string if they have one
        if(user.userType){
            string+="<td>";
            string += user.userType.toUpperCase();
            string+="</td>";
        }

        //Creates a new element "table row"
        let tr = document.createElement("tr");

        //Sets that element's innerHTML to the string we created
        let checkId = "attending" + user.email + "+" + user.firstName + "+" + user.lastName + "+" + user.crewPosition;

        for(let j = 0; j < conflicts.length; j++){
            if(user.email === conflicts[j].email && checkedString === "checked"){
                tr.style.backgroundColor = "tomato";
                //Sets that element's innerHTML to the string we created
                checkId = "attendingConflict" + user.email + "+" + user.firstName + "+" + user.lastName + "+" + user.crewPosition;
            }
        }

        tr.innerHTML = "<td><input " + checkedString + " name='addInstructorCheckbox' type='checkbox' id= '" + checkId + "'></input></td>" + string;
        //Appends the new row to the bottom of the table
        document.getElementById("instructorSearchTable").appendChild(tr);
    }
}

async function fillSyllabusCodeSelect(){
    once = true;
    let syllabusCodeSelect = document.getElementById("eventSyllabus");
    let editEventSyllabus = document.getElementById("editEventSyllabus");
    let string = "";
    let data = await findAllSyllabus();
    string += "<option value='none'>None</option>";
    for(let i = 0; i < data.length; i++){
        string += "<option value='" + data[i].code + "'>" + data[i].code +  "</option>"
    }
    syllabusCodeSelect.innerHTML = string;
    editEventSyllabus.innerHTML = string;
}

async function deleteEvents(e){
    //Gets the id
    let index = e.target.id;
    let alert = document.getElementById("alertMSText");
    let success = document.getElementById("successMSText");

    //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
    if(!index.includes("deleteBtn")){
        return;
    }
    unhideLoad();
      //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
    index = index.replaceAll('deleteBtn', '');

    let eventObj = {
        id: index
    }

    let event = await findEventID(eventObj);
    let title = event[0].title;
  

    if (window.confirm("Are you sure about deleting " + title + "? This cannot be undone!") === true) {

        let status = await deleteEvent(eventObj);
        if(status.status !== true){
            alert.innerHTML = "Error deleting event!";
            unHideAlert();
        }
        else{
            success.innerHTML = "Successfully deleted event!";
            unHideSuccess();
            searchDeleteTableAll();
        }
    }
    else{
        alert.innerHTML = "Cancelled";
        unHideAlert();
    }
}

async function popupdeleteEvents(e){ // When the admin clicks on the cross button this will happen

    // This Area Needs to Change
    //Gets the id
    let index = e.data.id;
    let alert = document.getElementById("alertMSText");
    let success = document.getElementById("successMSText");

    let eventObj = {
        id: index
    }

    let event = await findEventID(eventObj);
    let title = event[0].title;
    // This Area Needs to Change

    if (window.confirm("Are you sure about deleting " + title + "? This cannot be undone!") === true) {

        let status = await deleteEvent(eventObj);
        if(status.status !== true){
            alert.innerHTML = "Error deleting event!";
            unHideAlert();
        }
        else{
            success.innerHTML = "Successfully deleted event!";
            unHideSuccess();
            window.location.reload(false);
        }
    }
    else{
        alert.innerHTML = "Cancelled";
        unHideAlert();
    }
}

async function editASEventRedirect(e){
    //Gets the id
    let index = e.target.id;
    let header = document.getElementById("editASH2");
    let header2 = document.getElementById("editAIH2");
    //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
    if(!index.includes("editASBtn")){
        return;
    }
    //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
    index = index.replaceAll('editASBtn', '');

    document.getElementById("editASId").value = index;
    let eventObj = {
        id: index
    }
    let event = await findEventID(eventObj);
    header.innerHTML = "Editing Students For: " + event[0].name.toUpperCase();
    header2.innerHTML = "Editing Instructors For: " + event[0].name.toUpperCase();

    searchAllUsersAS();
    searchAllUsersAI();
    toggleEditAttendingStudentsPage();
    editAIEventRedirect(index);
}

async function editAIEventRedirect(a){
    //Gets the id
    let index = a;
    let header = document.getElementById("editAIH2");

    //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
    if(!index.includes("editAIBtn")){
        return;
    }
      //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
    index = index.replaceAll('editAIBtn', '');

    document.getElementById("editAIId").value = index;
    let eventObj = {
        id: index
    }
    let event = await findEventID(eventObj);
    header.innerHTML = "Editing Instructors For: " + event[0].name.toUpperCase();

    searchAllUsersAI();
}

async function editEventRedirect(e){
    //Gets the id
    let index = e.target.id;

    //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
    if(!index.includes("editBtn")){
        return;
    }
      //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
    index = index.replaceAll('editBtn', '');

    let eventObj = {
        id: index
    }

    let events = await findEventID(eventObj);
    if(!events){
        console.log("error getting event id");
        return;
    }

    let event = events[0];

    //set up page
    let startDateStringBad = event.startDate
    let startDateStringGood = startDateStringBad.slice(0, startDateStringBad.indexOf("T"));

    let endDateStringBad = event.endDate;
    let endDateStringGood = endDateStringBad.slice(0, endDateStringBad.indexOf("T"));

    document.getElementById("editId").value = index;
    document.getElementById("editName").value = event.name;
    document.getElementById("editTitle").value = event.title;
    document.getElementById("editStartDate").value = startDateStringGood;
    document.getElementById("editEndDate").value = endDateStringGood;
    document.getElementById("editStartDateOld").value = startDateStringGood;
    document.getElementById("editEndDateOld").value = endDateStringGood;
    document.getElementById("editSt").value = event.startTime;
    document.getElementById("editEt").value = event.endTime;
    document.getElementById("editDescription").value = event.description;
    document.getElementById("editType").value = event.type;
    document.getElementById("editEventSyllabus").value = event.syllabus;

    toggleEditEventsDiv();
}

async function editEvent(e){
    if(e){
        e.preventDefault();
    }

    let alert = document.getElementById("alertMSText");
    let success = document.getElementById("successMSText");
    let id = document.getElementById("editId").value;
    let name = document.getElementById("editName").value.toLowerCase();
    let title = document.getElementById("editTitle").value.toLowerCase();
    let startDateOld = document.getElementById("editStartDateOld").value;
    let endDateOld = document.getElementById("editEndDateOld").value;
    let startDate = document.getElementById("editStartDate").value;
    let endDate = document.getElementById("editEndDate").value;
    let startTime = document.getElementById("editSt").value;
    let endTime = document.getElementById("editEt").value;
    let description = document.getElementById("editDescription").value.toLowerCase();
    let type = document.getElementById("editType").value.toLowerCase();
    let syllabus = document.getElementById("editEventSyllabus").value.toLowerCase();

    unhideLoad();

    if(!description){
        description = null;
    }
    if(!syllabus){
        syllabus = null;
    }

    if(startDate > endDate){
        alert.innerHTML = "Start date should be before end date!"
        unHideAlert()
        return;
    }else{
        if(startDate === endDate && startTime >= endTime){
            alert.innerHTML = "Start time should be before end time!"
            unHideAlert();
            return;
        }
    }
    


     // Combine date and time strings
    const startDateTime = new Date(startDate + 'T' + startTime);
    const endDateTime = new Date(endDate + 'T' + endTime);

    // Calculate the duration in milliseconds
    const durationInMilliseconds = endDateTime - startDateTime;

    // Convert the duration to hours and minutes
    const hours = Math.floor(durationInMilliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((durationInMilliseconds % (60 * 60 * 1000)) / (60 * 1000));

    // Check if the duration is greater than 23 hours and 59 minutes
    if((hours > 23 || (hours === 23 && minutes > 59)) === true){
        alert.innerHTML = "Event must be under 24 hours!";
        unHideAlert();
        return;
    }

    let eventObj;

    let string = "Editing the date of an event will empty the conflicts and attendance for this event. This is to prevent scheduling conflicts. Proceed?";

    if(startDateOld !== startDate || endDateOld !== endDate){
        if (window.confirm(string) === true){
            eventObj = {
                id: id,
                title: title,
                name: name,
                startDate: (startDate + " 00:00:00"),
                endDate: (endDate + " 00:00:00"),
                startTime: startTime,
                endTime: endTime,
                description: description,
                type: type,
                syllabus: syllabus
            }

            let eventAttObj = {
                eventId: id,
                attendingArray: []
            }
            await updateAttendingStudents(eventAttObj);
            await updateAttendingInstructors(eventAttObj);

            let eventConObj = {
                eventId: id,
                conflictArray: []
            }

            await updateConflicts(eventConObj);
        }
        else{
            document.getElementById("editStartDate").value = startDateOld;
            document.getElementById("editEndDate").value = endDateOld;

            eventObj = {
                id: id,
                title: title,
                name: name,
                startDate: (startDateOld + " 00:00:00"),
                endDate: (endDateOld + " 00:00:00"),
                startTime: startTime,
                endTime: endTime,
                description: description,
                type: type,
                syllabus: syllabus
            }
        }
    }
    else{
        eventObj = {
            id: id,
            title: title,
            name: name,
            startDate: (startDate + " 00:00:00"),
            endDate: (endDate + " 00:00:00"),
            startTime: startTime,
            endTime: endTime,
            description: description,
            type: type,
            syllabus: syllabus
        }
    }
    
    let status = await updateEvent(eventObj);
    status = status.status;

    if(status !== true){
        alert.innerHTML = "Error updating event!";
        unHideAlert();
    }
    else{
        success.innerHTML = "Successfully updated event!";
        unHideSuccess();
        searchEditTableAll();
    }
}

async function searchDeleteTable(e){
    if(e){
        e.preventDefault();
    }
    let name = document.getElementById("delEventName").value.toLowerCase();
    let deleteTable = document.getElementById("deleteEventsTable");
    let nameObj = {
        name: name
    }
    let data = await findEventN(nameObj);

    //Clears the table before generating new rows
    while (deleteTable.firstChild) {
        deleteTable.removeChild(deleteTable.firstChild);
    }

    //Creates a row saying "No events found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No events found!";
        document.getElementById("deleteEventsTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th id = 'tableth'>Title</th><th id = 'tableth'>Name</th><th id = 'tableth'>Start Date</th><th id = 'tableth'>End Date</th><th id = 'tableth'>Start Time</th><th id = 'tableth'>End Time</th><th id = 'tableth'>Description</th><th id = 'tableth'>Type</th><th id = 'tableth'>Syllabus</th><th id = 'tableth'>Button</th></tr>";
    //Creates a new element "table row"
    let trH = document.createElement("tr");
    //Sets that element's innerHTML to the string we created
    trH.innerHTML = stringH;
    //Appends the new row to the bottom of the table
    document.getElementById("deleteEventsTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let event = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+= "<td>";
        string+= event.title;
        string+= "</td>";
            
        string+= "<td>";
        string+= event.name;
        string+= "</td>";

        string+= "</td>";
        let startDate = event.startDate;
        startDate = startDate.substring(0, startDate.indexOf("T"));
        string+= "</td>";

        string+= "<td>";
        string+= startDate;
        string+= "</td>";

        string+= "<td>";
        let endDate = event.endDate;
        endDate = endDate.substring(0, endDate.indexOf("T"));
        string+= endDate;
        string+= "</td>";

        string+= "<td>";
        string+= event.startTime;
        string+= "</td>";

        string+= "<td>";
        string+= event.endTime;
        string+= "</td>";
        

        string+= "<td>";
        //Adds description to the string if it has one
        if(event.description){
            let description = event.description;
            if(description.length > 70){
                description = description.slice(0, 70) + "...";
            }
            string += description;
        }
        else{
            string+= "None";
        }
        string+= "</td>";

        string+= "<td>";
        string+= event.type;
        string+= "</td>";

        string+= "<td>";
        //Adds syllabus to the string if it has one
        if(event.syllabus){
            string += event.syllabus.toUpperCase();
        }
        else{
            string+="None";
        }
        string+= "</td>";

        //Creates a new element "table row"
        let tr = document.createElement("tr");

        if(event.conflicts.length > 0){
            tr.style.backgroundColor = "tomato";
        }

        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string + "<td><button class='button-28 bb' id='deleteBtn" + event._id + "'>Delete</button></td>";

        //Appends the new row to the bottom of the table
        document.getElementById("deleteEventsTable").appendChild(tr);
    } 
}

async function searchDeleteTableAll(e){
    if(e){
        e.preventDefault();
    }
    let deleteTable = document.getElementById("deleteEventsTable");

    let data = await findAllEventsOrdered();

    //Clears the table before generating new rows
    while (deleteTable.firstChild) {
        deleteTable.removeChild(deleteTable.firstChild);
    }

    //Creates a row saying "No events found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No events found!";
        document.getElementById("deleteEventsTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th id = 'tableth'>Title</th><th id = 'tableth'>Name</th><th id = 'tableth'>Start Date</th><th id = 'tableth'>End Date</th><th id = 'tableth'>Start Time</th><th id = 'tableth'>End Time</th><th id = 'tableth'>Description</th><th id = 'tableth'>Type</th><th id = 'tableth'>Syllabus</th><th id = 'tableth'>Button</th></tr>";
    //Creates a new element "table row"
    let trH = document.createElement("tr");
    //Sets that element's innerHTML to the string we created
    trH.innerHTML = stringH;
    //Appends the new row to the bottom of the table
    document.getElementById("deleteEventsTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let event = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+= "<td>";
        string+= event.title;
        string+= "</td>";      
            
        string+= "<td>";
        string+= event.name;
        string+= "</td>";

        string+= "</td>";
        let startDate = event.startDate;
        startDate = startDate.substring(0, startDate.indexOf("T"));
        string+= "</td>";

        string+= "<td>";
        string+= startDate;
        string+= "</td>";

        string+= "<td>";
        let endDate = event.endDate;
        endDate = endDate.substring(0, endDate.indexOf("T"));
        string+= endDate;
        string+= "</td>";

        string+= "<td>";
        string+= event.startTime;
        string+= "</td>";

        string+= "<td>";
        string+= event.endTime;
        string+= "</td>";
        
        string+= "<td>";
        //Adds description to the string if it has one
        if(event.description){
            let description = event.description;
            if(description.length > 70){
                description = description.slice(0, 70) + "...";
            }
            string += description;
        }
        else{
            string+= "None";
        }
        string+= "</td>";

        string+= "<td>";
        string+= event.type;
        string+= "</td>";

        string+= "<td>";
        //Adds syllabus to the string if it has one
        if(event.syllabus){
            string += event.syllabus.toUpperCase();
        }
        else{
            string+="None";
        }
        string+= "</td>";

        //Creates a new element "table row"
        let tr = document.createElement("tr");

        if(event.conflicts.length > 0){
            tr.style.backgroundColor = "tomato";
        }

        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string + "<td><button class='button-28 bb' id='deleteBtn" + event._id + "'>Delete</button></td>";

        //Appends the new row to the bottom of the table
        document.getElementById("deleteEventsTable").appendChild(tr);
    } 
}

async function searchEditTable(e){
    if(e){
      e.preventDefault();
    }
    let name = document.getElementById("editEventName").value.toLowerCase();
    let editTable = document.getElementById("editEventsTable");
    let nameObj = {
        name: name
    }
    let data = await findEventN(nameObj);

    //Clears the table before generating new rows
    while (editTable.firstChild) {
        editTable.removeChild(editTable.firstChild);
    }

    //Creates a row saying "No events found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No events found!";
        document.getElementById("editEventsTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th id = 'tableth'>Title</th><th id = 'tableth'>Name</th><th id = 'tableth'>Start Date</th><th id = 'tableth'>End Date</th><th id = 'tableth'>Start Time</th><th id = 'tableth'>End Time</th><th id = 'tableth'>Description</th><th id = 'tableth'>Type</th><th id = 'tableth'>Syllabus</th><th id = 'tableth'>Button</th></tr>";
    //Creates a new element "table row"
    let trH = document.createElement("tr");
    //Sets that element's innerHTML to the string we created
    trH.innerHTML = stringH;
    //Appends the new row to the bottom of the table
    document.getElementById("editEventsTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let event = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+= "<td>";
        string+= event.title;
        string+= "</td>";  
            
        string+= "<td>";
        string+= event.name;
        string+= "</td>";

        string+= "</td>";
        let startDate = event.startDate;
        startDate = startDate.substring(0, startDate.indexOf("T"));
        string+= "</td>";

        string+= "<td>";
        string+= startDate;
        string+= "</td>";

        string+= "<td>";
        let endDate = event.endDate;
        endDate = endDate.substring(0, endDate.indexOf("T"));
        string+= endDate;
        string+= "</td>";

        string+= "<td>";
        string+= event.startTime;
        string+= "</td>";

        string+= "<td>";
        string+= event.endTime;
        string+= "</td>";
        
        string+= "<td>";
        //Adds description to the string if it has one
        if(event.description){
            let description = event.description;
            if(description.length > 70){
                description = description.slice(0, 70) + "...";
            }
            string += description;
        }
        else{
            string+= "None";
        }
        string+= "</td>";

        string+= "<td>";
        string+= event.type;
        string+= "</td>";

        string+= "<td>";
        //Adds syllabus to the string if it has one
        if(event.syllabus){
            string += event.syllabus.toUpperCase();
        }
        else{
            string+="None";
        }
        string+= "</td>";

        //Creates a new element "table row"
        let tr = document.createElement("tr");

        if(event.conflicts.length > 0){
            tr.style.backgroundColor = "tomato";
        }

        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string + "<td><button class='button-28 bb' id='editBtn" + event._id + "'>Edit</button></td>";


        //Appends the new row to the bottom of the table
        document.getElementById("editEventsTable").appendChild(tr);    
    } 
}

async function searchEditTableAll(e){
    if(e){
        e.preventDefault();
    }
    let editTable = document.getElementById("editEventsTable");

    let data = await findAllEventsOrdered();

    //Clears the table before generating new rows
    while (editTable.firstChild) {
        editTable.removeChild(editTable.firstChild);
    }

    //Creates a row saying "No events found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No events found!";
        document.getElementById("editEventsTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th id = 'tableth'>Title</th><th id = 'tableth'>Name</th><th id = 'tableth'>Start Date</th><th id = 'tableth'>End Date</th><th id = 'tableth'>Start Time</th><th id = 'tableth'>End Time</th><th id = 'tableth'>Description</th><th id = 'tableth'>Type</th><th id = 'tableth'>Syllabus</th><th id = 'tableth'>Button</th></tr>";
    //Creates a new element "table row"
    let trH = document.createElement("tr");
    //Sets that element's innerHTML to the string we created
    trH.innerHTML = stringH;
    //Appends the new row to the bottom of the table
    document.getElementById("editEventsTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let event = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+= "<td>";
        string+= event.title;
        string+= "</td>";         
            
        string+= "<td>";
        string+= event.name;
        string+= "</td>";

        string+= "</td>";
        let startDate = event.startDate;
        startDate = startDate.substring(0, startDate.indexOf("T"));
        string+= "</td>";

        string+= "<td>";
        string+= startDate;
        string+= "</td>";

        string+= "<td>";
        let endDate = event.endDate;
        endDate = endDate.substring(0, endDate.indexOf("T"));
        string+= endDate;
        string+= "</td>";

        string+= "<td>";
        string+= event.startTime;
        string+= "</td>";

        string+= "<td>";
        string+= event.endTime;
        string+= "</td>";
        
        string+= "<td>";
        //Adds description to the string if it has one
        if(event.description){
            let description = event.description;
            if(description.length > 70){
                description = description.slice(0, 70) + "...";
            }
            string += description;
        }
        else{
            string+= "None";
        }
        string+= "</td>";

        string+= "<td>";
        string+= event.type;
        string+= "</td>";

        string+= "<td>";
        //Adds syllabus to the string if it has one
        if(event.syllabus){
            string += event.syllabus.toUpperCase();
        }
        else{
            string+="None";
        }
        string+= "</td>";

        //Creates a new element "table row"
        let tr = document.createElement("tr");

        if(event.conflicts.length > 0){
            tr.style.backgroundColor = "tomato";
        }

        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string + "<td><button class='button-28 bb' id='editBtn" + event._id + "'>Edit</button></td>";

        //Appends the new row to the bottom of the table
        document.getElementById("editEventsTable").appendChild(tr);
    } 
}

async function searchEditASTable(e){
    if(e){
        e.preventDefault();
    }
    let name = document.getElementById("editASEventName").value.toLowerCase();
    let editTable = document.getElementById("editEventsASTable");
    let nameObj = {
        name: name
    }
    let data = await findEventN(nameObj);

    //Clears the table before generating new rows
    while (editTable.firstChild) {
        editTable.removeChild(editTable.firstChild);
    }

    //Creates a row saying "No events found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No events found!";
        document.getElementById("editEventsASTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th id = 'tableth'>Title</th><th id = 'tableth'>Name</th><th id = 'tableth'>Start Date</th><th id = 'tableth'>End Date</th><th id = 'tableth'>Start Time</th><th id = 'tableth'>End Time</th><th id = 'tableth'>Description</th><th id = 'tableth'>Type</th><th id = 'tableth'>Syllabus</th><th id = 'tableth'>Button</th></tr>";
    //Creates a new element "table row"
    let trH = document.createElement("tr");
    //Sets that element's innerHTML to the string we created
    trH.innerHTML = stringH;
    //Appends the new row to the bottom of the table
    document.getElementById("editEventsASTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let event = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+= "<td>";
        string+= event.title;
        string+= "</td>";  
            
        string+= "<td>";
        string+= event.name;
        string+= "</td>";

        string+= "</td>";
        let startDate = event.startDate;
        startDate = startDate.substring(0, startDate.indexOf("T"));
        string+= "</td>";

        string+= "<td>";
        string+= startDate;
        string+= "</td>";

        string+= "<td>";
        let endDate = event.endDate;
        endDate = endDate.substring(0, endDate.indexOf("T"));
        string+= endDate;
        string+= "</td>";

        string+= "<td>";
        string+= event.startTime;
        string+= "</td>";

        string+= "<td>";
        string+= event.endTime;
        string+= "</td>";

        string+= "<td>";
        //Adds description to the string if it has one
        if(event.description){
            let description = event.description;
            if(description.length > 70){
                description = description.slice(0, 70) + "...";
            }
            string += description;
        }
        else{
            string+= "None";
        }
        string+= "</td>";

        string+= "<td>";
        string+= event.type;
        string+= "</td>";

        string+= "<td>";
        //Adds syllabus to the string if it has one
        if(event.syllabus){
            string += event.syllabus.toUpperCase();
        }
        else{
            string+="None";
        }
        string+= "</td>";

        //Creates a new element "table row"
        let tr = document.createElement("tr");

        if(event.conflicts.length > 0){
            tr.style.backgroundColor = "tomato";
        }

        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string + "<td><button class='button-28 bb' id='editASBtn" + event._id + "'>Edit</button></td>";

        //Appends the new row to the bottom of the table
        document.getElementById("editEventsASTable").appendChild(tr);
    } 
}

async function searchEditASTableALL(e){
    if(e){
        e.preventDefault();
    }
    let editTable = document.getElementById("editEventsASTable");

    let data = await findAllEventsOrdered();

    //Clears the table before generating new rows
    while (editTable.firstChild) {
        editTable.removeChild(editTable.firstChild);
    }

    //Creates a row saying "No events found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No events found!";
        document.getElementById("editEventsASTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th id = 'tableth'>Title</th><th id = 'tableth'>Name</th><th id = 'tableth'>Start Date</th><th id = 'tableth'>End Date</th><th id = 'tableth'>Start Time</th><th id = 'tableth'>End Time</th><th id = 'tableth'>Description</th><th id = 'tableth'>Type</th><th id = 'tableth'>Syllabus</th><th id = 'tableth'>Button</th></tr>";
    //Creates a new element "table row"
    let trH = document.createElement("tr");
    //Sets that element's innerHTML to the string we created
    trH.innerHTML = stringH;
    //Appends the new row to the bottom of the table
    document.getElementById("editEventsASTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let event = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+= "<td>";
        string+= event.title;
        string+= "</td>";
                      
        string+= "<td>";
        string+= event.name;
        string+= "</td>";

        string+= "</td>";
        let startDate = event.startDate;
        startDate = startDate.substring(0, startDate.indexOf("T"));
        string+= "</td>";

        string+= "<td>";
        string+= startDate;
        string+= "</td>";

        string+= "<td>";
        let endDate = event.endDate;
        endDate = endDate.substring(0, endDate.indexOf("T"));
        string+= endDate;
        string+= "</td>";

        string+= "<td>";
        string+= event.startTime;
        string+= "</td>";

        string+= "<td>";
        string+= event.endTime;
        string+= "</td>";
        
        string+= "<td>";
        //Adds description to the string if it has one
        if(event.description){
            let description = event.description;
            if(description.length > 70){
                description = description.slice(0, 70) + "...";
            }
            string += description;
        }
        else{
            string+= "None";
        }
        string+= "</td>";

        string+= "<td>";
        string+= event.type;
        string+= "</td>";

        string+= "<td>";
        //Adds syllabus to the string if it has one
        if(event.syllabus){
            string += event.syllabus.toUpperCase();
        }
        else{
            string+="None";
        }
        string+= "</td>";

        //Creates a new element "table row"
        let tr = document.createElement("tr");

        if(event.conflicts.length > 0){
            tr.style.backgroundColor = "tomato";
        }

        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string + "<td><button class='button-28 bb' id='editASBtn" + event._id + "'>Edit</button></td>";

        //Appends the new row to the bottom of the table
        document.getElementById("editEventsASTable").appendChild(tr);
    } 
}

class CalendarMaster extends Component {

    constructor(props) {
        super(props);
        this.calendarRef = React.createRef();
        this.state = {
            viewType: "Week",
            durationBarVisible: false,
            eventDeleteHandling: "CallBack",
            eventMoveHandling: "disabled",
            headerDateFormat: "dd",

            onEventDelete: function(args){
                console.log(args)
                popupdeleteEvents(args.e);
            },
      
            onEventClick: async args => { /* When clicking on an event this happens*/
                const dp = this.calendar;
                
                const form = [ /* Event format */
                    {
                        type: 'title',
                        name: args.e.data.name + ", " + args.e.data.title,
                    },
                    {
                        type: 'EventName',
                        html: "Title: " + args.e.data.title,
                    },
                    {
                        type: 'EventName',
                        html: "Event name: " + args.e.data.name,
                    },
                    {
                        type: 'StartTime',
                        html: "Date: " + args.e.data.SDate + " ----> " + args.e.data.EDate,
                    },
                    {
                        type: 'EndTime',
                        html:  "Time: " + args.e.data.STime + " ----> " + args.e.data.ETime ,
                    },
                    {
                        type: 'Description',
                        html:  args.e.data.description,
                    },
                    {
                        type: 'searchable',
                        id: 'searchable',
                        name: 'Instructor List',
                        options: args.e.data.InstructorList
                    },
                    {
                        type: 'searchable',
                        id: 'searchable',
                        name: 'Students List',
                        options: args.e.data.StudentList
                    },
                ];

                const data = {};
        
                const modal = await DayPilot.Modal.form(form, data);
        
            },
        };
    }
  
    get calendar() {
        return this.calendarRef.current.control;
    }
  
    async componentDidMount() {
        generatePage();

        const events = await generateEvents();

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
      
        const currentDate = year + "-" + month + "-" + day;

        this.calendar.update({currentDate, events});
    }

    createEvents = async (e)=>{

        e.preventDefault();
        unhideLoad();
        let alert = document.getElementById("alertMSText");
        let success = document.getElementById("successMSText");
        let title = document.getElementById("title").value.toLowerCase();
        let name = document.getElementById("eventName").value.toLowerCase();
        let startDate = document.getElementById("startDate").value;
        let endDate = document.getElementById("endDate").value;
        let startTime = document.getElementById("st").value;
        let endTime = document.getElementById("et").value;
        let description = document.getElementById("description").value.toLowerCase();
        let type = document.getElementById("type").value.toLowerCase();
        let syllabus = document.getElementById("eventSyllabus").value.toLowerCase();

        unhideLoad();

        let userData = await getUserData();
        if(userData.userType !== "admin"){
            alert.innerHTML = "Only admins may create events";
            unHideAlert();
            return;
        }

        if(startDate > endDate){
            alert.innerHTML = "Start date should be before end date!"
            unHideAlert()
            return;
        }else{
            if(startDate === endDate && startTime >= endTime){
                alert.innerHTML = "Start time should be before end time!"
                unHideAlert();
                return;
            }
        }
        


         // Combine date and time strings
        const startDateTime = new Date(startDate + 'T' + startTime);
        const endDateTime = new Date(endDate + 'T' + endTime);

        // Calculate the duration in milliseconds
        const durationInMilliseconds = endDateTime - startDateTime;

        // Convert the duration to hours and minutes
        const hours = Math.floor(durationInMilliseconds / (60 * 60 * 1000));
        const minutes = Math.floor((durationInMilliseconds % (60 * 60 * 1000)) / (60 * 1000));

        // Check if the duration is greater than 23 hours and 59 minutes
        if((hours > 23 || (hours === 23 && minutes > 59)) === true){
            alert.innerHTML = "Event must be under 24 hours!";
            unHideAlert();
            return;
        }

        if(!description){
            description = null;
        }
        if(!syllabus){
            syllabus = null;
        }
        let instrObj = [];    

        let studObj = []   ;  

        let conflictObj = [];

        let eventObj = {
            title: title,
            name: name,
            startDate: (startDate + " 00:00:00"),
            endDate: (endDate + " 00:00:00"),
            startTime: startTime,
            endTime: endTime,
            description: description,
            type: type,
            syllabus: syllabus,
            instructors: instrObj,
            students: studObj,
            conflicts: conflictObj
        }
    
        let status = await addEvent(eventObj);
        if(status.status === true){
            success.innerHTML = "Event added successfully!";
            unHideSuccess();
        }
        else{
            alert.innerHTML = "Error Adding Event";
            unHideAlert();
        }
    }
  
    //Searches for user by first name
    searchFirstNameAS = async (e)=>{
        //Dom
        let field = document.getElementById("searchStudentAdd").value.toLowerCase();
      
        //Object for sending to the DB
        let firstNameObj = {
            firstName: field
        }
      
        //Data retrieved from database
        let data = await findUserFN(firstNameObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }
  
    //Searches for user by first name
    searchFirstNameAI = async (e)=>{
        //Dom
        let field = document.getElementById("searchInstructorAdd").value.toLowerCase();
      
        //Object for sending to the DB
        let firstNameObj = {
            firstName: field
        }
      
        //Data retrieved from database
        let data = await findUserFN(firstNameObj);
        if(data){
            userTableFillAI(data);
        }
        else{
            userTableFillAI(null);
        }
    }
    
    //Searches for user by crew position
    searchCPAS = async (e)=>{
        //Dom
        let field = document.getElementById("searchStudentAdd").value.toLowerCase();
      
        //Object for sending to the DB
        let crewPositionObj = {
            crewPosition: field
        }
      
        //Data retrieved from database
        let data = await findUserCP(crewPositionObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }
    
    //Searches for user by crew position
    searchCPAI = async (e)=>{
        //Dom
        let field = document.getElementById("searchInstructorAdd").value.toLowerCase();
      
        //Object for sending to the DB
        let crewPositionObj = {
            crewPosition: field
        }
      
        //Data retrieved from database
        let data = await findUserCP(crewPositionObj);
        if(data){
            userTableFillAI(data);
        }
        else{
            userTableFillAI(null);
        }
    }
    
    //Searches for user by first name
    searchLastNameAS = async (e)=>{
        //Dom
        let field = document.getElementById("searchStudentAdd").value.toLowerCase();
      
        //Object for sending to the DB
        let lastNameObj = {
            lastName: field
        }
      
        //Data retrieved from database
        let data = await findUserLN(lastNameObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }
    
    //Searches for user by first name
    searchLastNameAI = async (e)=>{
        //Dom
        let field = document.getElementById("searchInstructorAdd").value.toLowerCase();
      
        //Object for sending to the DB
        let lastNameObj = {
            lastName: field
        }
      
        //Data retrieved from database
        let data = await findUserLN(lastNameObj);
        if(data){
            userTableFillAI(data);
        }
        else{
            userTableFillAI(null);
        }
    }
    
    //Searches for user by Syllabus
    searchSyllabusAS = async (e)=>{
        //Dom
        let field = document.getElementById("searchStudentAdd").value.toLowerCase();
      
        //Object for sending to the DB
        let syllabusObj = {
            syllabus: field
        }
      
        //Data retrieved from database
        let data = await findUserS(syllabusObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }
    
    //Searches for user by Syllabus
    searchSyllabusAI = async (e)=>{
        //Dom
        let field = document.getElementById("searchInstructorAdd").value.toLowerCase();
      
        //Object for sending to the DB
        let syllabusObj = {
            syllabus: field
        }
      
        //Data retrieved from database
        let data = await findUserS(syllabusObj);
        if(data){
            userTableFillAI(data);
        }
        else{
            userTableFillAI(null);
        }
    }
    
    //Searches for user by email
    searchEmailAS = async (e)=>{
        //Grabs dom input
        let field = document.getElementById("searchStudentAdd").value.toLowerCase();
      
        //Creates object to send to the database from input
        let emailPassObj = {
            email: field
        }
      
        //Searches for user with that object
        let data = await findUserE(emailPassObj);
      
        //Creates an array and adds the data to it because the table generator only takes arrays
        let dataArray = [];
        if(data){
            dataArray.push(data)
            userTableFill(dataArray);
            return;
        }
        //Sends nothing to the table generator to get a "no users found!" message
        else{
            userTableFill(null);
        }
    }
    
    //Searches for user by email
    searchEmailAI = async (e)=>{
        //Grabs dom input
        let field = document.getElementById("searchInstructorAdd").value.toLowerCase();
      
        //Creates object to send to the database from input
        let emailPassObj = {
            email: field
        }
      
        //Searches for user with that object
        let data = await findUserE(emailPassObj);
      
        //Creates an array and adds the data to it because the table generator only takes arrays
        let dataArray = [];
        if(data){
            dataArray.push(data)
            userTableFillAI(dataArray);
            return;
        }
        //Sends nothing to the table generator to get a "no users found!" message
        else{
            userTableFillAI(null);
        }
    }
    
    addStudents = async (e) => {
        //Gets the id
        let index = e.target.id;
        let eventId = document.getElementById("editASId").value;
        let userChecked = e.target.checked;
        let alert = document.getElementById("alertMSText");
        let success = document.getElementById("successMSText");
        let conflict = false;
      
        let idObj = {
            id: eventId
        }
        let events = await findEventID(idObj);
        let event = events[0];
        let students = event.students;
        let conflicts = event.conflicts;
        let conflictFound = false;
      
        //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
        if(!index.includes("attending")){
            return;
        }
      
        if(index.includes("Conflict")){
            index = index.replaceAll('Conflict', '');
            conflict = true;
        }
      
        unhideLoad();
        //Remove 'attending' from the id and leave just important information
        index = index.replaceAll('attending', '');
        let user;
      
        //Gets user info from the element id and formats it
        let userArray = index.split("+");
        if(userArray[2] === "null" && userArray[1] === "null"){
            user = {
                email: userArray[0],
                name: "No Name"
            }
        }
        else if(userArray[2] === "null"){
            user = {
                email: userArray[0],
                name: userArray[1]
            }
        }
        else if(userArray[1] === "null"){
            user = {
                email: userArray[0],
                name: userArray[2]
            }
        }
        else{
            user = {
                email: userArray[0],
                name: userArray[2] + ", " + userArray[1]
            }
        }

        let addNotifObj = {
            recipient: userArray[0],
            subject: "Added to event",
            message: "You have been added to event " + event.name + "."
        }

        let removeNotifObj = {
            recipient: userArray[0],
            subject: "Removed from event",
            message: "You have been removed from event " + event.name + "."
        }
      
        //Checking the box
        if(userChecked === true){

            let userObj = {
                email: user.email
            }

            let approvedReqs = await findApprovedE(userObj);
            console.log(approvedReqs);
            if(approvedReqs.length > 0){
            
                let eventStart = event.startDate.split('T')[0];
                let eventEnd = event.endDate.split('T')[0];

                for(let i = 0; i < approvedReqs.length; i++){
                    let reqStart = approvedReqs[i].dateRequested.split('T')[0];
                    let reqEnd = approvedReqs[i].dateRequestedEnd.split('T')[0];
                    //If this if is true, we found a conflict
                    if(((reqStart <= eventStart) && (reqEnd >= eventStart)) || ((reqStart <= eventEnd) && (reqEnd  >= eventEnd))){
                        conflictFound = true;
                        console.log("conflict")
                    }
                }
            }

            //CHECK IF THERE IS AN APPROVED REQUEST FOR THIS USER DURING THIS EVENT TIME
            if( conflictFound ){
                let string = "This user has a reproved request to be absent on this day. Should you add this user to this event, a conflict will be created. Are you sure you want to add this user to this event?";
                if (window.confirm(string) === false) {
                    alert.innerHTML = "Cancelled";
                    unHideAlert();
                    document.getElementById(e.target.id).checked = false;
                    return;
                }
                else{
                    //CREATE THE CONFLICT
                    conflicts.push({
                        message: ("Conflict regarding event: " + event.name + " including: " + user.name + ", " + user.email),
                        email: user.email
                    })
          
                    //Makes an object with the event ID and the conflict array to send to the database
                    let conflictObj = {
                        eventId: event._id,
                        conflictArray: conflicts
                    }
          
                    //Data retrieved from database
                    await updateConflicts(conflictObj);
                    let notifObj = {
                        recipient: "Generic",
                        subject: "Conflict in Event!",
                        message: "Conflict created on Event: " + event.name + " regarding student: " + user.name + ", " + user.email + "!",
                        recipientType: "faculty"
                    }
        
                    //Data retrieved from database
                    await addGenericNotification(notifObj);
                    searchAllUsersAS();
                    searchAllUsersAI();
                    searchEditASTableALL();
                }
            }
            
            students.push(user);
        
            let eventObj = {
                eventId: eventId,
                attendingArray: students
            }
            let status = await updateAttendingStudents(eventObj);
            if(status.status === true){
                success.innerHTML = "Updated!";
                unHideSuccess();
            }
            else{
                alert.innerHTML = "Error Updating!";
                unHideAlert();
            }

            await addNotification(addNotifObj);
        }
        //Unchecking the box
        else{
            let newStudents = [];
            for(let i = 0; i < students.length; i++){
                if(students[i].email !== user.email){
                    newStudents.push(students[i]);
                }
            }
            
            let eventObj = {
                eventId: eventId,
                attendingArray: newStudents
            }

            let status = await updateAttendingStudents(eventObj);
            if(status.status === true){
                success.innerHTML = "Updated!";
                unHideSuccess();
            }
            else{
                alert.innerHTML = "Error Updating!";
                unHideAlert();
            }

            await addNotification(removeNotifObj);
        
            if(conflict === true){
                let newConflictArray = [];
                for(let i = 0; i < conflicts.length; i++){
                    if(conflicts[i].email !== user.email){
                        newConflictArray.push(conflicts[i]);
                    }
                }
                let eventConObj = {
                    eventId: eventId,
                    conflictArray: newConflictArray
                }
                //Data retrieved from database
                await updateConflicts(eventConObj);
                let conflictNotifObj = {
                    recipient: "General",
                    recipientType: "faculty",
                    subject: "Conflict Resolved",
                    message: "A conflict has been resolved in " + event.name + "."
                }
                await addGenericNotification(conflictNotifObj);
                searchAllUsersAS();
                searchEditASTableALL();
            }
        }
    }
    
    addInstructors = async (e) => {
        //Gets the id
        let index = e.target.id;
        let eventId = document.getElementById("editAIId").value;
        let userChecked = e.target.checked;
        let alert = document.getElementById("alertMSText");
        let success = document.getElementById("successMSText");
        let conflict = false;
        let conflictFound = false;
    
        let idObj = {
            id: eventId
        }
        let events = await findEventID(idObj);
        let event = events[0];
        let instructors = event.instructors;
        let conflicts = event.conflicts;
      
        //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
        if(!index.includes("attending")){
            return;
        }
        if(index.includes("Conflict")){
            index = index.replaceAll('Conflict', '');
            conflict = true;
        }
    
        unhideLoad();
    
        //Remove 'attending' from the id and leave just important information
        index = index.replaceAll('attending', '');
    
        //Gets user info from the element id and formats it
        let userArray = index.split("+");
        let user;
        if(userArray[2] === "null" && userArray[1] === "null"){
            user = {
                email: userArray[0],
                name: "No Name"
            }
        }
        else if(userArray[2] === "null"){
            user = {
                email: userArray[0],
                name: userArray[1]
            }
        }
        else if(userArray[1] === "null"){
            user = {
                email: userArray[0],
                name: userArray[2]
            }
        }
        else{
            user = {
                email: userArray[0],
                name: userArray[2] + ", " + userArray[1]
            }
        }

        let addNotifObj = {
            recipient: userArray[0],
            subject: "Added to event",
            message: "You have been added to event " + event.name + " as an Instructor."
        }

        let removeNotifObj = {
            recipient: userArray[0],
            subject: "Removed from event",
            message: "You have been removed from event " + event.name + " as an Instructor."
        }

        //Checking the box
        if(userChecked === true){

            let userObj = {
                email: user.email
            }

            let approvedReqs = await findApprovedE(userObj);

            if(approvedReqs.length > 0){
        
                let eventStart = event.startDate.split('T')[0];
                let eventEnd = event.endDate.split('T')[0];

                for(let i = 0; i < approvedReqs.length; i++){
                    let reqStart = approvedReqs[i].dateRequested.split('T')[0];
                    let reqEnd = approvedReqs[i].dateRequestedEnd.split('T')[0];

                    //If this if is true, we found a conflict
                    if(((reqStart <= eventStart) && (reqEnd >= eventStart)) || ((reqStart <= eventEnd) && (reqEnd  >= eventEnd))){
                        conflictFound = true;
                    }
                }
            }

            //CHECK IF THERE IS AN APPROVED REQUEST FOR THIS USER DURING THIS EVENT TIME
            if( conflictFound ){
                let string = "This user has a reproved request to be absent on this day. Should you add this user to this event, a conflict will be created. Are you sure you want to add this user to this event?";
                if (window.confirm(string) === false) {
                    alert.innerHTML = "Cancelled";
                    unHideAlert();
                    e.target.checked = false;
                    return;
                }
                else{
                    //CREATE THE CONFLICT
                    conflicts.push({
                        message: ("Conflict regarding event: " + event.name + " including: " + user.name + ", " + user.email),
                        email: user.email
                    })
      
                    //Makes an object with the event ID and the conflict array to send to the database
                    let conflictObj = {
                        eventId: event._id,
                        conflictArray: conflicts
                    }
      
                    //Data retrieved from database
                    await updateConflicts(conflictObj);
                    let notifObj = {
                        recipient: "Generic",
                        subject: "Conflict in Event!",
                        message: "Conflict created on Event: " + event.name + " regarding instructor: " + user.name + ", " + user.email + "!",
                        recipientType: "admin"
                    }

                    //Data retrieved from database
                    await addGenericNotification(notifObj);
                    searchAllUsersAI();
                    searchAllUsersAS();
                }
            }
        

            instructors.push(user);
        
            let eventObj = {
                eventId: eventId,
                attendingArray: instructors
            }

            let status = await updateAttendingInstructors(eventObj);
            if(status.status === true){
                success.innerHTML = "Updated!";
                unHideSuccess();
            }
            else{
                alert.innerHTML = "Error Updating!";
                unHideAlert();
            }

            //Data retrieved from database
            await addNotification(addNotifObj);
        }
        //Unchecking the box
        else{
            let newInstructors = [];
            for(let i = 0; i < instructors.length; i++){
                if(instructors[i].email !== user.email){
                    newInstructors.push(instructors[i]);
                }
            }
            
            let eventObj = {
                eventId: eventId,
                attendingArray: newInstructors
            }
            let status = await updateAttendingInstructors(eventObj);
            if(status.status === true){
                success.innerHTML = "Updated!";
                unHideSuccess();
            }
            else{
                alert.innerHTML = "Error Updating!";
                unHideAlert();
            }

            //Data retrieved from database
            await addNotification(removeNotifObj);
        
            if(conflict === true){
                let newConflictArray = [];
                for(let i = 0; i < conflicts.length; i++){
                    if(conflicts[i].email !== user.email){
                        newConflictArray.push(conflicts[i]);
                    }
                }
                let eventConObj = {
                    eventId: eventId,
                    conflictArray: newConflictArray
                }
                //Data retrieved from database
                await updateConflicts(eventConObj);
                let conflictNotifObj = {
                    recipient: "General",
                    recipientType: "admin",
                    subject: "Conflict Resolved",
                    message: "A conflict has been resolved in " + event.name + "."
                }
                await addGenericNotification(conflictNotifObj);
                searchAllUsersAI();
            }
        }
    }

    async generateTime(){
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        
        const currentDate = year + "-" + month + "-" + day;
        return currentDate;
    }
  
    
    render() {
        return (
            <div className="ci">
                <div id="schedulePage" className="nes">
                <h1 id="masterscheduleWords">Master Schedule Page</h1>
                <div id="buttons-master-schedule-5">
                        <center>
                            <Button className="button-28" onClick={toggleCreateEventsPage} id="Create-Events">Create Event</Button>
                            <Button className="button-28" id="Edit-Events" onClick={toggleEditEventsMenu}>Edit Event</Button>
                            <Link to="/"><Button className="button-28" id = "scheduleBacktohomeMasterBtn">Back to Home</Button></Link>
                            <Link to="/schedulePage"><Button className="button-28" id = "Master-Normal-Schedule">My Schedule</Button></Link>
                            <Link to="/searchSchedule"><Button className="button-28" id = "Master-Search-Schedule">Search Schedules</Button></Link>
                        </center>
                </div>
                <div style={styles.wrap}>

                    <div style={styles.left}>
                        <DayPilotNavigator
                            selectMode={"week"}
                            showMonths={months}
                            skipMonths={months}
                            startDate={this.generateTime().currentDate}
                            selectionDay={this.generateTime().currentDate}
                            onTimeRangeSelected={ args => {
                                this.calendar.update({
                                    startDate: args.day
                                });
                            }}
                        />
                    </div>
    
                    <div style={styles.main}>
                        <DayPilotCalendar
                            {...this.state}
                            ref={this.calendarRef}
                        />
                    </div>
                </div>
                </div>

                {/* CREATE EVENTS PAGE INITIALLY HIDDEN */}
                <div className="ci" id="createEventsPage" hidden>
                    <form onSubmit={this.createEvents} id='CreateEventsGrid'>
                        <center><h1 id="createEventH1">Create events</h1></center>
                        <div id = "CreateEventFormsGrid">
                        <center><label id ="CreateEventEventTitle">Event Title</label>
                        <Form.Control maxlength="50" required id="title" className="input" placeholder="Event Title"></Form.Control>

                        <label id ="CreateEventName">Event Name</label>
                        <Form.Control maxlength="50" required id="eventName" className="input" placeholder="Event Name"></Form.Control>

                        <label id ="CreateEventStartDate">Start Date</label>
                        <Form.Control required type = "date" id="startDate" className="input"></Form.Control>

                        <label id ="CreateEventEndDate">End Date</label>
                        <Form.Control required type = "date" id="endDate" className="input"></Form.Control>

                        <label id ="CreateEventStartTime">Start Time</label>
                        <Form.Control required type="time" id="st" className="input" placeholder="Starting Time"></Form.Control>

                        <label id ="CreateEventEndTime">End Time</label>
                        <Form.Control required type="time" id="et" className="input" placeholder="Ending Time"></Form.Control>
                        
                        <label id ="CreateEventDescription">Description</label>
                        <Form.Control maxlength="500" id="description" className="input" as="textarea" placeholder="description (not required)"></Form.Control>

                        <label id ="CreateEventFormSelect">Syllabus</label>
                        <Form.Select required id="eventSyllabus" className="form-select"></Form.Select>

                       <label id ="CreateEventEventType">Event Type</label>
                        <Form.Select required id="type" className ="List" aria-label="Default select example">
                            <option value="other">Type</option>
                            <option value="classroom_brief">Classroom Brief</option>
                            <option value="test">Test</option>
                            <option value="final">Final</option>
                            <option value="vault_brief">Vault Brief</option>
                        </Form.Select></center>
                        </div>
                        <div id = "CreateEventButtonsGrid">
                            <center><Button className="button-28" type="submit" id="AddEventBTN">Add event</Button>
                            <Button className="button-28" onClick={toggleCreateEventsPage} id="CreateEventBackBTN">Back</Button></center>
                        </div>
                    </form>
                </div>

                {/* EDIT EVENTS MENU INITIALLY HIDDEN */}
                <div id="editingEvents">
                    <div className="ci" id="editEventMenu" hidden>
                        <center><h1 id ="EditEventsWords">Edit Events Menu</h1></center>
                                    <center><Button className="button-28" onClick={toggleEditEventsPage} id="EditEventBTN">Edit Event</Button>
                                    <Button className="button-28" onClick={toggleDeleteEventsPage} id="EditDeleteBTN">Delete Event</Button></center>
                                    <center><Button className="button-28" onClick={toggleEditASEventsSearch} id="EditStudentsBTN">Edit Attendance</Button>
                                    <Button className="button-28" onClick={toggleEditEventsMenu} id="EditBackBTN">Back</Button></center>
                    </div>

                    {/* EDIT EVENTS PAGE INITIALLY HIDDEN */}
                    <div>
                        <div id="editEventsPage" hidden className="nes ci">
                            <center><h1 id="EditEventsSearchWords">Edit Events Search</h1></center>
                            <center>
                                <button className="button-28" onClick={searchEditTable} id="EditEventsSearch">Search</button>
                                <button className="button-28" onClick={searchEditTableAll} id="EditEventsSearchALL">Search All</button>
                                <Button className="button-28" onClick={toggleEditEventsPage} id="EditEventsSearchBack">Back</Button>
                            </center>
                            <center><label id="EventNameEditEvent">Event Name:</label></center>
                            <center>
                                <Form.Control required id="editEventName" className="input" placeholder="Search Event Name"></Form.Control>
                            </center>
                            <div id="MasteruserTableContainer">
                                <Table striped bordered hover onClick={editEventRedirect} className="eventListTable">      
                                    <thead id="editEventsTable">
                                    </thead>
                                </Table>
                            </div>
                        </div>
                        <div id="editEventsDiv" hidden>
                            <center>
                                <h1 id="editEventH1">Edit Event</h1>
                            </center>
                            
                            <form onSubmit={editEvent}>
                                <div id = "EditEventFormsGrid">
                                    <center>
                                        <Form.Control disabled hidden type = "date" id="editStartDateOld" className="input"></Form.Control>
                                        <Form.Control disabled hidden type = "date" id="editEndDateOld" className="input"></Form.Control>
                                        <Form.Control required id ="editId" className="input" disabled hidden></Form.Control>
                                        <label id ="EditEventEventTitle">Title</label>
                                        <Form.Control maxlength="50" required id="editTitle" className="input" placeholder="Title"></Form.Control>
                                        <label id ="EditEventName">Name</label>
                                        <Form.Control maxlength="50" required id="editName" className="input" placeholder="Event Name"></Form.Control>
                                        <label id ="EditEventStartDate">Start Date</label>
                                        <Form.Control required type = "date" id="editStartDate" className="input"></Form.Control>
                                        <label id ="EditEventEndDate">End Date</label>
                                        <Form.Control required type = "date" id="editEndDate" className="input"></Form.Control>
                                        <label id ="EditEventStartTime">Start Time</label>
                                        <Form.Control required type="time" id="editSt" className="input" placeholder="Starting Time"></Form.Control>
                                        <label id ="EditEventEndTime">End Time</label>
                                        <Form.Control required type="time" id="editEt" className="input" placeholder="Ending Time"></Form.Control>
                                        <label id ="EditEventDescription">Description</label>
                                        <Form.Control maxlength="500" id="editDescription" as="textarea" className="input" placeholder="description (not required)"></Form.Control>
                                        <label id="EditEventFormSelect">Syllabus</label>
                                        <Form.Select required id="editEventSyllabus" className="form-select"></Form.Select>
                                    
                                        <label id ="EditEventEventType">Type</label>
                                        <Form.Select required id="editType" aria-label="Default select example">
                                            <option value="other">Other</option>
                                            <option value="classroom_brief">Classroom Brief</option>
                                            <option value="test">Test</option>
                                            <option value="final">Final</option>
                                            <option value="vault_brief">Vault Brief</option>
                                        </Form.Select>
                                        <div id = "CreateEventButtonsGrid">
                                            <center>
                                                <Button className="button-28" type="submit" id ="EditEventBtn1">Edit event</Button>
                                                <Button className="button-28" onClick={toggleEditEventsDiv}id="EditEventBackBtn">Back</Button>
                                            </center>
                                        </div>
                                    </center>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* EDIT ATTENDING STUDENTS PAGE INITIALLY HIDDEN */}
                    <div>
                        <div id="editASEventsSearch" hidden className="nes ci">
                            <center><h1 id ="editASEventsSearchH1">Events Search</h1></center>
                            <center>
                                <button className="button-28" id="EditEventsSearch" onClick={searchEditASTable}>Search</button>
                                <button className="button-28" id="EditEventsSearchALL" onClick={searchEditASTableALL}>Search All</button>
                                <Button className="button-28" onClick={toggleEditASEventsSearch} id="EditEventsSearchBack">Back</Button>
                            </center>
                            <center><label id="EditASEventsWords">Event Name:</label></center>
                            <center>
                                <Form.Control required id="editASEventName" className="input" placeholder="Search Event Name"></Form.Control>
                            </center>
                            <div id="MasteruserTableContainer">
                            <Table striped bordered hover onClick={editASEventRedirect} className="eventListTable">      
                                <thead id="editEventsASTable">
                                </thead>
                            </Table>
                            </div>
                        </div>

                        <div className="nes ci" id="editAttendingStudentsPage" hidden>
                            <center><h1 id="editASH1"> </h1></center>
                            <center><h1 id="editASSearchH1">Edit Attendance</h1></center>

                            <center className="container">
                                <div className="tabs">
                                    <input onChange={nothing} className="radio-1" type="radio" id="radio-1" name="tabs" checked/>
                                    <label id="blue1"  className="tab" htmlFor="radio-1">Students</label>
                                    <input className="radio-2" onClick={toggleEditAttendingInstructorsPage} type="radio" id="radio-2" name="tabs"/>
                                    <label className="tab" htmlFor="radio-2">Faculty</label>
                                    <span className="glider"></span>
                                </div>
                            </center>

                            <center><h2 id="editASH2"> </h2></center>
                            <Form.Control hidden required id="editASId" disabled className="input"></Form.Control>
                            <center><Form.Control required id="searchStudentAdd" className="input" placeholder="Search Student"></Form.Control></center>
                            <center id="editattendingbuttonsbox"><Button onClick={searchAllUsersAS} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents1">All</Button>
                            <Button onClick={this.searchFirstNameAS} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents2">First Name</Button>
                            <Button onClick={this.searchLastNameAS} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents3">Last Name</Button>
                            <Button onClick={this.searchEmailAS} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents4">Email</Button>
                            <Button onClick={this.searchCPAS} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents5">Crew Position</Button>
                            <Button onClick={this.searchSyllabusAS} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents6">Syllabus</Button></center>
                            <center><Button onClick={toggleEditAttendingStudentsPage} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents7">Back</Button></center>
                            
                            <div id="MasteruserTableContainer1">
                                <Table striped bordered hover onClick={this.addStudents}>      
                                    <thead id="studentSearchTable">
                                    </thead>
                                </Table>
                            </div>
                        </div>
                    </div>

                    {/* EDIT ATTENDING INSTRUCTORS PAGE INITIALLY HIDDEN */}
                    <div>
                        <div className="nes ci" id="editAttendingInstructorsPage" hidden>
                            <center><h1 id="editAIH1"> </h1></center>
                            <center><h1 id="EditEventsAIH1">Edit Attendance</h1></center>

                            <center className="container">
                                <div className="tabs">
                                    <input className="radio-1" onClick={toggleEditAttendingStudentsPage} type="radio" id="radio-3" name="tabs2" />
                                    <label className="tab" htmlFor="radio-3">Students</label>
                                    <input onChange={nothing} className="radio-2" type="radio" id="radio-4" name="tabs2" checked/>
                                    <label id="blue2" className="tab" htmlFor="radio-4">Faculty</label>
                                    <span className="glider2"></span>
                                </div>
                            </center>

                            <center><h2 id="editAIH2"> </h2></center>
                            <Form.Control hidden required id="editAIId" disabled className="input"></Form.Control>
                            <center><Form.Control required id="searchInstructorAdd" className="input" placeholder="Search Instructor"></Form.Control></center>
                            <center id="editattendingbuttonsbox">
                                <Button onClick={searchAllUsersAI} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents1">All</Button>
                                <Button onClick={this.searchFirstNameAI} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents2">First Name</Button>
                                <Button onClick={this.searchLastNameAI} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents3">Last Name</Button>
                                <Button onClick={this.searchEmailAI} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents4">Email</Button>
                                <Button onClick={this.searchCPAI} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents5">Crew Position</Button>
                                <Button onClick={this.searchSyllabusAI} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents6">Syllabus</Button>
                            </center>
                            <center><Button onClick={toggleEditAttendingInstructorsPageBack} className="editAttendingStudentsBtn button-28" id="BtnBorderAttStudents7">Back</Button></center>

                            <div id="MasteruserTableContainer1">
                                <Table striped bordered hover onClick={this.addInstructors}>      
                                    <thead id="instructorSearchTable">
                                    </thead>
                                </Table>
                            </div>
                        </div>
                    </div>

                    {/* DELETE EVENTS PAGE INITIALLY HIDDEN */}

                    <div id="deleteEventsPage" hidden className="nes ci">
                        <center><h1 id="deleteEventsH1">Delete Events</h1></center>
                        <center>
                            <button onClick={deleteAllEvents} className="button-28 redBtn" id="deleteAllEventsBtn">Delete ALL Events</button>
                            <button className="button-28" id="EditEventsSearch" onClick={searchDeleteTable}>Search</button>
                            <button className="button-28" id="EditEventsSearchALL" onClick={searchDeleteTableAll}>Search All</button>
                            <Button className="button-28" onClick={toggleDeleteEventsPage} id="EditEventsSearchBack">Back</Button>
                        </center>
                        <center><label id="deleteEventsWords">Event Name:</label></center>
                        <center><Form.Control required id="delEventName" className="input" placeholder="Search Event Name"></Form.Control></center>
                        <div id="MasteruserTableContainer">
                            <Table striped bordered hover onClick={deleteEvents} className="eventListTable">      
                              <thead id="deleteEventsTable">
                              </thead>
                            </Table>
                        </div>
                    </div>
                </div>

                <div onClick={hideAlert} className="alertMS" id="alertMS" hidden>
                    <span className="closebtnMS" onClick={hideAlert}>x</span> 
                    <strong className="aostrong">Error:</strong><span> </span><span id="alertMSText">Error</span>
                </div>
                <div onClick={hideSuccess} className="successMS" id="successMS" hidden>
                    <span className="closebtnMS" onClick={hideSuccess}>x</span> 
                    <strong className="aostrong">Success:</strong><span> </span><span id="successMSText"></span>
                </div>
                <div className="loadMS" id="loadMS" hidden>
                    <span className="aostrong">Loading . . .</span>
                </div>
            </div>
        );
    }
}

export default CalendarMaster;







