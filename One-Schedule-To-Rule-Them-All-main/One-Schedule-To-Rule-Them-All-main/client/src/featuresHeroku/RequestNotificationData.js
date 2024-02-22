import axios from "axios"

export const addGenericNotification = (notification) => {

    let newNotifObj = {
        recipient: notification.recipient,
        subject: notification.subject,
        message: notification.message,
        recipientType: notification.recipientType
    }

    axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/notification/addGeneric", JSON.stringify(newNotifObj),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.status === 201) {
                    console.log("New notification added successfully!");
                }else{
                    console.log("error");
                }
                return res.data;
            })
}

export const addNotification = (notification) => {

    let newNotifObj = {
        recipient: notification.recipient,
        subject: notification.subject,
        message: notification.message
    }

    axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/notification/add", JSON.stringify(newNotifObj),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.status === 201) {
                    console.log("New notification added successfully!");
                }else{
                    console.log("error");
                }
                return res.data;
            })
}

//E stands for Email
export const findNotificationsE = async(email) =>{
    let notifData = null;

    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/notification/findE", JSON.stringify(email),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    notifData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (notifData);
            }
            catch{
                return null;
            }
}

//RT stands for Recipient Type
export const findNotificationsRT = async(recipientType) =>{
    let notifData = null;

    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/notification/findRT", JSON.stringify(recipientType),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    notifData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (notifData);
            }
            catch{
                return null;
            }
}

export const findAllNotifications = async() =>{
    let nData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/notification/findAll",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    nData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (nData);
            }
            catch{
                return null;
            }
}

export const findNotificationID = async(id) =>{
    let data = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/notification/findID", JSON.stringify(id),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    data = res.data;
                }else{
                    console.log("error");
                } 
            })
            try{
                return (data);
            }
            catch{
                return null;
            }
}

export const deleteNotification = async (id) => {

    try {
      const response = await axios.post(
        "https://teamkingpin-5b27c84fd0dd.herokuapp.com/notification/delete", JSON.stringify(id),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data) {
        return response.data;
      }
      else {
        console.log("error");
        return null;
      }
    } catch (error) {
      console.log("error", error);
      return null;
    }
  };

  //E stands for Email
export const findNotificationsC = async(query) =>{
    let notifData = null;
    let notifQuery = {    
        recipientType: query.recipientType,
        recipientType2: query.recipientType2,
        recipient:      query.recipient
    }

    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/notification/findC", JSON.stringify(notifQuery),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    notifData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (notifData);
            }
            catch{
                return null;
            }
}