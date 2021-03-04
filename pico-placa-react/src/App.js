// import logo from './logo.svg';
import './App.css';
import { useReducer } from 'react';

const regExDict = {
  pn_RegEx: /^([a-zA-Z]{3}|[a-zA-Z]{0})\d{3,4}$/,
  date_RegEx: /^\d{2}[-/]{1}\d{2}($|[-/]{1}(\d{2}|\d{4})$)/,
  date_separator_RegEx: /[-/]/g,
  invalid_RegEx: /(?=[^a-zA-Z])(?=\D)./g
}

function App() {

  function init(_initValue){
    return {
      plate_number: '',
      date: '',
      time: '',
      pn_valid: false,
      date_valid: false,
      time_valid: false,
      show_Error: false
    }
  }
  
  const [state, dispatch] = useReducer(reducer, {}, init)

  function cleanInput(item){
    return item.replace(regExDict.invalid_RegEx,'');
  }

  function reducer(state, action){
    switch(action.type){
      case 'pn_change':
        let pn = cleanInput(action.payload);
        return {pn_valid:regExDict.pn_RegEx.test(pn),plate_number:pn}
      case 'date_change':
        let d = cleanInput(action.payload);
        let dv = regExDict.date_RegEx.test(d);
        return {date_valid:dv,date:d}
        // if (!dv)
        //   return {date_valid:dv, date:d};
        // let date_arr = d.split(regExDict.date_separator_RegEx);
        // if(date_arr.length>2)
        // let d1 = parseInt(date_arr[0]);
      case 'time_change':
        console.log(typeof action.payload,'['+action.payload+']');
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
          placeholder='dd/MM/YYYY'/>
        </label>
        <label>
          Time: <input className="App-input" type="time" value={state.time} 
          onChange={(e)=>{dispatch({type:'time_change', payload: e.target.value})}} />
        </label>
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
