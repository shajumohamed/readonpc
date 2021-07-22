import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import logo from './logo.svg';
import './App.css';
import { ShowQRCode } from './components/ShowQRCode';
import { ReadQRCode } from './components/ReadQRCode';

export interface WebSocketMessage{
  action:string;
  body:any;
}

let client:any = null;
if(process.env.NODE_ENV == 'production')
{
   client = new W3CWebSocket('wss://'+window.location.host);
}
else
{
   client = new W3CWebSocket('ws://localhost:3001/');
}

function App() {
  const [clientID,setClientID]=React.useState<string>('');
  const [data, setData] = React.useState(null);
  React.useEffect(()=>{
    
    client.onopen = () => {
      let tempID=makeid(10);
      setClientID(tempID);
      console.log('WebSocket Client Connected');
      let sendObj={} as WebSocketMessage;
      sendObj.action="ClientRegistration";
      sendObj.body={'ID':tempID};
      client.send(JSON.stringify(sendObj));
    };
    client.onmessage = (message:any) => {
      console.log(message);
      let datObj=JSON.parse(message.data);
      if(datObj.action=="SendMessage")
      {
        window.location=datObj.body.link;
      }
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
        <ShowQRCode clientId={clientID}></ShowQRCode>
        <ReadQRCode client={client}></ReadQRCode>
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
  //return "1234567890";
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
