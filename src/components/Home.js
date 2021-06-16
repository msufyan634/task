import React,{useEffect} from 'react';
import Web3 from 'web3';
import {Button} from '@material-ui/core'
import VotingAbi from '../components/utils/VotingAbi.json'
import Environment from './utils/Environment';
import {totalVotes} from '../redux/action/index'
import { useSelector,useDispatch } from "react-redux";
import {ToastContainer,toast} from 'react-toastify'

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const Home = () => {
  const dispatch = useDispatch();
  const {totalV,hasvoted} = useSelector((state) => state.UserReducer);
  const [Useraccount, setAccount] = React.useState();
  const [txcontract, settxContract] = React.useState();

  const ConnectToWallet = () => {
    Ethereum();
    async function Ethereum() {
      window.ethereum.request({ method: "eth_requestAccounts" });
      if (typeof window.ethereum !== "undefined") {
        let connectAccount = setInterval(async () => {
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
            // console.log("Contract",Contract);
            settxContract(Contract);
          }
          clearInterval(connectAccount)
        }, 500);
        toast.success("Wallet Connected")
      }
    }
  };
  const vote=()=>{
    if(Useraccount!==undefined && txcontract !==undefined) {
      txcontract.methods.vote(web3.utils.toWei('1')).send(
        {
          from: Useraccount}
      ).on("confirmation", (confirmationNumber) => {
          if(confirmationNumber===1){
          toast.success("Transaction vote succeed");
          }
      })
      .on("error", (err) => {
        toast.error("Transaction vote failed");
        console.log("Error",err);
    
      });
    }
  }
  const removevote=()=>{
    if(Useraccount!==undefined && txcontract !==undefined) {
      txcontract.methods.removeVote(web3.utils.toWei('1')).send(
        {
          from: Useraccount}
      ).on("confirmation", (confirmationNumber) => {
       
        if (confirmationNumber===1) {
          toast.success("Transaction remove vote succed");
        }
      })
      .on("error", (err) => {
        toast.error("Transaction remove vote failed");
        console.log("Error",err);
    
      });
    }
  }
 useEffect(() => {
   if(Useraccount!==undefined && txcontract !==undefined) {
     setInterval(() => {
      dispatch(totalVotes(Useraccount,txcontract))
     }, 500);
     
   }
   
  },[Useraccount,txcontract])

    return (
        <div>
        <h6>Connect To a Wallet</h6>
        <div className="wallet__main">
        <Button color="primary" variant="contained" onClick={ConnectToWallet} >
        <ToastContainer/>
        Meta mask 	&nbsp;	&nbsp;	&nbsp;
        <img src="/images/metamask.svg" alt=""/></Button>
        </div>
        <h6 onClick={ConnectToWallet}>Wallet Address:  {Useraccount?Useraccount:""}</h6>
        <h6 onClick={ConnectToWallet}>Status: {hasvoted?"voted":"not voted"}</h6>
         <Button color="primary" variant="contained" >Total Votes:{totalV}</Button>
         <Button color="primary" variant="contained" onClick={vote} >Click for vote
         <ToastContainer/>
         </Button>
         <Button color="primary" variant="contained" onClick={removevote} >REMOVE VOTE
         <ToastContainer/>
         </Button>
        </div>
    )
}

export default Home
