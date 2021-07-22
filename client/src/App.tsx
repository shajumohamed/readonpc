import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import logo from './logo.svg';
import './App.css';
import { ShowQRCode } from './components/ShowQRCode';
import { ReadQRCode } from './components/ReadQRCode';

//const client = new W3CWebSocket('ws://localhost:3001/');
const client = new W3CWebSocket('wss://'+window.location.host);
function App() {
  const [clientID,setClientID]=React.useState<string>('');
  const [data, setData] = React.useState(null);
  React.useEffect(()=>{
    setClientID(makeid(10));
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message:any) => {
      console.log(message);
    };
  },[])

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {setData(data.message);console.log(data)});
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <ShowQRCode clientId={window.location.origin+"?pcID="+clientID}></ShowQRCode>
        <ReadQRCode></ReadQRCode>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>

    </div>
  );
}

function makeid(length:number) {
  var result           = '';
  var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

export default App;
