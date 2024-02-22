import axios from "axios"


export const addSyllabus = async (syllabus) => {

    let newSyllabusObj = {
        code: syllabus.code,
        startDate: syllabus.startDate,
        endDate: syllabus.endDate
    }

    try {
      const response = await axios.post(
        "https://teamkingpin-5b27c84fd0dd.herokuapp.com/syllabus/add",
        JSON.stringify(newSyllabusObj),
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

export const findAllSyllabus = async() =>{
    let syllabusData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/syllabus/findAll",
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    syllabusData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (syllabusData);
            }
            catch{
                return null;
            }
}

export const findSyllabus = async(code) =>{
    let syllabusData = null;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/syllabus/find", JSON.stringify(code),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
                if (res.data) {
                    syllabusData = res.data;
                }else{
                    console.log("error");
                }
                
            })
            try{
                return (syllabusData);
            }
            catch{
                return null;
            }
}

export const deleteSyllabus = async(code) =>{
    let status;
    await axios.post("https://teamkingpin-5b27c84fd0dd.herokuapp.com/syllabus/delete", JSON.stringify(code),
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

export const updateSyllabus = async (syllabus) => {
    try {
        const response = await axios.post(
        "https://teamkingpin-5b27c84fd0dd.herokuapp.com/syllabus/updateSyllabus",
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