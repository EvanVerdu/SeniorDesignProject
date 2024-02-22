import React, { Component }from 'react';
import Button from 'react-bootstrap/Button';
import {logOut} from '../features/AuthService';
import {getUserData} from '../features/ResquestUserData';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import { deleteNotification, findNotificationID, findNotificationsE, findNotificationsRT ,findNotificationsC} from '../features/RequestNotificationData';
import CardNotif from './cardNotif';

async function hideAlert(){
    let alert = document.getElementById("alertAO");
    if(alert.getAttribute("hidden") !== null){
        console.log(" unnecessary hide")
    }
    else{
        alert.setAttribute("hidden", true);
    }
}


async function hideSuccess(){
    let alert = document.getElementById("successAO");
    if(alert.getAttribute("hidden") !== null){
        console.log(" unnecessary hide")
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

async function unhideLoad(){
    let alert = document.getElementById("alertAO");
    let alert2 = document.getElementById("successAO");
    let load = document.getElementById("loadAO");
    
    if(load.getAttribute("hidden") !== null){
        load.removeAttribute("hidden"); 
        alert2.setAttribute("hidden", true);
        alert.setAttribute("hidden", true);
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

function toggleNotificationsScreen(){
    //Grabbing DOM elements
    let notifScreen = document.getElementById("notificationScreen");
    let homePage = document.getElementById("homePageBox");

    //If the change notification screen was hidden before, unhide it
    if(notifScreen.getAttribute("hidden") !== null){
        notifScreen.removeAttribute("hidden"); 
        homePage.setAttribute("hidden", true);
        fillNotifTable();
    }
    //otherwise, hide everything and show the general page
    else{
        homePage.removeAttribute("hidden"); 
        notifScreen.setAttribute("hidden", true);
    }
}

// Comparison function to sort objects by date
const compareByDate = (a, b) => {
    const dateTimeA = new Date(a.updatedAt);
    const dateTimeB = new Date(b.updatedAt);
    return dateTimeA - dateTimeB;
};

async function fillNotifTable(){
    let table = document.getElementById("notificationTable");
    let userData = await getUserData();
    let emailObj = {
        recipient: userData.email
    }

    let data = await findNotificationsE(emailObj);

    let userTypeObj = {
        recipientType: userData.userType
    }

    if(userData.userType === "faculty"){
        let helpMessage = document.getElementById("helpMessage");
        if(helpMessage.getAttribute("hidden") !== null){
            helpMessage.removeAttribute("hidden"); 
        }
    }

    let data2 = await findNotificationsRT(userTypeObj);

    if(data && data2){
        for(let i = 0; i < data2.length; i++){
            data.push(data2[i]);
        }
    }
    if(userData.userType === "admin"){
        let helpMessage = document.getElementById("helpMessage");
        if(helpMessage.getAttribute("hidden") !== null){
            helpMessage.removeAttribute("hidden"); 
        }
        let facultyObj = {
            recipientType: "faculty"
        }
        let data3 = await findNotificationsRT(facultyObj);
        if(data3){
            for(let i = 0; i < data3.length; i++){
                data.push(data3[i]);
            }
        }
    }
    
    // Sort the array of objects by date
    data.sort(compareByDate);

    if(data.length > 0){
        document.getElementById("notifButton").classList.remove('btn-primary');
        document.getElementById("notifButton").classList.add('btn-info');
    }
    else{
        document.getElementById("notifButton").classList.remove('btn-info');
        document.getElementById("notifButton").classList.add('btn-primary');
    }

    //Clears the table before generating new rows
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

      //Creates a row saying "No events found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "<center><h3>No notifications!</h3></center>";
        document.getElementById("notificationTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th>Subject</th><th>Message</th><th>Date</th><th>Button</th></tr>";
     //Creates a new element "table row"
     let trH = document.createElement("tr");
     //Sets that element's innerHTML to the string we created
     trH.innerHTML = stringH;
     //Appends the new row to the bottom of the table
     document.getElementById("notificationTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = data.length-1; i >= 0; i--){
        //Grabs the single bit of data
        let notification = data[i];
    
        //Sets up a string to be manupulated depending on the information from the data
        let string = "";
    

            
        string+= "<td>";
        //Adds description to the string if it has one
        if(notification.subject){
            let subject = notification.subject;
            string += subject;
        }
        else{
            string+= "None";
        }
        string+= "</td>";
            
        string+= "<td>";
        string+= notification.message;
        string+= "</td>";
    
        //Creates a new element "table row"
        let tr = document.createElement("tr");
        if(notification.recipientType && notification.recipientType === "faculty"){
            tr.style.backgroundColor = "lightblue";
        }
        else if(notification.recipientType && notification.recipientType === "admin"){
            tr.style.backgroundColor = "peachpuff"; 
        }
        var date = new Date(notification.updatedAt);
        date.toDateString();
        string += "<td>" + date + "</td>"; 
    
        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string + "<td><button class='button-28 bb' id='deleteBtn" + notification._id + "'>Delete</button></td>";
    
        //Appends the new row to the bottom of the table
        document.getElementById("notificationTable").appendChild(tr);
    } 
}


//Adds user data specific elements to the page upon loading
async function generatePage(){
    await fillNotifTable();
    let data = await getUserData();
    if(data.userType === "admin"){
        document.getElementById("accountOptionsBtn").innerHTML = "Admin options"
    }

    //If the user has no name, they will be prompter to create one in the account/admin settings
    if(!data.firstName){
        let noNameAlert =  document.getElementById("noNameAlert");
        noNameAlert.removeAttribute("hidden"); 
    }
    if(!data.crewPosition){
        let noCrewPositionAlert =  document.getElementById("noCrewPositionAlert");
        noCrewPositionAlert.removeAttribute("hidden"); 
    }
}

export default class HomePage extends Component {

    //Checks if the page is fully loaded
    componentDidMount() {
        generatePage();
        this.fetchNotif();
      }
    
    //Logs out the user
    logout = (e) =>{
        logOut();
        window.location.reload(false);
    }
    constructor(props){
        super(props)
        this.state = {
            notif:[],
            currentNotifPageArr:[],
            currentPageNo:1,
            maxPageNo:1,
            numNotifPerPage:10
        }
    }
    
     deleteNotificaitionFromTable =async(e)=>{
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        //Gets the id
        let index = e.target.id;
    
        //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
        if(!index.includes("deleteBtn")){
          return;
        }
          //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
        index = index.replaceAll('deleteBtn', '');
    
        let notifObj = {
          id: index
        }
       
    
       if (window.confirm("Are you sure about deleting this notification? Faculty and admin notifications will be deleted for all faculty and admin. This cannot be undone!") === true) {
            unhideLoad();
            let status = await deleteNotification(notifObj);
            console.log(status);
            status = status.status;
            
            if(status !== true){
            header.innerHTML = "Error deleting notification!";
            unHideAlert();
            }
            else{
            header2.innerHTML = "Successfully deleted notification!";
            unHideSuccess();
            await fillNotifTable();

            //DELETES STUFF FROM CARDS LIST

            let userData = await getUserData();
            let notifQuery;
            if( userData.userType === "admin"){ //if the admin is the user
                notifQuery = {
                    recipientType:"faculty",
                    recipientType2:"admin",
                    recipient: userData.email
                }
            }
            else if(userData.userType ==="faculty") //if the faculty member is the user
            {
                notifQuery = {
                    recipientType:"faculty",
                    recipientType2:"",
                    recipient: userData.email
                }
            }
            else 
            {
                notifQuery = {
                    recipientType:"",
                    recipientType2:"",
                    recipient: userData.email
                }
            }
        
            let data = await findNotificationsC(notifQuery);

            this.setState({
                notif: data,
                maxPageNo: Math.ceil ( data.length /this.state.numNotifPerPage),
                currentPageNo:1,
                currentNotifPageArr: (data.length>this.state.numNotifPerPage)?data.slice(0,this.state.numNotifPerPage-1) :data.slice(0,data.length)
            })
            console.log(data)

            let rigBtn = document.getElementById("rightPgButton");
            let leftBtn = document.getElementById("leftPgButton");
            if( Math.ceil(data.length/this.state.numNotifPerPage) === 1)
            {
                leftBtn.setAttribute("disabled", true);
                rigBtn.setAttribute("disabled", true);
            }
            else if( Math.ceil(data.length/this.state.numNotifPerPage) > 1)
            {
                leftBtn.setAttribute("disabled", true);
                rigBtn.removeAttribute("disabled");
            }
            else
            {
                leftBtn.removeAttribute("disabled");
                rigBtn.removeAttribute("disabled");
    
            }

            return;
            }
        }
        else{
          header.innerHTML = "Cancelled";
        }
    
    }

    testToggle= (e)=>{
        let testNotif = document.getElementById("cardNotif");
        let listNotif = document.getElementById("notUserTableContainer");

        //If the change user type screen was hidden before, unhide it
        if(testNotif.getAttribute("hidden") !== null){
            testNotif.removeAttribute("hidden");
            if(listNotif){
                listNotif.setAttribute("hidden", true);
            }
            
        }
        //otherwise, hide everything and show the general page
        else{
            testNotif.setAttribute("hidden", true);
            if(listNotif){
                listNotif.removeAttribute("hidden");
            }
        }

    }

    updateNotif = async(e) =>{
        let newData = this.state.notif;
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");

        let notifObj = {
            id: e[0]._id
          }
          console.log("notifObject")
          console.log(notifObj)

        var deletedNotif = await deleteNotification(notifObj);
        //console.log(deletedNotif.status);
        
        //REALLY DUMB WAY TO FILTER RESULTS WITHOUT CALLING DELETE
        var index = newData.findIndex(obj => obj._id===e[0]._id);
        //console.log("spliced array below  "+index);
        console.log(newData.splice(index,1)) //NOTE: AFTER THIS IS CALLED NEWDATA IS NOW WITHOUT THE SPECIFIC INDEX 

        if(deletedNotif.status !== true){
            header.innerHTML = "Error deleting notification!";
            unHideAlert();
            return;
            }
            else{
            header2.innerHTML = "Successfully deleted notification!";
            unHideSuccess();}
        //end of dumb filter method
        await fillNotifTable();


        if(newData.length % this.state.numNotifPerPage ===0 && this.state.maxPageNo !== 1 && this.state.maxPageNo === this.state.currentPageNo)     //if the deleted card is the only one left in a a page AND its not the first page (1 entry) AND its the last page is the currentPageNo
        {
            //console.log("NEW PAGE!!!!!")
            let m =  this.state.maxPageNo    - 1; //reduce the max page count
            let c = this.state.currentPageNo - 1; //reduce the current page count
            this.setState({
                notif: newData,
                maxPageNo: m,
                currentPageNo: c,
                currentNotifPageArr: this.state.notif.slice((m-1)*this.state.numNotifPerPage,((m-1)*this.state.numNotifPerPage)+this.state.numNotifPerPage)
            })
            return;
        }
        else if(newData.length ===1)  //you are deleting the last notification you have (newData is empty)
        {
            this.setState({
                notif: newData,
                maxPageNo: 1,
                currentPageNo: 1,
                currentNotifPageArr: newData
            })
            return;
        }
        else if (newData.length % this.state.numNotifPerPage === 0 && this.state.maxPageNo !== 1 && this.state.maxPageNo !== this.state.currentPageNo)//you delete enough notifications that arent on your current page but enough to reduce the maxoage count
        {
            //console.log("DELETED ENOUGH TO GET HERE!")
            //console.log(this.state.currentPageNo)
            let m =  this.state.maxPageNo    - 1; //reduce the max page count
            //console.log(this.state.notif.slice(20,30))
            //console.log((this.state.currentPageNo)*10)
            //console.log(this.state.notif.slice((this.state.currentPageNo-1)*10,((this.state.currentPageNo-1)*10)+10))
            this.setState({
                notif: newData,
                maxPageNo: m,
                currentNotifPageArr: this.state.notif.slice((this.state.currentPageNo-1)*this.state.numNotifPerPage,((this.state.currentPageNo-1)*this.state.numNotifPerPage)+this.state.numNotifPerPage)
            })
            return;
        }
        
        let maxPageNo = (Math.ceil(newData.length/this.state.numNotifPerPage));
        //console.log("maxPageNo CALCULATION   "   +maxPageNo)
        this.setState({maxPageNo: maxPageNo})

        if (this.state.currentPageNo ===maxPageNo)//this case is if you are on the last page but it has more than 1 entry so you stay on it
        {
            //console.log(newData.slice((maxPageNo-1)*10,(newData.length)))
            this.setState({currentNotifPageArr: newData.slice((this.state.maxPageNo -1) *this.state.numNotifPerPage,newData.length)})
            return
        }
        this.setState({currentNotifPageArr:newData.slice((this.state.currentPageNo -1) *this.state.numNotifPerPage,(((this.state.currentPageNo -1) *this.state.numNotifPerPage)+this.state.numNotifPerPage))})
        await fillNotifTable();
    }

    clearCurr = (e)=>{
        this.setState({currentNotifPageArr:[]})
        return
    }

    fetchNotif = async(e)=>{
        let userData = await getUserData();
        let notifQuery;
        let leftBtn = document.getElementById("leftPgButton");
        let rigBtn = document.getElementById("rightPgButton");
        leftBtn.setAttribute("disabled",true); 
        if( userData.userType === "admin"){ //if the admin is the user
            notifQuery = {
                recipientType:"faculty",
                recipientType2:"admin",
                recipient: userData.email
            }
        }
        else if(userData.userType ==="faculty") //if the faculty member is the user
        {
            notifQuery = {
                recipientType:"faculty",
                recipientType2:"",
                recipient: userData.email
            }
        }
        else 
        {
            notifQuery = {
                recipientType:"",
                recipientType2:"",
                recipient: userData.email
            }
        }
    
        let data = await findNotificationsC(notifQuery);

        let max = (Math.ceil(data.length/this.state.numNotifPerPage));
        this.setState({
            notif: data,
            currentPageNo: 1,
            maxPageNo:max,
        })
 
        let arr =data;
        if(max !== 1)
            arr =arr.slice(0,this.state.numNotifPerPage)
        this.setState({
            currentNotifPageArr: arr
        })
        if (max ===1)
            rigBtn.setAttribute("disabled",true); 


        //console.log(this.state.notif);
        //console.log(this.state.currentNotifPageArr);

    }
    scrollRight = async(e)=>{
        //console.log("RIGHT: BEFORE NEW SET PAGE")
        //console.log(this.state.currentNotifPageArr)
        //console.log("current page: "+ this.state.currentPageNo)
        //console.log("current notif array");
        //console.log(this.state.currentNotifPageArr);
        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        leftBtn.removeAttribute("disabled"); 
        if (this.state.maxPageNo <= this.state.currentPageNo)
        {
            console.log("NOr")
            return;
        }
        //this.state.currentPageNo++;
        this.setState({currentPageNo: this.state.currentPageNo + 1})
        //console.log("CURRENT PAGE AFTER SET STATE CHECK    "+this.state.currentPageNo);
        let pageDisplayNotif = document.getElementById("pageDisplayNotif")
        let temp = this.state.currentPageNo + 1;
        //console.log("temp    "+ temp+"    this.state.currentPageNo: "+ this.state.currentPageNo)
        pageDisplayNotif.innerText = temp;

        //console.log("END CHECK PAGES: CURRENT    MAX");
        //console.log("                 "+this.state.currentPageNo + "    "+ this.state.maxPageNo);


        if(this.state.maxPageNo === temp)
        {
            //console.log("REACHED END FLAG")
            this.setState({currentNotifPageArr:  this.state.notif.slice(((this.state.maxPageNo-1)*this.state.numNotifPerPage),((this.state.notif.length)))})  
            rigBtn.setAttribute('disabled',true);
            return;
        }
        //console.log("Right successful!")
        //console.log("new current page: "+ this.state.currentPageNo+ "   temp results:  "+ temp)
        let newPage = this.state.notif.slice((temp-1)*this.state.numNotifPerPage,((temp-1)*this.state.numNotifPerPage)+this.state.numNotifPerPage);
        //console.log("NEW SET PAGE")
        //console.log(newPage)
        this.setState({
            currentNotifPageArr: newPage,
        });
        return;
        
    }

    scrollLeft = async(e)=>{
        //console.log("Left: BEFORE NEW SET PAGE")
        //console.log(this.state.currentNotifPageArr)
        //console.log("LEFT")
        //console.log("current notif array");
        //console.log(this.state.currentNotifPageArr);

        //console.log("total notif array");
        //console.log(this.state.notif);
        //this.clearCurr();
        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        if (this.state.currentPageNo === 1)
        {
            console.log("NOl")
            return;
        }
        rigBtn.removeAttribute("disabled");
        this.setState({currentPageNo: this.state.currentPageNo- 1, currentNotifPageArr:[]})
        let temp = this.state.currentPageNo - 1;
        let pageDisplayNotif = document.getElementById("pageDisplayNotif")
        pageDisplayNotif.innerText = this.state.currentPageNo;
        let newPage = (temp-1)*this.state.numNotifPerPage;
        //console.log("current notif")
        //console.log(this.state.notif.slice(0,10))
        this.setState({currentNotifPageArr: this.state.notif.slice(newPage,newPage+this.state.numNotifPerPage)})
        if (temp ===1)
        {
            leftBtn.setAttribute("disabled", true);
        }
        return;
        
    }

    selectNewNo =async() =>{
        let pageDisplayNotifsNo = parseInt(document.getElementById("selectPageNo").value);
        this.setState({numNotifPerPage: pageDisplayNotifsNo,
                    currentPageNo:1,
                    currentNotifPageArr:(this.state.notif.length<pageDisplayNotifsNo)?this.state.notif.slice(0,this.state.notif.length):this.state.notif.slice(0,pageDisplayNotifsNo),
                    maxPageNo: Math.ceil(this.state.notif.length/pageDisplayNotifsNo),
        })
        let rigBtn = document.getElementById("rightPgButton");
        let leftBtn = document.getElementById("leftPgButton");
        if( Math.ceil(this.state.notif.length/pageDisplayNotifsNo) === 1)
        {
            leftBtn.setAttribute("disabled", true);
            rigBtn.setAttribute("disabled", true);
        }
        else if( Math.ceil(this.state.notif.length/pageDisplayNotifsNo) > 1)
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



    //The jsx
    render() {
        const {currentNotifPageArr,notif} =this.state;

        return(
            <div id="homeboxdivid" className="ci">
            <center id='homePageBox' className='homePageBox ci'>
                <div id="noNameAlert" hidden>
                    <Alert variant="warning">
                        <Alert.Heading>Update your name in the Account/Admin Options!</Alert.Heading>
                    </Alert>
                </div>
                <div id="noCrewPositionAlert" hidden>
                    <Alert variant="warning">
                        <Alert.Heading>Update your crew position in the Account/Admin Options!</Alert.Heading>
                    </Alert>
                </div>
                <h1 id="homePageWords">
                    Home Page
                </h1>
                <Link to="/schedulePage"><Button className="button-28" id="scheduleBtn">Schedule</Button></Link>
                <Link to="/requests"><Button className="button-28" id="requestsOptionsBtn">Requests</Button></Link>
                <Link to="/accountOptions"><Button className="button-28" id="accountOptionsBtn">Account Options</Button></Link>
                <center><Button className="button-28" onClick={toggleNotificationsScreen} id="notifButton">Notifications</Button></center>
            </center>
            
            <div className="white ci" id="notificationScreen" hidden> 
               <center><h1>Notifications</h1></center>
               
               <center><Button className="button-28" onClick={toggleNotificationsScreen} id="NotifBackBtn">Back</Button></center>
               <h2 id="notifH2"> </h2>
               <center><p id="helpMessage" hidden>Orange are admin notifications, blue are faculty included notifications.</p></center>
               <div className='checkTest'>
                <center>
                    <input type="checkbox" id="switch"className="switch" onChange={this.testToggle} ></input>
                    <label htmlFor="switch">Card View</label>
                    <center><p>Total Notifications: {notif.length}</p></center>
               </center>
               </div>
               <div id="cardNotif" hidden>
                    
                    {/*<center>{notif.map(notif=> <CardNotif recipient={notif.recipient} subject={notif.subject} message={notif.message} nid={notif._id} recipientType={notif.recipientType} date={notif.updatedAt}/>)}</center>*/}
                <center><div id="cardContainer">{currentNotifPageArr.map(currentNotifPageArr=> <CardNotif updateNotif= {this.updateNotif} recipient={currentNotifPageArr.recipient} subject={currentNotifPageArr.subject} message={currentNotifPageArr.message} key ={currentNotifPageArr._id} nid={currentNotifPageArr._id} recipientType={currentNotifPageArr.recipientType} date={currentNotifPageArr.updatedAt}/>)}</div></center>
                <center>
                    <div id="pageButtonCenter">
                        <Button onClick={this.scrollLeft} style ={{minWidth:"80px"}} id ="leftPgButton" className="button-28"></Button>
                        <p id="pageDisplayNotif">{this.state.currentPageNo}</p>
                        <Button onClick={this.scrollRight} style ={{minWidth:"80px"}} id = "rightPgButton" className="button-28"></Button>
                    </div>
                    <select id="selectPageNo" onChange={this.selectNewNo} defaultValue={10}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>    
                </center>


                </div>
                <div id="notUserTableContainer" className ="userTableContainer">
                    <Table striped bordered hover onClick={this.deleteNotificaitionFromTable}>      
                        <thead id="notificationTable">
                        </thead>
                    </Table>
                </div>

                </div>
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
            </div>
        )
    }
}
