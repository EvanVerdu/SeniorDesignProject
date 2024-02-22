//You have to import react component in every component
import React, { Component }from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
//This import lets us link to other urls in the project!
import { Link } from 'react-router-dom';
import { findAllUsers, findUserCP, findUserE, findUserFN, findUserLN, findUserS, findUserUT, getUserData } from '../features/ResquestUserData';
import { Button } from 'react-bootstrap';
import { Form, Table } from 'react-bootstrap';
import { findInstructorsEvents, findStudentsEvents } from '../features/RequestEventData';

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


async function generatePage(){
    let data = await getUserData();
    if(data.userType === "student"){
        return;
    }
    allUsersTable();

    //Otherwise do the rest of the schedule stuff
}
//Generates table to show only students
async function studentTable(){
    //Manupulating the header
    let header = document.getElementById("userTableH1");
    header.innerHTML = "Students";

    //Find all user data and filter out students
    let userData = await findAllUsers();
    let students = [];
    for(let i = 0; i < userData.length; i++){
        if(userData[i].userType === "student"){
            students.push(userData[i]);
        }
    }
    //Fill user table with only students
    userTableFill(students);
}
function userTableFill(data) {
    let userTable = document.getElementById("userTable");

    //Clears the table before generating new rows
    while (userTable.firstChild) {
        userTable.removeChild(userTable.firstChild);
    }

    //Creates a row saying "No users found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No users found!";
        document.getElementById("userTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th>Name</th><th>Crew Position</th><th>Syllabus</th><th>Email</th><th>Permissions</th><th>Button</th></tr>";
     //Creates a new element "table row"
     let trH = document.createElement("tr");
     //Sets that element's innerHTML to the string we created
     trH.innerHTML = stringH;
     //Appends the new row to the bottom of the table
     document.getElementById("userTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){

        //Grabs the single bit of data
        let user = data[i];

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
        string += "<td><Button class='button-28 bb' id = 'search" + user.email + "'>Search</Button></td>";

        //Creates a new element "table row"
        let tr = document.createElement("tr");

        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string;
        //Appends the new row to the bottom of the table
        document.getElementById("userTable").appendChild(tr);
    }
}

function toggleSearchScheduleScreen(){
    //Grabbing DOM elements
    let searchSchedulePageDiv = document.getElementById("searchSchedulePageDiv");
    let searchScheduleSearch = document.getElementById("searchScheduleSearch");

    //If the change name screen was hidden before, unhide it
    if(searchSchedulePageDiv.getAttribute("hidden") !== null){
        searchSchedulePageDiv.removeAttribute("hidden"); 
        searchScheduleSearch.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        searchScheduleSearch.removeAttribute("hidden"); 
        searchSchedulePageDiv.setAttribute("hidden", true);
    }
}

//Takes a string and capitalizes its first letter
function firstLetterCapital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Generates table to show only faculty
async function facultyTable(){
    //Manupulating the header
    let header = document.getElementById("userTableH1");
    header.innerHTML = "Faculty";

    //Find all user data and filter out faculty
    let userData = await findAllUsers();
    let faculty = [];
    for(let i = 0; i < userData.length; i++){
        if(userData[i].userType === "faculty"){
            faculty.push(userData[i]);
        }
    }
    //Fill user table with only faculty
    userTableFill(faculty);
}

//Generates table to show only admins
async function adminTable(){
    //Manupulating the header
    let header = document.getElementById("userTableH1");
    header.innerHTML = "Admin";

    //Find all user data and filter out admin
    let userData = await findAllUsers();
    let admin = [];
    for(let i = 0; i < userData.length; i++){
        if(userData[i].userType === "admin"){
            admin.push(userData[i]);
        }
    }
    //Fill user table with only admins
    userTableFill(admin);
}

//Generates table to show all users of the system
async function allUsersTable(){
    //Manipulate the header
    let header = document.getElementById("userTableH1");
    header.innerHTML = "All Users";

    //Fill the table with all users of the system
    let userData = await findAllUsers();
    userTableFill(userData);
}

//Toggles the search box in the search user part of the user settings
function toggleSearchBox(){
    let searchBox = document.getElementById("searchBox");
    let tableHeader = document.getElementById("userTableH1");
    let button = document.getElementById("searchSpecificUsersBtn");
    let table = document.getElementById("MasteruserTableContainer2");

    //If the search box is hidden, unhide it
    if(searchBox.getAttribute("hidden") !== null){
        searchBox.removeAttribute("hidden");
        button.innerText = "Close";
        tableHeader.innerHTML = "Search Schedule by User";
        if(window.innerHeight < 1250 && window.innerWidth >= 2350){
            table.style.maxHeight = "25%";
            table.style.marginTop = "2%";
        }
        if(window.innerHeight > 1250 && window.innerWidth >= 2350){
            table.style.maxHeight = "30%";
            table.style.marginTop = "3%";
        }
    }
    //Otherwise hide it
    else{
        searchBox.setAttribute("hidden", true);
        button.innerText = "Search Specific User";
        tableHeader.innerHTML = "Users"; 
        if(window.innerHeight < 1250 && window.innerWidth >= 2350){
            table.style.maxHeight = "40%";
            table.style.marginTop = "7%";
        }
        if(window.innerHeight > 1250  && window.innerWidth >= 2350){
            table.style.maxHeight = "40%";
            table.style.marginTop = "7%";
        }
    }
}

export default class SearchSchedulePage extends Component {

    //Searches for user by email
    searchEmail = async (e)=>{
        //Grabs dom input
        let field = document.getElementById("searchUserInput").value.toLowerCase();

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
    //Searches for user by first name
    searchFirstName = async (e)=>{
        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase();

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

    //Searches for user by last name
    searchLastName = async (e)=>{
        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase();

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
    
    //Searches for user by crew position
    searchCP = async (e)=>{
        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase();

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
    
    //Searches for user by syllabus
    searchS = async (e)=>{
        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase();

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
    
    //Searches for user by user type
    searchUT = async (e)=>{
        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase();

        //Object for sending to the DB
        let userTypeObj = {
            userType: field
        }

        //Data retrieved from database
        let data = await findUserUT(userTypeObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }

    constructor(props) {
        super(props);
        this.calendarRef = React.createRef();
        this.state = {
    
            viewType: "Week",
            durationBarVisible: false,
            eventDeleteHandling: "disabled",
            eventMoveHandling: "disabled",
            headerDateFormat: "dd",

            onBeforeEventRender: function(args) {
                args.data.deleteDisabled = true;
            },
    
            onEventClick: async args => { /* When clicking on an event this happens*/
                const dp = this.calendar;   
    
                console.log(args);
                
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

    async componentDidMount(e) {     
        generatePage();

        const events = e;

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
    
        const currentDate = year + "-" + month + "-" + day;

        this.calendar.update({currentDate, events});
    }

    getSchedule = async (e) => {
        let index = e.target.id;

        //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
        if(!index.includes("search")){
            return;
        }
        //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
        index = index.replaceAll('search', '');

        let emailObj = {
            email: index
        }
        
        let events = [];
    
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
            object.id = i;
      
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
    
        this.componentDidMount(PageEvents);
        toggleSearchScheduleScreen();
    }

    async generateTime(){
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        
        const currentDate = year + "-" + month + "-" + day;
        return currentDate;
    }

    //Render and return are more of just the react component formatting
    render() {
        return(
            <div>
                <center>
                <div id="searchScheduleSearch" className="nes1 ci" >
                    <h1 id="searchUserH1">Schedule User Search</h1>
                    <div id="buttons-search-schedule-5">
                        <center>
                        <Link to="/schedulePage"><Button className="button-28" id="SearchSchedulesMySchedule">My Schedule</Button></Link>
                        <Link to="/"><Button className="button-28" id="SearchScheduleBackHome">Back to Home</Button></Link>
                        <Link to="/masterSchedule"><Button className="button-28" id="SearchSchedulesMasterSchedule">Master Schedule</Button></Link>
                        </center>
                    </div>
                    <center>
                        <h1 id="userTableH1">Search for users</h1>
                        <Button className="button-28" onClick={studentTable} id="Search-Students-Filter">Students</Button>
                        <Button className="button-28" onClick={facultyTable} id="Search-Faculty-Filter">Faculty</Button>
                        <Button className="button-28" onClick={adminTable} id="Search-Admins-Filter">Admins</Button>
                        <Button className="button-28" onClick={allUsersTable} id="Search-AllUsers-Filter">All Users</Button>
                        <Button className="button-28" id = "searchSpecificUsersBtn" onClick={toggleSearchBox}>Search Specific Users</Button>
                        <br />

                        <div id="searchBox" hidden>
                            <br />
                            <form>
                                <Form.Control type="input" id="searchUserInput" className="input" onChange={this.forceLowercase} placeholder="Type Input Here!"></Form.Control>
                                <Button className="btn btn-info button-28" onClick={this.searchEmail} id="UserSpecificFilter">Search by email</Button>
                                <Button className="btn btn-info button-28" onClick={this.searchFirstName} id="UserSpecificFilter">Search by first name</Button>
                                <Button className="btn btn-info button-28" onClick={this.searchLastName} id="UserSpecificFilter">Search by last name</Button>
                                <Button className="btn btn-info button-28" onClick={this.searchCP} id="UserSpecificFilter">Search by crew position</Button>
                                <Button className="btn btn-info button-28" onClick={this.searchS} id="UserSpecificFilter">Search by syllabus</Button>
                                <Button className="btn btn-info button-28" onClick={this.searchUT} id="UserSpecificFilter">Search by Permissons</Button>
                            </form>
                            <br />
                        </div>
                    </center>
                    <div id="MasteruserTableContainer2">
                        <Table striped bordered hover onClick={this.getSchedule}>      
                            <thead id="userTable">
                            </thead>
                        </Table>       
                    </div>            
                </div>
                </center>
                
                
                <div className="nes ci" hidden id="searchSchedulePageDiv">
                        <h1 id="scheduleWords2">Search Individual Schedule Page</h1>
                        <div id ="buttons-search-schedule-5-2">
                            <center><Link to="/"><Button className="button-28" id="searchscheduleBacktohomeMasterBtn">Back to Home</Button></Link>
                            <Button className="button-28" onClick={toggleSearchScheduleScreen}id="SearchIndividualScheduleBack">Back</Button></center>
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
            </div>         
        )
    }
}
