import './App.css';
import { useEffect, useReducer, useState } from 'react';

const regExDict = {                                            //RegEx for validation and parsing
  pn_RegEx: /^([a-zA-Z]{3}\d{3,4}$|^\d{3,4}$)/,
  shortdate_RegEx: /^\d{1,2}[-/]+\d{1,2}$/,
  longdate_RegEx: /^\d{1,2}[-/]+\d{1,2}[-/]+(\d{2}|\d{4})$/,
  date_separator_RegEx: /[-/]+/g,
  invalid_pn_RegEx: /(?=[^a-zA-Z])(?=\D)./g,
  invalid_date_RegEx: /(?=[^a-zA-Z/-])(?=\D)./g
}

const initDateTime = new Date();                              //Initializes with current DateTime

function App() {

  const [state, dispatch] = useReducer(reducer, {
    plate_number: '',
    date: '',
    time: '',
    DateTime: initDateTime,
    pn_valid: false,
    date_valid: false,
    time_valid: false,
    show_Error: false,
  })

  const [outcome, setOutcome] = useState(undefined)          //Final outcome updates after all other updates (inputs and validations)

  function cleanInput(item,regex){                            
    return item.replace(regex,'');
  }

  function reducer(state, action){
    switch(action.type){
      case 'pn_change':
        const pn = cleanInput(action.payload,regExDict.invalid_pn_RegEx);
        return Object.assign({},state,{pn_valid:regExDict.pn_RegEx.test(pn),plate_number:pn})
      
      case 'date_change':        
        const d = cleanInput(action.payload,regExDict.invalid_date_RegEx);
        let dateTime = new Date(d);

        const lacksYear = regExDict.shortdate_RegEx.test(d);

        if (!isNaN(dateTime.getDay())){
          dateTime.setHours(state.DateTime.getHours(),state.DateTime.getMinutes())
          if(lacksYear)
            dateTime.setFullYear(initDateTime.getFullYear());
          return Object.assign({},state,{DateTime:dateTime,date_valid:true,date:d});
        }
        
        let d_alter = d.split(regExDict.date_separator_RegEx);
        let validity = true;
        if(lacksYear){
          d_alter = d_alter[1] + '/' + d_alter[0] + '/' + initDateTime.getFullYear().toString(); 
          dateTime = new Date(d_alter);
        }
        if(regExDict.longdate_RegEx.test(d)){
          d_alter = d_alter[1] + '/' + d_alter[0] + '/' + d_alter[2];
          dateTime = new Date(d_alter);
        }

        if(isNaN(dateTime.getDay())){
          dateTime = initDateTime;
          validity = false;
        }          
        
        dateTime.setHours(state.DateTime.getHours(),state.DateTime.getMinutes())
        
        return Object.assign({},state,{DateTime:dateTime,date_valid:validity,date:d});
                
      case 'time_change':
        let t = action.payload;
        if(t.length===0)
          return Object.assign({},state,{time_valid:false,time:action.payload});
        t = t.split(':');
        let dt = state.DateTime;
        if(!dt)
          dt = initDateTime;
        dt.setHours(parseInt(t[0]),parseInt(t[1]));
        return Object.assign({},state,{DateTime:dt, time_valid:true, time:action.payload});
      default:
        alert('An error has ocurred, please reload.');
    }
  }

  useEffect(() => {                                                     //Final outcome updates after all other updates (inputs and validations)
    if(!state.pn_valid){                                                //Update function includes all 'Pico&Placa' logic
      setOutcome(undefined);
      return;
    }      
    const lastChar = parseInt(state.plate_number.slice(-1))
    const dt = state.DateTime;
    let daycheck = false;
    if(2*dt.getDay()-1 === lastChar || 2*dt.getDay() === lastChar)
      daycheck = true;
    else if(dt.getDay()===5 && lastChar === 0)
      daycheck = true;
    if(daycheck)
      if((dt.getHours()>=7 && dt.getHours() < 9) || (dt.getHours() >= 16 && dt.getHours() < 19))
        setOutcome(2);
      else if ((dt.getHours === 9 && dt.getMinutes < 30) || (dt.getHours() === 19 && dt.getMinutes() < 30 ))
        setOutcome(2);
      else
        setOutcome(1);
    else
      setOutcome(0);
  }, [state])

  return (
    <div className="App">
      
      <div className="App-body">
        <h1>Pico&Placa predictor</h1>
        {state.DateTime &&
          <div className="App-info">
            <p>Date Time: {state.DateTime.toDateString() + ' - ' + state.DateTime.getHours()+':'+state.DateTime.getMinutes()}</p>
          </div>
        }
      </div>

      {outcome === 2 && <div className= "App-info-red">You can not go out</div>}
      {outcome === 1 && 
      <div className= "App-info-yellow">
        <p>You may go out at the selected time, but not on restricted hours</p>
        <p>Restricted Hours are <b>7:00 - 9:30 am</b> and <b>16:00-19:30 pm</b></p>
      </div>}
      {outcome === 0 && <div className= "App-info-green">You can go out freely</div>}

      <div className="App-body">
        <div className="Input-cell">
          <label>
            Plate number:
          </label>
          <input
          className="App-input" type="text" value={state.plate_number} 
          onChange={(e)=>{dispatch({type:'pn_change', payload: e.target.value})}} 
          placeholder='Full plate or plate numbers'/>
          {(!state.pn_valid && state.plate_number !== '') && <p className="App-error">Please enter a correct plate number</p>}
        </div>
        
        <div className="Input-cell">
          <label>
            Date:
          </label>
          <input className="App-input" type="text" value={state.date} 
          onChange={(e)=>{dispatch({type:'date_change', payload: e.target.value})}} 
          placeholder='MM/dd/YYYY'/>
          {(!state.date_valid && state.date !== '') && <p className="App-error">Please enter a correct date in MM/dd/YYYY format</p>}
        </div>
        <div className="Input-cell">
          <label>
            Time:
          </label>
          <input className="App-input" type="time" value={state.time} 
          onChange={(e)=>{dispatch({type:'time_change', payload: e.target.value})}} />
        </div>
                
      </div>
      
      <footer>
        App made by <a
          href="https://github.com/MNNoboa"
          target="_blank"
          rel="noopener noreferrer"
        >
          MNNoboa 
        </a> according to <a
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
