import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";


function Content(props) {
  
  const { state } = useLocation();
  let navigate = useNavigate();

  return (
    <div className='Content'>
  <div className='content-title'>
      Seleziona cosa vuoi visionare: 
  </div>

  <div className='lotto'>
    
    <label>
    <h3>Controlla Giacenze di Magazzino</h3>
    <input 
        className='btn' 
        type='button'
        value={"Esplora"}
        onClick={ () => {navigate("/cellaPL",{state:{status: state.status}})}}/>
    </label>
    
  </div>

  <div className='lotto'>
  
    <label>
      <h3>Lista Lotti</h3>
    <input 
        className='btn' 
        type='button'
        value={"Esplora"}
        onClick={ () => {navigate("/Listalotti",{state:{status: state.status}})}}/>
    </label>
  
  </div>

  <div className='lotto'>
  
    <label>
      <h3>Fuori Cella</h3>
    <input 
        className='btn' 
        type='button'
        value={"Esplora"}
        onClick={ () => {navigate("/Fuoricella",{state:{status: state.status}})}}/>
    </label>
  
  </div>

    </div>
  );
}

export default Content;