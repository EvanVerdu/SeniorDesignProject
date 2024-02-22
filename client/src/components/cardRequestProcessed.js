import React, {Component} from 'react';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
//import { deleteNotification, findNotificationID} from '../features/RequestNotificationData';

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

class CardRequestP extends Component{
    constructor(props){
        super(props);
        this.state = {
            requestingUser:      props.requestingUser,
            userType:            props.userType, 
            name:                props.name,
            dateRequested:       props.dateRequested,
            dateRequestedEnd:    props.dateRequestedEnd,
            description:         props.description,
            accepted:            props.accepted,
            approvingUser:       props.approvingUser,
            reason:              props.reason,
            seenNotification:    props.seenNotification,
            updatedAt:           props.updatedAt,
            rid:                 props.rid,
            editable:            props.editable,
            currentUser:         props.currentUser
        }
    }
    deleteRequest = (e) =>{
        this.props.processRequestsC(e);
    }

    processModeA = (e) =>{
        let displayAccept   = document.getElementById("formAcceptRequest" +this.state.rid);
        let acceptScreen    = document.getElementById("acceptRequestMode" +this.state.rid);

        //If the change user type screen was hidden before, unhide it
        if(acceptScreen.getAttribute("hidden") !== null){
            acceptScreen.removeAttribute("hidden"); 
            displayAccept.setAttribute("hidden", true);
        }
        //otherwise, hide everything and show the general page
        else{
            displayAccept.removeAttribute("hidden"); 
            acceptScreen.setAttribute("hidden", true);
        }
    }

    processModeD = (e) =>{
        let displayAccept   = document.getElementById("formAcceptRequest" +this.state.rid);
        let declineScreen    = document.getElementById("declineRequestMode" +this.state.rid);

        //If the change user type screen was hidden before, unhide it
        if(declineScreen.getAttribute("hidden") !== null){
            declineScreen.removeAttribute("hidden"); 
            displayAccept.setAttribute("hidden", true);
        }
        //otherwise, hide everything and show the general page
        else{
            displayAccept.removeAttribute("hidden"); 
            declineScreen.setAttribute("hidden", true);
        }
    }
    deleteModeToggle = ()=>{
        console.log("requestingUser:  " +this.state.requestingUser+"     this.state.currentuser: "+this.state.currentUser)
        if ((this.state.accepted===0 && (this.state.currentUser===this.state.requestingUser))||((this.state.accepted !==0) &&(this.state.currentUser!==this.state.requestingUser))){
            document.getElementById("delToggle"+this.state.rid).removeAttribute("hidden")
        }

    }
    toggleDeletePress = ()=>{
        let rid = this.state.rid;
        let deleteMode = document.getElementById("deleteReq"+rid)
        let delModeBtn = document.getElementById("delToggle"+rid)
        if(deleteMode.getAttribute("hidden") !== null)
        {
            deleteMode.removeAttribute("hidden")
            delModeBtn.setAttribute("hidden",true)
        }
        else{
            deleteMode.setAttribute("hidden",true)
            delModeBtn.removeAttribute("hidden")
        }

    }


    dateStringifier = (e) =>{
        let date = new Date(e);
        return date.toString().substring(0,15);
    }

    componentDidMount() {
        this.deleteModeToggle();
    }
    



    render(){
        return(
                <div className = "cardContainerRequestDisplay" id = {"cardContainerRequestDisplay"+this.state.rid} >
                    <div className="cardContentRequest">

                    </div>
                    <div>
                        {(this.props.name ==="null , null")?<h3>No Name</h3>:<h3>{formatName(this.props.name)}</h3>}
                        <h5>{this.props.userType}</h5>
                        <h6>{this.props.requestingUser}</h6>
                        <h4>{(this.props.dateRequested === this.props.dateRequestedEnd) ? this.dateStringifier(Date.parse(this.props.dateRequested)) :this.dateStringifier(Date.parse(this.props.dateRequested))+" - "+this.dateStringifier(Date.parse(this.props.dateRequestedEnd))}</h4>
                        <h5>Description:</h5><br/>
                        <h6>{this.props.description}</h6><br/>
                        <h5 style ={{color:(this.props.accepted ===1)?"lawngreen":"red"}}>{(this.props.accepted === 1)? "Accepted" : ((this.props.accepted === 2)? "Denied":"Processing")}</h5>
                        <p>{(this.props.approvingUser ==="N/A")?"":"Processed by: "+this.props.approvingUser+" on "+this.dateStringifier(this.props.updatedAt)}</p>
                        <p>{(this.props.approvingUser ==="N/A")?"":"Reason: "+this.props.reason }</p>
                        <Button hidden className = "button-28" id={"delToggle"+this.props.rid} onClick={this.toggleDeletePress}>Delete</Button>
                        <div id={"deleteReq"+this.state.rid} hidden>
                            <h6 style={{color: "red"}}>Are you sure you want to delete this request?</h6>
                            <Button onClick={this.toggleDeletePress} className = "button-28">Cancel</Button>
                            <Button id={"delBtn"+this.state.rid} onClick={this.deleteRequest}className = "button-28 redBtn" style={{backgroundColor:'red'}}>Delete</Button>

                        </div>

                    </div>
                    


                </div>
        )
    }

}

export default CardRequestP;