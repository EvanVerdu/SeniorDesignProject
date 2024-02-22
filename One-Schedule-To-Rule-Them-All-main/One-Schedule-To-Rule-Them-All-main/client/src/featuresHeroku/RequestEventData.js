import axios from "axios"

export const addEvent = async(event) => {

    try {
        let newEventObj = {
            title: event.title,
            name: event.name,
            startDate: event.startDate,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            type: event.type,
            syllabus: event.syllabus,
            instructors: event.instructors,
            students: event.students
        }
        
        const response = await axios.post(
            "https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/add",
            JSON.stringify(newEventObj),
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
}

export const findAllEvents = async() =>{
    let eventData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/findAll",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    eventData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (eventData);
            }
            catch{
                return null;
            }
}

export const findAllEventsOrdered = async() =>{
    let eventData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/findAllOrdered",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    eventData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (eventData);
            }
            catch{
                return null;
            }
}

export const findEventN = async(name) =>{
    let userData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/findN", JSON.stringify(name),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    userData = res.data;
                }else{
                    console.log("error");
                } 
            })
            try{
                return (userData);
            }
            catch{
                return null;
            }
}

export const findConflictsByUser = async(email) =>{
    let userData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/findConflictsByUser", JSON.stringify(email),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    userData = res.data;
                }else{
                    console.log("error");
                } 
            })
            try{
                return (userData);
            }
            catch{
                return null;
            }
}

export const deleteEvent = async (id) => {

    try {
      const response = await axios.post(
        "https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/delete",
        JSON.stringify(id),
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

export const findEventID = async(id) =>{
    let userData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/findID", JSON.stringify(id),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    userData = res.data;
                }else{
                    console.log("error");
                } 
            })
            try{
                return (userData);
            }
            catch{
                return null;
            }
}

export const findStudentsEvents = async(email) =>{
    let userData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/findStuEmail", JSON.stringify(email),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    userData = res.data;
                }else{
                    console.log("error");
                } 
            })
            try{
                return (userData);
            }
            catch{
                return null;
            }
}

export const findInstructorsEvents = async(email) =>{
    let userData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/findInstEmail", JSON.stringify(email),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    userData = res.data;
                }else{
                    console.log("error");
                } 
            })
            try{
                return (userData);
            }
            catch{
                return null;
            }
}

export const updateEvent = async(event) => {

    try {
        const response = await axios.post(
            "https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/updateEvent",
            JSON.stringify(event),
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
}

export const updateAttendingStudents = async(event) => {

    try {
        const response = await axios.post(
            "https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/updateAttendingStudents",
            JSON.stringify(event),
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
}

export const updateAttendingInstructors = async(event) => {

    try {
        const response = await axios.post(
            "https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/updateAttendingInstructors",
            JSON.stringify(event),
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
}

export const updateConflicts = async(conflict) => {
    let status = null;
    axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/updateConflicts", JSON.stringify(conflict),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
        if (res.data) {
            status = res.status;
        }else{
            console.log("error");
        }
    })
    try{
        return (status);
    }
    catch{
        return null;
    }
}

export const deleteUserUpdateAttendanceStu = async(emails) => {
    let status = null;
    axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/deleteUserUpdateAttendanceStu", JSON.stringify(emails),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
        if (res.data) {
            status = res.status;
        }else{
            console.log("error");
        }
    })
    try{
        return (status);
    }
    catch{
        return null;
    }
}

export const deleteAll = async() => {
    try {
        const response = await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/deleteALL",
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
        );
    
        if (response.data) {
            return response.data;
        } else {
            console.log("error");
            return null;
        }
    } catch (error) {
        console.log("error", error);
        return null;
    }

}


export const deleteUserUpdateAttendanceInst = async(emails) => {
    let status = null;
    axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/deleteUserUpdateAttendanceInst", JSON.stringify(emails),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
        if (res.data) {
            status = res.status;
        }else{
            console.log("error");
        }
    })
    try{
        return (status);
    }
    catch{
        return null;
    }
}

export const clearConflicts = async() => {
    let status = null;
    axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/clearConflicts",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
        if (res.data) {
            status = res.status;
        }else{
            console.log("error");
        }
    })
    try{
        return (status);
    }
    catch{
        return null;
    }
}

export const updateCertainEventSyllabusNew = async (syllabus) => {
    try {
        const response = await axios.post(
        "https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/updateCertainSyllabusNew",
        JSON.stringify(syllabus),
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
        );
    
        if (response.data) {
            return response.data;
        } else {
            console.log("error");
            return null;
        }
    } catch (error) {
        console.log("error", error);
        return null;
    }
};

export const updateCertainNameNewInst = async(email) =>{
    try {
        const response = await axios.post(
            "https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/updateCertainNameNewInst",
        JSON.stringify(email),
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
        );
    
        if (response.data) {
            return response.data;
        } else {
            console.log("error");
            return null;
        }
    } catch (error) {
        console.log("error", error);
        return null;
    }
}
export const updateCertainNameNewStu = async(email) =>{
    try {
        const response = await axios.post(
            "https://teamkingpin-5b27c84fd0dd.herokuapp.com/event/updateCertainNameNewStu",
        JSON.stringify(email),
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
        );
    
        if (response.data) {
            return response.data;
        } else {
            console.log("error");
            return null;
        }
    } catch (error) {
        console.log("error", error);
        return null;
    }
}