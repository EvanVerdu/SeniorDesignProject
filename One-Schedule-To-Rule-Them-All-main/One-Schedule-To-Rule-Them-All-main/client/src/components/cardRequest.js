import React, {Component} from 'react';
//import Form from "react-bootstrap/Form"
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

class CardRequest extends Component{
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
            editable:            props.editable
        }
    }
    processRequest = (e) =>{
        this.props.processRequestsC(e);
    }

    processModeA = (e) =>{
        let displayAccept   = document.getElementById("formAcceptRequest" +this.state.rid);
        let acceptScreen    = document.getElementById("acceptRequestMode" +this.state.rid);
        let acceptTextB    =document.getElementById("reasonA" +this.state.rid);

        //If the change user type screen was hidden before, unhide it
        if(acceptScreen.getAttribute("hidden") !== null){
            acceptScreen.removeAttribute("hidden"); 
            displayAccept.setAttribute("hidden", true);
        }
        //otherwise, hide everything and show the general page
        else{
            displayAccept.removeAttribute("hidden"); 
            acceptScreen.setAttribute("hidden", true);
            acceptTextB.value = "N/A"
        }
    }

    processModeD = (e) =>{
        let displayAccept   = document.getElementById("formAcceptRequest" +this.state.rid);
        let declineScreen    = document.getElementById("declineRequestMode" +this.state.rid);
        let declineTextB    =document.getElementById("reasonD" +this.state.rid);

        //If the change user type screen was hidden before, unhide it
        if(declineScreen.getAttribute("hidden") !== null){
            declineScreen.removeAttribute("hidden"); 
            displayAccept.setAttribute("hidden", true);
        }
        //otherwise, hide everything and show the general page
        else{
            displayAccept.removeAttribute("hidden"); 
            declineScreen.setAttribute("hidden", true);
            declineTextB.value = "N/A"

        }
    }



    dateStringifier = (e) =>{
        let date = new Date(e);
        return date.toString().substring(0,15);
    }



    render(){
        return(
                <div className = "cardContainerRequestDisplay" id = {"cardContainerRequestDisplay"+this.state.rid} >
                    <div className="cardContentRequest">

                    </div>
                    <div>
                        {(this.props.name ==="null , null")?<h3>No Name</h3>:<h3>{formatName(this.props.name)}</h3>}
                        <h3>{this.props.userType}</h3>
                        <h6 style={{wordWrap: "break-word"}}>{this.props.requestingUser}</h6>
                        <h4>{(this.props.dateRequested === this.props.dateRequestedEnd) ? this.dateStringifier(Date.parse(this.props.dateRequested)) :this.dateStringifier(Date.parse(this.props.dateRequested))+" - "+this.dateStringifier(Date.parse(this.props.dateRequestedEnd))}</h4>
                        <h5>{"Description: " +this.props.description}</h5><br/>
                        <p>{(this.props.approvingUser ==="N/A")?"":this.props.approvingUser}</p>
                    </div>
                    
                    <div className = "formAcceptRequest" id = {"formAcceptRequest"+this.state.rid} >
                        <Button type="button" className="acceptRequestMode button-28 leftBtn" id = {"cancelAcceptRequest" +this.state.rid} onClick ={this.processModeA}>Accept</Button>
                        <Button type="button" className="acceptRequestMode button-28 rightBtn" id = {"cancelAcceptRequest" +this.state.rid} onClick ={this.processModeD}>Decline</Button>
                    </div>
                    <div className = "acceptRequestMode" id = {"acceptRequestMode"+this.state.rid} hidden>
                        <p>You are accepting this request</p>
                        <textarea className="requestReason"  placeholder = "Write your reason for accepting the request here." defaultValue={"N/A"} id = {"reasonA"+this.state.rid}/><br/>
                        <Button type="button" className="cancelAcceptRequest button-28 leftBtn" id = {"cancelAcceptRequest" +this.state.rid} onClick ={this.processModeA}>Cancel</Button>
                        <Button type="button" className="acceptRequest button-28 rightBtn" id = {"acceptRequest" +this.state.rid} onClick={this.processRequest} >Accept</Button>
                    </div>
                    <div className = "declineRequestMode" id = {"declineRequestMode"+this.state.rid} hidden>
                        <p>You are declining this request</p>
                        <textarea className="requestReason" placeholder = "Write your reason for denying the request here."  defaultValue={"N/A"} id = {"reasonD"+this.state.rid}/><br/>
                        <Button type="button" className="cancelDeclineRequest button-28 leftBtn" id = {"cancelDeclineRequest" +this.state.rid} onClick ={this.processModeD}>Cancel</Button>
                        <Button type="button" className="denyRequest button-28 rightBtn" id = {"denyRequest" +this.state.rid} onClick={this.processRequest} >Decline</Button>
                    </div>


                </div>
        )
    }

}

export default CardRequest;