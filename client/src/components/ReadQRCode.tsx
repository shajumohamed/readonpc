import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import React from 'react';
import QrReader from 'react-qr-reader';
import { w3cwebsocket as W3CWebSocket } from "websocket";

export interface ReadQRCodeProps {
  client: W3CWebSocket
}

export const ReadQRCode = (props: ReadQRCodeProps) => {
  const [result, setResult] = React.useState<string>("");
  const [enableRead, setEnableRead] = React.useState<boolean>(true);
  const [value, setValue] = React.useState<string>("");

  const handleScan = (data: any) => {
    if (data) {
      //alert(data);
      if (validURL(data)) {
        let clientid = data.toLowerCase().indexOf("?pcid=") > -1 ? data.toLowerCase().split("?pcid=")[1] : null;
        if (clientid != null && clientid.length == 10) {
          setResult(clientid);
          setEnableRead(false);
        }
        else {
          console.error("invalidClient-" + (data));
        }
      }
      else {
        console.error("invalidURL-" + (data));
      }
    }
  }
  const handleError = (err: any) => {
    console.error(err)
  }

  return (
    <>
      {enableRead &&
        <QrReader showViewFinder={false}
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      }
      {result != "" &&
        <Stack tokens={{childrenGap:20}}>
          <TextField onChange={handleChanged.bind(this)} multiline resizable={false} />
          <PrimaryButton value="Send" onClick={() => sendClicked()}>Read On PC</PrimaryButton>
        </Stack>
      }
      <p>{result}</p>

    </>
  );


  function sendClicked() {
    props.client.send(JSON.stringify({ action: "SendMessage", body: { ID: result, link: value } }));
  }


  function handleChanged(event: any) {
    var modifiedValue = event.target.value;
    setValue(modifiedValue);
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
}