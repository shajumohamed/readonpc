import React from 'react';
import QRCode from "react-qr-code";

export interface ShowQRCodeProps{
    clientId:string;
}

export const ShowQRCode=(props:ShowQRCodeProps)=>{
    

    return(
        <>
            <QRCode  id="QRCode" value={window.location.origin+"?pcid="+props.clientId} />
        </>
    );
}