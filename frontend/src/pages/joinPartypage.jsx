import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import api from "../services/api";

export const JoinByCodeOrQRCode = () => {
  const [code, setCode] = useState("");
  const [scannedCode, setScannedCode] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleQRScan = (data) => {
    if (data) {
      setScannedCode(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleQRScannerClick = () => {
    setShowQRScanner(true);
  };

  const handleQRScannerClose = () => {
    setShowQRScanner(false);
  };

  const handleJoin = async () => {
    const joinCode = scannedCode || code;
    const uppercaseJoinCode = joinCode.toUpperCase();

    try {
      const party = await api.getParty(uppercaseJoinCode);
      const name = localStorage.getItem("first_name");
      await api.memberset(name, 0, party.id);
      console.log("Joining with code:", uppercaseJoinCode);
      console.log("Name:", name);
      console.log("PartyID:", party.id);
      localStorage.setItem("code", uppercaseJoinCode);
      navigate("/partyPage");
      setCode("");
      setScannedCode("");
    } catch (error) {
      console.error("Error joining party:", error);
    }
  };

  const token = localStorage.getItem("access_token");
  if (!token) {
    return <LoginPage />;
  }

  return (
    <div className="hero min-h-screen bg-Green">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-Emerald2">
          <h1 className="text-2xl font-bold card-body text-white">
            Join by Code or QR Code
          </h1>
          <div className="card-body">
            <input
              type="text"
              placeholder="Enter code"
              maxLength={5}
              value={code}
              onChange={handleCodeChange}
              className="form-control"
            />
            <button onClick={handleJoin} className="btn btn-primary">
              Join
            </button>
          </div>
          <div className="card-body">
            <button onClick={handleQRScannerClick} className="btn btn-primary">
              Scan QR Code
            </button>
          </div>
          {showQRScanner && (
            <div className="card-body">
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleQRScan}
                style={{ width: "100%" }}
              />
              <button
                onClick={handleQRScannerClose}
                className="btn btn-primary"
              >
                Close Scanner
              </button>
            </div>
          )}
          {scannedCode && (
            <div>
              <p>Scanned code: {scannedCode}</p>
              <button onClick={handleJoin} className="btn btn-primary">
                Join with Scanned Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
