import React, { Component }from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import {Modal} from '@daypilot/modal';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import { findInstructorsEvents, findStudentsEvents } from '../features/RequestEventData';
import { getUserData } from '../features/ResquestUserData';

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


let once = false;

async function generatePage(){
    let user = await getUserData();
    let userType = user.userType;

    let viewAllBtn = document.getElementById("View-All-Schedules");
    let searchScheduleBtn = document.getElementById("Search-Schedule");

    if(userType === "admin" || userType === "faculty"){
        viewAllBtn.removeAttribute("hidden"); 
        searchScheduleBtn.removeAttribute("hidden"); 
    }
    
    if(once === true){
        return;
    }
    once = true;
}

async function generateEvents(){
    let userData = await getUserData();

    let emailObj = {
        email: userData.email
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

    return PageEvents;
}



class Calendar extends Component {
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
                const data = {
                };

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
            <div className="nes ci">
                <h1 id="scheduleWords">My Schedule Page</h1>
                <div id="buttons-schedule-5">
                        <center>
                            <Link to="/masterSchedule"><Button className="button-28" id="View-All-Schedules" hidden>Master Schedule</Button></Link>
                            <Link to="/"><Button className="button-28" id="scheduleBacktohomeBtn">Back to Home</Button></Link>
                            <Link to="/searchSchedule"><Button className="button-28" id="Search-Schedule" hidden>Search Schedules</Button></Link>
                        </center>
                </div>
                <div style={styles.wrap} id="schedulePage1">
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
        );
    }
}

export default Calendar;

