import React, { Component } from "react";
// import Registration from "./contracts/Registration.json";
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    lastName: "",
    account: "",
    loaded:false,
    candidates: JSON.parse(localStorage.getItem('candidates')) || {},
     };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();

      // this.Registration = new this.web3.eth.Contract(
      //   Registration.abi,
      //   Registration.networks[networkId] && Registration.networks[networkId].address,
      // );      
      this.Voting = new this.web3.eth.Contract(
        Voting.abi,
        Voting.networks[networkId] && Voting.networks[networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded:true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleRegistration = async () => {
    const {lastName} = this.state;
    let result = await this.Voting.methods.register(lastName).send({from: this.accounts[0]}); 
    this.setState( prevState => ({
      candidates: {...prevState.candidates, [lastName]: this.accounts[0]} 
    }),() => {
      localStorage.setItem('candidates', JSON.stringify(this.state.candidates))
    });
    console.log(result);
    console.log(this.state.candidates);
  };

  handleVoting = async () => {
    const {account} = this.state
    let result = await this.Voting.methods.vote(account).send({from: this.accounts[0]})
    console.log(result);
  }

  handleVotingWinner = async () => {
    let result = await this.Voting.methods.getPickWinner().call({from: this.accounts[0]})
    console.log(result);
    alert("The winner is " + result + "!!!");
  }

  handleCandidatesList = async () => {
    var newCandidates = [];
    this.setState({
      candidates: newCandidates
    },() => {
      localStorage.setItem('candidates', JSON.stringify(this.state.candidates))      
    });    
  };  

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let candidates = this.state.candidates;
    return (
      <div className="App">
        <h1>Voting in Ethereum</h1>
        <h2>Candidates registration</h2>
        <p>
          To complete your registration, enter your name 
        </p>
        Name: <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleInputChange} />
         <button type="button" onClick={this.handleRegistration}>Complete registration</button>
        <p>
          <button type="button" onClick={this.handleCandidatesList}>Reset</button>
        </p>
        <p></p>
        <p></p>
        <h3>List of candidates</h3>
        <ul>
          {Object.keys(candidates).map((candidate, i) => <li key={i}>{candidate}: {candidates[candidate]}</li>)}
        </ul>  
        <p></p>
        <p></p>
        <p>
          To complete the voting, enter the candidate account below and click "Vote" 
        </p>
        <p>
        Candidate account: <input type="text" name="account" value={this.state.account} onChange={this.handleInputChange} />
         <button type="button" onClick={this.handleVoting}>Vote</button>
        </p>  
        <p></p>
        <p>
          <button type="button" onClick={this.handleVotingWinner}>Get winner</button>
        </p>

      </div>
    );
  }
}

export default App;
