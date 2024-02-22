import axios from "axios"


export const getUserData = async() =>{
    let userData;
    let token = JSON.parse(localStorage.getItem("user"));
    await axios.post("http://localhost:3001/users/get", JSON.stringify({token}),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    userData= res.data[0];
                }else{
                    console.log("error");
                }
            })
            return (userData);
}

//EP stands for email and password
export const findUserEP = async(email) =>{
    let userData = null;
    await axios.post("http://localhost:3001/users/findEP", JSON.stringify(email),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    userData = res.data[0];
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

//E stands for Email
export const findUserE = async(email) =>{
    let userData = null;
    await axios.post("http://localhost:3001/users/findE", JSON.stringify(email),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    userData = res.data[0];
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

//LN stands for Last Name
export const findUserLN = async(lastName) =>{
    let userData = null;
    await axios.post("http://localhost:3001/users/findLN", JSON.stringify(lastName),
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

//LN stands for First Name
export const findUserFN = async(lastName) =>{
    let userData = null;
    await axios.post("http://localhost:3001/users/findFN", JSON.stringify(lastName),
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

export const findUserCP = async(crewPosition) =>{
    let userData = null;
    await axios.post("http://localhost:3001/users/findCP", JSON.stringify(crewPosition),
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

export const findUserS = async(syllabus) =>{
    let userData = null;
    await axios.post("http://localhost:3001/users/findS", JSON.stringify(syllabus),
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

export const findUserUT = async(userType) =>{
    let userData = null;
    await axios.post("http://localhost:3001/users/findUT", JSON.stringify(userType),
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



export const updateName = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/users/updateName",
        JSON.stringify(user),
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

  export const updatePassword = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/users/updatePassword",
        JSON.stringify(user),
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


  export const updateCrewPosition = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/users/updateCrewPosition",
        JSON.stringify(user),
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

  export const updateUserType = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/users/updateUserType",
        JSON.stringify(user),
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

export const updateUserSyllabus = async (user) => {
try {
    const response = await axios.post(
    "http://localhost:3001/users/updateSyllabus",
    JSON.stringify(user),
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

export const findAllUsers = async() =>{
    let userData = null;
    await axios.post("http://localhost:3001/users/findAll",
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

export const deleteUser = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/users/delete",
        JSON.stringify(user),
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

export const deleteUserMany = async(emailArray) =>{
    let userData = null;
    await axios.post("http://localhost:3001/users/deleteMany", JSON.stringify(emailArray),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    userData = res.data;
                    if(res.status === 201){
                        document.getElementById("successAOText").innerHTML = "Successfully Deleted Users!";
                        unHideSuccess();
                    }
                    else{
                        document.getElementById("alertAOText").innerHTML = "Error Deleting Any or All Users!";
                        unHideAlert();
                    }
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

export const updateCertainSyllabus = async (syllabus) => {
    try {
        const response = await axios.post(
        "http://localhost:3001/users/updateCertainSyllabus",
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

export const updateCertainSyllabusNew = async (syllabus) => {
    try {
        const response = await axios.post(
        "http://localhost:3001/users/updateCertainSyllabusNew",
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

export const updateCertainCPNew = async (crewPosition) => {
    try {
        const response = await axios.post(
        "http://localhost:3001/users/updateCertainCPNew",
        JSON.stringify(crewPosition),
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