import React from 'react';
import QRCode from "qrcode.react";

export interface ShowQRCodeProps {
    clientId: string;
}

export const ShowQRCode = (props: ShowQRCodeProps) => {


    return (
        <>
            <QRCode includeMargin={true} size={256} level="M" id="QRCode" value={window.location.origin + "?pcid=" + props.clientId} />
        </>
    );
}