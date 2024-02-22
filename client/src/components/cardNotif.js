import React, {Component} from 'react';
//import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import {  findNotificationID} from '../features/RequestNotificationData';



class CardNotif extends Component{
    constructor(props){
        super(props);
        this.state = {
            recipient: props.recipient,
            message: props.message, 
            subject: props.subject,
            recipientType: props.recipientType,
            nid: props.nid,
            date: props.date
        }
    }
    updateNotifPage = (e) =>{
        this.props.updateNotif(e);
    }

    deleteMode = (e) =>{
        let displayNotif = document.getElementById("formDelNotif" +this.state.nid);
        let delScreen    = document.getElementById("notifDelMode" +this.state.nid);

        //If the change user type screen was hidden before, unhide it
        if(delScreen.getAttribute("hidden") !== null){
            delScreen.removeAttribute("hidden"); 
            displayNotif.setAttribute("hidden", true);
        }
        //otherwise, hide everything and show the general page
        else{
            displayNotif.removeAttribute("hidden"); 
            delScreen.setAttribute("hidden", true);
        }


    }

    dateStringifier = (e) =>{
        let date = new Date(e);
        return date.toString();
    }

    deleteNotif = async(e)=>{

        let id = this.state.nid;
        console.log("ID FOR CARD OUTPUT:   " +id)

        let notif = {
            id:    id
        }
        console.log(notif);
        let data =await findNotificationID(notif)
        console.log(data);
        this.updateNotifPage(data);
        /*
        await deleteExercise(exercise);
        this.deleteMode();
        this.updateDays();*/
        //window.location.reload(false);

        }

    render(){
        return(
            <div>
                <div className = "cardContainerNotifDisplay" id = {"cardContainerNotifDisplay"+this.state.nid} style ={ (this.props.recipientType==="admin") ? {backgroundColor:'peachpuff'}:((this.props.recipientType==="faculty")?{backgroundColor:'lightblue'}:{backgroundColor:"white"})}>
                    <div className="cardContentNotif">


                    </div>
                    <div>
                        <h3>{this.props.subject}</h3>
                        <h4>{this.dateStringifier(Date.parse(this.props.date))}</h4>
                    </div>
                    <p>{this.props.message}</p>
                    <div className ="deleteNotifMode" id={"notifDelMode"+this.state.nid}hidden>
                        <h6 style={{color:"red"}}> Are you sure you want to delete this notification?</h6>
                        <form>
                            <Button type="button" className="cancelDelModeNotif button-28 leftBtn" id = {"cancelDelModeNotif" +this.state.nid} onClick ={this.deleteMode}>Cancel</Button>
                            <Button type="button" className="delNotif button-28 rightBtn redBtn" id = {"delNotif" +this.state.nid} onClick ={this.deleteNotif} style={{backgroundColor:"red", border: "2px solid black !important"}}>Delete</Button>
                        </form>
                    </div>
                    <div className ="formDelNotif" id={"formDelNotif"+this.state.nid}>
                        <form>
                            <Button type="button" className="buttonCardNotif button-28" id={"deleteNotifMode"+this.state.nid} onClick ={this.deleteMode}>Delete</Button> 
                        </form>
                    </div>

                </div>
            </div>
        )
    }

}

export default CardNotif;