import React, { Component }from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getUserData } from '../features/ResquestUserData';
import {findInstructorsEvents, findStudentsEvents, updateConflicts, findConflictsByUser, clearConflicts } from '../features/RequestEventData';
import { addGenericNotification, addNotification } from '../features/RequestNotificationData';
import Table from 'react-bootstrap/Table';
import {addRequest,approveRequest,pullAllPendingRequests,pullAllProcessedRequests, deleteRequest, deleteAllRequests, denyRequest, findPendingE, pullStudentProcessedRequests, findProcessedE, pullStudentPendingRequests, getRequestData, pullFacultyPendingRequests, pullFacultyProcessedRequests} from '../features/RequestManager';
import CardRequest from './cardRequest';
import CardRequestP from './cardRequestProcessed';
import Alert from 'react-bootstrap/Alert';

async function hideAlert(){
    let alert = document.getElementById("alertAO");
    if(alert.getAttribute("hidden") !== null){
        //console.log(" unnecessary hide")
    }
    else{
        alert.setAttribute("hidden", true);
    }
}


async function hideSuccess(){
    let alert = document.getElementById("successAO");
    if(alert.getAttribute("hidden") !== null){
        //console.log(" unnecessary hide")
    }
    else{
        alert.setAttribute("hidden", true);
    }
}

async function unHideAlert(){
    let alert = document.getElementById("alertAO");
    let alert2 = document.getElementById("successAO");
    let load = document.getElementById("loadAO");
    
    if(alert.getAttribute("hidden") !== null){
        alert.removeAttribute("hidden"); 
        alert2.setAttribute("hidden", true);
        load.setAttribute("hidden", true);
    }
}

async function unHideSuccess(){
    let alert = document.getElementById("successAO");
    let alert2 = document.getElementById("alertAO");
    let load = document.getElementById("loadAO");
    if(alert.getAttribute("hidden") !== null){
        alert.removeAttribute("hidden"); 
        alert2.setAttribute("hidden", true);
        load.setAttribute("hidden", true);
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

let white = true;

async function fbcu(deletingRequest, email){
    //put the email of the requesting user in the database call

    let emailobj = {
        email: email
    }
    let list = await findConflictsByUser(emailobj);
    list = list.conflictedEvents;
    //console.log(list);
    for(let i = 0; i < list.length; i++){
        let eventStart = list[i].startDate.split('T')[0];
        let eventEnd = list[i].endDate.split('T')[0];
        //console.log(eventStart)
        //console.log(eventEnd)
        let reqStart = deletingRequest.dateRequested.split('T')[0];
        //console.log(reqStart)
        let reqEnd = deletingRequest.dateRequestedEnd.split('T')[0];

        //If this if is true, we found a conflict, and need to remove it.
        if(((reqStart <= eventStart) && (reqEnd >= eventStart)) || ((reqStart <= eventEnd) && (reqEnd  >= eventEnd))){
            
            //console.log("conflict")

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
            
           //console.log(newConflictArray)
        }
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


function formatName(name) {
    if(!name){
        return;
    }
    // Check if the name contains a comma
    if (name.includes(',')) {
      // Split the name into last name and first name
      const names = name.split(', ');
  
      // Capitalize the first letter of each name
      let formattedLastName = names[0].charAt(0).toUpperCase() + names[0].slice(1);
      let formattedFirstName = names[1].charAt(0).toUpperCase() + names[1].slice(1);
  
      if(formattedLastName.slice(-1) === " "){
        formattedLastName = formattedLastName.slice(0, -1);
      }
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

async function toggleUserFunctionality(){
    let userData = await getUserData();
    let userType = userData.userType;

    let myRequests = document.getElementById("personalTables");
    let studentRequests = document.getElementById("facultyTables");
    let adminRequests = document.getElementById("adminTables");

    if( userType === "student" || userType === "faculty" )
        myRequests.removeAttribute("hidden"); 
    if( userType === "faculty" )
        studentRequests.removeAttribute("hidden"); 
    if(  userType === "admin" )
        adminRequests.removeAttribute("hidden"); 
}

const compareDates = (d1, d2) => {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();
  
    if (date1 < date2) {
        //console.log(`${d1} is less than ${d2}`);
        return 1;
    } else if (date1 > date2) {
        //console.log(`${d1} is greater than ${d2}`);
        return -1;
    } else {
        //console.log(`Both dates are equal`);
        return 0; 
    }
  };


class RequestsPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            requestId:'',
            rowIndex: -1,
            currentUser: '',
            currentType:'',

            currentRequests:[],
            currentPageArr:[],
            currentPageNo:1,
            maxPageNo:1,
            numRequestPerPage:10,
            editable:false,

            requestsPendingP:[],
            requestsProcessedP:[],
            requestsPendingS:[],
            requestsProcessedS:[],
            requestsPendingF:[],
            requestsProcessedF:[],
        }
    }


    dateStringifier = (e) =>{
        let date = new Date(e);
        return date.toString().substring(0,15);
    }

    swapSingleMultiRequest = ()=>{
        let header = document.getElementById("MakeARequestH1");
        if(header.textContent.toLowerCase() == "single day request"){
            header.innerHTML = "Multiple Day Request";
        }
        else{
            header.innerHTML = "Single Day Request";
        }
        let multiEnd = document.getElementById('requestDateEnd');
        //let buttonMulti = document.getElementById('MultipleDayRequestToggle');
        let buttonSingle =document.getElementById('RequestToSingleToggle');
        let labelEnd = document.getElementById("ReasonlabelEndDate");
        this.switchScreens('MultipleDayRequestToggle','RequestToSingleToggle')
        if(buttonSingle.getAttribute("hidden") !== null){
            
            multiEnd.removeAttribute("hidden");
            labelEnd.removeAttribute("hidden");   
            multiEnd.setAttribute("required", true); 
        }
        //otherwise, hide everything and show the general page
        else{
            labelEnd.setAttribute("hidden", true);
            multiEnd.setAttribute("hidden", true);
            multiEnd.removeAttribute("required");
        }

    }

    addRequestMultiple = async(e) =>{
        e.preventDefault();
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        let error = document.getElementById("requestMultErr");
        let userData = await getUserData();
        let email = userData.email;
        let userType = userData.userType;
        let name = userData.lastName +" , " +userData.firstName;
        let dateRequested  = new Date(document.getElementById("requestDate").value);
        let dateRequestedConverted = new Date (dateRequested.getTime()+ Math.abs(dateRequested.getTimezoneOffset()*60000) )  
        let dateRequestedEnd  = new Date(document.getElementById("requestDateEnd").value);
        let dateRequestedEndConverted = new Date (dateRequestedEnd.getTime()+ Math.abs(dateRequestedEnd.getTimezoneOffset()*60000) )  
        let descriptionRequest = (document.getElementById("descriptionRequest").value);

        let emailC = { email: userData.email}
        let pendingData = await findPendingE(emailC); 
        if(pendingData.length>=2)
        {
            error.innerHTML = "You may only have 2 pending requests at once!"
            return;  
        }
        if(descriptionRequest.length >149)
        {
            error.innerHTML = "Your request needs a shorter description! (150 char max)"
            return;  
        }

        let currentDate = new Date().toJSON().slice(0, 10);
        if (document.getElementById("RequestToSingleToggle").getAttribute("hidden") ===null)//if its a single day request
        {
            if((compareDates(currentDate, dateRequested) < 0))
            {
                error.innerHTML = "Please pick a valid date after today!"
                return;  
            }
        }
        else
        {
            if (compareDates(dateRequested, dateRequestedEnd)<0){
                error.innerHTML = "Please pick a start date before the end date."
                return;  
            }
            else if((compareDates(currentDate, dateRequested) <= 0)||(compareDates(currentDate, dateRequestedEnd) <=0)){
                error.innerHTML = "Please pick a valid date after today."
                return;  
            }
            else if((compareDates(dateRequested, dateRequestedEnd) === 0)){
                error.innerHTML = "Please use the 'single day Request' Option if you want one day."
                return;  
            }
        }
    


        let request = {
            requestingUser:     email,
            userType:           userType,
            name:               name,
            dateRequested:      dateRequestedConverted,
            dateRequestedEnd:   (document.getElementById("RequestToSingleToggle").getAttribute("hidden") ===null)?dateRequestedConverted:dateRequestedEndConverted,
            description:        descriptionRequest
        }

        await addRequest(request);
        //console.log("req:")
        //console.log(req)
        error.innerHTML = "Request made!";
        this.fillTableNoButtons("myPendingRequests",1)
        this.populateRequests();

        document.getElementById("requestDate").value = "";  
        document.getElementById("requestDateEnd").value = '';

        document.getElementById("descriptionRequest").value ='N/A';
        

        this.switchScreens('requestScreen','requestPageBox');

        if (userType === "student"){
            let notificationF ={
                recipient: "generic",
                subject: "New request made",
                message: (document.getElementById("RequestToSingleToggle").getAttribute("hidden") ===null)?"Student "+email+" has made a single day request for processing.":"Student "+email+" has made a multiple day request for processing.",
                recipientType: "faculty"
            }

            addGenericNotification(notificationF);
        }
        else {
            let notificationA ={
                recipient: "generic",
                subject: "New request made",
                message: (document.getElementById("RequestToSingleToggle").getAttribute("hidden") ===null)?"User "+email+" has made a single day request for processing.":"User "+email+" has made a multiple day request for processing.",
                recipientType: "admin"
            }
            addGenericNotification(notificationA);
        }

        header2.innerHTML = "Request Created!";
        unHideSuccess();
        
    }
    deleteRequestsCards = async(e)=>{
        let index  = e.target.id;
        let button = e.target.id;
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        //console.log(button);
        if((!index.includes("delBtn"))){
            return;
        }
        let reason;
        let userData = await getUserData();
        index = index.replaceAll('delBtn', '');
        let idObj = {
            id: index,
        }
        //delete request
        await deleteRequest(idObj);
        header2.innerHTML = "Request Deleted!";
        unHideSuccess();
        //card deletion
        let currentR = this.state.currentRequests;
        var ind = currentR.findIndex(obj => obj._id===index);
        //console.log(ind);
        //console.log(this.state.currentRequests)
        let processedRequest = currentR.splice(ind,1);  
        //console.log(processedRequest)

        if(this.state.currentRequests.length ===0) //if that was the last request in the page
        {
            //console.log("ALL REQUESTS PROCESSED")
            this.setState({
                maxPageNo:1,
                currentPageNo:1,
                currentPageArr:[],
            })
        }
        else{
            let maxPage = (Math.ceil(currentR.length/this.state.numRequestPerPage));
            //console.log( "this.maxpageno    "+this.state.maxPageNo +"    this current pageno:   "+ this.state.currentPageNo+"   currentlength:"+currentR.length%this.state.numRequestPerPage)
            if (this.state.maxPageNo === this.state.currentPageNo && currentR.length%this.state.numRequestPerPage ===0) // ig you are on the last request of the last page (page 2, request 1 ect)
            {
            
                this.setState({ maxPageNo: maxPage,
                    currentPageNo: this.state.currentPageNo-1,
                    currentPageArr:this.state.currentRequests.slice(((maxPage-1)*this.state.numRequestPerPage),((this.state.currentRequests.length)))
                })
                rigBtn.setAttribute("disabled", true)
                if(this.state.currentPageNo-1 ===1)
                    leftBtn.setAttribute("disabled", true)
                else
                    leftBtn.removeAttribute("disabled");


            }
            else
            {
                //console.log(this.state.currentRequests)
                //console.log(this.state.currentRequests.length%this.state.numRequestPerPage)
                this.setState({
                    maxPageNo: maxPage,
                    currentPageArr: (this.state.currentRequests.length %this.state.numRequestPerPage !==0)? this.state.currentRequests.slice((this.state.currentPageNo-1)*this.state.numRequestPerPage,((this.state.currentPageNo-1)*this.state.numRequestPerPage)+this.state.numRequestPerPage):this.state.currentRequests.slice((this.state.currentPageNo-1)*this.state.numRequestPerPage,this.state.currentRequests.length)
                })
            }

        //fix right/left arrow buttons
        if(maxPage===this.state.currentPageNo)
            rigBtn.setAttribute("disabled", true) 
        }
        //list consistancy
        //find the table to delete from
        let deletedTable;
        if((document.getElementById("btn-personal-pendS").getAttribute("hidden")===null) ||(document.getElementById("btn-personal-pendF").getAttribute("hidden")===null))
        {
            //console.log("IN  PERSONAL")
            deletedTable ="myPendingRequests"
        }
        else if(document.getElementById("btn-student-procF").getAttribute("hidden")===null)
        {
            //console.log("IN student processed F")
            deletedTable ="studentsProcessedRequests"
        }
        else if((document.getElementById("btn-student-procA").getAttribute("hidden")===null)||(document.getElementById("btn-faculty-procA").getAttribute("hidden")===null))
        {
            //console.log("IN all proc table A")
            deletedTable ="allProcessedRequests"
        }
        else{
            //console.log("error")
            header.innerHTML = "Error with locating list. Please refresh the page.";
            unHideAlert();
            return;
        }
        //find the index of the row to delete from the table
        const table = document.getElementById(deletedTable), // get the table
        rows = Array.from(table.rows), // get the <tr> elements inside it and convert it to an array
        cells = rows.map(row => Array.from(row.cells).map(cell => cell.innerHTML)); //make array called cells for table
    
    var indList = 1;
    //if its a pending table, the buttons location is at index 4, otherwise its at index 8
    let column = (deletedTable ==="myPendingRequests")?4:8
    for(let i = 1; i<cells.length; i++)
    {
        //console.log(cells[i][column].includes(index))
        if(cells[i][column].includes(index))
        {
            indList = i;
            break;
        }
    }
    
    //console.log("INDEX OF THE LIST NEEDED TO REMOVE    "+indList);

    table.deleteRow(indList);//delete relevant row
    if(cells.length === 2){
        table.deleteRow(0);
        let tr = document.createElement("tr");
        tr.innerHTML = "<center><h3>No Requests Found!</h3></center>";
        table.appendChild(tr);
    }
    //delete conflicts
    if (deletedTable !=='myPendingRequests')
    {
        let req = {  
        dateRequested: processedRequest[0].dateRequested,
        dateRequestedEnd: processedRequest[0].dateRequestedEnd
        }
    let email = processedRequest[0].requestingUser;
    //console.log(req);
    //console.log("email in cards:   "+email);
    await fbcu(req, email);
    }




    }
    deleteAllRequestConfirm =async(e)=>{
        e.preventDefault();
        let userData = await getUserData();

        let inputPass =  document.getElementById('passwordDeleteAll').value;
        //console.log(inputPass)
        if(userData.password === inputPass)
            {
                console.log('Bye bye!')
                await deleteAllRequests();
                await clearAllConflicts()
                window.location.reload();
            }
        else if(inputPass==='')
        {
            document.getElementById('deleteAllErrorMsg').innerHTML = 'Please enter your password.';
        }
        else
        {
            document.getElementById('deleteAllErrorMsg').innerHTML = 'Incorrect Password';
        }
    }

    processRequestsCards = async(e)=>{  //FUNCTION PASSED DOWN TO CARDS FOR PROCESSING
        let index  = e.target.id;
        let button = e.target.id;
        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        //console.log(button);
        if((!index.includes("acceptRequest"))&&(!index.includes("denyRequest"))&&(!index.includes("delBtn"))){
            return;
        }
        let reason;
        let userData = await getUserData();

        if(index.includes("acceptRequest"))
        {
            index = index.replaceAll('acceptRequest', '');
            reason = document.getElementById("reasonA"+index).value;
            //console.log(reason)
        }
        else if(index.includes("denyRequest"))
        {
            index = index.replaceAll('denyRequest', '');
            reason = document.getElementById("reasonD"+index).value;
            //console.log(reason)
        }
        let req = {approvingUser: userData.userType,
            reason: reason,
            id: index,
        }
        //STEP 1: PROCESS THE REQUEST
        
        if(button.includes("acceptRequest"))
        {
            await approveRequest(req);
            let requestData = await getRequestData(req);
            let recipient = requestData.requestingUser;
            let startDate = requestData.dateRequested.slice(0,10);
            let endDate = requestData.dateRequestedEnd.slice(0,10); 
            let messageT = "";

            if (startDate === endDate)
                messageT = "Your request for time off on "+ startDate+ " has been approved.";
            else
                messageT = "Your request for time off between "+ startDate+ " and "+endDate +" has been approved.";

            let notificationA = {
                recipient:  recipient,
                subject:    "Request: Approved",
                message:    messageT
            }
            addNotification(notificationA);

            //conflict resolution
            await this.requestConflicts(e,requestData);
        }
        else if (button.includes("denyRequest"))
        {
            await denyRequest(req);

            let requestData = await getRequestData(req); 
            let recipient = requestData.requestingUser;
            let startDate = requestData.dateRequested.slice(0,10);
            let endDate = requestData.dateRequestedEnd.slice(0,10);
            let messageT = "";

            if (startDate === endDate)
                messageT = "Your request for time off on "+ startDate+ " has been denied.";
            else
                messageT = "Your request for time off between "+ startDate+ " and "+endDate +" has been denied.";

            let notificationD = {
                recipient:  recipient,
                subject:    "Request: Denied",
                message:    messageT
            }
            addNotification(notificationD);
        }

        // STEP 2: ADD THE CARD TO THE PROCESSED ARRAY STACK
        let currentR = this.state.currentRequests;
        var ind = currentR.findIndex(obj => obj._id===index);
        //console.log(ind);
        //console.log(this.state.currentRequests)
        let processedRequest = currentR.splice(ind,1);     
        let accepted = 0 
        if(button.includes("acceptRequest"))
            accepted = 1;
        else 
            accepted = 2
        
        processedRequest[0].reason = reason;
        processedRequest[0].approvingUser = userData.userType;
        processedRequest[0].accepted      =accepted;
        let date = new Date();
        var now_utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        processedRequest[0].updatedAt = now_utc;
        //console.log(processedRequest)
        let btnStdPendF = document.getElementById("btn-student-pendF");
        let btnStdPendA = document.getElementById("btn-student-pendA");
        let btnFacPendA = document.getElementById("btn-faculty-pendA");

        if(btnStdPendF.getAttribute("hidden") === null) //if you are on the student processing page as an faculty member
        {
            //console.log(btnStdPendF.getAttribute("hidden") )
            //console.log("IN PENDING STUDENTS IN FACULTY")
            this.state.requestsProcessedS.unshift(processedRequest[0])
            //this.setState({requestsProcessedS : this.state.requestsProcessedS.unshift(processedRequest)})
        }
        else if (btnStdPendA.getAttribute("hidden") === null)//if you are on the student processing page as an admin
        {
            //console.log(btnStdPendA.getAttribute("hidden"))
            //console.log("IN PENDING STUDENTS IN ADMIN")
            this.state.requestsProcessedS.unshift(processedRequest[0])
            //console.log(this.state.requestsProcessedS)
            //this.setState({requestsProcessedS : this.state.requestsProcessedS.unshift(processedRequest)})
        }
        else if(btnFacPendA.getAttribute("hidden") === null) //if you are on the faculty processing page as an admin
        {
            //console.log(btnFacPendA.getAttribute("hidden") )
            //console.log("IN PENDING FACULTY IN ADMIN")
            this.state.requestsProcessedF.unshift(processedRequest[0])
        }
        else
        {
            //console.log("CRITICAL ERROR")
            header.innerHTML = "Successfully updated! Refreshing the page to update your card view properly.";
            unHideAlert();
            window.location.reload();
            return;
        }
        //STEP 3: UPDATE THE CURRENT PAGE OF CARDS TO REMOVE THE PROCESSED CARD

        if(this.state.currentRequests.length ===0) //if that was the last request in the page
        {
            //console.log("ALL REQUESTS PROCESSED")
            this.setState({
                maxPageNo:1,
                currentPageNo:1,
                currentPageArr:[],
            })

            
        }
        else{
            let maxPage = (Math.ceil(currentR.length/this.state.numRequestPerPage));
            //console.log( "this.maxpageno    "+this.state.maxPageNo +"    this current pageno:   "+ this.state.currentPageNo+"   currentlength:"+currentR.length%this.state.numRequestPerPage)
            if (this.state.maxPageNo === this.state.currentPageNo && currentR.length%this.state.numRequestPerPage ===0) // ig you are on the last request of the last page (page 2, request 1 ect)
            {
            
                this.setState({ maxPageNo: maxPage,
                    currentPageNo: this.state.currentPageNo-1,
                    currentPageArr:this.state.currentRequests.slice(((maxPage-1)*this.state.numRequestPerPage),((this.state.currentRequests.length)))
                })
                rigBtn.setAttribute("disabled", true)
                if(this.state.currentPageNo-1 ===1)
                    leftBtn.setAttribute("disabled", true)
                else
                    leftBtn.removeAttribute("disabled");


            }
            else
            {
                //console.log(this.state.currentRequests)
                //console.log(this.state.currentRequests.length%this.state.numRequestPerPage)
                this.setState({
                    maxPageNo: maxPage,
                    currentPageArr: (this.state.currentRequests.length %this.state.numRequestPerPage !==0)? this.state.currentRequests.slice((this.state.currentPageNo-1)*this.state.numRequestPerPage,((this.state.currentPageNo-1)*this.state.numRequestPerPage)+this.state.numRequestPerPage):this.state.currentRequests.slice((this.state.currentPageNo-1)*this.state.numRequestPerPage,this.state.currentRequests.length)
                })
            }

        //fix right/left arrow buttons
        if(maxPage===this.state.currentPageNo)
            rigBtn.setAttribute("disabled", true) 
        }
        

        //table consistancy
        let tableDeletedRow,tableNewRow,listPendingRequests;
        if(btnStdPendF.getAttribute("hidden") === null) //if you are on the student processing page as an faculty member
        {
            tableDeletedRow = document.getElementById("studentsPendingRequests");
            tableNewRow     = document.getElementById("studentsProcessedRequests");
            listPendingRequests = await pullStudentPendingRequests();
            //console.log("DELETING STUDENT PENDING IN FACULTY")
        }
        else if (btnStdPendA.getAttribute("hidden") === null)//if you are on the student processing page as an admin
        {
            tableDeletedRow = document.getElementById("allPendingRequests");
            tableNewRow     = document.getElementById("allProcessedRequests");
            listPendingRequests = await pullAllPendingRequests();
            //console.log("DELETING STUDENT PENDING IN ADMIN")
        }
        else if(btnFacPendA.getAttribute("hidden") === null) //if you are on the faculty processing page as an admin
        {
            tableDeletedRow = document.getElementById("allPendingRequests");
            tableNewRow     = document.getElementById("allProcessedRequests");
            listPendingRequests = await pullAllPendingRequests();
            //console.log("DELETING FACULTY PENDING IN ADMIN") //THE PROBLEM, ITS NOT GOING BY THE TABLE, ITS GOING BY THE PENDING REQUESTS
        }
        else
        {
            console.log("CRITICAL ERROR")
            header.innerHTML = "Error with list consistancy! Please refresh the page to fix this issue.";
            unHideAlert();
            return;
        }
        //console.log("list of pending requests")
        //console.log(listPendingRequests)


        const table = tableDeletedRow, // get the table
            rows = Array.from(table.rows), // get the <tr> elements inside it and convert it to an array
            cells = rows.map(row => Array.from(row.cells).map(cell => cell.innerHTML)); //make array called cells for table
        
        var indList = 1;
        for(let i = 1; i<cells.length; i++)
        {
            //console.log(cells[i][6].includes(processedRequest[0]._id))
            if(cells[i][6].includes(processedRequest[0]._id))
            {
                indList = i;
                break;
            }
        }
        
        //console.log("INDEX OF THE LIST NEEDED TO REMOVE    "+indList);

        tableDeletedRow.deleteRow(indList);//delete relevant row

        //create new row in processed area

        let startDate = processedRequest[0].dateRequested.slice(0,10);
        let endDate = processedRequest[0].dateRequestedEnd.slice(0,10);
        let startAtt = new Date(processedRequest[0].dateRequested);
        let endAtt   = new Date(processedRequest[0].dateRequestedEnd);
        startAtt.toDateString();    
        endAtt.toDateString();
        //console.log("MODIFIED DATES:   "+startAtt +"   "+endAtt)
        var row = tableNewRow.insertRow(1);
        if (processedRequest[0].userType ==="faculty" && userData.userType==="admin")
            row.style.backgroundColor ="peachpuff"
        else if (processedRequest[0].userType === "student" && userData.userType==="admin")
            row.style.backgroundColor ="lightblue"
        var name = row.insertCell(0);
        var userType = row.insertCell(1);
        var user = row.insertCell(2);
        var startDateL = row.insertCell(3);
        var endDateL   = row.insertCell(4);    
        var status = row.insertCell(5);
        var approver = row.insertCell(6);
        var reasonList   = row.insertCell(7);
        var buttonDel   = row.insertCell(8);
        if(processedRequest[0].name === "null, null")
        {
            name.innerHTML = "No Name"
        }
        else
            name.innerHTML = formatName(processedRequest[0].name);
        userType.innerHTML = processedRequest[0].userType;
        user.innerHTML = processedRequest[0].requestingUser;
        startDateL.innerHTML = startAtt;
        if(startDate===endDate)
            endDateL.innerHTML  = "-"
        else
            endDateL.innerHTML = endAtt;
        if(button.includes("denyRequest"))
                status.innerHTML  =  "Denied!";
        else
                status.innerHTML  =  "Approved!";
        approver.innerHTML = userData.userType;
        reasonList.innerHTML   = reason;
        document.getElementById("reasonPopup").value = "N/A";
        buttonDel.innerHTML = "<td><button class='button-28 bb' id='delBtn" + processedRequest[0]._id + "'>Delete</button></td>";
        header2.innerHTML = "Request processed!";
        unHideSuccess();
        //console.log(cells)
        //console.log("cells length "+cells.length)
        //if current list array is empty
        if(cells.length === 2){
            tableDeletedRow.deleteRow(0);
            let tr = document.createElement("tr");
            tr.innerHTML = "<center><h3>No Requests Found!</h3></center>";
            tableDeletedRow.appendChild(tr);
        }
    }
    deleteRequestList = async(e)=>
    {
        //if the deletion is done in the list
            let header = document.getElementById("alertAOText");
            let header2 = document.getElementById("successAOText");
            let index = e.target.id;
            let rowIndex =  e.target.parentNode.parentNode.rowIndex;
            let idObj = {id: index.replaceAll('delBtn', '')}
            //console.log(idObj)
            let nameOfTable = e.target.parentNode.parentNode.parentNode.id;
            if (index.includes('delBtn') && window.confirm("Are you sure about deleting this request? This cannot be undone!") === true) {
                
                let deletedTable = document.getElementById(e.target.parentNode.parentNode.parentNode.id);
                deletedTable.deleteRow(rowIndex)
                let processedRequest = await getRequestData(idObj);
                await deleteRequest(idObj);
                header2.innerHTML = "Request deleted!";
                unHideSuccess();

                if(deletedTable.rows.length ===1)
                {
                    deletedTable.deleteRow(0)
                    let tr = document.createElement("tr");
                    tr.innerHTML = "<center><h3>No Requests Found!</h3></center>";
                    deletedTable.appendChild(tr);

                }
                //lol update the cards
                this.populateRequests();
                if (nameOfTable !=='myPendingRequests')//ONLY DELETE CONFLICTS IF THE DELETION CALL IS COMING FROM A NONPERSONAL TABLE
                {
                    //delete conflicts
                    let req = {  
                        dateRequested: processedRequest.dateRequested,
                        dateRequestedEnd: processedRequest.dateRequestedEnd
                        }
                    //console.log(req);
                    let email = processedRequest.requestingUser;
                    //console.log("email: " +email);    
                

                    await fbcu(req, email);
                }
            }
    }

    processRequestsC = async(e)=>{ //MAKES THE POPUP APPEAR WITH CORRECT BUTTONS
        let index = e.target.id;
        let userData = await getUserData();
        //console.log("THE ROW INDEX IS...."+e.target.parentNode.parentNode.rowIndex); 
        let rowIndex = e.target.parentNode.parentNode.rowIndex;
        this.setState({rowIndex: rowIndex});
        if((!index.includes("approveBtn"))&&(!index.includes("denyBtn"))){
            return;
        }
        let button;

        if (index.includes("approveBtn")){
            index = index.replaceAll('approveBtn', '');
            button = document.getElementById("popupbugtestA")
            button.removeAttribute("hidden")
        }

        else if (index.includes("denyBtn")){
                index = index.replaceAll('denyBtn', '');
                button = document.getElementById("popupbugtestD")
                button.removeAttribute("hidden")
        }
            //let popupId = document.getElementById("popupId")
            //popupId.innerHTML = "Request Id: "+index
            this.setState({requestId :index});
            //console.log("THE ID IS...."+ index)

            let chosenRequest = {id: index}
            let request = await getRequestData(chosenRequest)
            //console.log(request)

            let popupUser =document.getElementById("requestingUserPopup");
            popupUser.innerHTML = request.requestingUser;

            let popup = document.getElementById("requestListPopup")
            popup.removeAttribute("hidden")

            let popupDates =document.getElementById("datePopup");
            let popupDateEnd = document.getElementById('dateEndPopup')
            if(request.dateRequested === request.dateRequestedEnd)
            {
                popupDates.innerHTML = "On: " + this.dateStringifier(request.dateRequested)
                popupDateEnd.innerHTML = "";
            }
            else
            {
                popupDates.innerHTML = "From: " + this.dateStringifier(request.dateRequested);
                popupDateEnd.innerHTML = "To: "+ this.dateStringifier(request.dateRequestedEnd);
            }
            (request.name ==="null , null")?document.getElementById("namePopup").innerHTML = "No Name":document.getElementById("namePopup").innerHTML = formatName(request.name);
            document.getElementById("descriptionPopup").innerHTML = "Description: "+ capitalizeSentences(request.description);

            let requestScreen =document.getElementById("requestScreen");
            requestScreen.setAttribute("hidden", true)


    }
    cancelPopup = (e)=>{
        let popup = document.getElementById("requestListPopup")
        let popupUser =document.getElementById("requestingUserPopup");
        let button1 = document.getElementById("popupbugtestA")
        let button2 = document.getElementById("popupbugtestD")
        this.setState({requestId:'',
        rowIndex:-1,
        });
        //console.log(this.state.rowIndex)
        document.getElementById("reasonPopup").value ='N/A';
        popupUser.innerHTML = null;
        popup.setAttribute("hidden", true)
        button1.setAttribute("hidden", true)
        button2.setAttribute("hidden", true)
        let requestScreen =document.getElementById("requestScreen");
        requestScreen.removeAttribute("hidden")

    }

    listProcess = async(e)=>{
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        let popup = document.getElementById("requestListPopup")
        //let popupId = document.getElementById("popupId").innerHTML.replaceAll('Request Id: ', '');
        let popupUser = document.getElementById("requestingUserPopup").innerHTML;
        let userData = await getUserData();
        let popupReason = document.getElementById("reasonPopup").value;
        let button1 = document.getElementById("popupbugtestA")
        let button2 = document.getElementById("popupbugtestD")
        let index = this.state.requestId
        button1.setAttribute("hidden", true)
        button2.setAttribute("hidden", true)
        popup.setAttribute("hidden", true);
        //console.log(popupUser);
        let req = {approvingUser: userData.userType,
                    reason: popupReason,
                    id: index,
        }
        //console.log(req)
        let requestScreen =document.getElementById("requestScreen");
        requestScreen.removeAttribute("hidden")
        this.setState({requestId:''})
        let buttonId = e.target.id
        let requestData = await getRequestData(req);            
        let startDate = requestData.dateRequested.slice(0,10);
        let endDate = requestData.dateRequestedEnd.slice(0,10);
        if(buttonId === "popupbugtestA") //APPROVING THE REQUEST
        {
            await approveRequest(req);

            
            let recipient = requestData.requestingUser;
            let startDate = requestData.dateRequested.slice(0,10);
            let endDate = requestData.dateRequestedEnd.slice(0,10);
            let messageT = "";

            if (startDate === endDate)
                messageT = "Your request for time off on "+ startDate+ " has been approved.";
            else
                messageT = "Your request for time off between "+ startDate+ " and "+endDate +" has been approved.";

            let notificationA = {
                recipient:  recipient,
                subject:    "Request: Approved",
                message:    messageT
            }
            addNotification(notificationA);

            //conflict resolution
            await this.requestConflicts(e,requestData);

        }
        else if (buttonId === "popupbugtestD")//Denying the request
        {
            await denyRequest(req);

            let recipient = requestData.requestingUser;

            let messageT = "";

            if (startDate === endDate)
                messageT = "Your request for time off on "+ startDate+ " has been denied.";
            else
                messageT = "Your request for time off between "+ startDate+ " and "+endDate +" has been denied.";

            let notificationD = {
                recipient:  recipient,
                subject:    "Request: Denied",
                message:    messageT
            }
            addNotification(notificationD);

        }
        header2.innerHTML = "Request processed!";
        unHideSuccess();

            let table;
            if(userData.userType ==="admin")
            {
                document.getElementById("allPendingRequests").deleteRow(this.state.rowIndex)
                //create new row in processed area
                table = document.getElementById("allProcessedRequests")
            }
            else
            {
                document.getElementById("studentsPendingRequests").deleteRow(this.state.rowIndex)
                table = document.getElementById("studentsProcessedRequests")
            }

            let startAtt = new Date(requestData.dateRequested);
            let endAtt   = new Date(requestData.dateRequestedEnd);
            startAtt.toDateString();    
            endAtt.toDateString();
            //console.log("MODIFIED DATES:   "+startAtt +"   "+endAtt)
            var row = table.insertRow(1);
            if (requestData.userType ==="faculty" && userData.userType==="admin")
                row.style.backgroundColor ="peachpuff"
            else if (requestData.userType === "student" && userData.userType==="admin")
                row.style.backgroundColor ="lightblue"
            var name = row.insertCell(0);
            var userType = row.insertCell(1);
            var user = row.insertCell(2);
            var startDateL = row.insertCell(3);
            var endDateL   = row.insertCell(4);    
            var status = row.insertCell(5);
            var approver = row.insertCell(6);
            var reason   = row.insertCell(7);
            var buttonDel   = row.insertCell(8);
            if (requestData.name ==="null, null")
            {
                name.innerHTML ="No Name"; 
            }
            else
                name.innerHTML = formatName(requestData.name);
            userType.innerHTML = requestData.userType;
            user.innerHTML = requestData.requestingUser;
            startDateL.innerHTML = startAtt;
            if(startDate===endDate)
                endDateL.innerHTML  = "-"
            else
                endDateL.innerHTML = endAtt;
            if(buttonId === "popupbugtestA")
                    status.innerHTML  =  "Approved!"
            else
                    status.innerHTML  =  "Denied!"
            approver.innerHTML =userData.userType;
            reason.innerHTML   =popupReason;
            //console.log("requestData.-id:   "+ requestData._id)
            buttonDel.innerHTML = "<td><button class='button-28 bb' id='delBtn" + requestData._id + "'>Delete</button></td>";
            document.getElementById("reasonPopup").value = "N/A";
            //create new processed card
            this.populateRequests();



    }

    requestConflicts = async (e, requestObj)=>{
        //Email object for searching for involved events by email
        let emailObj = {
            email: requestObj.requestingUser
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
        //console.log("Here are all the searched user's events:");
        //console.log(events);

        let requestStart = requestObj.dateRequested.split('T')[0];
        let requestEnd = requestObj.dateRequestedEnd.split('T')[0];
        

        //Compares the dates of the events and the request and checks for conflicts
        for(let i = 0; i < events.length; i++){
            let eventStart = events[i].startDate.split('T')[0];
            let eventEnd = events[i].endDate.split('T')[0];
            //If this if is true, we found a conflict
            if(((requestStart <= eventStart) && (requestEnd  >= eventStart)) || ((requestStart <= eventEnd) && (requestEnd  >= eventEnd))){
                //console.log("conflict!");

                //Gets conflict array from that event
                let conflicts = events[i].conflicts;

                if(!conflicts){conflicts = []}

                //console.log(conflicts);

                //Pushes a new conflict to the array
                conflicts.push({
                    message: "Conflict created on Event: " + events[i].name + " regarding " + requestObj.requestingUser + "!",
                    email: requestObj.requestingUser
                })
                //console.log(conflicts);

                //Makes an object with the event ID and the conflict array to send to the database
                let conflictObj = {
                    eventId: events[i]._id,
                    conflictArray: conflicts
                }
                //console.log(conflictObj);

                //Data retrieved from database
                await updateConflicts(conflictObj);

                let notifObj = {
                    recipient: "Generic",
                    subject: "Conflict in Event!",
                    message: "Conflict created on Event: " + events[i].name + " regarding " + requestObj.requestingUser + "!",
                    recipientType: "faculty"
                }
                //console.log(notifObj);
        
                //Data retrieved from database
                await addGenericNotification(notifObj);
            }
        }
    }

    //switch screens
    switchScreens = (e,f)=>{
        let screen1 = document.getElementById(e);
        let screen2 = document.getElementById(f);

        if(e === "requestScreen" && f ==="requestPageBox"){
            let activeDiv;
            if(white === true){
                white = false;
                activeDiv = document.querySelector('.white');
                activeDiv.style.backgroundColor = 'transparent';
            }
            else{
                white = true;
                activeDiv = document.querySelector('.white');
                activeDiv.style.backgroundColor = 'white';
            }

        }

        //If the change user type screen was hidden before, unhide it
        if(screen1.getAttribute("hidden") !== null){
            screen1.removeAttribute("hidden");
            screen2.setAttribute("hidden", true);
        }
        //otherwise, hide everything and show the general page
        else{
            screen1.setAttribute("hidden", true);
            screen2.removeAttribute("hidden");
        }

    }

    //Switching system Buttons

    switchButtonsGeneric = (e,f,t,i) =>{
        let btn1 = document.getElementById(e);
        let btn2 = document.getElementById(f);
        let title = document.getElementById("cardRequestTitles");
        

        btn1.setAttribute("hidden", true);
        btn2.removeAttribute("hidden"); 

        if(f === "btn-student-procF" || f === "btn-student-procA"){
            title.innerHTML = "Student Processed Requests";
        }
        else if(f === "btn-faculty-procF" || f === "btn-faculty-procA"){
            title.innerHTML = "Faculty Processed Requests";
        }
        else if(f === "btn-student-pendF" || f === "btn-student-pendA"){
            title.innerHTML = "Student Pending Requests";
        }
        else if(f === "btn-faculty-pendF" || f === "btn-faculty-pendA"){
            title.innerHTML = "Faculty Pending Requests";
        }
        else if(f === "btn-personal-pendF" || f === "btn-personal-pendS"){
            title.innerHTML = "Personal Pending Requests";
        }
        else if(f === "btn-personal-procF" || f === "btn-personal-procS"){
            title.innerHTML = "Personal Processed Requests";
        }
        
        
        //console.log(this.state.requestsProcessedF)

        this.setState({
            editable:t,
            currentPageNo:1,
            currentRequests: i,
            maxPageNo: Math.ceil(i.length/this.state.numRequestPerPage),
            currentPageArr:(i.length<this.state.numRequestPerPage)?i.slice(0,i.length): i.slice(0,this.state.numRequestPerPage)

        })

        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        if (i.length === 0 || Math.ceil(i.length/this.state.numRequestPerPage)===1)
        {
            leftBtn.setAttribute("disabled", true);
            rigBtn.setAttribute("disabled", true);
        }
        else if(Math.ceil(i.length/this.state.numRequestPerPage) >1)
        {
            //console.log(Math.ceil(i.length/this.state.numRequestPerPage) )
            leftBtn.setAttribute("disabled", true);
            rigBtn.removeAttribute("disabled");
        }
        else
        {
            leftBtn.removeAttribute("disabled");
            rigBtn.removeAttribute("disabled");
        }
    }

    switchButtonsToOtherSet =(a,b,c, d,e,f, t, i)=>{
        let btn1 = document.getElementById(a);
        let btn2 = document.getElementById(b);
        let btn3 = document.getElementById(c);

        let btn4 = document.getElementById(d);
        let btn5 = document.getElementById(e);
        let btn6 = document.getElementById(f);
        let title = document.getElementById("cardRequestTitles");

        //console.log(d)
        if(d === "btn-student-pendF" || d === "btn-student-pendA"){
            title.innerHTML = "Student Pending Requests";
        }
        else if(d === "btn-faculty-pendF" || d === "btn-faculty-pendA"){
            title.innerHTML = "Faculty Pending Requests";
        }
        else if(d === "btn-personal-pendF" || d === "btn-personal-pendA"){
            title.innerHTML = "Personal Pending Requests";
        }

        btn1.setAttribute("hidden", true);
        btn2.setAttribute("hidden", true);
        btn3.setAttribute("hidden", true);
        btn4.removeAttribute("hidden");
        btn5.setAttribute("hidden", true);
        btn6.removeAttribute("hidden");
        this.setState({
            editable:t,
            currentPageNo:1,
            currentRequests: i,
            maxPageNo: Math.ceil(i.length/this.state.numRequestPerPage),
            currentPageArr:(i.length<this.state.numRequestPerPage)?i.slice(0,i.length): i.slice(0,this.state.numRequestPerPage)
        })

        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        if (i.length === 0  || Math.ceil(i.length/this.state.numRequestPerPage) ===1)
        {
            leftBtn.setAttribute("disabled", true);
            rigBtn.setAttribute("disabled", true);
        }
        else if(Math.ceil(i.length/this.state.numRequestPerPage) >1)
        {
            //console.log(Math.ceil(i.length/this.state.numRequestPerPage) )
            leftBtn.setAttribute("disabled", true);
            rigBtn.removeAttribute("disabled");
        }
        else
        {
            leftBtn.removeAttribute("disabled");
            rigBtn.removeAttribute("disabled");
        }
    }

     fillTableButtons = async(tableId,numberData)=>{
        let table = document.getElementById(tableId);
        let pendingData;
        let userData = await getUserData();
        switch(numberData)
        {
            case 1://fillstudentTable
            pendingData = await pullStudentPendingRequests();
            break;
            case 2: //fill all tables
            pendingData = await pullAllPendingRequests();
            break;
            default:
                console.log("CRITICAL ERROR");
                return;
        }
        //console.log("PENDING DATA")
        //console.log(pendingData)
        
    
        //Clears the table before generating new rows
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    
    
        //Creates a row saying "No events found" if there is no valid data given
        if(!pendingData || pendingData.length === 0){
            let tr = document.createElement("tr");
            tr.innerHTML = "<center><h3>No Pending Requests!</h3></center>";
            document.getElementById(tableId).appendChild(tr);
            return;
        } 
    
        let stringH = "<tr><th>Name</th><th>UserType</th><th>User</th><th>StartDate</th><th>EndDate</th><th>RequestDescription</th><th colspan = 2>Buttons</th></tr>";
        let prH = document.createElement("tr");
        prH.innerHTML = stringH;
        document.getElementById(tableId).appendChild(prH);
    
        for (let i = pendingData.length-1; i>=0; i--)
        {
            let pendingRequest = pendingData[i];
            let stringR = "";
    
            stringR += "<td>";
            let usernameR = formatName(pendingRequest.name);
            if (usernameR ==="Null, Null")
                usernameR = "No Name"
            stringR += usernameR;
            stringR += "</td>"; 
    
            stringR += "<td>";
            let userTypeR = pendingRequest.userType;
            stringR += userTypeR;
            stringR += "</td>"; 
    
            stringR += "<td>";
            let userR = pendingRequest.requestingUser;
            stringR += userR;
            stringR += "</td>"; 
    
            var dateStart = new Date(pendingRequest.dateRequested);
            dateStart.toDateString();
            stringR += "<td>" + dateStart + "</td>";
            var dateEnd = new Date(pendingRequest.dateRequestedEnd);
            dateEnd.toDateString();
            if (dateStart.toDateString() === dateEnd.toDateString())
            {
                stringR += "<td> - </td>";  
            }
            else
            {
                stringR += "<td>" + dateEnd + "</td>";            
            }
            stringR += "<td>";
            let messageR = capitalizeSentences(pendingRequest.description);
            stringR += messageR;
            stringR += "</td>";
            let trR = document.createElement("tr");
    
            if(pendingRequest.userType && pendingRequest.userType === "faculty" && userData.userType ==="admin"){
                trR.style.backgroundColor = "peachpuff";
            }
            else if(pendingRequest.userType && pendingRequest.userType === "student"&& userData.userType ==="admin"){
                trR.style.backgroundColor = "lightblue"; 
            }
            else
            trR.style.backgroundColor = "white"; 
            trR.innerHTML = stringR + "<td><button class='button-28 bb' id='approveBtn" + pendingRequest._id + "'>Approve</button></td><td><button  class='button-28 bb' id='denyBtn" + pendingRequest._id + "'>Deny</button></td>";
    
            document.getElementById(tableId).appendChild(trR); 
        }
    }

      fillTableNoButtons =async(tableId, numberData)=>{
        let table = document.getElementById(tableId);
        let processedData;
        let userData = await getUserData();
        let email = { email: userData.email}
        switch(numberData)
        {
            case 1://personal pending
                processedData = await findPendingE(email);
                break;
            case 2://personal processed
                processedData = await findProcessedE(email);
                break;
            case 3: //student processed
                processedData = await pullStudentProcessedRequests();
                break;
            case 4: //all processed
                processedData = await pullAllProcessedRequests();
                break;
            default:
                console.log("critical error")
                return;
        }
    
        //Clears the table before generating new rows
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    
        //Creates a row saying "No events found" if there is no valid data given
        if(!processedData || processedData.length === 0){
            let tr = document.createElement("tr");
            tr.innerHTML = "<center><h3>No Requests Found!</h3></center>";
            document.getElementById(tableId).appendChild(tr);
            return;
        } 
        let stringH;
        if( numberData ===1)
        {
            stringH = "<tr><th>Date Made</th><th>StartDate</th><th>EndDate</th><th>Description</th><th>Delete?</th></tr>"
        }
        else if (numberData ===2)
        {
            stringH ="<tr><th>Name</th><th>UserType</th><th>User</th><th>StartDate</th><th>EndDate</th><th>Status</th><th>Approver</th><th>Reason</th></tr>"
        }
        else 
            stringH = "<tr><th>Name</th><th>UserType</th><th>User</th><th>StartDate</th><th>EndDate</th><th>Status</th><th>Approver</th><th>Reason</th><th>Delete?</th></tr>"

        let prH = document.createElement("tr");
        prH.innerHTML = stringH;
        document.getElementById(tableId).appendChild(prH);
    
        for (let i = processedData.length-1; i>=0; i--)
        {
            let processedRequest = processedData[i];
    
    
            let stringR = "";
            if(numberData ===1)
            {
                stringR += "<td>";
                let updatedTime= new Date(processedRequest.updatedAt);
                stringR +=updatedTime.toDateString();
                stringR += "</td>";
            }
            else{
            stringR += "<td>";
            let usernameR = formatName(processedRequest.name);
            if (usernameR ==="Null, Null")
                usernameR = "No Name"
            stringR += usernameR;
            stringR += "</td>"; 
            if(numberData!==1)
            {
            stringR += "<td>";
            let userTypeR = processedRequest.userType;
            stringR += userTypeR;
            stringR += "</td>"; 
            }
            
            stringR += "<td>";
            let userR = processedRequest.requestingUser;
            stringR += userR;
            stringR += "</td>"; 
            }
            var dateStart = new Date(processedRequest.dateRequested);
            dateStart.toDateString();
            stringR += "<td>" + dateStart + "</td>";
            var dateEnd = new Date(processedRequest.dateRequestedEnd);
            dateEnd.toDateString();
            if (dateStart.toDateString() === dateEnd.toDateString())
            {
                stringR += "<td> - </td>";  
            }
            else
            {
                stringR += "<td>" + dateEnd + "</td>";            
            }
     
            stringR += "<td>";
            if(numberData !==1)
            
            {
            let status = processedRequest.accepted;
            if(status === 1)
            {
                stringR += "Approved!";
            }
            else
            {
                stringR += "Denied!";
            }
            stringR += "</td>";
    
            stringR += "<td>";
            let evalR = processedRequest.approvingUser;
            stringR += evalR;
            stringR += "</td>"; 
    
            stringR += "<td>";
            let reasonR = capitalizeSentences(processedRequest.reason);
            stringR += reasonR;
            stringR += "</td>";    
            }
            else
            {
                stringR += capitalizeSentences(processedRequest.description);
                stringR += "</td>"; 
            }
            if(numberData!==2)
                stringR +="<td><button class='button-28 bb' id='delBtn" + processedRequest._id + "'>Delete</button></td>"
    
            let trR = document.createElement("tr");
            if(processedRequest.userType && processedRequest.userType === "faculty" &&numberData ===4){
                trR.style.backgroundColor = "peachpuff";
            }
            else if(processedRequest.userType && processedRequest.userType === "student"&&numberData ===4){
                trR.style.backgroundColor = "lightblue"; 
            }
            else
            trR.style.backgroundColor = "white"; 
            trR.innerHTML = stringR;
            document.getElementById(tableId).appendChild(trR);
        }
    }
    

    populateRequests = async(e)=>{
        let userData = await getUserData();
        let userType = userData.userType;
        let email = { email: userData.email}
        //console.log(email+"    "+userType)
        let pendingDataP = await findPendingE(email);
        let processedDataP = await findProcessedE(email);
        let arr;
        switch (userType)
        {
            case "admin":
                //console.log("ADMIN!")
                let studentPendR  = await pullStudentPendingRequests();
                let studentsProcR = await pullStudentProcessedRequests();
                let facultyPendR  = await pullFacultyPendingRequests();
                let facultyProcR  = await pullFacultyProcessedRequests();
                //console.log("THE MAX PAGE NUMBER IS:   ")
                //console.log(Math.floor(studentPendR.length/this.state.numRequestPerPage)+1)
                //console.log("studentPend LENGTH" + studentPendR.length +"   numperpage: "+this.state.numRequestPerPage)
                this.setState({
                    requestsPendingF:  facultyPendR.reverse(),
                    requestsProcessedF: facultyProcR.reverse(), 
                    requestsPendingS:    studentPendR,
                    requestsProcessedS:  studentsProcR.reverse(),
                    editable: true,

                    currentRequests: studentPendR.reverse(),
                    maxPageNo: Math.ceil(studentPendR.length/this.state.numRequestPerPage),
                    currentPageArr: (studentPendR.length<this.state.numRequestPerPage)?studentPendR.slice(0,studentPendR.length):studentPendR.slice(0,this.state.numRequestPerPage)
                })
                let btnStdPendF = document.getElementById("btn-student-pendF");
                btnStdPendF.setAttribute("hidden",true);
                let buttonsA = document.getElementById("adminButtons");
                let delAll =document.getElementById("deleteAllRequests")
                document.getElementById("btn-personal-pendS").setAttribute("hidden",true)
                document.getElementById("btn-personal-pendF").setAttribute("hidden",true)
                //document.getElementById("btn-personal-pendF").setAttribute("hidden",true)
                buttonsA.removeAttribute("hidden"); 
                delAll.removeAttribute("hidden"); 
                arr = studentPendR;

                break;
            case "faculty":
                let studentPendingR = await pullStudentPendingRequests();
                let studentsProcessedR = await pullStudentProcessedRequests();
                this.setState({requestsPendingP: pendingDataP,
                    requestsProcessedP: processedDataP.reverse(),
                    requestsPendingS:   studentPendingR.reverse(),
                    requestsProcessedS: studentsProcessedR.reverse(),
                    editable: false,
                    
                    currentRequests: pendingDataP.reverse(),
                    maxPageNo: Math.ceil(pendingDataP.length/this.state.numRequestPerPage),
                    currentPageArr: (pendingDataP.length<10)?pendingDataP.slice(0,pendingDataP.length):pendingDataP.slice(0,9)
                    
                })
                //console.log("FACULTY")
                let buttonsF = document.getElementById("facultyButtons");
                buttonsF.removeAttribute("hidden"); 
                let btnStdPendA = document.getElementById("btn-student-pendA");
                btnStdPendA.setAttribute("hidden",true)
                document.getElementById("btn-personal-pendS").setAttribute("hidden",true)
                document.getElementById("AddRequestButton").removeAttribute("hidden")
                arr = pendingDataP;
                break;
            default:
                this.setState({requestsPendingP: pendingDataP,
                    requestsProcessedP: processedDataP.reverse(),
                    editable: false,

                    currentRequests: pendingDataP.reverse(),
                    maxPageNo: Math.ceil(pendingDataP.length/this.state.numRequestPerPage),
                    currentPageArr: (pendingDataP.length<10)?pendingDataP.slice(0,pendingDataP.length):pendingDataP.slice(0,9)
                
                })
                document.getElementById("AddRequestButton").removeAttribute("hidden")
                //console.log("STUDENT!")        
                let buttonsS = document.getElementById("studentButtons");
                buttonsS.removeAttribute("hidden"); 
                arr = pendingDataP;
                break;
        }
                       let rigBtn = document.getElementById("rightPgButton");
                       let leftBtn = document.getElementById("leftPgButton");
                       if (arr.length === 0)
                       {
                           leftBtn.setAttribute("disabled", true);
                           rigBtn.setAttribute("disabled", true);
                       }
                       else
                       {
                           leftBtn.removeAttribute("disabled");
                           rigBtn.removeAttribute("disabled");
                       }
                       leftBtn.setAttribute("disabled", true);
                       if (Math.ceil(arr.length/this.state.numRequestPerPage)===this.state.maxPageNo)
                            rigBtn.setAttribute("disabled", true);


    }

    scrollRight = async(e)=>{
        if (this.state.maxPageNo <= this.state.currentPageNo)
        {
            //console.log("NOr")
            return;
        }
        this.setState({currentPageNo: this.state.currentPageNo + 1})
        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        leftBtn.removeAttribute("disabled"); 
        let pageDisplayNotif = document.getElementById("pageDisplayRequests")
        let temp = this.state.currentPageNo + 1;
        pageDisplayNotif.innerText = temp;


        if(this.state.maxPageNo === temp)
        {
            //console.log("REACHED END FLAG")
            this.setState({currentPageArr:  this.state.currentRequests.slice(((this.state.maxPageNo-1)*this.state.numRequestPerPage),((this.state.currentRequests.length)))})
            rigBtn.setAttribute('disabled',true);
            return;
        }
        let newPage = this.state.currentRequests.slice((temp-1)*this.state.numRequestPerPage,((temp-1)*this.state.numRequestPerPage)+this.state.numRequestPerPage);
        this.setState({
            currentPageArr: newPage,
        });


        return;
        
    }

    scrollLeft = async(e)=>{
        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        if (this.state.currentPageNo === 1)
        {
            //console.log("NOl")
            return;
        }
        rigBtn.removeAttribute("disabled");
        let temp = this.state.currentPageNo - 1;
        let pageDisplayRequests = document.getElementById("pageDisplayRequests")
        pageDisplayRequests.innerText = this.state.currentPageNo;
        let newPage = (temp-1)*this.state.numRequestPerPage;
        this.setState({currentPageNo: this.state.currentPageNo- 1,
            currentPageArr: this.state.currentRequests.slice(newPage,newPage+this.state.numRequestPerPage)})
        if (temp ===1)
        {
            leftBtn.setAttribute("disabled", true);
        }
        return;
        
    }
    selectNewNo =async() =>{
        let pageDisplayRequestsNo = parseInt(document.getElementById("selectPageNo").value);
        this.setState({numRequestPerPage: pageDisplayRequestsNo,
                    currentPageNo:1,
                    currentPageArr:(this.state.currentRequests.length<pageDisplayRequestsNo)?this.state.currentRequests.slice(0,this.state.currentRequests.length):this.state.currentRequests.slice(0,pageDisplayRequestsNo),
                    maxPageNo: Math.ceil(this.state.currentRequests.length/pageDisplayRequestsNo),
        })
        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        if( Math.ceil(this.state.currentRequests.length/pageDisplayRequestsNo) === 1)
        {
            leftBtn.setAttribute("disabled", true);
            rigBtn.setAttribute("disabled", true);
        }
        else if( Math.ceil(this.state.currentRequests.length/pageDisplayRequestsNo) > 1)
        {
            leftBtn.setAttribute("disabled", true);
            rigBtn.removeAttribute("disabled");
        }
        else
        {
            leftBtn.removeAttribute("disabled");
            rigBtn.removeAttribute("disabled");

        }

    }//very differento
    fillTables= async()=>{
        let userData = await getUserData();
        toggleUserFunctionality();
        switch(userData.userType)
        {
            case "admin":
                this.fillTableButtons("allPendingRequests",2);
                this.fillTableNoButtons("allProcessedRequests",4); //all processed requests (admin)
                break;
            case "faculty":
                this.fillTableNoButtons("myPendingRequests",1); //pending requests (personal)
                this.fillTableNoButtons("myProcessedRequests",2); //processed requests (personal)
                this.fillTableButtons("studentsPendingRequests",1);
                this.fillTableNoButtons("studentsProcessedRequests",3); //processed requests (faculty)
                break;
            case "student":
                this.fillTableNoButtons("myPendingRequests",1); //pending requests (personal)
                this.fillTableNoButtons("myProcessedRequests",2); //processed requests (personal)
                break;
            default:
                console.log("CRITICAL ERROR");
                return; 
        }
    }
    setUserData=async()=>{
        let data = await getUserData();
        this.setState({currentUser:data.email,
        currentType:data.userType})
    }

    swapCardListViewWithContingency = async()=>{
        this.switchScreens('cardRequests','listRequests');
        let title = document.getElementById("cardRequestTitles");
        let data = await getUserData();

        if(title.getAttribute("hidden") === null){
                title.setAttribute("hidden", true);
        }
        else{
            if(data.userType === "faculty" || data.userType === "student"){
                title.innerHTML = "Personal Pending Requests";
            }
            title.removeAttribute("hidden"); 
        }

        this.reloadContingency();
    }

    reloadContingency = async() =>{
        this.setUserData();
        this.fillTables();
        this.populateRequests();
    }


    componentDidMount() {
        this.reloadContingency();
    }

    render() {

        const{currentPageArr,editable} = this.state;
        return (
            <div>
                <div onClick={hideAlert} className="alertAO" id="alertAO" hidden>
                    <span className="closebtnAO" onClick={hideAlert}>x</span> 
                    <strong className="aostrong">Error:</strong><span> </span><span id="alertAOText">Error</span>
                </div>
                <div onClick={hideSuccess} className="successAO" id="successAO" hidden>
                    <span className="closebtnAO" onClick={hideSuccess}>x</span> 
                    <strong className="aostrong">Success:</strong><span> </span><span id="successAOText"></span>
                </div>
                <div className="loadAO" id="loadAO" hidden>
                    <span className="aostrong">Loading . . .</span>
                </div>
                <div className="white ci"><center>
                    <center id="deleteAll" hidden>
                        <form>
                            <h3>This screen is intended for deleting all requests currently in the system for the purpose of beginning a new semester.</h3>
                            <h2 style={{color: 'red'}}>This cannot be undone.</h2>
                            <Form.Control className="input" id="passwordDeleteAll" type="password" placeholder='Enter your password.'></Form.Control>
                            <h6 className = "h6" id ='deleteAllErrorMsg'>{}</h6>
                            <Button  id="deleteAllRequestsToggle" className='button-28' onClick={()=>this.switchScreens('requestScreen','deleteAll')} >Cancel</Button><br/>
                            <Button type="Submit" className='button-28' id="deleteAllButton" style={{backgroundColor:'red'}}  onClick={this.deleteAllRequestConfirm}>Clear All Requests</Button>
                        </form>

                    </center>

                    <div id="requestListPopup" hidden>
                        <h3 id="requestingUserPopup"> </h3>
                        <h2 id="namePopup"> </h2> <br/>
                        <h3 id="actionPopup"> </h3>
                        <h3 id="datePopup"> </h3>
                        <h3 id="dateEndPopup"></h3>
                        <p id="descriptionPopup"></p><br/>
                        <textarea id="reasonPopup" defaultValue="N/A"/>
                        <center>
                            <Button id="popupCancel" className="button-28 leftBtn" onClick={this.cancelPopup}>Cancel</Button>
                            <Button id="popupbugtestA" className="button-28 rightBtn" onClick={this.listProcess} hidden>Accept</Button>
                            <Button id="popupbugtestD" className="button-28 rightBtn" onClick={this.listProcess} hidden >Deny</Button>    
                        </center>

                    </div></center>

                    <div id = "requestPageBox" hidden>

                        <center><h1 id="MakeARequestH1">Single Day Request</h1></center>
                        <div id = "pickADateMultiple" onSubmit = {this.addRequestMultiple} >
                            <form>
                                <label htmlFor = "requestDate" id="ReasonlabelStartDate">Start Date:</label>
                                <Form.Control required id="requestDate" className="date"  type="date"></Form.Control>
                                <br/>
                                <label htmlFor = "requestDateEnd" id="ReasonlabelEndDate" hidden>End Date:</label>
                                <Form.Control  id="requestDateEnd" className="date"  type="date" hidden></Form.Control>
                                <br/>
                                <label htmlFor = "descriptionRequest" id="ReasonlabelMultiple">Reason:</label>
                                <Form.Control required id="descriptionRequest" className="input" as="textarea"  placeholder="Description"></Form.Control>
                                <br/>
                                <center><Button className="button-28 bb" type = "Submit" id = "sendRequestMultiple">Create Request</Button>
                                <Button className="button-28 bb" onClick={this.swapSingleMultiRequest} id="RequestToSingleToggle"> Multiple Day Request </Button>
                                <Button className="button-28 bb" onClick={this.swapSingleMultiRequest} id="MultipleDayRequestToggle" hidden>Single Day Request</Button><br/>
                                <p id="requestMultErr"></p></center>
                            </form>
                        </div>
                        <center><Button className="button-28 bb" onClick={()=>this.switchScreens('requestScreen','requestPageBox')} id="AddARequestGoBack">Go Back</Button></center>
                    </div>
                    <div id="requestScreen" >
                        <center>
                            <h1>Requests</h1>

                            <br/>

                        </center> 

                            <center>                            
                                <Button  id="deleteAllRequests" className='button-28'style={{backgroundColor:'red'}}  onClick={()=>this.switchScreens('requestScreen','deleteAll')} hidden>Delete ALL Requests</Button>
                                <Link to="/"><Button className="button-28" id="RequestsBackHomeBTN">Back to Home</Button></Link>
                                <Button onClick={()=>this.switchScreens('requestScreen','requestPageBox')} id="AddRequestButton" className='button-28' hidden>Add a Request</Button>
                                
                                <br/>

                                <input type="checkbox" id="switch" className="switch"  onClick={this.swapCardListViewWithContingency}></input>
                                <label htmlFor="switch">Card View</label>
                                <br/>

                                <h2 id="cardRequestTitles" hidden>Student Pending Requests</h2>
                                <br/>
                            </center>


                            <div id="cardRequests" hidden>
                                <center>{(this.state.currentRequests.length !==0)?<h6 className = "h6">Total Requests: {this.state.currentRequests.length}</h6>:<h3>No requests found!</h3>}</center>
                                <center><div id="cardContainer">{(this.state.editable)? ((this.state.currentPageArr.length ===0)?<h1> </h1>:currentPageArr.map(request=> <CardRequest processRequestsC= {this.processRequestsCards}requestingUser= {request.requestingUser}userType={request.userType} name={request.name} dateRequested={request.dateRequested} key ={request._id} rid={request._id}  dateRequestedEnd={request.dateRequestedEnd} description={request.description} reason= {request.reason} accepted = {request.accepted} approvingUser={request.approvingUser} updatedAt={request.updatedAt}editable ={editable}/>)) : ((this.state.currentPageArr.length ===0)?<h1> </h1>: currentPageArr.map(request=> <CardRequestP processRequestsC= {this.deleteRequestsCards} currentUser ={this.state.currentUser} requestingUser= {request.requestingUser} userType={request.userType} name={request.name} dateRequested={request.dateRequested} key ={request._id} rid={request._id}  dateRequestedEnd={request.dateRequestedEnd} description={request.description} reason= {request.reason} accepted = {request.accepted} approvingUser={request.approvingUser} updatedAt={request.updatedAt}editable ={editable}/>))}</div></center>
                                <center>

                                    <div id="pageButtonCenter">
                                        <Button className="button-28" style ={{minWidth:"80px"}} onClick={this.scrollLeft} id="leftPgButton"></Button>
                                        <h2 id = "pageDisplayRequests">{this.state.currentPageNo}</h2>
                                        <Button className="button-28" style ={{minWidth:"80px"}} onClick={this.scrollRight} id="rightPgButton" ></Button>
                                    </div>

                                    <select id="selectPageNo" onChange={this.selectNewNo} defaultValue={10}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                    </select>    
                                


                                    <div id="studentButtons" hidden>
                                        <Button className="button-28" id="btn-personal-pendS" onClick={()=> this.switchButtonsGeneric("btn-personal-pendS","btn-personal-procS",false,this.state.requestsProcessedP)}>Switch to Processed</Button>
                                        <Button className="button-28" id="btn-personal-procS" onClick={()=> this.switchButtonsGeneric("btn-personal-procS","btn-personal-pendS",false,this.state.requestsPendingP)} hidden>Switch to Pending</Button>
                                    </div>

                                    <div id="facultyButtons" hidden>
                                        <Button className="button-28 rightBtn" id="btn-personal-pendF" onClick={()=> this.switchButtonsGeneric("btn-personal-pendF","btn-personal-procF",false,this.state.requestsProcessedP)}>Switch to Personal Processed</Button>
                                        <Button className="button-28 leftBtn" id="btn-personal-procF" onClick={()=> this.switchButtonsGeneric("btn-personal-procF","btn-personal-pendF",false,this.state.requestsPendingP)} hidden>Switch to Personal Pending</Button>
                                        <Button className="button-28 rightBtn" id="btn-personal-studentF" onClick={()=>this.switchButtonsToOtherSet("btn-personal-pendF","btn-personal-procF","btn-personal-studentF","btn-student-pendF","btn-student-procF","btn-student-personalF",true,this.state.requestsPendingS)} >Switch to Students</Button>
                                        
                                        <Button id="btn-student-pendF"  className="button-28 leftBtn" onClick={()=> this.switchButtonsGeneric("btn-student-pendF","btn-student-procF",false,this.state.requestsProcessedS)}  hidden>Switch to Student Processed</Button>
                                        <Button className="button-28 leftBtn" id="btn-student-procF" onClick={()=> this.switchButtonsGeneric("btn-student-procF","btn-student-pendF",true,this.state.requestsPendingS)}  hidden>Switch to Student Pending</Button>
                                        <Button className="button-28 rightBtn" id="btn-student-personalF" onClick={()=>this.switchButtonsToOtherSet("btn-student-pendF","btn-student-procF","btn-student-personalF","btn-personal-pendF","btn-personal-procF","btn-personal-studentF",false,this.state.requestsPendingP)} hidden>Switch to Personal</Button>
                                    </div>

                                    <div id="adminButtons" hidden>
                                        <Button  className="button-28 leftBtn" onClick={()=> this.switchButtonsGeneric("btn-student-pendA","btn-student-procA",false,this.state.requestsProcessedS)} id="btn-student-pendA">Switch to Student Processed</Button>
                                        <Button className="button-28 leftBtn" onClick={()=> this.switchButtonsGeneric("btn-student-procA","btn-student-pendA",true,this.state.requestsPendingS)} id="btn-student-procA" hidden>Switch to Student Pending</Button>
                                        <Button  className="button-28 rightBtn" onClick={()=>this.switchButtonsToOtherSet("btn-student-pendA","btn-student-procA","btn-student-facultyA","btn-faculty-pendA","btn-faculty-procA","btn-faculty-studentA",true,this.state.requestsPendingF)} id="btn-student-facultyA">Switch to Faculty</Button>

                                        <Button className="button-28 rightBtn" onClick={()=> this.switchButtonsGeneric("btn-faculty-pendA","btn-faculty-procA",false,this.state.requestsProcessedF)} id="btn-faculty-pendA" hidden>Switch to Faculty Processed</Button>
                                        <Button className="button-28 leftBtn" onClick={()=> this.switchButtonsGeneric("btn-faculty-procA","btn-faculty-pendA",true,this.state.requestsPendingF)} id="btn-faculty-procA" hidden>Switch to Faculty Pending</Button>
                                        <Button className="button-28 rightBtn" onClick={()=>this.switchButtonsToOtherSet("btn-faculty-pendA","btn-faculty-procA","btn-faculty-studentA","btn-student-pendA","btn-student-procA","btn-student-facultyA",true,this.state.requestsPendingS)} id="btn-faculty-studentA"hidden>Switch to Students</Button>
                                    </div>
                                </center>   
                            </div>

                        <div id= "listRequests">
                            <div id= "personalTables" hidden>
                                <p></p>
                    
                                <h2 id="pendingE">My Pending Requests</h2>
                                <div className="userTableContainer">
                                    <Table striped bordered hover onClick={this.deleteRequestList}>      
                                        <thead id="myPendingRequests">
                                        </thead>
                                    </Table>
                                </div>

                                <br/>

                                <h2 id="processedE">My Processed Requests</h2>
                                <div className="userTableContainer">
                                    <Table striped bordered hover >      
                                        <thead id="myProcessedRequests">
                                        </thead>
                                    </Table>
                                </div>

                            </div>

                            <br/>

                            <div id= "facultyTables" hidden>
                                <h2 id="pendingF">Student's Pending Requests</h2>
                                <div className="userTableContainer">
                                    <Table striped bordered hover onClick= {this.processRequestsC}>      
                                        <thead id="studentsPendingRequests">
                                        </thead>
                                    </Table>   
                                </div>

                                <br/>

                                <h2 id="processedf">Student's Processed Requests</h2>
                                <div className="userTableContainer">
                                    <Table striped bordered hover onClick={this.deleteRequestList}>      
                                        <thead id="studentsProcessedRequests">
                                        </thead>
                                    </Table>
                                </div>
                            </div>

                            <br/>

                            <div id= "adminTables" hidden>
                                <h2 id="pendingA">All Pending Requests</h2>
                                <div className="userTableContainer">
                                    <Table striped bordered hover onClick= {this.processRequestsC}>      
                                        <thead id="allPendingRequests"> 
                                        </thead>
                                    </Table>
                                </div>

                                <br/>

                                <h2 id="processed">All Processed Requests</h2>
                                <div className="userTableContainer">
                                    <Table striped bordered hover onClick={this.deleteRequestList}>      
                                        <thead id="allProcessedRequests">
                                        </thead>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
  
  export default RequestsPage;
  
