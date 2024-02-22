import axios from "axios"

export const register = async (user) => {
  try {
    const response = await axios.post(
      "https://teamkingpin-5b27c84fd0dd.herokuapp.com/users/add",
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
};

export const logIn = async (user) => {
    try {
      const response = await axios.post(
        "https://teamkingpin-5b27c84fd0dd.herokuapp.com/users/logIn",
        JSON.stringify(user),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data) {
        if(response.data.status !== false){
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log("Locally saved and login is sucessful");
            document.getElementById("successLoginText").innerHTML = "Successfully Logged In!";
            unHideSuccess();

            window.location.reload(false);
        }
        else{
            document.getElementById("alertLoginText").innerHTML = response.data.result;
            unHideAlert();
        }
            return response.data;
      } 
      else {
        console.log("error");
        document.getElementById("alertLoginText").innerHTML = "Unknown Error";
        unHideAlert();
        return null;
      }
    } catch (error) {
      console.log("error", error);
      return null;
    }
  };

export const logOut=()=>{
    localStorage.removeItem("user");
    if(!localStorage.getItem("user"))
         return "User sucessfully logged out";
}


async function unHideAlert(){
  let alert = document.getElementById("alertLogin");
  let alert2 = document.getElementById("successLogin");
  let load = document.getElementById("loadLogin");
  
  if(alert.getAttribute("hidden") !== null){
      alert.removeAttribute("hidden"); 
      alert2.setAttribute("hidden", true);
      load.setAttribute("hidden", true);
  }
}

async function unHideSuccess(){
  let alert = document.getElementById("successLogin");
  let alert2 = document.getElementById("alertLogin");
  let load = document.getElementById("loadLogin");
  if(alert.getAttribute("hidden") !== null){
      alert.removeAttribute("hidden"); 
      alert2.setAttribute("hidden", true);
      load.setAttribute("hidden", true);
  }
}