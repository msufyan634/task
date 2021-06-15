import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider || "http://localhost8545");
export const totalVotes = (Useraccount, txiContract) => async (
    dispatch
  ) => {
     txiContract.methods
      .totalVotes()
      .call()
      .then((val) => { 
        console.log("val",val);    
        dispatch({
          type: "TOTAL_VOTES",
          payload: val,
        });
      });
      txiContract.methods
      .voted(Useraccount)
      .call()
      .then((val) => { 
        console.log("val",val);    
        dispatch({
          type: "HAS_VOTED",
          payload: val,
        });
      });
  };
