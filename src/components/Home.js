import React,{useEffect} from 'react';
import Web3 from 'web3';
import {Button} from '@material-ui/core'
import VotingAbi from '../components/utils/VotingAbi.json'
import Environment from './utils/Environment';
import {totalVotes} from '../redux/action/index'
import { useSelector,useDispatch } from "react-redux";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const Home = () => {
  const dispatch = useDispatch();
  const {totalV,hasvoted} = useSelector((state) => state.UserReducer);
  const [Useraccount, setAccount] = React.useState();

  const [txcontract, settxContract] = React.useState();

  const ConnectToWallet = () => {
    Ethereum();
    async function Ethereum() {
      // window.ethereum && window.ethereum.enable();
      window.ethereum.request({ method: "eth_requestAccounts" });
      if (typeof window.ethereum !== "undefined") {
        // let connectAccount = setInterval(async () => {
          // const web3 = new Web3(Web3.givenProvider || "http://localhost8545");
          const account = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log("here are the accounts====>", account);
          if (account) {
            setAccount(account[0]);
            const Contract = new web3.eth.Contract(
              VotingAbi,
              Environment.VotingContractAddress,
              
            );
            console.log("Contract",Contract);
            settxContract(Contract);
          }
          // clearInterval(connectAccount);
        // }, 500);
      }
    }
  };
  const vote=()=>{
    if(Useraccount!==undefined && txcontract !==undefined) {
      txcontract.methods.vote(web3.utils.toWei('1')).send(
        {
          from: Useraccount}
      ).on("confirmation", (confirmationNumber) => {
        // console.log("here is the confirmation number====>", confirmationNumber);
        if (confirmationNumber === 5) {
          alert("Transtion conform")
        }
      })
      .on("error", (err) => {
        alert(err.message);
    
      });
    }
  }
  const removevote=()=>{
    if(Useraccount!==undefined && txcontract !==undefined) {
      txcontract.methods.removeVote(web3.utils.toWei('1')).send(
        {
          from: Useraccount}
      ).on("confirmation", (confirmationNumber) => {
        // console.log("here is the confirmation number====>", confirmationNumber);
        if (confirmationNumber === 5) {
          alert("Transtion conform")
        }
      })
      .on("error", (err) => {
        alert(err.message);
    
      });
    }
  }
 useEffect(() => {
   if(Useraccount!==undefined && txcontract !==undefined) {
     setInterval(() => {
      dispatch(totalVotes(Useraccount,txcontract))
     }, 3000);
     
   }
   
  },[Useraccount,txcontract])

    return (
        <div>
        <h6>Connect To a Wallet</h6>
        <div className="wallet__main">
        <Button color="primary" variant="contained" onClick={ConnectToWallet} >
        Meta mask 	&nbsp;	&nbsp;	&nbsp;
        <img src="/images/metamask.svg" alt=""/></Button>
        </div>
        <h6 onClick={ConnectToWallet}>Wallet Address:  {Useraccount?Useraccount:""}</h6>
        <h6 onClick={ConnectToWallet}>{hasvoted?"voted":"not voted"}</h6>
         <Button color="primary" variant="contained" >Total Votes:{totalV}</Button><br/>
         <Button color="primary" variant="contained" onClick={vote} >Click for vote</Button><br/>
         <Button color="primary" variant="contained" onClick={removevote} >REMOVE VOTE</Button>
        </div>
    )
}

export default Home
