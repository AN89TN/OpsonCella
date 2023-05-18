import React, { useState, useEffect } from 'react';
import Parse from 'parse/dist/parse.min.js';
import {useLocation} from 'react-router-dom';

function Fuoricella() {

    const { state } = useLocation();
    const [codice,setCodice] = useState("");
    const [ident,setIdent] = useState("");
    const [giorni,setGiorni] = useState("");
    const [listaFC,setListaFC] = useState();
    const [trova,setTrova] = useState("");
    const [size, setSize] = useState(" TA");
    const [toggle, setToggle] = useState(false);
    const [queryResults, setQueryResults] = useState([]);

    useEffect(() => {
        const firstFC =  async function () {
          const parseQuery = new Parse.Query('FuoriCella');
          try {
                let prodotti = await parseQuery.find();
                setListaFC(prodotti);
          return true;
        } catch (error) {
          // Error can be caused by lack of Internet connection
          alert(`Error! ${error.message}`);
          return false;
        }
      };
      firstFC();
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

    const firstFC =  async function () {
        const parseQuery = new Parse.Query('FuoriCella');
        try {
              let prodotti = await parseQuery.find();
              setListaFC(prodotti);
        return true;
    } catch (error) {
        // Error can be caused by lack of Internet connection
        alert(`Error! ${error.message}`);
        return false;}
    };

    async function addFC() {
        try {
            // create a new Parse Object instance
            const Prodotto = new Parse.Object('FuoriCella');
            // define the attributes you want for your Object
            Prodotto.set('codice', codice);
            Prodotto.set('nome', ident);
            Prodotto.set('giorni', giorni);
            if (size === " TA") {
              Prodotto.set('TA', true);
              Prodotto.set('GS', false);
            } else {
              Prodotto.set('TA', false);
              Prodotto.set('GS', true);
            }
            // save it on Back4App Data Store
            await Prodotto.save().then(
            alert("Prodotto Salvato con Successo!"),
            setCodice(""),
            setIdent(""),
            setGiorni("")
            );
            return firstFC();
        } catch (error) {
            console.log('Error saving new prodotto: ', error);
        }
      }

      const deleteProdotto = async function (index) {
        const parseQuery = new Parse.Object('FuoriCella');
        try {
          parseQuery.set('objectId', index);
          await parseQuery.destroy().then(
            alert("Prodotto Cancellato con Successo!")
          );
          firstFC();
          return true;
        } catch (error) {
          // Error can be caused by lack of Internet connection
          alert(`Error ${error.message}`);
          return false;
        };
      };

      const deleteProdotto2 = async function (index) {
        const parseQuery = new Parse.Object('Prodotto');
        try {
          parseQuery.set('objectId', index);
          await parseQuery.destroy().then(
            alert("Prodotto Cancellato con Successo!")
          );
          checkQuery();
          return true;
        } catch (error) {
          // Error can be caused by lack of Internet connection
          alert(`Error ${error.message}`);
          return false;
        };
      };

      const findFC = async function () {
        const parseQuery = new Parse.Query('FuoriCella');
        try {
          parseQuery.matches('nome', trova, "i");
              let prodotti = await parseQuery.find();
              setListaFC(prodotti);
              setTrova("");
        return true;
      } catch (error) {
        // Error can be caused by lack of Internet connection
        alert(`Error! ${error.message}`);
        return false;
      }
    };

    const handleSize = event => {
      if (event.target.checked) {
        setSize(" GS");
      } else {
        setSize(" TA");
      }
      setToggle(current => !current);
    };

    const checkQuery =  async function () {
      var currentDate = new Date();
      const parseQuery = new Parse.Query('Prodotto');
      try {
        
        parseQuery.lessThan('scadenza', currentDate);

            let prodotti = await parseQuery.find()

            setQueryResults(prodotti);

            /* for (let result of prodotti) {
              // You access `Parse.Objects` attributes by using `.get`
              console.log(result.get("fuoricella"))
            }; */
            
      return alert("Controllo Effettuato con Successo!");
    } catch (error) {
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  function letturaScadenza(lotto) {
    var data = new Date(lotto).toISOString().slice(0,10).split('-').reverse().join('-');
    return data
  };  
      
  function differenzaScadenza(lotto) {
    var currentDate = new Date();
    var oldDate = new Date(lotto);
    var difference = ((currentDate - oldDate)/ (1000*60*60*24))+1;
    return Math.floor(difference)
  }

    return(
        <div>
          <div className='testo1'>Controllo Fuori Cella</div><br/>
          <button  className='btn' onClick={checkQuery} type='button'  >Cerca Prodotti!</button>

          <div className='wrapper-titolo-FC' >

          <div className='testo1'>Lista Fuori Cella</div><br/>

          <div className='wrapperFC'>
          {state.status === false ? (
              null ):
          <div className='titleFC-0'>❌</div>
          }
          <div className='titleFC-3'>Lotto</div>
          <div className='titleFC-2'>Nome</div>
          <div className='titleFC-1'>Scad.</div>
          <div className='titleFC-4'>Giorni</div>
          </div>

          {/* Query list */}
          {queryResults !== undefined &&
              queryResults.map((prodotti, index) => (
                <div className="wrapperFC" key={`${index}`}>
                    {state.status === false ? (
                        null ):
                    <div className='titleFC-0'><button className='btn-delete' onClick={() =>deleteProdotto2(prodotti.id)}>❌</button></div>
                    }
                    <div className='titleFC-3'>{`${prodotti.get('lotto')}`}</div>
                    <div className='titleFC-2'>{`${prodotti.get('nome')}`+" "+`${prodotti.get('tipo')}`}</div>                   
                    <div className='titleFC-1'>{letturaScadenza(`${prodotti.get('scadenza')}`)}</div>
                    <div className='titleFC-4'>{differenzaScadenza(`${prodotti.get('scadenza')}`)}</div>

                </div>
              ))}
            {queryResults !== undefined && queryResults.length <= 0 ? (
              <p className='testo1' >{'Nessun elemento trovato!'}</p>
            ) : null}
          </div>
          <br/><br/>






        <div className='containerFC'>
        <div className='wrapper-titolo-FC' >
        <div className='testo1'>Lista Giorni di Cella</div><br/>
        <label className='testo1'>Cerca:</label><br/><input type='text' value={trova} onChange={(e) => setTrova(e.target.value)} maxLength="50" placeholder= "Nome"/><br/>
        <button  className='btn-lotto' type='button' onClick={findFC} >Cerca</button>
        <br/><br/>
        <div className='wrapperFC'>
        {state.status === false ? (
                        null ):
          <div className='titleFC-0'>❌</div>
        }
          <div className='titleFC-1'>Codice</div>
          <div className='titleFC-2'>Identificativo Prodotto</div>
          <div className='titleFC-4'>Tipo</div>
          <div className='titleFC-3'>Giorni</div>
        </div>

        <div>
            {/* Query list */}
            {listaFC !== undefined &&
              listaFC.map((prodotti, index) => (
                <div className="wrapperFC" key={`${index}`}>
                      {state.status === false ? (
                         null ):
                    <div className='titleFC-0'><button className='btn-delete' onClick={() =>deleteProdotto(prodotti.id)}>❌</button></div>
                      }
                    <div className='titleFC-1'>{`${prodotti.get('codice')}`}</div>
                    <div className='titleFC-2'>{`${prodotti.get('nome')}`}</div>

                    {`${prodotti.get('TA')}` === "true" ? (
                    <div className='titleFC-4'>TA</div>
                    ) : 
                    <div className='titleFC-4'>GS</div>
}

                    <div className='titleFC-3'>{`${prodotti.get('giorni')}`}</div>

                </div>
              ))}
            {listaFC !== undefined && listaFC.length <= 0 ? (
              <p className='testo1' >{'Nessun elemento trovato!'}</p>
            ) : null}
          </div>

        </div>
        </div>
        {state.status === false ? (
          null ):
        <>
        <div className='list-item'>
        <div className='testo1'>Aggiungi</div>
        <label className="label"><div className='label-text'>TA</div><div className="toggle"><input className="toggle-state" type='checkbox' defaultChecked={toggle} onChange={handleSize} /><div className="indicator"></div></div><div className='label-text' >GS</div></label><br/>
        <br/><label className='testo1'>Codice:</label><input type='text' value={codice} onChange={(e) => setCodice(e.target.value)} maxLength="50" placeholder= "Numero codice"/>
        <br/><label className='testo1'>Nome  :</label><input type='text' value={ident} onChange={(e) => setIdent(e.target.value)} maxLength="50" placeholder= "Nome"/>
        <br/><label className='testo1'>Giorni:</label><input type='text' value={giorni} onChange={(e) => setGiorni(e.target.value)} maxLength="50" placeholder= "Giorni"/>
        </div>
        <button className='btn-lotto' type='button'onClick={addFC} >Invia</button>
        </>
        }
        </div>


    );
}

export default Fuoricella;