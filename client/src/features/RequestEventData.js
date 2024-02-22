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
            "http://localhost:3001/event/add",
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
    await axios.post("http://localhost:3001/event/findAll",
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
    await axios.post("http://localhost:3001/event/findAllOrdered",
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
    await axios.post("http://localhost:3001/event/findN", JSON.stringify(name),
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
    await axios.post("http://localhost:3001/event/findConflictsByUser", JSON.stringify(email),
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
        "http://localhost:3001/event/delete",
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
    await axios.post("http://localhost:3001/event/findID", JSON.stringify(id),
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
    await axios.post("http://localhost:3001/event/findStuEmail", JSON.stringify(email),
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
    await axios.post("http://localhost:3001/event/findInstEmail", JSON.stringify(email),
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
            "http://localhost:3001/event/updateEvent",
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
            "http://localhost:3001/event/updateAttendingStudents",
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
            "http://localhost:3001/event/updateAttendingInstructors",
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
    axios.post("http://localhost:3001/event/updateConflicts", JSON.stringify(conflict),
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
    axios.post("http://localhost:3001/event/deleteUserUpdateAttendanceStu", JSON.stringify(emails),
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
        const response = await axios.post("http://localhost:3001/event/deleteALL",
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
    axios.post("http://localhost:3001/event/deleteUserUpdateAttendanceInst", JSON.stringify(emails),
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
    axios.post("http://localhost:3001/event/clearConflicts",
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
        "http://localhost:3001/event/updateCertainSyllabusNew",
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
            "http://localhost:3001/event/updateCertainNameNewInst",
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
            "http://localhost:3001/event/updateCertainNameNewStu",
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