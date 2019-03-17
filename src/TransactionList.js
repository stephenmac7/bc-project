import React from 'react';
import {valueToBTC, satsToBTC} from './Common.js';

function showOut(address, updateAddress, out, idx) {
  return (
    <tr key={idx}>
      <td>
        <span
          className="outAddress"
          onClick={(e) => updateAddress(e.target.innerText)}>
          {out.addr}
        </span>
      </td>
      <td>{satsToBTC(out.value.toString())}</td>
    </tr>
  );
}

function OutputTable(props) {
  return (
    <table>
      <tbody>
        {props.outputs.map(showOut.bind(
          null, props.address, props.updateAddress))}
      </tbody>
    </table>
  );
}

function sumOutputs(address, outputs) {
  return outputs.reduce(function(sum, out) {
    if (out.addr === address) {
      return sum + out.value;
    } else {
      return sum;
    }
  }, 0);
}

function InputOutputTable(props) {
  return (
    <table>
      <thead>
        <tr><th>Inputs</th><th>Outputs</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <OutputTable
              address={props.address}
              updateAddress={props.updateAddress}
              outputs={props.prevOuts} />
          </td>
          <td>
            <OutputTable
              address={props.address}
              updateAddress={props.updateAddress}
              outputs={props.out} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function Transaction(props) {
  const prevOuts = props.tx.inputs.map((input) => input.prev_out);

  const inputValue = sumOutputs(props.address, prevOuts);
  const outputValue = sumOutputs(props.address, props.tx.out);

  const change = outputValue - inputValue;

  const timeDisplay = (new Date(props.tx.time * 1000)).toLocaleString();
  return (
    <div className="transaction">
      {props.tx.hash}
      <div className="transactionDetails">
        <InputOutputTable
          address={props.address}
          updateAddress={props.updateAddress}
          out={props.tx.out}
          prevOuts={prevOuts}
        />
        <div className="time">
          <small>{timeDisplay}</small>
        </div>
      </div>
      <div className="change">
        <span className="label">Balance Change:&nbsp;</span>
        {valueToBTC(change)}
      </div>
    </div>
  );
}

function TransactionList(props) {
  return (
    <div className="transactionList">
      {props.transactions.map(
        (tx) => <Transaction
                  address={props.address}
                  tx={tx}
                  key={tx.hash}
                  updateAddress={props.updateAddress} />
       )}
    </div>
  );
}

export default TransactionList;
