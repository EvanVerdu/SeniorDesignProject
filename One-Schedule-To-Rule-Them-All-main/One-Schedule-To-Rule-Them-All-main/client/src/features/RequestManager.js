import axios from "axios"


export const addRequest = async(request) => {
    let status = null;
    axios.post("http://localhost:3001/request/add", JSON.stringify(request),
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

export const pullAllRequests = async() =>{
    let requestData = null;
    await axios.post("http://localhost:3001/request/findAll",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    requestData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (requestData);
            }
            catch{
                return null;
            }
}

//E stands for Email
export const findApprovedE = async(email) =>{
    let data = null;

    await axios.post("http://localhost:3001/request/findApprovedRequestE", JSON.stringify(email),
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

export const updateNameRequest = async(user) => {

    try {
        const response = await axios.post(
            "http://localhost:3001/request/updateNameRequest",
            JSON.stringify(user),
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

export const findPendingE = async(email) =>{
    let data = null;

    await axios.post("http://localhost:3001/request/findPendingRequestE", JSON.stringify(email),
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


export const findProcessedE = async(email) =>{
    let data = null;

    await axios.post("http://localhost:3001/request/findProcessedRequestE", JSON.stringify(email),
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

export const findApprovedEold = async(email) =>{
    let requestData = null;
    await axios.post("http://localhost:3001/request/findApprovedRequestE",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    requestData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (requestData);
            }
            catch{
                return null;
            }
}
export const getRequestData = async(idObj) =>{
    let requestData = null;
    await axios.post("http://localhost:3001/request/findS/"+idObj.id,
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    requestData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (requestData);
            }
            catch{
                return null;
            }
}

export const deleteRequest = async(idObj)=>{
    let response = await axios.post("http://localhost:3001/request/delete/"+idObj.id,
    {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.data) {
        return response.data;
      }
      else {
        console.log("error");
        return null;
      }
}

export const deleteAllRequests =async()=>{
    let response = await axios.post("http://localhost:3001/request/deleteAll/",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.data) {
        return response.data;
      }
      else {
        console.log("error");
        return null;
      }
}

export const pullStudentPendingRequests = async() =>{
    let requestData = null;
    await axios.post("http://localhost:3001/request/findPendingRequestS",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    requestData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (requestData);
            }
            catch{
                return null;
            }
}

export const pullStudentProcessedRequests = async() =>{
    let requestData = null;
    await axios.post("http://localhost:3001/request/findProcessedRequestS",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    requestData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (requestData);
            }
            catch{
                return null;
            }
}

export const pullAllPendingRequests = async() =>{
    let requestData = null;
    await axios.post("http://localhost:3001/request/findPending",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    requestData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (requestData);
            }
            catch{
                return null;
            }
}


export const pullAllProcessedRequests = async() =>{
    let requestData = null;
    await axios.post("http://localhost:3001/request/findCompleted",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    requestData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (requestData);
            }
            catch{
                return null;
            }
}
export const updateRequestDeleted = async (emails) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/request/updateRequestUserDelete",
        JSON.stringify(emails),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data) {
        return response.status;
      } else {
        console.log("Error in response data");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  

export const approveRequest = async(approveObj) => {
    let status = null;
    let request = 
    {
        approvingUser: approveObj.approvingUser,
        reason:        approveObj.reason

    }

    axios.post("http://localhost:3001/request/accept/"+approveObj.id, JSON.stringify(request),
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

export const denyRequest = async(denyObj) => {
    let status = null;
    let request = 
    {
        approvingUser: denyObj.approvingUser,
        reason:        denyObj.reason

    }

    axios.post("http://localhost:3001/request/decline/"+denyObj.id, JSON.stringify(request),
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

export const pullFacultyPendingRequests = async() =>{
    let requestData = null;
    await axios.post("http://localhost:3001/request/findPendingRequestF",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    requestData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (requestData);
            }
            catch{
                return null;
            }
}

export const pullFacultyProcessedRequests = async() =>{
    let requestData = null;
    await axios.post("http://localhost:3001/request/findProcessedRequestF",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    requestData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (requestData);
            }
            catch{
                return null;
            }
}