import { QRCodeSVG } from 'qrcode.react';

import Card from './Card';
import Button from './Button';



export default function QRCodeCard() {

    const url =
        `${window.location.origin}/contact.html`;

    function downloadQRCode() {
        const svg = document.getElementById('lead-qr');

        if (!svg) return;

        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);

        const blob = new Blob([source], {
            type: 'image/svg+xml;charset=utf-8',
        });

        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = 'girl-scouts-qr-code.svg';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(objectUrl);
    }

    return (
        <Card className="space-y-4 text-center">

            <h2 className="text-lg font-semibold">
                QR Code Lead Form
            </h2>

            <p className="text-sm text-gray-600">
                Families can scan this QR code to
                learn more about Girl Scouts.
            </p>

            <div className="flex justify-center">
                <QRCodeSVG
                    value={url}
                    size={220}
                     id="lead-qr"
                />
            </div>

            <Button onClick={downloadQRCode}>
                Download QR Code
            </Button>

        </Card>
    );
}