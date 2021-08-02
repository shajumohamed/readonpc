import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import logo from './logo.svg';
import linkedIn from './linkedin.svg';
import './App.css';
import { ShowQRCode } from './components/ShowQRCode';
import { ReadQRCode } from './components/ReadQRCode';
import { FontIcon, Icon, PrimaryButton, Stack, Text } from '@fluentui/react';
import { CopyToClipboard } from "react-copy-to-clipboard";

export interface WebSocketMessage {
  action: string;
  body: any;
}

let client: any = null;
if (process.env.NODE_ENV == 'production') {
  client = new W3CWebSocket('wss://' + window.location.host);
}
else {
  client = new W3CWebSocket('ws://localhost:3001/');
}

function App() {
  const [clientID, setClientID] = React.useState<string>('');
  const [data, setData] = React.useState(null);
  const [scanMode, setScanMode] = React.useState<boolean>(false);
  const [textValue, setTextValue] = React.useState<string>('');
  const [isCopied, setIsCopied] = React.useState(false);
  React.useEffect(() => {

    client.onopen = () => {
      let tempID = makeid(10);
      setClientID(tempID);
      console.log('WebSocket Client Connected');
      let sendObj = {} as WebSocketMessage;
      sendObj.action = "ClientRegistration";
      sendObj.body = { 'ID': tempID };
      client.send(JSON.stringify(sendObj));
    };
    client.onmessage = (message: any) => {
      console.log(message);
      let datObj = JSON.parse(message.data);
      if (datObj.action == "SendMessage") {
        if (validURL(datObj.body.link)) {
          
          window.location = datObj.body.link.indexOf('http')!=0?"http://"+datObj.body.link:datObj.body.link;
        }
        else {
          setTextValue(datObj.body.link)
        }
      }
    };
  }, [])

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => { setData(data.message); console.log(data) });
  // }, []);

  function toggleScanMode() {
    setScanMode(!scanMode);
  }
  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Stack tokens={{ childrenGap: 10 }} horizontalAlign="center" style={{paddingBottom:20}}>
          <Text variant="xxLarge" >Read on PC</Text>
          <Text variant="large">This application can be used to send links and text between two devices. </Text>
          <Text variant="large">Links will auto open on the target device.</Text>
          {!scanMode && 
          <div style={{alignItems:"center"}}><ShowQRCode clientId={clientID}></ShowQRCode>
          </div>
          }
           <Stack tokens={{ childrenGap: 10 }} style={{maxWidth:300}} >
          <div style={{textAlign:"start",fontSize:15}}>
         
          <h4>Target Device </h4>
          <ul>
            <li>Open the URL</li>
          </ul>
          <h4>Source Device</h4>
          <ul>
            <li>Open the URL</li>
            <li>hit "Send From Here" button</li>
            <li>scan this QR displayed in target device </li>
            <li>enter the text/URL to be send</li>
            <li>hit "Read on PC" button</li>

          </ul>
          </div>
          <PrimaryButton onClick={() => toggleScanMode()}>{scanMode ? "View Here" : "Send From Here"}</PrimaryButton>
          {scanMode &&
            <div style={{alignItems:"center", width: 300 }}>
              <ReadQRCode client={client}></ReadQRCode>
            </div>
          }
          {textValue &&
            <div className="code-snippet">
              <div className="code-section">
                <pre>{textValue}</pre>
                <CopyToClipboard text={textValue} onCopy={onCopyText} options={{message:"Copied"}}>
                  <span>{isCopied ? "Copied!" : "Copy"}</span>
                </CopyToClipboard>
              </div>
            </div>
          }
           </Stack>
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
        </Stack>
        <div style={{padding:20,backgroundColor:"#eff6fc",maxWidth:700}}>
         <Stack tokens={{childrenGap:20}}>
           <Text>The project was quickly put together to achieve the functionality. Needs UI and other optimization.</Text>
           <Text>Let me know of any issues at the contact details below.</Text>
           <Stack horizontal wrap horizontalAlign="center" verticalAlign="center" tokens={{childrenGap:20}}>
          <Text>Created by Shaju Mohammed</Text>
          <a target="_blank" href="https://www.linkedin.com/in/shaju-mohammed-a6452243/"><img src={linkedIn} height="40"></img></a>          
          <a target="_blank" href="https://github.com/shajumohamed/readonpc">Fork this on GitHub</a>
        </Stack>
         </Stack>
        
        </div>
      </header>     
    </div>
  );
}

function makeid(length: number) {
  //return "1234567890";
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

function validURL(str: string) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

export default App;
