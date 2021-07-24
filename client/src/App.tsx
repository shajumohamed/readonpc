import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import logo from './logo.svg';
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
          window.location = datObj.body.link;
        }
        else {
          setTextValue(datObj.body.link)
        }
      }
    };
  }, [])

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => { setData(data.message); console.log(data) });
  }, []);

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
        <Stack tokens={{ childrenGap: 20 }}>
          <Text variant="xxLarge" >Read on PC</Text>
          {!scanMode && <ShowQRCode clientId={clientID}></ShowQRCode>
          }
          <PrimaryButton onClick={() => toggleScanMode()}>{scanMode ? "View Here" : "Send From Here"}</PrimaryButton>
          {scanMode &&
            <div style={{ width: 250 }}>
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
