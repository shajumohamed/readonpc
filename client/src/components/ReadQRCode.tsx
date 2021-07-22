import React from 'react';
import QRCode from "react-qr-code";
import QrReader from 'react-qr-reader';

export interface ReadQRCodeProps{
   
}

export const ReadQRCode=(props:ReadQRCodeProps)=>{
    const [result,setResult]=React.useState<string>("");
    const [enableRead,setEnableRead]=React.useState<boolean>(true);

    const handleScan = (data:any) => {
        if (data) {
            if(validURL(data))
            {
                let clientid=data.toLowerCase().indexOf("?pcid=")>-1? data.toLowerCase().split("?pcid=")[1]:null;
                if(clientid!=null&&clientid.length==10)
                {
                    setResult(clientid);
                    setEnableRead(false);
                }
                else
                {
                    console.error("invalidClient-" +(data));
                }
            }
            else
            {
                console.error("invalidURL-" +(data));
            }        
        }
      }
      const handleError = (err:any) => {
        console.error(err)
      }

    return(
        <>
        {enableRead&&
           <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
        }
        <p>{result}</p>
     
        </>
    );

    function validURL(str:string) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
      }
}