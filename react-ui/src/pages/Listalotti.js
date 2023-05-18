import React, { useState, useEffect } from 'react';
import Parse from 'parse/dist/parse.min.js';
import {useLocation} from 'react-router-dom';

function Listalotti() {

    const { state } = useLocation();
    const [ricerca, setRicerca] = useState('');
    const [nomeQry, setNomeQry] = useState([]);
    const [qryResults, setQryResults] = useState([]);
    const [toggle, setToggle] = useState(false);
    const date = new Date().toLocaleString().split(',')[0];

    useEffect(() => {
      const firstQuery =  async function () {
        const parseQuery = new Parse.Query('Prodotto');
        try {
          parseQuery.equalTo('listalotti', true);
              let prodotti = await parseQuery.find();
              let sorted = prodotti.sort((a, b) =>
              `${a.get('nome')}`.localeCompare(`${b.get('nome')}`));
              setQryResults(sorted);
        return true;
      } catch (error) {
        // Error can be caused by lack of Internet connection
        alert(`Error! ${error.message}`);
        return false;
      }
    };
    firstQuery();
  }, []);

  const cercaProdotto = async event => {
    setRicerca(event.target.value);
      try {
      const parseQuery = new Parse.Query('Prodotto');
        parseQuery.matches('nome', ricerca, "i");
            let prodotti = await parseQuery.find();
            setNomeQry(prodotti);
            return true }
            catch (error) {
              // Error can be caused by lack of Internet connection
              alert(`Error ${error.message}`);
              return false;}
  };

  const updateProdottoStato = async function (id, stato) {
    let update = new Parse.Object('Prodotto');
      update.set('objectId', id);
              update.set('listalotti', stato);
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

    const firstQuery =  async function () {
      const parseQuery = new Parse.Query('Prodotto');
      try {
        parseQuery.equalTo('listalotti', true);
            let prodotti = await parseQuery.find();
            let sorted = prodotti.sort((a, b) =>
            `${a.get('nome')}`.localeCompare(`${b.get('nome')}`));
            setQryResults(sorted);
      return true;
  } catch (error) {
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;}
  };

    function NodoEdit(props){
      const [lottoNuovo, setLottoNuovo] = useState(props.lotto);

    
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
        <div className='wrapper1'>
        <div className='title1-1'><label>Lotto:  <input type="text" value={lottoNuovo} onChange={(e) => setLottoNuovo(e.target.value)} maxLength="6" placeholder= "Lotto" /></label></div>
        <div className='title1-2'><button onClick={() => updateProdotto(props.id)} >✔️</button></div>
        </div>
      )};
    
      const cellsTA = qryResults.map((prodotti, i) => 
  
    (`${prodotti.get('tipo')}` === "TA") ? (
      <div key={`${i}`}>
        <div className='wrapper1'>
            <div className='title1-1'>{`${prodotti.get('nome')}`}</div>
            <div className='title1-2'>{`${prodotti.get('lotto')}`}</div>
        </div>
        {toggle === true ? (
      <NodoEdit
        id={prodotti.id}
        lotto={`${prodotti.get('lotto')}`}
        giorni={`${prodotti.get('giorni')}`}
        />
        ) : null}
      </div>
         ) : null
        );
        
    
    const cellsGS = qryResults.map((prodotti, i) => 
    `${prodotti.get('tipo')}` === "GS" ? (
      <div key={`${i}`}>
        <div className='wrapper1'>
            <div className='title1-1'>{`${prodotti.get('nome')}`}</div>
            <div className='title1-2'>{`${prodotti.get('lotto')}`}</div>
        </div>
      {toggle === true ? (
       <NodoEdit
       id={prodotti.id}
       lotto={`${prodotti.get('lotto')}`}
       giorni={`${prodotti.get('giorni')}`}
       />
      ) : null }
        </div>
         ) : null 
        );

    return(
        <div>
            <div className="container">
            <div className='wrapper1-testo' >
            <div className='testo1'>Prodotti TA</div>
            {cellsTA}
            </div>


            <div className='wrapper1-testo' >
            <div className='testo1'>Prodotti GS</div>
            {cellsGS}
            </div>
              
              
            </div>
            <div className='data'>{date}</div>
            {state.status === false ? (
              null ):
            <>
            <button className='btn' onClick={()=>setToggle(!toggle)}>
              {toggle === true ? (
                "Nascondi"
               ) :" Mostra" }
              </button>
            <div className='content-title'> Lista Lotti Immissione Prodotti: </div>
            <br/>
            <input type="text" value={ricerca} onChange={event => cercaProdotto(event)} maxLength="50" placeholder= "Cerca Nome Prodotto" />
            <br/><br/>
      <div className='wrapper-titolo-FC-0'>
      
      <div className='wrapperFC-0'>
          <div className='titleFC-0-0'>Nome</div>
          <div className='titleFC-1-0'>Lotto</div>
          <div className='titleFC-2-0'>E' nella lista?</div>
      </div>

      <div>
            {/* Query list */}
            {nomeQry !== undefined &&
              nomeQry.map((prodotti, index) => (
                <div className="wrapperFC-0" key={`${index}`}>
                    <div className='titleFC-0-0'>{`${prodotti.get('nome')}`+" "+`${prodotti.get('tipo')}` }</div>
                    <div className='titleFC-1-0'>{`${prodotti.get('lotto')}`}</div>
                    {`${prodotti.get('listalotti')}` === "true" ? (
                    <div className='titleFC-2-0'>Si <button className='btn-lotto' onClick={() => updateProdottoStato(prodotti.id, false)} >Cambia</button></div>
                    ) : 
                    <div className='titleFC-2-0'>No <button className='btn-lotto' onClick={() => updateProdottoStato(prodotti.id, true)} >Cambia</button></div>
                    }
                </div>
              ))}
            {nomeQry !== undefined && nomeQry.length <= 0 ? (
              <p className='testo1' >{'Nessun elemento trovato!'}</p>
            ) : null}
          </div>
          </div>
          </>
          }
        </div>
    );
}

export default Listalotti;