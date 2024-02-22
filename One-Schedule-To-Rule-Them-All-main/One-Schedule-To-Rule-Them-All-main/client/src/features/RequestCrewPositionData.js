import axios from "axios"


export const addCrewPosition = async (crewPosition) => {

    let newCPObj = {
        acronym: crewPosition.acronym,
        fullName: crewPosition.fullName
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/crewPosition/add",
        JSON.stringify(newCPObj),
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

export const findAllCrewPositions = async() =>{
    let cpData = null;
    await axios.post("http://localhost:3001/crewPosition/findAll",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    cpData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (cpData);
            }
            catch{
                return null;
            }
}

export const deleteCP = async (id) => {

    try {
      const response = await axios.post(
        "http://localhost:3001/crewPosition/delete",
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


export const findCPID = async(id) =>{
    let data = null;
    await axios.post("http://localhost:3001/crewPosition/findID", JSON.stringify(id),
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

export const findCPA = async(acronym) =>{
    let data = null;
    await axios.post("http://localhost:3001/crewPosition/findAcronym", JSON.stringify(acronym),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    data = res.data;
                }
            })
            try{
                return (data);
            }
            catch{
                return null;
            }
}

export const updateACrewPosition = async (crewPosition) => {
    try {
        const response = await axios.post(
        "http://localhost:3001/crewPosition/update",
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