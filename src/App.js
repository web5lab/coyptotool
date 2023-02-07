import './App.css';
import { useState } from 'react';
import ReactModal from 'react-modal';
import { WalletConnect } from './walletconnect/wc';

var xlsl = require('xlsx');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
function App() {
  const [modal, setmodal] = useState(false)
  const [jsonData, setjsonData] = useState("test data")
  const OpenModal =() => {
    setmodal(true)
  }
const CloseModal =() => {
  setmodal(false)
}

const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = xlsl.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = xlsl.utils.sheet_to_json(worksheet);
            console.log(JSON.stringify(json));
            const jsonStr = JSON.stringify(json);
            setjsonData(jsonStr)
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
}

const ConnectWallet = async() => {
  const wc = await WalletConnect()
}

  return (
    <div className="App">
      <header className="App-header">
        <div className='navbar'><div className='navbar_left'><a href='https://web5lab.net'><img src='media/logo.png' className='navbar_web5lab_logo'></img></a><h1>Powerd By Web5lab</h1></div><div className='navbar_right'><a className='testnet_btn' href='https://cryptotool.in'>Mainet Version</a><button className='Connect_Btn btn' onClick={ConnectWallet}>Connect Wallet</button></div></div>
        <div className='app_content'>
          <input type={'text'} className="input_box" value={jsonData}></input>
        </div>
        <div>
          <button className='btn' onClick={OpenModal}>import csv file</button>
          <input type={'file'} onChange={readUploadFile}></input>
          <button className='btn'>import excel file</button>
        </div>
      </header>
      <ReactModal
       isOpen={modal}
      //  onAfterOpen={}
       onRequestClose={CloseModal}
       style={customStyles}
       contentLabel="Example Modal">
        <button className='btn' onClick={CloseModal}>CloseModal</button>
        <input type={'file'}></input>
      </ReactModal>
    </div>
  );
}
export default App;