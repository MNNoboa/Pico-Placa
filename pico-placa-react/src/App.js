import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  const [plate_number, setPlateNumber] = useState(null)

  function handleSubmit(e){
    alert('Processing information'+plate_number)
    e.preventDefault();
  }

  return (
    <div className="App">
      {/* <header className="App-header"> */}
        {/* <img src={logo} className="App-logo" alt="logo" />         */}
      {/* </header> */}
      <body className="App-body">
        <form onSubmit={handleSubmit}>
          <label>
            Plate number: <input type="text" value={plate_number} />
          </label>
          <br />
          <label>
            Date: <input type="text" value={plate_number} />
          </label>
          <br />
          <label>
            Hour: <input type="text" value={plate_number} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </body>
      
      <footer>
        App made by 
        <a
          href="https://github.com/MNNoboa"
          target="_blank"
          rel="noopener noreferrer"
        > MNNoboa 
        </a> according to <a
          // className="App-link"
          href="https://www.eluniverso.com/2010/05/03/1/1447/desde-hoy-rige-pico-placa-vias-quitenas.html/"
          target="_blank"
          rel="noopener noreferrer"
        >
          public press information.
        </a>
      </footer>
    </div>
  );
}

export default App;
