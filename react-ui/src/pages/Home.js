import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Parse from 'parse/dist/parse.min.js';

function Home() { 
  let navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [queryResults, setQueryResults] = useState([]);
  const [logged, setLogged] = useState(false);

  useEffect( () => {
    const doUserLogIn = async function () {
      const usernameValue = localStorage.getItem("OpUser");
      const passwordValue = localStorage.getItem("OpPass");

      if (usernameValue === null) return doUserLogOut();
      try {
        const loggedInUser = await Parse.User.logIn(usernameValue, passwordValue);
        const currentUser = await Parse.User.current();
        return setLogged(true);
      } catch (error) {
        return doUserLogOut();
      }
    };

    doUserLogIn();
  },[]);

  useEffect(() => {
    var currentDate = new Date();
    const checkQuery =  async function () {
      const parseQuery = new Parse.Query('Prodotto');
      try {
        
        parseQuery.lessThan('scadenza', currentDate);

            let prodotti = await parseQuery.find()

            setQueryResults(prodotti);

            /* for (let result of prodotti) {
              // You access `Parse.Objects` attributes by using `.get`
              console.log(result.get("fuoricella"))
            }; */
            
      return true;
    } catch (error) {
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    }
  };
  checkQuery();
}, []);

useEffect(() => {
  const updateQuery =  async function () {
    if (queryResults !== undefined && queryResults.length <= 0) return

  queryResults.map(async i => {
    if (i.get("fuoricella") === true) return
    else {
      let update = new Parse.Object('Prodotto');
      update.set('objectId', i.id);
              update.set('fuoricella', true);
              try {
                await update.save();
                // Success
                alert('Attenzione, un prodotto è fuori cella!');
                return true;
              } catch (error) {
                // Error can be caused by lack of Internet connection
                alert(`Error! ${error.message}`);
                return false;
              }}})
  };
  updateQuery()
}, [queryResults]);


  //Funzione per il lotto del giorno ISO 8601
  var currentDate = new Date();
  /*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/
  Date.prototype.getWeekNumber = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  

    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
  };
  //var year = new Date(currentDate.getFullYear(), 0, 1);
  //var days = Math.floor((currentDate - year) / (24 * 60 * 60 * 1000));
  var week = ("0" + new Date().getWeekNumber()).slice(-2);
  var lottoDay = ("0" + currentDate.getDate()).slice(-2);
  var reverse=num=>num.toString().split('').reverse().join('');
  var lottoYear = ("0" + currentDate.getFullYear()).slice(-2);
  var lottoOggi = week+reverse(lottoDay)+reverse(lottoYear);

  const handleEnter = () => {
    const home = document.getElementById("home");
    const logo = document.getElementById("logo");
    home.classList.toggle("fade");
    logo.classList.toggle("fade");



    return setTimeout( ()=> {navigate("/content",{state:{status: logged}})}, 600);
  };

  const doUserRegistration = async function () {
    // Note that these values come from state variables that we've declared before
    const usernameValue = user;
    const passwordValue = pass;
    try {
      // Since the signUp method returns a Promise, we need to call it using await
      const createdUser = await Parse.User.signUp(usernameValue, passwordValue);
      alert(
        `Success! User ${createdUser.getUsername()} was successfully created!`
      );
      return setLogged(true);
    } catch (error) {
      // signUp can fail if any parameter is blank or failed an uniqueness check on the server
      alert(`Error! ${error}`);
      return false;
    }
  };

  const doUserLogIn = async function () {
    // Note that these values come from state variables that we've declared before
    const usernameValue = user;
    const passwordValue = pass;
    try {
      const loggedInUser = await Parse.User.logIn(usernameValue, passwordValue);
      // logIn returns the corresponding ParseUser object
      alert(
        `Success! User ${loggedInUser.get(
          'username'
        )} has successfully signed in!`
      );
      // To verify that this is in fact the current user, `current` can be used
      const currentUser = await Parse.User.current();
      localStorage.setItem("OpUser", user);
      localStorage.setItem("OpPass", pass);
      return setLogged(true);
    } catch (error) {
      // Error can be caused by wrong parameters or lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  const doUserLogOut = async function () {
    try {
      await Parse.User.logOut();
      // To verify that current user is now empty, currentAsync can be used
      const currentUser = await Parse.User.current();
      setLogged(false);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  

  return (
      <div id='home' className='Home'>
      <div id='logo' className='logo' />

      <div className='testo1' style={{color:"white"}} >Username:<input style={{width:"50px"}} type='text' value={user} onChange={(e) => setUser(e.target.value)} maxLength="50"/></div>
      <div className='testo1' style={{color:"white"}} >Password:<input style={{width:"50px"}} type='password' value={pass} onChange={(e) => setPass(e.target.value)} maxLength="50"/></div>
      <div><input 
        className='btn' 
        type='button'
        value={"LogIn"}
        onClick={() => doUserLogIn()} /></div>
      <br/>

      <div className='lotto'>Lotto di Oggi: <br/> {lottoOggi}</div>
      
      <input 
        className='btn' 
        type='button'
        value={"Entra nel Magazzino"}
        onClick={handleEnter} />
        {logged === false ? (
        <div style={{display: 'inline', backgroundColor : 'white'}} >❌</div>
        ) : 
        <div onClick={() => doUserLogOut()} style={{display: 'inline', backgroundColor : 'white', cursor: 'pointer'}} >✔️</div>
        }
      </div>
  );
}

export default Home;