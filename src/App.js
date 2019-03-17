import React, { Component } from 'react';
import './App.css';

import {satsToBTC} from './Common.js';
import TransactionList from './TransactionList.js';

const API = "https://blockchain.info/rawaddr/";

function AddressInput(props) {
  return (
    <input
      placeholder="Bitcoin Address"
      value={props.address}
      className="addressInput"
      onChange={(e) => props.onAddressChange(e.target.value)}
    />
  );
}

function LabeledItem(props) {
  return (
    <div>
      <span className="label">
        {props.label}:&nbsp;
      </span>
      {props.content}
    </div>
  )
}

function GeneralInfo(props) {
  return (
    <div>
      <LabeledItem
        label="Current Address"
        content={props.address} />
      <LabeledItem
        label="Balance"
        content={satsToBTC(props.balance.toString())} />
    </div>
  );
}

function AddressInfo(props) {
  return (
    <div className="addressInfo">
      <h2>Details</h2>
      <GeneralInfo
        address={props.info.address}
        balance={props.info.final_balance}
      />
      <h3>Transactions ({props.info.n_tx})</h3>
      <TransactionList
        transactions={props.info.txs}
        address={props.info.address}
        updateAddress={props.updateAddress}
      />
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      address: '',
    };

    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  updateData(address) {
    fetch(API + address + "?cors=true")
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return null;
        }
      })
      .then(data => this.setState({data}))
  }

  handleAddressChange(address) {
    this.setState({address: address});
    this.clearTimer();
    if (address.length === 34) { // rudimentary validation
      this.updateData(address);
      this.setTimer(address);
    }
  }

  clearTimer() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  setTimer(address) {
    this.timerID = setInterval(
      () => this.updateData(address),
      5000);
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  render() {
    return (
      <div className="App">
        <h1>Bitcoin Address</h1>
        <AddressInput
          address={this.state.address}
          onAddressChange={this.handleAddressChange}
        />
        {this.state.data ? <AddressInfo
                             info={this.state.data}
                             updateAddress={this.handleAddressChange} />
                         : <p>Please enter a valid Bitcoin Address</p>}
      </div>
    );
  }
}

export default App;
