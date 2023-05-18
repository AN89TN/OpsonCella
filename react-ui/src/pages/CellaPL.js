import React, { useState, useEffect } from 'react';
import cellaPL from "../Cella con sezioni.webp";
import Parse from 'parse/dist/parse.min.js';
import {useLocation} from 'react-router-dom';

function CellaPL() {

  const { state } = useLocation();
  const [nome, setNome] = useState('');
  const [nomeRicerca, setNomeRicerca] = useState('');
  const [size0, setSize0] = useState('');
  const [giorni, setGiorni] = useState('');
  const [lotto, setLotto] = useState('');
  const [posizione, setPosizione] = useState('');
  const [numero, setNumero] = useState('');
  const [queryResults0, setQueryResults0] = useState([]);
  const [queryResults, setQueryResults] = useState();
  const [ricerca, setRicerca] = useState('');
  const [size, setSize] = useState(" TA");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const firstQuery =  async function () {
      const parseQuery = new Parse.Query('Prodotto');
      try {
            let prodotti = await parseQuery.find();
            setQueryResults(prodotti);
      return true;
    } catch (error) {
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    }
  };
  firstQuery();
}, []);

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
var week = ("0" + new Date().getWeekNumber()).slice(-2);
var lottoDay = ("0" + currentDate.getDate()).slice(-2);
var reverse=num=>num.toString().split('').reverse().join('');
var lottoYear = ("0" + currentDate.getFullYear()).slice(-2);
var lottoOggi = week+reverse(lottoDay)+reverse(lottoYear);


async function addProdotto() {
  if (nome === "") return alert("Selleziona un Prodotto!");
  var mesi = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
  var reverse=num=>num.toString().split('').reverse().join('');
  var lottoAnno = (new Date().getFullYear().toString().slice(0,2))+reverse(lotto.slice(-2));
  var lottoGiorno = reverse(lotto.slice(2,4));
  var lottoSettimana = lotto.slice(0,2);
  var veroLottoSettimana = getRealWeek(lottoSettimana,lottoGiorno);
  var numeroMeseLotto = getDateOfISOWeek(veroLottoSettimana, lottoAnno);
  var meseNomeLotto = mesi[numeroMeseLotto.getMonth()];
  var dataLottoConsiderato = new Date(meseNomeLotto+"-"+lottoGiorno+"-"+lottoAnno);
  var numberOfDaysToAdd = parseInt(giorni)+1;
  var giornoDataScadenza = new Date(dataLottoConsiderato.setDate(dataLottoConsiderato.getDate() + numberOfDaysToAdd));
  //var dateString = ("0" + giornoDataScadenza.getDate()).slice(-2) + "-" + ("0" + (giornoDataScadenza.getMonth()+1)).slice(-2) + "-" + giornoDataScadenza.getFullYear();

  try {
      // create a new Parse Object instance
      const Prodotto = new Parse.Object('Prodotto');
      // define the attributes you want for your Object
      Prodotto.set('nome', nome);
      Prodotto.set('tipo', size0);
      Prodotto.set('lotto', lotto);
      Prodotto.set('posizione', posizione);
      Prodotto.set('numero', numero);
      Prodotto.set('giorni', giorni);
      Prodotto.set('scadenza', giornoDataScadenza);
      Prodotto.set('listalotti', false);
      Prodotto.set('fuoricella', false);
      // save it on Back4App Data Store
      await Prodotto.save().then(
      alert("Prodotto Salvato con Successo!"));
      return firstQuery();
  } catch (error) {
      console.log('Error saving new prodotto: ', error);
  }
}

function getRealWeek(w,d) {
  var week = parseInt(w);
  var day = parseInt(d);
  if (day <= 6) return week +1
  else return week
}

function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
};

function toggleEdit(id) {
var elem = document.getElementById(id)
if (elem.style.display === "none") {
  elem.style.display = "flex";
} else {
  elem.style.display = "none";
}
};

const firstQuery =  async function () {
    const parseQuery = new Parse.Query('Prodotto');
    try {
          let prodotti = await parseQuery.find();
          setQueryResults(prodotti);
    return true;
} catch (error) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return false;}
};

  const findProdotto = async function () {
    const parseQuery = new Parse.Query('Prodotto');
    try {
      parseQuery.matches('nome', nomeRicerca, "i");
          let prodotti = await parseQuery.find();
          setQueryResults(prodotti);
    return true;
  } catch (error) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return false;
  }
};

const deleteProdotto = async function (index) {
  const parseQuery = new Parse.Object('Prodotto');
  try {
    parseQuery.set('objectId', index);
    await parseQuery.destroy().then(
      alert("Prodotto Cancellato con Successo!")
    );
    firstQuery();
    return true;
  } catch (error) {
    // Error can be caused by lack of Internet connection
    alert(`Error ${error.message}`);
    return false;
  };
};

const setLottoOggi = () => {
  setLotto(lottoOggi);
};

const handleSize = event => {
  if (event.target.checked) {
    setSize(" GS");
  } else {
    setSize(" TA");
  }
  setToggle(current => !current);
};


const cercaProdotto = async event => {
  setRicerca(event.target.value);
    try {
    const parseQuery = new Parse.Query('FuoriCella');
      parseQuery.matches('nome', ricerca, "i");
      if (size === " TA") {
        parseQuery.equalTo('TA', true);
      } else {
        parseQuery.equalTo('GS', true);
      }
          let prodotti = await parseQuery.find();
          setQueryResults0(prodotti);
          return true }
          catch (error) {
            // Error can be caused by lack of Internet connection
            alert(`Error ${error.message}`);
            return false;}
};

const constructNewProduct = (nome,giorni,size) => {
  if (size === "true") {
    setSize0("TA")
  } else{ 
    setSize0("GS")
  };
  setNome(nome);
  setGiorni(giorni);

}

function letturaScadenza(lotto) {
  var data = new Date(lotto).toISOString().slice(0,10).split('-').reverse().join('-');
  return data
};

function NodoEdit(props){
  const [lottoNuovo, setLottoNuovo] = useState(props.lotto);
  const [posizioneNuovo, setPosizioneNuovo] = useState(props.posizione);
  const [numeroNuovo, setNumeroNuovo] = useState(props.numero);

  var mesi = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
  var reverse=num=>num.toString().split('').reverse().join('');
  var lottoAnno = (new Date().getFullYear().toString().slice(0,2))+reverse(lottoNuovo.slice(-2));
  var lottoGiorno = reverse(lottoNuovo.slice(2,4));
  var lottoSettimana = lottoNuovo.slice(0,2);
  var veroLottoSettimana = getRealWeek(lottoSettimana,lottoGiorno);
  var numeroMeseLotto = getDateOfISOWeek(veroLottoSettimana, lottoAnno);
  var meseNomeLotto = mesi[numeroMeseLotto.getMonth()];
  var dataLottoConsiderato = new Date(meseNomeLotto+"-"+lottoGiorno+"-"+lottoAnno);
  var numberOfDaysToAdd = parseInt(props.giorni)+1;
  var giornoDataScadenza = new Date(dataLottoConsiderato.setDate(dataLottoConsiderato.getDate() + numberOfDaysToAdd));

  const updateProdotto = async function (i) {
    let update = new Parse.Object('Prodotto');
      update.set('objectId', i);
              update.set('lotto', lottoNuovo);
              update.set('posizione', posizioneNuovo);
              update.set('numero', numeroNuovo);
              update.set('scadenza', giornoDataScadenza);

              try {
                await update.save();
                // Success
                alert('Prodotto aggiornato con successo!');
                return firstQuery();
              } catch (error) {
                // Error can be caused by lack of Internet connection
                alert(`Error! ${error.message}`);
                return false;
              }}

  return(
    <div className='titleFC-6-1'>
      <button className='btn-delete' onClick={() =>deleteProdotto(props.id)}>❌</button>
      <label>Lotto:  <input type="text" value={lottoNuovo} onChange={(e) => setLottoNuovo(e.target.value)} maxLength="6" placeholder= "Lotto" /></label>
      <label>Posizione:  <input type="text" value={posizioneNuovo} onChange={(e) => setPosizioneNuovo(e.target.value)} maxLength="6" placeholder= "Posizione" /></label>
      <label>Numero:  <input type="text" value={numeroNuovo} onChange={(e) => setNumeroNuovo(e.target.value)} maxLength="6" placeholder= "Numero" /></label>
      <button className='btn-delete'onClick={() => updateProdotto(props.id)} >✔️</button>
      </div>
  )};
    
  return (

    <div className='Content' >
      {state.status === false ? (
        null ):
      <>
      <div className='content-title' >Inserisci Nuovo Prodotto: </div>
      <br/>
      <input type="text" value={ricerca} onChange={event => cercaProdotto(event)} maxLength="50" placeholder= "Cerca Nome Prodotto" /> <label className="label"><div className='label-text'>TA</div><div className="toggle"><input className="toggle-state" type='checkbox' defaultChecked={toggle} onChange={handleSize} /><div className="indicator"></div></div><div className='label-text' >GS</div></label><br/>
      <br/>
      <div className='wrapper-titolo-FC-0'>
      
      <div className='wrapperFC-0'>
          <div className='titleFC-0-0'>Seleziona</div>
          <div className='titleFC-1-0'>Nome</div>
          <div className='titleFC-2-0'>Codice</div>
      </div>

      <div>
            {/* Query list */}
            {queryResults0 !== undefined &&
              queryResults0.map((prodotti, index) => (
                <div className="wrapperFC-0" key={`${index}`}>
                    <div className='titleFC-0-0'><button className='btn-delete' onClick={() => constructNewProduct(`${prodotti.get('nome')}`,`${prodotti.get('giorni')}`, `${prodotti.get('TA')}` )}>✔️</button></div>
                    <div className='titleFC-1-0'>{`${prodotti.get('nome')}`}</div>
                    <div className='titleFC-2-0'>{`${prodotti.get('codice')}`}</div>
                </div>
              ))}
            {queryResults0 !== undefined && queryResults0.length <= 0 ? (
              <p className='testo1' >{'Nessun elemento trovato!'}</p>
            ) : null}
          </div>

      </div>
      <br/>
      <div>
      <label className='label-text'>Nome prodotto: {nome} {size0}</label>
      <br/>
      <label className='label-text'>Lotto Prodotto: </label>
      <input type="text" value={lotto} onChange={(e) => setLotto(e.target.value)} maxLength="6" placeholder= "Lotto" /><button className='btn-lotto' onClick={setLottoOggi}>Lotto di Oggi</button>
      <br/>
      <label className='label-text'>Posizione Prodotto: </label>
      <input type="text" value={posizione} onChange={(e) => setPosizione(e.target.value)} maxLength="30" placeholder= "Sezione" />
      <br/>
      <label className='label-text'>Quantità Cassette: </label>
      <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} maxLength="10" placeholder= "Numero" />
      <br/>
      <button className='btn' onClick={addProdotto}>Aggiungi prodotto</button>
      </div>
    </>
      }
    <h2>Lista:</h2>

    <input type="text" value={nomeRicerca} onChange={(e) => setNomeRicerca(e.target.value)} maxLength="50" placeholder= "Nome" />
    <br/>
    <button className='btn' onClick={findProdotto}>Trova prodotto</button>
    <br/>


    <div className='wrapper-titolo-FC-1'>
      
      <div className='wrapperFC-1'>
      {state.status === false ? (
                   null ):
          <div className='titleFC-0-1'>Edit</div>
      }
          <div className='titleFC-1-1'>Nome</div>
          <div className='titleFC-2-1'>Lotto</div>
          <div className='titleFC-3-1'>Luogo</div>
          <div className='titleFC-4-1'>Num</div>
          <div className='titleFC-5-1'>Scad.</div>
          
      </div>

{/* Query list */}
{queryResults !== undefined &&
              queryResults.map((prodotti, index) => (
                <div key={`${index}`}>
                <div className='wrapperFC-1' >
                {state.status === false ? (
                   null ):
                  <div className='titleFC-0-1'><button className='btn-delete' onClick={()=>toggleEdit(`${index}`)}>⚙️</button></div>
                }
                  <div className='titleFC-1-1'>{`${prodotti.get('nome')}`+" "+`${prodotti.get('tipo')}` }</div>
                  <div className='titleFC-2-1'>{`${prodotti.get('lotto')}`}</div>
                  <div className='titleFC-3-1'>{`${prodotti.get('posizione')}`}</div>
                  <div className='titleFC-4-1'>{`${prodotti.get('numero')}`}</div>
                  <div className='titleFC-5-1'>{letturaScadenza(`${prodotti.get('scadenza')}`)}</div>
                  
                  </div>

                  <div className='wrapperFC-1' id={`${index}`} style={{display: "none"}} >

                  {<NodoEdit
                    id={prodotti.id}
                    lotto={`${prodotti.get('lotto')}`}
                    posizione={`${prodotti.get('posizione')}`}
                    numero={`${prodotti.get('numero')}`}
                    giorni={`${prodotti.get('giorni')}`}
                    />}
       
                  </div>

                </div> 
              ))}
            {queryResults !== undefined && queryResults.length <= 0 ? (
              <p className='list_item' >{'Nessun elemento trovato!'}</p>
            ) : null}

</div>


    <br/><br/>
    <h2>Mappa:</h2>

    <div className='cellaPL'>
      <img className="map" alt='mappa' id="cellaPL" src={cellaPL} useMap="#workmap"/>
    </div>
    <br/>



    </div>
  );
}

export default CellaPL;