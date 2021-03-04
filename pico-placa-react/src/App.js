// import logo from './logo.svg';
import './App.css';
import { useReducer } from 'react';

const regExDict = {
  pn_RegEx: /^([a-zA-Z]{3}\d{3,4}$|^\d{3,4}$)/,
  shortdate_RegEx: /^\d{2}[-/]{1}\d{2}$/,
  longdate_RegEx: /^\d{2}[-/]{1}\d{2}[-/]{1}(\d{2}|\d{4})$/,
  invalid_pn_RegEx: /(?=[^a-zA-Z])(?=\D)./g,
  invalid_date_RegEx: /(?=[^a-zA-Z/-])(?=\D)./g
}

const initDateTime = new Date();

function App() {

  function init(_initValue){
    return {
      plate_number: '',
      date: '',
      time: '',
      DateTime: initDateTime,
      pn_valid: false,
      date_valid: false,
      time_valid: false,
      show_Error: false
    }
  }
  
  const [state, dispatch] = useReducer(reducer, {}, init)

  function cleanInput(item,regex){
    return item.replace(regex,'');
  }

  function reducer(state, action){
    switch(action.type){
      case 'pn_change':
        const pn = cleanInput(action.payload,regExDict.invalid_pn_RegEx);
        return {pn_valid:regExDict.pn_RegEx.test(pn),plate_number:pn}
      case 'date_change':        
        const d = cleanInput(action.payload,regExDict.invalid_date_RegEx);
        let dateTime = new Date(d);

        if (!isNaN(dateTime.getDay()))
          return {DateTime:dateTime,date_valid:true,date:d};
        
        if(regExDict.shortdate_RegEx.test(d)){
          let d_alter = d.substring(3,5) + '/' + d.substring(0,2);
          dateTime = new Date(d_alter);
          dateTime.setFullYear(initDateTime.getFullYear());
          return {DateTime:dateTime,date_valid:isNaN(dateTime.getDay()),date:d};
        }
        if(regExDict.longdate_RegEx.test(d)){
          let d_alter = d.substring(3,5) + '/' + d.substring(0,2) + '/' + d.substring(6,10);
          dateTime = new Date(d_alter);
          return {DateTime:dateTime,date_valid:isNaN(dateTime.getDay()),date:d};
        }
        return {DateTime:initDateTime, date_valid:false,date:d}
                
      case 'time_change':

        // console.log(typeof action.payload,'['+action.payload+']');
        return {time_valid:true};
      default:
        throw new Error();
    }
  }

  return (
    <div className="App">
      {/* <header className="App-header"> */}
        {/* <img src={logo} className="App-logo" alt="logo" />         */}
      {/* </header> */}

      <div className="App-body">
        <label>
          Plate number: <input
            className="App-input" type="text" value={state.plate_number} 
            onChange={(e)=>{dispatch({type:'pn_change', payload: e.target.value})}} 
            placeholder='Full plate or plate numbers'/>
        </label>
        {state.pn_valid ? null: state.plate_number && <p className="App-error">Please enter a correct plate number</p>}
        <label>
          Date: <input className="App-input" type="text" value={state.date} 
          onChange={(e)=>{dispatch({type:'date_change', payload: e.target.value})}} 
          placeholder='MM/dd/YYYY'/>
        </label>
        <label>
          Time: <input className="App-input" type="time" value={state.time} 
          onChange={(e)=>{dispatch({type:'time_change', payload: e.target.value})}} />
        </label>
        {state.DateTime &&
          <div>
            <p>{state.DateTime.toString()}</p>
          </div>
        }
      </div>
      
      <footer>
        App made by <a
          href="https://github.com/MNNoboa"
          target="_blank"
          rel="noopener noreferrer"
        >
          MNNoboa 
        </a> according to <a
          // className="App-link"
          href="https://www.eluniverso.com/2010/05/03/1/1447/desde-hoy-rige-pico-placa-vias-quitenas.html/"
          target="_blank"
          rel="noopener noreferrer"
        >
          public press information
        </a>
      </footer>
    </div>
  );
}

export default App;
