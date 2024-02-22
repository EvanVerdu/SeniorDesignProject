import React, { Component }from 'react';
import Button from 'react-bootstrap/Button';
import {logOut} from '../features/AuthService';
import { findAllUsers, findUserCP, findUserE, findUserFN, findUserLN, findUserS, findUserUT, getUserData, updateCrewPosition, updatePassword, updateUserSyllabus, updateUserType, updateCertainSyllabus, deleteUserMany, updateCertainSyllabusNew, updateCertainCPNew} from '../features/ResquestUserData';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { register } from '../features/AuthService';
import {updateName} from '../features/ResquestUserData';
import { addSyllabus, findAllSyllabus, findSyllabus, deleteSyllabus, updateSyllabus } from '../features/RequestSyllabusData';
import { addCrewPosition, deleteCP, findAllCrewPositions, findCPA, findCPID, updateACrewPosition } from '../features/RequestCrewPositionData';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import { deleteUserUpdateAttendanceInst, deleteUserUpdateAttendanceStu, updateCertainEventSyllabusNew, updateCertainNameNewInst, updateCertainNameNewStu } from '../features/RequestEventData';
import { updateNameRequest, updateRequestDeleted } from '../features/RequestManager';

//Generates the first page you see
//Changes screen based on whether the user is an admin or not
async function generatePage(){
    //Gets the current user's data for checking their permissions
    let data = await getUserData();

    //Gets data and fills the page tables with it still hidden
    let userData = await findAllUsers();
    userTableFill(userData);
    changeUserTypeTableFill(userData);
    deleteUserTableFill(userData);

    updateCPSelects();
    searchWithoutSyllabus();
    fillUpdateSyllabusCodeSelect();

    let syllabusData = await findAllSyllabus();
    syllabusTableFill(syllabusData);

    //If the user selects "Update Name", their current name will be posted there
    let fn = document.getElementById("newFirstName");
    let ln = document.getElementById("newLastName");

    if(data.firstName){
        fn.value = firstLetterCapital(data.firstName);
    }
    if(data.lastName){
        ln.value = firstLetterCapital(data.lastName);
    }

    //checks if admin and generates features only admins have access to
    if(data.userType === "admin"){
        document.getElementById("acctOptnsH1").innerHTML = "Account/Admin Options"

        if(!(document.getElementById('userSettingsBtn'))){
            const UserBtn = document.createElement("Button");
            UserBtn.innerText = "User Settings";
            UserBtn.addEventListener("click", toggleUserSettingsScreen);
            UserBtn.setAttribute('id', 'userSettingsBtn');
            UserBtn.setAttribute('class', 'aoButtonMenu button-28');

            const syllabusBtn = document.createElement("Button");
            syllabusBtn.innerText = "Syllabus Options";
            syllabusBtn.addEventListener("click", toggleSyllabusScreen);
            syllabusBtn.setAttribute('id', 'optionsSyllabusBtn');
            syllabusBtn.setAttribute('class', 'aoButtonMenu button-28');

            const cpBtn = document.createElement("Button");
            cpBtn.innerText = "Crew Position Settings";
            cpBtn.addEventListener("click", toggleCrewPositionSettingsScreen);
            cpBtn.setAttribute('id', 'cpSettingsBtn');
            cpBtn.setAttribute('class', 'aoButtonMenu button-28');
            
            document.getElementById("ao_HTMLgeneration").appendChild(UserBtn);
            document.getElementById("ao_HTMLgeneration").appendChild(syllabusBtn);
            document.getElementById("ao_HTMLgeneration").appendChild(cpBtn);
        }
    }
    //otherwise don't do anything special
    else{
        document.getElementById("acctOptnsH1").innerHTML = "Account Options";
    }
}

//Generates table to show only students
async function studentTable(){
    //Manupulating the header
    let header = document.getElementById("userTableH1");
    header.innerHTML = "Students";

    //Find all user data and filter out students
    let userData = await findAllUsers();
    let students = [];
    for(let i = 0; i < userData.length; i++){
        if(userData[i].userType === "student"){
            students.push(userData[i]);
        }
    }
    //Fill user table with only students
    userTableFill(students);
}

function specificSearchClick(){
    document.getElementById("userTableH1").innerHTML = "Specific Search";
}

//Generates the profile page
async function generateProfile(){
    unhideLoad();
    let data = await getUserData();
    let profileName = document.getElementById("profileName");
    let profileEmail = document.getElementById("profileEmail");
    let profileCP = document.getElementById("profileCrewPosition");
    let profileSyllabus = document.getElementById("profileSyllabus");

    let nameString = "Name: ";
    if(!data.firstName || !data.lastName){
        nameString += "None! Update ASAP!";
    }
    else{
        nameString += firstLetterCapital(data.firstName) + " " + firstLetterCapital(data.lastName);
    }
    profileName.innerHTML = nameString;
    profileEmail.innerHTML = "Email: " + data.email;

    let cpString = "Crew position: ";

    if(data.crewPosition){
        cpString += data.crewPosition.toUpperCase();
    }
    else{
        cpString += "None! Update ASAP!";
    }
    profileCP.innerHTML = cpString;

    let sylString = "Syllabus: ";
    if(data.syllabus){
        sylString += data.syllabus.toUpperCase();
    }
    else{
        sylString += "Not assigned yet!"
    }
    profileSyllabus.innerHTML = sylString;
    let load = document.getElementById("loadAO");

    load.setAttribute("hidden", true);
}

//Updates the select form in the update crew position screen
async function updateCPSelects(){
    let changeCPSelect = document.getElementById("ChangeUserCP");
    let string = "";
    string += "<option value='none'>None</option>";
    let data = await findAllCrewPositions();
    for(let i = 0; i < data.length; i++){
        string += "<option value='" + data[i].acronym + "'>" + data[i].fullName.toUpperCase() +  "</option>"
    }
    changeCPSelect.innerHTML = string;
}

//Updates the select form in the update syllabus code screen
async function fillUpdateSyllabusCodeSelect(){
    let updateSyllabusCodeSelect = document.getElementById("updateSyllabusCodeSelect");
    let string = "";
    let data = await findAllSyllabus();
    for(let i = 0; i < data.length; i++){
        string += "<option value='" + data[i].code + "'>" + data[i].code +  "</option>"
    }
    string += "<option value='none'>None</option>"
    updateSyllabusCodeSelect.innerHTML = string;
}

//Searches for users without a syllabus and updates the table
async function searchWithoutSyllabus(){
    //Manupulating the header
    let header = document.getElementById("syllabusUserTableH1");
    header.innerHTML = "Users without a syllabus";

    //Find all user data and filter out students
    let userData = await findAllUsers();
    userData = sortObjectsByName(userData);
    let users = [];
    for(let i = 0; i < userData.length; i++){
        if(!userData[i].syllabus){
            users.push(userData[i]);
        }
    }
    //Fill user table with only students
    sylUserTableFill(users);
}

function sortObjectsByName(data) {
  return data.sort((a, b) => {
    if (a.lastName && b.lastName) {
      return a.lastName.localeCompare(b.lastName);
    } else {
      // handle objects without a name property
      return 0;
    }
  });
}

async function searchWithSyllabus(){
    //Manupulating the header
    let header = document.getElementById("syllabusUserTableH1");
    header.innerHTML = "Users with a syllabus";

    //Find all user data and filter out students
    let userData = await findAllUsers();
    userData = sortObjectsByName(userData);
    let users = [];
    for(let i = 0; i < userData.length; i++){
        if(userData[i].syllabus){
            users.push(userData[i]);
        }
    }
    //Fill user table with only students
    sylUserTableFill(users);
}

//Generates table to show only faculty
async function facultyTable(){
    //Manupulating the header
    let header = document.getElementById("userTableH1");
    header.innerHTML = "Faculty";

    //Find all user data and filter out faculty
    let userData = await findAllUsers();
    let faculty = [];
    for(let i = 0; i < userData.length; i++){
        if(userData[i].userType === "faculty"){
            faculty.push(userData[i]);
        }
    }
    //Fill user table with only faculty
    userTableFill(faculty);
}

//Generates table to show only admins
async function adminTable(){
    //Manupulating the header
    let header = document.getElementById("userTableH1");
    header.innerHTML = "Admin";

    //Find all user data and filter out admin
    let userData = await findAllUsers();
    let admin = [];
    for(let i = 0; i < userData.length; i++){
        if(userData[i].userType === "admin"){
            admin.push(userData[i]);
        }
    }
    //Fill user table with only admins
    userTableFill(admin);
}

//Generates table to show all users of the system
async function allUsersTable(){
    //Manipulate the header
    let header = document.getElementById("userTableH1");
    header.innerHTML = "All Users";

    //Fill the table with all users of the system
    let userData = await findAllUsers();
    userTableFill(userData);
}

//Takes a string and capitalizes its first letter
function firstLetterCapital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Fills the syllabus table with given data
function syllabusTableFill(data) {
    let syllabusTable = document.getElementById("syllabusTable");

    //Clears the table before generating new rows
    while (syllabusTable.firstChild) {
        syllabusTable.removeChild(syllabusTable.firstChild);
    }

    let stringH = "<tr><th>Code</th><th>Starting Date</th><th>Ending Date</th></tr>";
     //Creates a new element "table row"
     let trH = document.createElement("tr");
     //Sets that element's innerHTML to the string we created
     trH.innerHTML = stringH;
     //Appends the new row to the bottom of the table
     document.getElementById("syllabusTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let syllabus = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";
        
        string += "<td>";
        //Adds a syllabus code to the row if there is one
        if(syllabus.code){
            string += syllabus.code.toUpperCase();
        }
        else{
            string += "None";
        }
        string += "</td>";

        string += "<td>";
        //Adds a syllabus start date to the row if there is one
        if(syllabus.startDate){
            let startDate = new Date(syllabus.startDate);
            string += (startDate.getMonth() + 1) + "/" + (startDate.getDate()) + "/" + (startDate.getFullYear());
        }
        string += "</td>";

        string += "<td>";
        //Adds a syllabus end date to the row if there is one
        if(syllabus.endDate){
            let endDate = new Date(syllabus.endDate);
            string += (endDate.getMonth() + 1) + "/" + (endDate.getDate()) + "/" + (endDate.getFullYear());
        }
        string += "</td>";
        //Creates a new element "table row"
        let tr = document.createElement("tr");
        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string;
        //Appends the new row to the bottom of the table
        document.getElementById("syllabusTable").appendChild(tr);
    }
}

function userTableFill(data) {
    let userTable = document.getElementById("userTable");

    //Clears the table before generating new rows
    while (userTable.firstChild) {
        userTable.removeChild(userTable.firstChild);
    }

    //Creates a row saying "No users found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No users found!";
        document.getElementById("userTable").appendChild(tr);
        return;
    }

    data.sort((a, b) => {
        const lastNameA = a.lastName || ''; // Default to an empty string if lastName is null/undefined
        const lastNameB = b.lastName || ''; // Default to an empty string if lastName is null/undefined
    
        return lastNameA.localeCompare(lastNameB);
    });

    let stringH = "<tr><th>Name</th><th>Crew Position</th><th>Syllabus</th><th>Email</th><th>Permissions</th><th>Password</th></tr>";
     //Creates a new element "table row"
     let trH = document.createElement("tr");
     //Sets that element's innerHTML to the string we created
     trH.innerHTML = stringH;
     //Appends the new row to the bottom of the table
     document.getElementById("userTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){

        //Grabs the single bit of data
        let user = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+="<td>";
        //Adds last name if the user has one
        if(user.lastName){
            string += firstLetterCapital(user.lastName);
            //Adds the first name if the user has one
            if(user.firstName){
                string += ", " + firstLetterCapital(user.firstName);
            }
        }
        //If the user has no last name, but has a first name, it is added to the string
        else if(user.firstName){
            string += firstLetterCapital(user.lastName);
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds crew position to the string if they have one
        if(user.crewPosition){
            string += user.crewPosition.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds syllabus to the string if they have one
        if(user.syllabus){
            string += user.syllabus.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        //Adds email to the string. They have to have an email, so no if statement
        string+="<td>";
        string += user.email;
        string+="</td>";

        //Adds user type to the string if they have one
        if(user.userType){
            string+="<td>";
            string += user.userType.toUpperCase();
            string+="</td>";
        }

        string+="<td>";
        string += user.password;
        string+="</td>";

      //Creates a new element "table row"
      let tr = document.createElement("tr");

      //Sets that element's innerHTML to the string we created
      tr.innerHTML = string;
      //Appends the new row to the bottom of the table
      document.getElementById("userTable").appendChild(tr);
  }
}

async function cpTableFillDelete() {

    let data = await findAllCrewPositions();
    let cpTable = document.getElementById("crewPositionTableSearch1");

    //Clears the table before generating new rows
    while (cpTable.firstChild) {
        cpTable.removeChild(cpTable.firstChild);
    }

    //Creates a row saying "No users found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No crew positions found!";
        document.getElementById("crewPositionTableSearch1").appendChild(tr);
        return;
    }

    let stringH = "<tr><th>Full Name</th><th>Acronym</th><th>Button</th></tr>";
     //Creates a new element "table row"
     let trH = document.createElement("tr");
     //Sets that element's innerHTML to the string we created
     trH.innerHTML = stringH;
     //Appends the new row to the bottom of the table
     document.getElementById("crewPositionTableSearch1").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let cp = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        //Adds name if the cp has one
        if(cp.fullName){
            string+= "<td>";
            string += cp.fullName.toUpperCase();
            string+= "</td>";
        }

        //Adds acronym to the string if it has one
        if(cp.acronym){
            string+= "<td>";
            string += cp.acronym.toUpperCase();
            string+= "</td>";
        }
        string+= "<td>";
        string += " <button class='button-28 bb' id='deleteCP" + cp._id + "'>Delete</button>";

        //Creates a new element "table row"
        let tr = document.createElement("tr");
        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string;
        //Appends the new row to the bottom of the table
        document.getElementById("crewPositionTableSearch1").appendChild(tr);
    }
}

async function cpTableFillEdit() {

    let data = await findAllCrewPositions();
    let cpTable = document.getElementById("crewPositionTableSearch2");

    //Clears the table before generating new rows
    while (cpTable.firstChild) {
        cpTable.removeChild(cpTable.firstChild);
    }

    //Creates a row saying "No users found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No crew positions found!";
        document.getElementById("crewPositionTableSearch2").appendChild(tr);
        return;
    }

    let stringH = "<tr><th>Full Name</th><th>Acronym</th><th>Button</th></tr>";
     //Creates a new element "table row"
     let trH = document.createElement("tr");
     //Sets that element's innerHTML to the string we created
     trH.innerHTML = stringH;
     //Appends the new row to the bottom of the table
     document.getElementById("crewPositionTableSearch2").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let cp = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        //Adds name if the cp has one
        if(cp.fullName){
            string+= "<td>";
            string += cp.fullName.toUpperCase();
            string+= "</td>";
        }

        //Adds acronym to the string if it has one
        if(cp.acronym){
            string+= "<td>";
            string += cp.acronym.toUpperCase();
            string+= "</td>";
        }
        string+= "<td>";
        string += " <button class='button-28 bb' id='editCP" + cp._id + "'>Edit</button>";

        //Creates a new element "table row"
        let tr = document.createElement("tr");
        //Sets that element's innerHTML to the string we created
        tr.innerHTML = string;
        //Appends the new row to the bottom of the table
        document.getElementById("crewPositionTableSearch2").appendChild(tr);
    }
}

async function deleteUserTableFill(data) {
    let userTable = document.getElementById("deleteUserTable");
    //Clears the table before generating new rows
    while (userTable.firstChild) {
        userTable.removeChild(userTable.firstChild);
    }

    //Creates a row saying "No users found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No users found!";
        document.getElementById("deleteUserTable").appendChild(tr);
        return;
    }
    
    data.sort((a, b) => {
        const lastNameA = a.lastName || ''; // Default to an empty string if lastName is null/undefined
        const lastNameB = b.lastName || ''; // Default to an empty string if lastName is null/undefined
    
        return lastNameA.localeCompare(lastNameB);
    });

    let stringH = "<tr><th>Checkbox</th><th>Name</th><th>Crew Position</th><th>Syllabus</th><th>Email</th><th>Permissions</th></tr>";
     //Creates a new element "table row"
     let trH = document.createElement("tr");
     //Sets that element's innerHTML to the string we created
     trH.innerHTML = stringH;
     //Appends the new row to the bottom of the table
     document.getElementById("deleteUserTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let user = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+="<td>";
        //Adds last name if the user has one
        if(user.lastName){
            string += firstLetterCapital(user.lastName);
            //Adds the first name if the user has one
            if(user.firstName){
                string += ", " + firstLetterCapital(user.firstName);
            }
        }
        //If the user has no last name, but has a first name, it is added to the string
        else if(user.firstName){
            string += firstLetterCapital(user.lastName);
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds crew position to the string if they have one
        if(user.crewPosition){
            string += user.crewPosition.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds syllabus to the string if they have one
        if(user.syllabus){
            string += user.syllabus.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        //Adds email to the string. They have to have an email, so no if statement
        string+="<td>";
        string += user.email;
        string+="</td>";

        //Adds user type to the string if they have one
        if(user.userType){
            string+="<td>";
            string += user.userType.toUpperCase();
            string+="</td>";
        }

        //Creates a new element "table row"
        let checkId = "deleteUserCheckbox" + user.email;
        let tr = document.createElement("tr");
        string =  "<td><input name='deleteUserCheckbox' type='checkbox' id= '" + checkId + "'></input></td>" + string;
       

        tr.innerHTML = string;
        //Appends the new row to the bottom of the table
        document.getElementById("deleteUserTable").appendChild(tr);

    }
}

function sylUserTableFill(data) {
    let userTable = document.getElementById("syllabusUsersTable");

    //Clears the table before generating new rows
    while (userTable.firstChild) {
        userTable.removeChild(userTable.firstChild);
    }

    //Creates a row saying "No users found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No users found!";
        document.getElementById("syllabusUsersTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th>Name</th><th>Crew Position</th><th>Syllabus</th><th>Email</th><th>Permissions</th><th>Button</th></tr>";
     //Creates a new element "table row"
     let trH = document.createElement("tr");
     //Sets that element's innerHTML to the string we created
     trH.innerHTML = stringH;
     //Appends the new row to the bottom of the table
     document.getElementById("syllabusUsersTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let user = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+="<td>";
        //Adds last name if the user has one
        if(user.lastName){
            string += firstLetterCapital(user.lastName);
            //Adds the first name if the user has one
            if(user.firstName){
                string += ", " + firstLetterCapital(user.firstName);
            }
        }
        //If the user has no last name, but has a first name, it is added to the string
        else if(user.firstName){
            string += firstLetterCapital(user.lastName);
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds crew position to the string if they have one
        if(user.crewPosition){
            string += user.crewPosition.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds syllabus to the string if they have one
        if(user.syllabus){
            string += user.syllabus.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        //Adds email to the string. They have to have an email, so no if statement
        string+="<td>";
        string += user.email;
        string+="</td>";

        //Adds user type to the string if they have one
        if(user.userType){
            string+="<td>";
            string += user.userType.toUpperCase();
            string+="</td>";
        }

        //Creates a new element "table row"
        let tr = document.createElement("tr");
        string += "<td><button class='button-28 bb' id='syllabus" + user.email +"'>Enter Email</button></td>"

        tr.innerHTML = string;
        //Appends the new row to the bottom of the table
        document.getElementById("syllabusUsersTable").appendChild(tr);

    }
}

function changeUserTypeTableFill(data) {
    let userTable = document.getElementById("userTypeTable");

    //Clears the table before generating new rows
    while (userTable.firstChild) {
        userTable.removeChild(userTable.firstChild);
    }

    //Creates a row saying "No users found" if there is no valid data given
    if(!data || data.length === 0){
        let tr = document.createElement("tr");
        tr.innerHTML = "No users found!";
        document.getElementById("userTypeTable").appendChild(tr);
        return;
    }

    let stringH = "<tr><th>Name</th><th>Crew Position</th><th>Syllabus</th><th>Email</th><th>Permissions</th><th>Button</th></tr>";
     //Creates a new element "table row"
     let trH = document.createElement("tr");
     //Sets that element's innerHTML to the string we created
     trH.innerHTML = stringH;
     //Appends the new row to the bottom of the table
     document.getElementById("userTypeTable").appendChild(trH);

    //Generates a row in the table for each data point in the given data
    for(let i = 0; i < data.length; i++){
        //Grabs the single bit of data
        let user = data[i];

        //Sets up a string to be manupulated depending on the information from the data
        let string = "";

        string+="<td>";
        //Adds last name if the user has one
        if(user.lastName){
            string += firstLetterCapital(user.lastName);
            //Adds the first name if the user has one
            if(user.firstName){
                string += ", " + firstLetterCapital(user.firstName);
            }
        }
        //If the user has no last name, but has a first name, it is added to the string
        else if(user.firstName){
            string += firstLetterCapital(user.lastName);
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds crew position to the string if they have one
        if(user.crewPosition){
            string += user.crewPosition.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        string+="<td>";
        //Adds syllabus to the string if they have one
        if(user.syllabus){
            string += user.syllabus.toUpperCase();
        }
        else{
            string += "None";
        }
        string+="</td>";

        //Adds email to the string. They have to have an email, so no if statement
        string+="<td>";
        string += user.email;
        string+="</td>";

        //Adds user type to the string if they have one
        if(user.userType){
            string+="<td>";
            string += user.userType.toUpperCase();
            string+="</td>";
        }

        //Creates a new element "table row"
        let tr = document.createElement("tr");
        string += "<td><button class='button-28 bb' id='type" + user.email +"'>Enter Email</button></td>"

        tr.innerHTML = string;
        //Appends the new row to the bottom of the table
        document.getElementById("userTypeTable").appendChild(tr);

    }
}

async function syllabusEmailFill(e){
    //Gets the id
    let index = e.target.id;
    //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
    if(!index.includes("syllabus")){
      return;
    }
      //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
    index = index.replaceAll('syllabus', '');
  
    document.getElementById("updateSyllabusEmail").value = index;
  }

  async function userTypeFill(e){
    //Gets the id
    let index = e.target.id;
    //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
    if(!index.includes("type")){
      return;
    }
      //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
    index = index.replaceAll('type', '');
  
    document.getElementById("updateUserTypeInput").value = index;
  }

//Toggles the user settings screen
function toggleUserSettingsScreen(){
    //Grabbing DOM elements
    let generalPage = document.getElementById("ao_generalPage");
    let userSettingsScreen = document.getElementById("ao_userSettings");

    //If the new user screen was hidden before, unhide it
    if(userSettingsScreen.getAttribute("hidden") !== null){
        userSettingsScreen.removeAttribute("hidden"); 
        generalPage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        generalPage.removeAttribute("hidden"); 
        userSettingsScreen.setAttribute("hidden", true);
    }
}

//Toggles the user creation page of the user settings
function toggleNewUserDiv(){
    //Grabbing DOM elements
    let userSettingsScreen = document.getElementById("ao_userSettingsMenu");
    let newUserDiv = document.getElementById("ao_createUser");
    let header = document.getElementById("ao_createUserH1");
    let header2 = document.getElementById("ao_createUserH2");

    let password = document.getElementById("createUserPassword");

    var randomstring = Math.random().toString(36).slice(-8);
    password.value = randomstring;

    //If the new user screen was hidden before, unhide it
    if(newUserDiv.getAttribute("hidden") !== null){
        newUserDiv.removeAttribute("hidden"); 
        userSettingsScreen.setAttribute("hidden", true); 
    }
    //otherwise, hide everything and show the main user settings page
    else{
        userSettingsScreen.removeAttribute("hidden"); 
        newUserDiv.setAttribute("hidden", true);
        header.innerHTML = "Create a user";
        header2.innerHTML = " ";
    }
}

//Toggles the delete user page in the user settings
async function toggleDeleteDiv(){
    //Grabbing DOM elements
    let userSettingsScreen = document.getElementById("ao_userSettingsMenu");
    let deleteUserDiv = document.getElementById("deleteUserDiv");
    let header = document.getElementById("deleteUserH1");
    header.innerHTML = "Delete a User";

    let userData = await findAllUsers();
    deleteUserTableFill(userData);

    //If the delete user screen was hidden before, unhide it
    if(deleteUserDiv.getAttribute("hidden") !== null){
        deleteUserDiv.removeAttribute("hidden"); 
        userSettingsScreen.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the user settings page
    else{
        userSettingsScreen.removeAttribute("hidden"); 
        deleteUserDiv.setAttribute("hidden", true);
    }
}

async function hideAlert(){
    let alert = document.getElementById("alertAO");
    if(alert.getAttribute("hidden") !== null){
        console.log(" unnecessary hide")
    }
    else{
        alert.setAttribute("hidden", true);
    }
}


async function hideSuccess(){
    let alert = document.getElementById("successAO");
    if(alert.getAttribute("hidden") !== null){
        console.log(" unnecessary hide")
    }
    else{
        alert.setAttribute("hidden", true);
    }
}

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

async function unhideLoad(){
    let alert = document.getElementById("alertAO");
    let alert2 = document.getElementById("successAO");
    let load = document.getElementById("loadAO");
    
    if(load.getAttribute("hidden") !== null){
        load.removeAttribute("hidden"); 
        alert2.setAttribute("hidden", true);
        alert.setAttribute("hidden", true);
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

//Toggles the search user screen in the user settings
async function toggleSearchDiv(){
    //Grabbing DOM elements
    let userSettingsScreen = document.getElementById("ao_userSettingsMenu");
    let searchDiv = document.getElementById("searchUserDiv");
    let tableHeader = document.getElementById("userTableH1");

    //If the search user screen was hidden before, unhide it
    if(searchDiv.getAttribute("hidden") !== null){
        searchDiv.removeAttribute("hidden"); 
        userSettingsScreen.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the user settings page
    else{
        userSettingsScreen.removeAttribute("hidden"); 
        searchDiv.setAttribute("hidden", true);
    }

    //Resets the table of users
    let userData = await findAllUsers();
    userTableFill(userData);
    tableHeader.innerHTML = "All Users";
}

async function toggleAssignSyllabusDiv(){
    //Grabbing DOM elements
    let userSettingsScreen = document.getElementById("ao_userSettingsMenu");
    let assignSyllabusDiv = document.getElementById("assignSyllabusDiv");
    let header = document.getElementById("syllabusUserTableH1");

    header.innerHTML = "Users without a syllabus";
    searchWithoutSyllabus();

    //If the search user screen was hidden before, unhide it
    if(assignSyllabusDiv.getAttribute("hidden") !== null){
        assignSyllabusDiv.removeAttribute("hidden"); 
        userSettingsScreen.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the user settings page
    else{
        userSettingsScreen.removeAttribute("hidden"); 
        assignSyllabusDiv.setAttribute("hidden", true);
    }
}

//Toggles the change password screen
function toggleChangePasswordScreen(){
    //Grabbing DOM elements
    let generalPage = document.getElementById("ao_generalPage");   
    let changePasswordScreen = document.getElementById("ao_changePassword");
   
    //If the new password screen was hidden before, unhide it
    if(changePasswordScreen.getAttribute("hidden") !== null){
        changePasswordScreen.removeAttribute("hidden"); 
        generalPage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        generalPage.removeAttribute("hidden"); 
        changePasswordScreen.setAttribute("hidden", true);
    }
}

//Toggles the change name screen
function toggleChangeNameScreen(){
    //Grabbing DOM elements
    let generalPage = document.getElementById("ao_generalPage");
    let changeNameScreen = document.getElementById("ao_changeName");

    //If the change name screen was hidden before, unhide it
    if(changeNameScreen.getAttribute("hidden") !== null){
        changeNameScreen.removeAttribute("hidden"); 
        generalPage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        generalPage.removeAttribute("hidden"); 
        changeNameScreen.setAttribute("hidden", true);
    }
}

//Toggles the crew position settings screen
function toggleCrewPositionSettingsScreen(){
    //Grabbing DOM elements
    let generalPage = document.getElementById("ao_generalPage");
    let cpSettings = document.getElementById("ao_cpSettings");

    //If the crew position settings screen was hidden before, unhide it
    if(cpSettings.getAttribute("hidden") !== null){
        cpSettings.removeAttribute("hidden"); 
        generalPage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        generalPage.removeAttribute("hidden"); 
        cpSettings.setAttribute("hidden", true);
    }
}

//Toggles the create crew position screen
function toggleCreateCrewPositionScreen(){
    //Grabbing DOM elements
    let createCPScreen = document.getElementById("createCrewPositionScreen");
    let cpSettings = document.getElementById("ao_cpSettings");

    //If the create crew position screen was hidden before, unhide it
    if(createCPScreen.getAttribute("hidden") !== null){
        createCPScreen.removeAttribute("hidden"); 
        cpSettings.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        cpSettings.removeAttribute("hidden"); 
        createCPScreen.setAttribute("hidden", true);
    }
}

//Toggles the delete crew position screen
function toggleDeleteCrewPositionScreen(){
    //Grabbing DOM elements
    let deleteCPScreen = document.getElementById("deleteCrewPositionScreen");
    let cpSettings = document.getElementById("ao_cpSettings");

    //If the delete crew position screen was hidden before, unhide it
    if(deleteCPScreen.getAttribute("hidden") !== null){
        deleteCPScreen.removeAttribute("hidden"); 
        cpSettings.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        cpSettings.removeAttribute("hidden"); 
        deleteCPScreen.setAttribute("hidden", true);
    }
    cpTableFillDelete();
}

//Toggles the update crew position screen
function toggleUpdateAllCrewPositionScreen(){
    //Grabbing DOM elements
    let updateCPScreen = document.getElementById("editCrewPositionScreen");
    let cpSettings = document.getElementById("ao_cpSettings");

    //If the update crew position screen was hidden before, unhide it
    if(updateCPScreen.getAttribute("hidden") !== null){
        updateCPScreen.removeAttribute("hidden"); 
        cpSettings.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        cpSettings.removeAttribute("hidden"); 
        updateCPScreen.setAttribute("hidden", true);
    }
    cpTableFillEdit();
}

//Toggles the update user permissions page in the user settings
function toggleChangeUserTypeDiv(){
    //Grabbing DOM elements
    let userSettingsScreen = document.getElementById("ao_userSettingsMenu");
    let changeUserTypeDiv = document.getElementById("ao_changeUserType");

    //If the change user type screen was hidden before, unhide it
    if(changeUserTypeDiv.getAttribute("hidden") !== null){
        changeUserTypeDiv.removeAttribute("hidden"); 
        userSettingsScreen.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        userSettingsScreen.removeAttribute("hidden"); 
        changeUserTypeDiv.setAttribute("hidden", true);
    }
}

function toggleEditSyllabusDiv(){
    //Grabbing DOM elements
    let editSyllabusDiv = document.getElementById("editSyllabusDiv");
    let searchEditSyllabusDiv = document.getElementById("searchEditSyllabusDiv");
    let syllabusMenu = document.getElementById("ao_syllabusMenu");

    //If the change user type screen was hidden before, unhide it
    if(editSyllabusDiv.getAttribute("hidden") !== null){
        editSyllabusDiv.removeAttribute("hidden"); 
        searchEditSyllabusDiv.setAttribute("hidden", true);
        syllabusMenu.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        syllabusMenu.removeAttribute("hidden"); 
        editSyllabusDiv.setAttribute("hidden", true);
        searchEditSyllabusDiv.setAttribute("hidden", true);
    }
}

//Toggles the change crew position screen
function toggleChangeCrewPositionScreen(){
    //Grabbing DOM elements
    let generalPage = document.getElementById("ao_generalPage");
    let changeCrewPositionScreen = document.getElementById("ao_changeCrewPosition");

    //If the change crew position screen was hidden before, unhide it
    if(changeCrewPositionScreen.getAttribute("hidden") !== null){
        changeCrewPositionScreen.removeAttribute("hidden"); 
        generalPage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        generalPage.removeAttribute("hidden"); 
        changeCrewPositionScreen.setAttribute("hidden", true);

    }
}

function toggleEditCPDiv(){
        //Grabbing DOM elements
    let editCPTable = document.getElementById("editCrewPositionScreen");
    let editCPDiv = document.getElementById("editCPDiv");

    if(editCPDiv.getAttribute("hidden") !== null){
        editCPDiv.removeAttribute("hidden"); 
        editCPTable.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the menu from before
    else{
        editCPTable.removeAttribute("hidden"); 
        editCPDiv.setAttribute("hidden", true);

    }
    cpTableFillEdit();
}

//Toggles the profile screen
function toggleProfileScreen(){
    //Grabbing DOM elements
    let generalPage = document.getElementById("ao_generalPage");
    let profileScreen = document.getElementById("ao_profile");

    //If the profile screen was hidden before, unhide it
    if(profileScreen.getAttribute("hidden") !== null){
        generateProfile();
        profileScreen.removeAttribute("hidden"); 
        generalPage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        generalPage.removeAttribute("hidden"); 
        profileScreen.setAttribute("hidden", true);

    }
}

//Toggles the syllabus settings
function toggleSyllabusScreen(){
    //Grabbing DOM elements
    let generalPage = document.getElementById("ao_generalPage");
    let syllabusScreen = document.getElementById("ao_syllabus");

    //If the syllabus settings was hidden before, unhide it
    if(syllabusScreen.getAttribute("hidden") !== null){
        syllabusScreen.removeAttribute("hidden"); 
        generalPage.setAttribute("hidden", true);
    }
    //otherwise, hide everything and show the general page
    else{
        generalPage.removeAttribute("hidden"); 
        syllabusScreen.setAttribute("hidden", true);
    }
}

//Toggles the add syllabus screen in syllabus settings
function toggleAddSyllabusDiv(){
    //Grabbing DOM elements
    let addSyllabusScreen = document.getElementById("ao_addSyllabusDiv");
    let deleteSyllabusScreen = document.getElementById("ao_deleteSyllabusDiv");
    let syllabusMenu = document.getElementById("ao_syllabusMenu");

    //If the add syllabus screen was hidden before, unhide it
    if(addSyllabusScreen.getAttribute("hidden") !== null){
        addSyllabusScreen.removeAttribute("hidden"); 
        deleteSyllabusScreen.setAttribute("hidden", true);
        syllabusMenu.setAttribute("hidden", true);
    }
    //Otherwise, hide it and show the syllabus settings
    else{
        syllabusMenu.removeAttribute("hidden"); 
        deleteSyllabusScreen.setAttribute("hidden", true);
        addSyllabusScreen.setAttribute("hidden", true);
    }
}

function toggleSearchEditSyllabusDiv(){
    //Grabbing DOM elements
    let searchEditSyllabusDiv = document.getElementById("searchEditSyllabusDiv");
    let syllabusMenu = document.getElementById("ao_syllabusMenu");

    //If the add syllabus screen was hidden before, unhide it
    if(searchEditSyllabusDiv.getAttribute("hidden") !== null){
        searchEditSyllabusDiv.removeAttribute("hidden"); 
        syllabusMenu.setAttribute("hidden", true);
    }
    //Otherwise, hide it and show the syllabus settings
    else{
        syllabusMenu.removeAttribute("hidden"); 
        searchEditSyllabusDiv.setAttribute("hidden", true);
    }
}

//Toggles the delete syllabus screen in syllabus settings
function toggleDeleteSyllabusDiv(){
    //Grabbing DOM elements
    let addSyllabusScreen = document.getElementById("ao_addSyllabusDiv");
    let deleteSyllabusScreen = document.getElementById("ao_deleteSyllabusDiv");
    let syllabusMenu = document.getElementById("ao_syllabusMenu");

    //If the delete syllabus screen was hidden before, unhide it
    if(deleteSyllabusScreen.getAttribute("hidden") !== null){
        deleteSyllabusScreen.removeAttribute("hidden"); 
        addSyllabusScreen.setAttribute("hidden", true);
        syllabusMenu.setAttribute("hidden", true);

    }
    //Otherwise, hide it and show the syllabus settings
    else{
        syllabusMenu.removeAttribute("hidden"); 
        deleteSyllabusScreen.setAttribute("hidden", true);
        addSyllabusScreen.setAttribute("hidden", true);
    }
}

async function selectCPEditRedirect(e){
    //Gets the id
    let index = e.target.id;
  
    //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
    if(!index.includes("editCP")){
      return;
    }
      //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
    index = index.replaceAll('editCP', '');
    document.getElementById("editCPid").value = index;

    let idObj = {
        id: index
    }

    let data = await findCPID(idObj);
    document.getElementById("editCPDivH1").innerHTML = "Edit " + data.acronym.toUpperCase();
    toggleEditCPDiv();

    document.getElementById("editCPFN").value = data.fullName;
    document.getElementById("editCPAcronym").value = data.acronym;
    document.getElementById("editCPAcronymOld").value = data.acronym;
}

async function selectCPDelete(e){
    //Gets the id
    let index = e.target.id;
    let header = document.getElementById("alertAOText");
    let header2 = document.getElementById("successAOText");
  
    //The delete button looks like this "delete{id of the event}" so if you clicked on an element with "delete" in the ID, it will trigger this function.
    if(!index.includes("deleteCP")){
      return;
    }
      //Remove 'delete' from the id and leave just the number so we can use the id for deleting the event
    index = index.replaceAll('deleteCP', '');

    let idObj = {
        id: index
    }
    let data = await findCPID(idObj);
    let string = "Are you sure you want to delete " + data.fullName + "? This cannot be undone!";
    if (window.confirm(string) === true) {
        unhideLoad();
        let data = await deleteCP(idObj);
        if(data.status === true){
            header2.innerHTML = "Successfully deleted crew position!";
            unHideSuccess();
            cpTableFillDelete();
            updateCPSelects();
        }
        else{
            header.innerHTML = "Error deleting crew position!";
            unHideAlert();
        }
    }
    else{
        header.innerHTML = "Cancelled!";
        unHideAlert();
    }
}



export default class AccountOptionsPage extends Component {
  
    constructor(props){
        //Syntax line
        super(props);
        
        //Syntax functions
        this.changeUserType= this.changeUserType.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changeOldPassword = this.changeOldPassword.bind(this);
        this.changeCrewPosition = this.changeCrewPosition.bind(this);

        this.updateNewName = this.updateNewName.bind(this);
        this.createNewUser=this.createNewUser.bind(this);

        //The state. Too many forms so I stopped adding to it.
        this.state={

            _id:"",//Email
            userType:"",
            name:"",
            crewPosition:""
        }
    }
    
    //Searches for user by email
    searchEmail = async (e)=>{
        specificSearchClick();
        
        //Grabs dom input
        let field = document.getElementById("searchUserInput").value.toLowerCase().trimEnd();

        //Creates object to send to the database from input
        let emailPassObj = {
            email: field
        }
       
        //Searches for user with that object
        let data = await findUserE(emailPassObj);

        //Creates an array and adds the data to it because the table generator only takes arrays
        let dataArray = [];
        if(data){
            dataArray.push(data)
            userTableFill(dataArray);
            return;
        }
        //Sends nothing to the table generator to get a "no users found!" message
        else{
            userTableFill(null);
        }
    }

    //Searches for user by first name
    searchFirstName = async (e)=>{
        specificSearchClick();

        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase().trimEnd();

        //Object for sending to the DB
        let firstNameObj = {
            firstName: field
        }

        //Data retrieved from database
        let data = await findUserFN(firstNameObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }

    //Searches for user by last name
    searchLastName = async (e)=>{
        specificSearchClick();
        
        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase().trimEnd();

        //Object for sending to the DB
        let lastNameObj = {
            lastName: field
        }

        //Data retrieved from database
        let data = await findUserLN(lastNameObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }

    //Searches for user by crew position
    searchCP = async (e)=>{
        specificSearchClick();
        
        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase().trimEnd();

        if(field.includes(" ") ){

            let data2 = await findAllCrewPositions();

            for(let i = 0; i < data2.length; i++){
                if(field === data2[i].fullName){
                    field = data2[i].acronym;
                }
            }
        }
        if(field && field.includes(" ") ){
            field = field.replace(/\s/g, '');
        }

        //Object for sending to the DB
        let crewPositionObj = {
            crewPosition: field
        }

        //Data retrieved from database
        let data = await findUserCP(crewPositionObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }

    //Searches for user by syllabus
    searchS = async (e)=>{
        specificSearchClick();
        

        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase().trimEnd();

        //Object for sending to the DB
        let syllabusObj = {
            syllabus: field
        }

        //Data retrieved from database
        let data = await findUserS(syllabusObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }

    //Searches for user by user type
    searchUT = async (e)=>{
        specificSearchClick();

        //Dom
        let field = document.getElementById("searchUserInput").value.toLowerCase().trimEnd();

        //Object for sending to the DB
        let userTypeObj = {
            userType: field
        }

        //Data retrieved from database
        let data = await findUserUT(userTypeObj);
        if(data){
            userTableFill(data);
        }
        else{
            userTableFill(null);
        }
    }

    //Updates the userType value on form change
    changeUserType = (e)=>{
        this.setState({
            userType: e.target.value
        });
    }

    //Updates crew position on change
    changeCrewPosition = (e)=>{
        this.setState({
            crewPosition: e.target.value
        });
    }

    //Updates old password on change
    changeOldPassword = (e)=>{
        this.setState({
            oldPassword: e.target.value
        });
    }

    //Updates name on change
    changeName = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    //Updates the user's name
    updateNewName = async (e)=>{
        //Stops page from refreshing
        e.preventDefault();

        //Manipulates the header to say loading until a result is received
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        header.innerHTML = "Loading...";
        unhideLoad();
        

        //Get user data and DOM values
        let userData = await getUserData();
        let newFirstName = (document.getElementById("newFirstName").value).toLowerCase().trimEnd();
        let newLastName = (document.getElementById("newLastName").value).toLowerCase().trimEnd();

        //If the new name is the same as the old one, don't do anything
        if(userData.firstName === newFirstName && userData.lastName === newLastName){
            header.innerHTML = "New name is identical to current name!"
            unHideAlert();
            return;
        }

        //Creates an object from user data
        let user={
            email: userData.email,
            firstName: newFirstName,
            lastName: newLastName
        }
        //Updates name with object
            
        let status = await updateName(user);
        status = status.status;

        let emailName = {
            email: userData.email,
            newName: newLastName + ", " + newFirstName
        }
    
        //If the user's current name is now their desired name, the update worked!
        if(status === true){
            header2.innerHTML = "Name updated successfully!";
            unHideSuccess();
            await updateCertainNameNewInst(emailName);
            await updateCertainNameNewStu(emailName);
            let s = await updateNameRequest(user);
        }
        //Otherwise it did not work...
        else{
            header.innerHTML = "Error updating name!"
            unHideAlert();
        }
    }

    //Updates the user's password
    updatePassword = async (e)=>{
        e.preventDefault();

        //Finding DOM elements
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        header.innerHTML = "Loading..."
        unhideLoad();
        let userData = await getUserData();
        let oldPassword = document.getElementById("oldPassword").value;
        let newPassword1 = document.getElementById("newPassword1").value;
        let newPassword2 = document.getElementById("newPassword2").value;

        //Misspelled your new password
        if(newPassword1 !== newPassword2){
            header.innerHTML = "New password fields are not equal";
            unHideAlert();
            return;
        }

        //Incorrect password
        if(userData.password !== oldPassword){
            header.innerHTML = "Incorrect old password";
            unHideAlert();
            return;
        }

        //Trying to change your password into the same password you had before
        if(oldPassword === newPassword1){
            header.innerHTML = "Old and new password are the same!";
            unHideAlert();
            return;
        }

        //Creating user object to send to the database
        let user = {
            email: userData.email,
            password: newPassword1,
        }

        //Update password function from features
       
        let status =  await updatePassword(user);
        status = status.status;

        if(status === true){
            header2.innerHTML = "Password updated successfully!"
            unHideSuccess();
            document.getElementById("newPassword1").value = "";
            document.getElementById("newPassword2").value = "";
            document.getElementById("oldPassword").value = "";

        }
        //Otherwise, either password changing wasn't successful, or checking the database went wrong
        else{
            header.innerHTML = "Error updating password!"
            unHideAlert();
        }
    }

    //Updates the user's crew position
    updateNewCrewPosition = async (e) => {
        //Prevernts the page from refreshing
        e.preventDefault();

        //Manipulates the header
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        header.innerHTML = "Loading...";
        unhideLoad();

        //Sets desired crew position from input
        let desiredCrewPosition = document.getElementById("ChangeUserCP").value;

        if(desiredCrewPosition === 'none'){
            desiredCrewPosition = null;
        }

        //Gets user data and check if the user already has this position
        let userData = await getUserData();
        if(desiredCrewPosition === userData.crewPosition){
            header.innerHTML = "You already have this crew position!"
            unHideAlert();
            return;
        }

        //Creating user object to send to the database
        let user;

        user = {
            email: userData.email,
            crewPosition: desiredCrewPosition
        }

        //Update crew position function from features
        
        let status =  await updateCrewPosition(user);
        status = status.status;

        if(status === true){
            header2.innerHTML = "Crew Position successfully updated!";
            unHideSuccess();
        }
        //If not, it has failed
        else{
            header.innerHTML = "Error updating Crew Position!";
            unHideAlert();
        }
    }

    //Updates the user's type
    updateUserType = async (e) => {
        //Prevents the page from refreshing
        e.preventDefault();

        //Grabbing DOM elements
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        let email = document.getElementById("updateUserTypeInput").value;
        let newUserType = document.getElementById("updateUserTypeSelect").value;

        //Manipulates the header to say loading until data comes back
        header.innerHTML = "Loading...";
        unhideLoad();

        //Creates an email object from input
        let emailObj = {
            email: email
        };

        //Gets user's own data and user data from the input.
        let userData = await findUserE(emailObj);
        let myUserData = await getUserData();

        //If the user they looked up doesn't exist, do nothing
        if(!userData){
            header.innerHTML = "Specified user does not exist!";
            unHideAlert();
            return;
        }

        //If they are the same, do nothing.
        if(userData.email === myUserData.email){
            header.innerHTML = "Cannot update one's own permissions!";
            unHideAlert();
            return;
        }

        //If they are trying to update the permission to one that they already have, do nothing.
        if(userData.userType === newUserType){
            header.innerHTML = "They already have these permissions!";
            unHideAlert();
            return;
        }

        //Make user object from input
        let user = {
            email: email,
            userType: newUserType
        };

        if(user.userType == "admin"){
            if(window.confirm("Are you sure you want to give this user admin permissions?") == false){
                header.innerHTML = "Cancelled Permissions Update!";
                unHideAlert();
                return;
            }
        }

        //Update user type in DB
        let status = await updateUserType(user);

        status = status.status;

        if(status === true){
            header2.innerHTML = "Successfully Updated User Permissions";
            unHideSuccess();
        }
        //Otherwise it failed..
        else{
            header.innerHTML = "Error Updating User Permissions";
            unHideAlert();
        }
    }

    //Updates the user's syllabus
    updateSyllabus = async (e) => {
        //Prevents the page from refreshing
        e.preventDefault();

        //Grabbing DOM elements
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        let email = document.getElementById("updateSyllabusEmail").value.toLowerCase().trimEnd();
        let code = document.getElementById("updateSyllabusCodeSelect").value.toLowerCase().trimEnd();

        //Manipulates the header to say loading until data comes back
        unhideLoad();

        //Creates an email object from input
        let emailObj = {
            email: email,
        };
        let syllabusObj = {
            code: code
        };

        let updateObj;
        let syllabus;

        if(code !== 'none'){
            updateObj = {
                email: email,
                syllabus: code
            };

            syllabus = await findSyllabus(syllabusObj);

            if(syllabus.length < 1){
                header.innerHTML = "Syllabus Does Not Exist!";
                unHideAlert();
                return;
            }
        }
        else{
            updateObj = {
                email: email,
                syllabus: null
            };
        }

        let user = await findUserE(emailObj);

        if(!user){
            header.innerHTML = "User Does Not Exist!";
            unHideAlert();
            return;
        }

        let status = await updateUserSyllabus(updateObj);
        status = status.status;

        if(status === true){
            header2.innerHTML = "Successfully Updated User Syllabus!";
            unHideSuccess();
            searchWithoutSyllabus();
        }
        //Otherwise it failed..
        else{
            header.innerHTML = "Error Updating User Syllabus";
            unHideAlert();
        }
    }

    //Adds a new syllabus to the DB
    addNewSyllabus = async (e) => {
        //Prevents the page from refreshing
        e.preventDefault();

        //Grabs DOM elements and created loading message
        let code = document.getElementById("syllabusCode").value.toLowerCase().trimEnd();
        let startDate = document.getElementById("syllabusStartDate").value;
        let endDate = document.getElementById("syllabusEndDate").value;
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        unhideLoad();

        //Creates object for sending to the DB
        let syllabusObj = {
            code: code,
            //The 00:00:00 is very important because time zones make days off if we don't specify the time to be zero
            startDate: (startDate + " 00:00:00"), 
            endDate: (endDate + " 00:00:00")
        }

        //Creates object for sending to the DB
        let codeObj = {
            code: code
        };

        //Checks if a syllabus with that code already exists
        let syllabus = await findSyllabus(codeObj);
        if(syllabus.length > 0){
            header.innerHTML = "Syllabus with that code already exists!";
            unHideAlert();
            return;
        }
        //Adds the syllabus to the DB
        let status =  await addSyllabus(syllabusObj);
        status = status.status;

        if(status === true){
            header2.innerHTML = "Successfully Added Syllabus!"
            unHideSuccess();
            //Refresh the syllabus table
            let syllabusData = await findAllSyllabus();
            syllabusTableFill(syllabusData);
            fillUpdateSyllabusCodeSelect();
        }
        //Otherwise, we failed..
        else{
            header.innerHTML = "Error Adding Syllabus!"
            unHideAlert();
        }
    }

    //Deletes a syllabus from the DB
    deleteASyllabus = async (e) => {
        //Prevents the page from refreshing
        e.preventDefault();

        //Grabs DOM elements and makes loading message
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        let code = document.getElementById("syllabusCodeDelete").value.toLowerCase().trimEnd();
        let codeBox = document.getElementById("syllabusCodeDelete");
        unhideLoad();

        //Creates object for sending to the DB
        let codeObj = {
            code: code
        }

        let syllabus = await findSyllabus(codeObj);
        if(syllabus.length < 1){
            header.innerHTML = "That Syllabus Does Not Exist!";
            unHideAlert();
            return;
        }
        let string = "Do you really want to delete " + code + "? This cannot be undone!";
        
        if (window.confirm(string) === true) {
            //Deletes the syllabus using the object created above.
            let results = await deleteSyllabus(codeObj);
            if(results === 200){
                let syllabusData = await findAllSyllabus();
                syllabusTableFill(syllabusData);
    
                let updateObj = {
                    syllabus: code
                }
                let results = await updateCertainSyllabus(updateObj);
                console.log(results);
                header2.innerHTML = "Successfully Deleted Syllabus";
                unHideSuccess();
                fillUpdateSyllabusCodeSelect();
                codeBox.value = "";
                return;
            }
            else{
                header.innerHTML = "Error Deleting Syllabus!";
                unHideAlert();
            }
        }
        else{
            header.innerHTML = "Cancelled!";
            unHideAlert();
        }
    }

    editSyllabus = async (e) => {
        e.preventDefault();
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        let oldSyllabusCode = document.getElementById("editOldSyllabusCode").value;
        let newSyllabusCode = document.getElementById("editNewSyllabusCode").value.toLowerCase().trimEnd();
        let newSyllabusStartDate = document.getElementById("editNewStartDate").value;
        let newSyllabusEndDate = document.getElementById("editNewEndDate").value;

        unhideLoad();

        let sylObj = {
            oldCode: oldSyllabusCode,
            code: newSyllabusCode,
            //The 00:00:00 is very important because time zones make days off if we don't specify the time to be zero
            startDate: (newSyllabusStartDate + " 00:00:00"), 
            endDate: (newSyllabusEndDate + " 00:00:00")
        }

        let status = await updateSyllabus(sylObj);
        status = status.status;

        if(status === true){
            header2.innerHTML = "Successfully Edited Syllabus!"
            unHideSuccess();
            document.getElementById("editOldSyllabusCode").value = newSyllabusCode;
            let sylData = await findAllSyllabus();

            let updateObj = {
                syllabus: oldSyllabusCode,
                newSyllabus: newSyllabusCode
            }
            await updateCertainSyllabusNew(updateObj);
            await updateCertainEventSyllabusNew(updateObj);
            
            fillUpdateSyllabusCodeSelect();
            syllabusTableFill(sylData);
        }
        else{
            header.innerHTML = "Error Editing Syllabus"
            unHideAlert();
        }
    }

    searchSyllabusForEdit = async (e) => {
        e.preventDefault();
        
        unhideLoad()
        let input = document.getElementById("editSyllabusCode").value.toLowerCase().trimEnd();
        let header = document.getElementById("alertAOText");
        let sylObj = {
            code: input
        }
        let syllabus = await findSyllabus(sylObj);
        if(syllabus.length < 1){
            header.innerHTML = "Syllabus does not exist";
            unHideAlert();
        }
        else{
            let oldSyllabusCode = document.getElementById("editOldSyllabusCode");
            let newSyllabusCode = document.getElementById("editNewSyllabusCode");
            let newSyllabusStartDate = document.getElementById("editNewStartDate");
            let newSyllabusEndDate = document.getElementById("editNewEndDate");

            let startDateStringBad = syllabus[0].startDate
            let startDateStringGood = startDateStringBad.slice(0, startDateStringBad.indexOf("T"));

            let endDateStringBad = syllabus[0].endDate;
            let endDateStringGood = endDateStringBad.slice(0, endDateStringBad.indexOf("T"));

            oldSyllabusCode.value = input;
            newSyllabusCode.value = input;
            newSyllabusStartDate.defaultValue = startDateStringGood;
            newSyllabusEndDate.defaultValue = endDateStringGood;
            toggleEditSyllabusDiv();

            unHideSuccess();
            hideSuccess();
        }


    }

    //Deletes a user from the DB
    deleteUser = async (e) => {
        //Prevents the page from refreshing
        e.preventDefault();
        var checkedBoxes = document.getElementsByName("deleteUserCheckbox");
        let header = document.getElementById("alertAOText");
        unhideLoad();
        var checkboxesChecked = [];
        let deleteArray = [];

        for (var i=0; i< checkedBoxes.length; i++) {
            // And stick the checked ones onto an array...
            if (checkedBoxes[i].checked) {
               checkboxesChecked.push(checkedBoxes[i]);
            }
         }
         for(let i = 0; i < checkboxesChecked.length; i++){

          let index = checkboxesChecked[i].id;
          index = index.replaceAll('deleteUserCheckbox', '');

          let myData = await getUserData();
          if(index === myData.email){
            header.innerHTML = "Cannot delete one's own account!";
            unHideAlert();
            return;
          }
          deleteArray.push(index);
        }
        
        if(deleteArray.length < 1){
            header.innerHTML = "No users selected for deletion!";
            unHideAlert();
            return;
        }

        let string = "Please be sure you want to delete these users";
        if (window.confirm(string) === true) {
            //Make loading message
            header.innerHTML = "Loading...";


                await deleteUserMany(deleteArray);
                await deleteUserUpdateAttendanceInst(deleteArray)
                await deleteUserUpdateAttendanceStu(deleteArray);
                await updateRequestDeleted(deleteArray);
            setTimeout(async function(){
                let userData = await findAllUsers();
                deleteUserTableFill(userData);
            }, 1000);
        } 
        //If the user pressed cancel, do nothing.
        else {
            header.innerHTML = "Cancelled!"
            unHideAlert();
        }

    }

    //Submits information given in the form to the database for creating a new user
    createNewUser = async (e)=>{
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        let password = document.getElementById("createUserPassword").value;
        let passwordForm = document.getElementById("createUserPassword");
        let email = document.getElementById("createUserEmail").value.toLowerCase().trimEnd();
        let emailForm = document.getElementById("createUserEmail");

        //Temporary loading message
        header.innerHTML = "Loading..."
        unhideLoad();
        e.preventDefault();

        //Creates a user object for sending to the database
        const user={
            email: email,
            password: password,
            userType: this.state.userType,
            firstName: null,
            lastName: null,
            syllabus: null,
            crewPosition: null
        }

        if(user.userType === "admin"){
            if(window.confirm("Are you sure you want to make this user an admin?") !== true){
                header.innerHTML = "Cancelled!";
                unHideAlert();
                return;
            }
        }

        //Registering to the DB here!
        let status = await register(user);
        let response = status.result;
        status = status.status;

        if(status === true){
            header2.innerHTML = response;
            unHideSuccess();
            var randomstring = Math.random().toString(36).slice(-8);
            passwordForm.value = randomstring;
            emailForm.value = "";
        }
        //No user exists, either the email was already taken and registration failed, or registration failed some other way.
        else{
           header.innerHTML =  response;
           unHideAlert();
        }
    }

    createCrewPosition = async (e)=>{
        e.preventDefault();
        unhideLoad();
        let fullName = document.getElementById("newCPFullName").value.toLowerCase().trimEnd();
        let acronym = document.getElementById("newCPAcronym").value.toLowerCase().trimEnd();
        let cpObj = {
            acronym: acronym, 
            fullName: fullName
        };

        let acObject = {
            acronym: acronym
        }
        let exists = await findCPA(acObject);

        if(exists){
            document.getElementById("createCrewPositionH1").innerHTML = "That acronym already exists!"
            return;
        }
        let status = await addCrewPosition(cpObj);
        status = status.status;

        if (status === true) {
            document.getElementById("successAOText").innerHTML = "Successfully Created Crew Position!";
            unHideSuccess();
        }else{
            document.getElementById("alertAOText").innerHTML = "Error Creating Crew Position!";
            unHideAlert();
        }
        updateCPSelects();
    }

    editCP = async(e) => {
        let fullName = document.getElementById("editCPFN").value.toLowerCase().trimEnd();
        let acronym = document.getElementById("editCPAcronym").value.toLowerCase().trimEnd();
        let acronymOld = document.getElementById("editCPAcronymOld").value.toLowerCase().trimEnd();
        let id = document.getElementById("editCPid").value.toLowerCase().trimEnd();
        let header = document.getElementById("alertAOText");
        let header2 = document.getElementById("successAOText");
        unhideLoad();

        let cpObj = {
            id: id,
            fullName: fullName,
            acronym: acronym
        }

        if(acronym !== acronymOld){
            let acObject = {
                acronym: acronym
            }
            let exists = await findCPA(acObject);

            if(exists){
                header.innerHTML = "That acronym already exists!";
                unHideAlert();
                return;
            }
        }
        let status = await updateACrewPosition(cpObj);
        status = status.status;

        if (status === true) {
            document.getElementById("successAOText").innerHTML = "Successfully updated crew position!";
            unHideSuccess();
        }else{
            document.getElementById("alertAOText").innerHTML = "Error updating crew position! Acronym might be taken!";
            unHideAlert();
        }

        cpTableFillEdit();
        await updateCPSelects();

        let crewPosition = {
            crewPosition: acronymOld,
            newCrewPosition: acronym
        }
        let results = await updateCertainCPNew(crewPosition);
        results = results.status;
    }

    //Generates the general page when the screen loads
    componentDidMount() {
        generatePage();
      }

    //Logs out the current user
    logout = (e) =>{
        logOut();
        window.location.reload(false);
    }

    //The jsx
    render() {
        return(
            <div className="ci" id="ao_wholeDocument">

{/* GENERAL PAGE */} 
                <div className="ci" id="ao_generalPage">
                    <center className='OptionsBox'>
                        <h1 id = "acctOptnsH1">
                            Loading...
                        </h1>
                        <div id="ao_HTMLgeneration">
                            <Button className="button-28 aoButtonMenu" onClick={toggleProfileScreen} id="OptionsProfile">Profile</Button>
                            <Button className="button-28 aoButtonMenu" onClick={toggleChangeNameScreen} id="OptionsUpdateName">Update Name</Button>
                            <Button className="button-28 aoButtonMenu" onClick={toggleChangePasswordScreen} id="OptionsUpdatePassword">Update Password</Button>
                            <Button className="button-28 aoButtonMenu" onClick={toggleChangeCrewPositionScreen} id="OptionsUpdateCrewPosition">Update Crew Position</Button>
                        </div>
                        <div>
                             <Link to="/"><Button className="button-28 aoButtonMenu" id="OptionsBackHome">Back to Home</Button></Link>
                        </div>
                    </center>
                </div>

{/* CREATE USER SCREEN INITIALLY HIDDEN */} 

                <div className="ci" id="ao_createUser" hidden>
                    <center><h1 id="ao_createUserH1">Create a User</h1></center>
                    <h2 id="ao_createUserH2"> </h2>
                    <form onSubmit={this.createNewUser}>
                        <p className= "Email-Label createUserLabel">
                            Email
                        </p>
                        <Form.Control maxlength="100" name = "email" id="createUserEmail" className="input createUserInput" required type="email"></Form.Control>
                        <p className="Password-Label createUserLabel">
                            Password
                        </p>
                        <Form.Control name = "password" id="createUserPassword" className="input createUserInput" required type="input"></Form.Control>
                        <p className="Password-Label createUserLabel">
                            User Type
                        </p>

                        <select required className="form-select createUserInput" onChange={this.changeUserType} id="UserTypeSelect">
                            <option value="">Select</option>
                            <option value="admin">Admin</option>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>
                        <br />
                        <Button className="button-28" type="Submit" id="NewUserBtn">Create</Button>
                        <Button className="button-28" onClick={toggleNewUserDiv} id="NewUserBackBtn">Back</Button>
                    </form>
                </div>

{/* CHANGE NAME SCREEN INITIALLY HIDDEN */} 

                <div className="ci" id="ao_changeName" hidden>
                    <center>
                        <h1 className="aoHeader" id="ao_changeNameH1">Enter your name here!</h1>
                    </center>
                    <form onSubmit={this.updateNewName}>
                        <label className="ao_labelChangeName">First Name:</label>
                        <Form.Control maxlength="30" required id="newFirstName" className="input" value={this.state.name} onChange={this.changeName} placeholder="Enter your first name"></Form.Control>
                        <label className="ao_labelChangeName">Last Name:</label>
                        <Form.Control maxlength="30" required id="newLastName" className="input" placeholder="Enter your last name"></Form.Control>
                        <Button className="button-28" type="Submit" id="updateNameBtn">Update Name</Button>
                        <Button className="button-28" onClick={toggleChangeNameScreen} id="nameBackBtn">Back</Button>
                    </form>
                </div>

{/* CHANGE PASSWORD SCREEN INITIALLY HIDDEN */} 

                <div className="ci" id="ao_changePassword" hidden>
                    <center>
                        <h1 id="ao_changePasswordH1">Change your password</h1>
                    </center>
                    <form onSubmit={this.updatePassword}>
                        <label className="changePasswordLabel">Old Pasword:</label>
                        <Form.Control type = "password" required id="oldPassword" className="input changePasswordInput" value={this.state.oldPassword} onChange={this.changeOldPassword} placeholder="Enter your old password"></Form.Control>

                        <label className="changePasswordLabel">New Pasword:</label>
                        <Form.Control type = "password" required id="newPassword1" className="input changePasswordInput" placeholder="Enter your new password"></Form.Control>
                        <label className="changePasswordLabel">Confirm New Pasword:</label>
                        <Form.Control type="password" required id="newPassword2" className="input changePasswordInput" placeholder="Enter your new password again"></Form.Control>

                        <Button className="button-28" type="Submit" id="UpdatePasswordBtn">Update Password</Button>
                        <Button className="button-28" onClick={toggleChangePasswordScreen} id="UpdatePasswordBack">Back</Button>
                    </form>
                </div>

{/* CHANGE CREW POSITION INITIALLY HIDDEN */}

                <div className="ci" id="ao_changeCrewPosition" hidden>
                    <center>
                        <h1 id="ao_changeCrewPositionH1">Change your Crew Position</h1>
                    </center>
                    <form onSubmit={this.updateNewCrewPosition}>
                        <label className="changeCPLabel">New Crew Position:</label>
                        <center>
                            <select required className="form-select" id="ChangeUserCP" onChange={this.changeCrewPosition}></select>
                        </center>
                        <Button className="button-28" type="Submit" id="UpdateCrewBtn">Update</Button>
                        <Button className="button-28" onClick={toggleChangeCrewPositionScreen} id="UpdateCrewBack">Back</Button>
                    </form>
                </div>

{/* SYLLABUS OPTIONS INITIALLY HIDDEN */}

                <div className="ci" id="ao_syllabus" hidden>
                    <div id="ao_syllabusMenu">
                        <center>
                            <h1 id="EditSyllabusWords">Edit Syllabuses</h1>

                            <Button className="button-28 sylMenuBtn" onClick={toggleAddSyllabusDiv} id="toggleAddSyllabusBtn">Add Syllabus</Button>
                            <Button className="button-28 sylMenuBtn" onClick={toggleDeleteSyllabusDiv} id="toggleDeleteSyllabusBtn">Delete Syllabus</Button>
                            <Button className="button-28 sylMenuBtn" onClick={toggleSearchEditSyllabusDiv} id="toggleSearchEditSyllabusBtn">Edit Syllabus</Button>
                            <Button className="button-28 sylMenuBtn" onClick={toggleSyllabusScreen} id="toggleeditSyllabusBtn">Back</Button>
                        </center>
                    </div>
                    <div className="ci" id="ao_addSyllabusDiv" hidden>
                        <form onSubmit={this.addNewSyllabus}>
                            <center>
                                <h1 id="ao_syllabusH1">Add A Syllabus</h1>
                            
                                <label className="syllabusLabels" htmlFor="syllabusCode" id="SylCode">Syllabus Code</label>
                                <Form.Control maxlength="30" type = "input" required id="syllabusCode" className="syllabusInputs input" placeholder="Enter the syllabus code" name="syllabusCode"></Form.Control>

                                <label className="syllabusLabels" htmlFor="startDate" id="StartDateSyll">Start Date</label>
                                <Form.Control type = "date" required id="syllabusStartDate" className="syllabusInputs input" name="startDate"></Form.Control>

                                <label className="syllabusLabels" htmlFor="endDate" id="EndDateSyll">Ending Date</label>
                                <Form.Control type = "date" required id="syllabusEndDate" className="syllabusInputs input" name="endDate"></Form.Control>

                                <Button className="button-28" type="Submit" id="addSyllabus">Add New Syllabus</Button>
                                <Button className="button-28" onClick={toggleAddSyllabusDiv} id="toggleSyllabusAddBtn">Back</Button>
                            </center>
                        </form>
                    </div>
                    <div className="ci" id="ao_deleteSyllabusDiv" hidden>
                        <center>
                            <form onSubmit={this.deleteASyllabus}>
                                <center><h1 id="ao_deleteSyllabusH1">Delete A Syllabus</h1></center>
                                
                                <label className="syllabusLabels" htmlFor="syllabusCode" id="DeleteSyll">Enter The Syllabus' Code to Delete It:</label>
                                <Form.Control type = "input" required id="syllabusCodeDelete" className="syllabusInputs input" placeholder="Enter the syllabus code" name="syllabusCode"></Form.Control>

                                
                                <Button className="button-28 sylbtn" type="Submit" id="deleteSyllabus">Delete The Syllabus</Button>
                                <Button className="button-28 sylbtn" onClick={toggleDeleteSyllabusDiv} id="toggleSyllabusDeleteBtn">Back</Button>
                                
                            </form>
                        </center>
                    </div>
                    <div className="ci" id="searchEditSyllabusDiv" hidden>
                        <center>
                            <h1 id="editSyllabusMessage">Which Syllabus?</h1>
                            <form onSubmit={this.searchSyllabusForEdit}>
                                <label className="syllabusLabels" htmlFor="editSyllabusCode" id="SylCode">Syllabus Code</label>
                                <Form.Control type = "input" required id="editSyllabusCode" className="syllabusInputs input" placeholder="Enter the syllabus code" name="syllabusCode"></Form.Control>
                                <Button className="button-28 sylbtn" type="Submit" id="Submit-BTN">Submit</Button>
                                <Button className="button-28 sylbtn" onClick={toggleSearchEditSyllabusDiv} id="Submit-BCK-BTN">Back</Button>
                            </form>
                        </center>

                    </div>
                    <div className="ci" id="editSyllabusDiv" hidden>
                    <form onSubmit={this.editSyllabus}>
                            <center>
                                <h1 id="editSyllabusH1">Edit A Syllabus</h1>
                            
                                <label className="syllabusLabels" htmlFor="editOldSyllabusCode" id="editOldSyllabusCodeLabel">Old Syllabus Code</label>
                                <Form.Control disabled type = "input" required id="editOldSyllabusCode" className="syllabusInputs input" placeholder="Enter the syllabus code" name="editOldSyllabusCode"></Form.Control>

                                <label className="syllabusLabels" htmlFor="editNewSyllabusCode" id="editNewSyllabusCodelabel">New Syllabus Code</label>
                                <Form.Control maxlength="30" type = "input" required id="editNewSyllabusCode" className="syllabusInputs input" placeholder="Enter the syllabus code" name="editNewSyllabusCode"></Form.Control>

                                <label className="syllabusLabels" htmlFor="editNewStartDate" id="editNewStartDatelabel">Start Date</label>
                                <Form.Control type = "date" required id="editNewStartDate" className="syllabusInputs input" name="editNewStartDate"></Form.Control>

                                <label className="syllabusLabels" htmlFor="editNewEndDate" id="editNewEndDatelabel">Ending Date</label>
                                <Form.Control type = "date" required id="editNewEndDate" className="syllabusInputs input" name="editNewEndDate"></Form.Control>

                                <Button className="button-28" type="Submit" id="editSyllabusBtn">Edit the Syllabus</Button>
                                <Button className="button-28" onClick={toggleEditSyllabusDiv} id="editSyllabusBackBtn">Back</Button>
                            </center>
                        </form>
                    </div>
                    <center><h2 >Current Syllabuses</h2></center>
                    <div className="ci" id="editSyllabusTableContainer">
                        <Table striped bordered hover>      
                            <thead id="syllabusTable">
                            </thead>
                        </Table>  
                    </div>     
                </div>

{/* USER OPTIONS INITIALLY HIDDEN */}

                <div className="ci" id="ao_userSettings" hidden>
                    <div className="ci" id="ao_userSettingsMenu">
                        <center><h1 id="userSettingsMenuH1">User Settings</h1></center>
                        <center>
                        <Button className="button-28 userSettingsBtn" onClick={toggleNewUserDiv} id="toggleCreateUserBtn">Create a User</Button>
                        <Button className="button-28 userSettingsBtn" onClick={toggleChangeUserTypeDiv} id="UserSettingsUpdateUserPermissions">Update User Permissions</Button>
                        <Button className="button-28 userSettingsBtn" onClick={toggleSearchDiv} id="UserSettingsSearchUser">Search User</Button>
                        <Button className="button-28 userSettingsBtn" onClick={toggleDeleteDiv} id="UserSettingsDeletehUser">Delete User</Button>
                        <Button className="button-28 userSettingsBtn" onClick={toggleAssignSyllabusDiv} id="UserSettingsAssignSyllabus"> Assign Syllabus To User</Button>
                        <Button className="button-28 userSettingsBtn" onClick={toggleUserSettingsScreen} id="toggleSyllabusBtn">Back</Button> </center>

                    </div>
                    {/* SEARCH USER INITIALLY HIDDEN */}
                    <div className="ci" id="searchUserDiv" hidden>
                        <center>
                        <h1 id="SearchUsersH1">Search for users</h1>
                        <Button className="button-28 searchBtn" onClick={studentTable} id="SearchUsersSettingsButtons">Students</Button>
                        <Button className="button-28 searchBtn" onClick={facultyTable} id="SearchUsersSettingsButtons">Faculty</Button>
                        <Button className="button-28 searchBtn" onClick={adminTable} id="SearchUsersSettingsButtons">Admins</Button>
                        
                        <Dropdown>
                            <Button className="button-28 searchBtn" onClick={allUsersTable} id="SearchUsersSettingsButtons">All Users</Button>
                                <Dropdown.Toggle className="button-28 searchBtn" id="dropdown-basic">
                                    Specific Search
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={this.searchEmail}>Search by email</Dropdown.Item>
                                    <Dropdown.Item onClick={this.searchFirstName}>Search by first name</Dropdown.Item>
                                    <Dropdown.Item onClick={this.searchLastName}>Search by last name</Dropdown.Item>
                                    <Dropdown.Item onClick={this.searchCP}>Search by crew position</Dropdown.Item>
                                    <Dropdown.Item  onClick={this.searchS}>Search by syllabus</Dropdown.Item>
                                </Dropdown.Menu>
                                <Button className="button-28 searchBtn" onClick={toggleSearchDiv} id="SearchUsersSettingsButtons">Back</Button>
                            </Dropdown>
                        
                            <form>
                                <Form.Control type="input" id="searchUserInput" className="input" placeholder="Specific Search"></Form.Control>
                            </form>


                            <h1 id="userTableH1">All Users</h1>
                        </center>
                        <div id="userTableContainer">
                            <Table striped bordered hover>      
                                <thead id="userTable">
                                </thead>
                            </Table>
                        </div>
                    </div>
                    <div className="ci" id="ao_changeUserType" hidden>
                        <center><h1 id="ao_changeUserTypeH1">Update User Type/Permissions</h1></center>
                        <form onSubmit={this.updateUserType}>
                            <center>
                                <Form.Control type = "email" required id="updateUserTypeInput" className="input" placeholder="Enter the user's email"></Form.Control>
                                <select required className="form-select" id="updateUserTypeSelect">
                                    <option value="">Select</option>
                                    <option value="admin">Admin</option>
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                </select>
                            </center>

                            <center>
                                <Button className="button-28" type="Submit" id="UpdateUserTypeBtn">Update User Type</Button>
                                <Button className="button-28" onClick={toggleChangeUserTypeDiv} id="ChangeUserType">Back</Button>
                            </center>
                        </form>
                        <center id="changeTypeTableContainer">
                            <Table striped bordered hover onClick={userTypeFill}>      
                                <thead id="userTypeTable">
                                </thead>
                            </Table>
                        </center>

                    </div>
                    <div className="ci" id="deleteUserDiv" hidden>
                        <center><h1 id="deleteUserH1">Delete a User</h1></center>

                        <form onSubmit={this.deleteUser}>
                            <center>
                                <Button className="button-28 btn btn-danger" type="submit" id="UserSettingsDeleteUser">Delete User(s)</Button>
                                <Button className="button-28" onClick={toggleDeleteDiv} id="UserSettingsDeleteUserBack">Back</Button>
                            </center>
                            <div id="deleteUserTableDiv">
                                <Table striped bordered hover>      
                                    <thead id="deleteUserTable">
                                    </thead>
                                </Table>
                            </div>
                        </form>
                    </div>
                    <div className="ci" id="assignSyllabusDiv" hidden>
                        <center><h1 id="assignSyllabusDivH1">Assign Syllabus To A User</h1>
                            <Button className="button-28 updateSylBtn" onClick={searchWithoutSyllabus} id="UserSettingsAssignSyllabusButtons">Users Without a Syllabus</Button>
                            <Button className="button-28 updateSylBtn" onClick={searchWithSyllabus} id="UserSettingsAssignSyllabusButtons">Users With a Syllabus</Button>
                            <Button className="button-28 updateSylBtn" onClick={toggleAssignSyllabusDiv} id="UserSettingsAssignSyllabusButtons">Back</Button>
                        </center>
                        <div id="syllabusBox">
                            <form onSubmit={this.updateSyllabus}>
                                <center>
                                    <label id="UserSettingsAssignSyllabusEmailWords">Email:</label>
                                    <Form.Control required placeholder = "Email" type="email" id="updateSyllabusEmail"></Form.Control>
                                    <label id="UserSettingsAssignSyllabusSyllabusCodeWords">Syllabus Code:</label>
                                    <Form.Select required id="updateSyllabusCodeSelect" className="form-select"></Form.Select>
                                    <Button className="button-28 updateSylBtn" type="submit" id="UserSettingsAssignSyllabusSubmitButton">Submit</Button>
                                </center>
                            </form>
                        </div>
                        <center><h2 id="syllabusUserTableH1">Users Without a Syllabus</h2></center>
                        <div id="assignSyllabusTableContainer">
                            <Table striped bordered hover onClick={syllabusEmailFill}>      
                                <thead id="syllabusUsersTable">
                                </thead>
                            </Table>
                        </div>
                    </div>
                </div>

{/* PROFILE PAGE INITIALLY HIDDEN */}
                <div className="ci" id="ao_profile" hidden>
                    <center>
                        <h1 id="profilePage">Profile Page</h1>
                        <h2 className="profileText" id="profileName"> </h2>
                        <h2 className="profileText" id="profileEmail"> </h2>
                        <h2 className="profileText" id="profileCrewPosition"> </h2>
                        <h2 className="profileText" id="profileSyllabus"> </h2>
                        <Button className="button-28" onClick={toggleProfileScreen} id="toggleProfileBtn">Back</Button>
                    </center>
                </div>


{/* CREW POSITION SETTINGS PAGE INITIALLY HIDDEN */}
                <div>
                    <div className="ci" id="ao_cpSettings" hidden>
                        <center>
                            <h1 id="EditCrewPossitionsH1">Edit Crew Positions Menu</h1>
                            <Button className="button-28 editCPBtns" onClick={toggleCreateCrewPositionScreen} id="EditCrewPossitionsMenuButtons">Create Crew Position</Button>
                            <Button className="button-28 editCPBtns" onClick={toggleDeleteCrewPositionScreen} id="EditCrewPossitionsMenuButtons">Delete Crew Position</Button>
                            <Button className="button-28 editCPBtns" onClick={toggleUpdateAllCrewPositionScreen} id="EditCrewPossitionsMenuButtons">Edit Crew Position</Button>
                            <Button className="button-28 editCPBtns" onClick={toggleCrewPositionSettingsScreen} id="EditCrewPossitionsMenuButtonsBack">Back</Button>
                        </center>
                    </div>
                    <div className="ci" id="createCrewPositionScreen" hidden>
                        <center>
                            <h1 id="createCrewPositionH1">Create A Crew Position</h1>
                            <form onSubmit={this.createCrewPosition}>
                            <label className="cpLabel" id="createCrewPositionScreenFullNameWords">Full Name:</label>
                            <Form.Control maxlength="30" className="input" required id="newCPFullName"></Form.Control>
                            <label  className="cpLabel" id="createCrewPositionScreenAcronymWords">Acronym:</label>
                            <Form.Control maxlength="30" className="input" required id="newCPAcronym"></Form.Control>
                            <Button className="button-28" type="submit" id="createCrewPositionScreenCreateNewCrewPosition">Create</Button>
                            </form>
                            <Button className="button-28" onClick={toggleCreateCrewPositionScreen} id="createCrewPositionScreenBackBtn">Back</Button>
                        </center>
                    </div>
                    <div id="deleteCrewPositionScreen" className="tableButtonScreen ci" hidden>
                        <center>
                            <h1 id="deleteCrewPositionH1" className="tableButtonScreenH1">Delete A Crew Position</h1>
                            <div className="tableButtonScreenTable">
                                <Table striped bordered hover onClick={selectCPDelete}>      
                                    <thead id="crewPositionTableSearch1">
                                    </thead>
                                </Table>
                            </div>

                            <Button className="button-28 tableButtonScreenBack" onClick={toggleDeleteCrewPositionScreen} id="deleteCrewPositionScreenBackBtn">Back</Button>
                        </center>
                    </div>
                    <div id="editCrewPositionScreen" className="tableButtonScreen ci" hidden>
                        <center>
                            <h1 className="tableButtonScreenH1" id="editCrewPositionH1">Edit A Crew Position</h1>
                            <div className="tableButtonScreenTable">
                                <Table striped bordered hover onClick={selectCPEditRedirect}>      
                                    <thead id="crewPositionTableSearch2">
                                    </thead>
                                </Table>
                            </div>
                            <Button className="button-28 tableButtonScreenBack" onClick={toggleUpdateAllCrewPositionScreen} id="editCrewPositionScreenBackBtn">Back</Button>
                        </center>
                    </div>
                    <div className="ci" id="editCPDiv" hidden>
                        <center>
                            <h1 id="editCPDivH1"> </h1>
                            <Form.Control hidden disabled className="input" required id="editCPid"></Form.Control>
                            <label  className="cpLabel">Full Name</label>
                            <Form.Control maxlength="30" className="input" required id="editCPFN"></Form.Control>
                            <label  className="cpLabel">Acronym</label>
                            <Form.Control maxlength="30" className="input" required id="editCPAcronym"></Form.Control>
                            <Form.Control hidden disabled className="input" required id="editCPAcronymOld"></Form.Control>
                            <Button id="cpUpdateBtn" className="button-28" onClick={this.editCP}>Update</Button>
                            <Button id="cpBackBtn" className="button-28" onClick={toggleEditCPDiv}>Back</Button>
                        </center>
                    </div>
                </div>
                <div onClick={hideAlert} className="alertAO" id="alertAO" hidden>
                    <span className="closebtnAO" onClick={hideAlert}>x</span> 
                    <strong className="aostrong">Error:</strong><span> </span><span id="alertAOText">Error</span>
                </div>
                <div onClick={hideSuccess} className="successAO" id="successAO" hidden>
                    <span className="closebtnAO" onClick={hideSuccess}>x</span> 
                    <strong className="aostrong">Success:</strong><span> </span><span id="successAOText"></span>
                </div>
                <div className="loadAO" id="loadAO" hidden>
                    <span className="aostrong">Loading . . .</span>
                </div>
            </div>
        )
    }
}

