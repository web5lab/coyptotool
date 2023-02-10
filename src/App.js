import './App.css';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { WalletConnect } from './walletconnect/wc';
import { data_01 } from './DummyData/data';

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
  const [tempCounter, settempCounter] = useState(4)
  const [TxtCounter, setTxtCounter] = useState('')
  const [rows, setRows] = useState('1\n2\n3\n4\n');
  const [txtValue, setTxtValue] = useState('')
  const OpenModal = () => {
    setmodal(true)
  }

  const CloseModal = () => {
    setmodal(false)
  }

  const ReturnData = () => {

    let finalStr = ''
    for (let x of data_01) {
      finalStr = finalStr + x + '\n'
    }
    // var Str = JSON.stringify(data_01);
    return finalStr;
  }
   
  
  const lineCounter = (event) => {
    let temp = event.target.value.split("\n").length 
    settempCounter(temp);
    setTxtValue(event.target.value);
    if (tempCounter == temp ) {
      console.log('same number')
    } else {
      var t = '';
      var y = 0
      for (let i = 0; i < temp; i++) {
         y = y + 1
         t = t + y + '\n'
      }
      setRows(t)
    }
  }

  useEffect(() => {
    setTxtValue(ReturnData())
  }, [])


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
        setTxtValue(jsonStr)
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  const ConnectWallet = async () => {
    const wc = await WalletConnect()
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='navbar'><div className='navbar_left'><a href='https://web5lab.net'><img src='media/logo.png' className='navbar_web5lab_logo'></img></a><h1>Powerd By Web5lab</h1></div><div className='navbar_right'><a className='testnet_btn' href='https://cryptotool.in'>Mainet Version</a><button className='Connect_Btn btn' onClick={ConnectWallet}>Connect Wallet</button></div></div>
        <div className='app_content'>
          <textarea rows={1} cols={1} value={rows} className="input_box_sub"></textarea>
          <textarea rows={20} className="input_box" value={txtValue} onChange={(e) => { lineCounter(e) }} cols={40}></textarea>
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
