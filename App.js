import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";

function Main() {

  //  components for updating pages
  const [currency, setCurrency] = useState({});
  const [amountFrom, setAmountFrom] = useState(0);
  const [amountTo, setAmountTo] = useState(0);
  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [currencyTo, setCurrencyTo] = useState('UAH');
  const [exchangeRate, setExchangeRate] = useState();

  // reading currency with National Bank Ukraine with public IP
  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
        .then(response => response.json())
        .then(data => {
          const usdRate = data.find(currency => currency.cc === 'USD').rate;
          const eurRate = data.find(currency => currency.cc === 'EUR').rate;

          // updating currency in the <div> with class usd and eur
          document.querySelector('#usd').textContent = usdRate.toFixed(2);
          document.querySelector('#eur').textContent = eurRate.toFixed(2);

          const updatedCurrency = {
            ...currency,
            "USD-UAH": usdRate,
            "EUR-UAH": eurRate,
            "UAH-USD": 1 / usdRate,
            "UAH-EUR": 1 / eurRate,
            "USD-EUR": usdRate / eurRate ,
            "EUR-USD": eurRate / usdRate ,
            "UAH-UAH": 1,
            "EUR-EUR": 1,
            "USD-USD": 1
          };

          setCurrency(updatedCurrency);
          setExchangeRate(currency[currencyFrom + '-' + currencyTo]);

        })
        .catch(error => {
          console.error('Помилка отримання курса валют:', error);
        });
  });

  // follows the value <select>
  useEffect(() => {
    if (currency[currencyFrom + '-' + currencyTo]) {
      setExchangeRate(currency[currencyFrom + '-' + currencyTo]);
    } else {
      setExchangeRate(currency[currencyTo + '-' + currencyFrom]);
    }
  }, [currency, currencyFrom, currencyTo]);

  // follows the value <input "from">
  function handleAmountFromChange(event) {
    setAmountFrom(event.target.value);

    // to enter negative numbers
    if (event.target.value < 0) {
      event.target.value = 0;
    }

    // follows the value 0 (zero) in <select "from">
    if (event.target.value == 0){

      setAmountTo(event.target.value * exchangeRate);
    }
    else{
      setAmountTo((event.target.value * exchangeRate).toFixed(2));
    }

  }

  // follows the <input "to">
  function handleAmountToChange(event) {
    setAmountTo(event.target.value);

    // to enter negative numbers
    if (event.target.value < 0) {
      event.target.value = 0;
    }

    // follows the value 0 (zero) in <select "to">
    if (event.target.value == 0){
      setAmountFrom(event.target.value / exchangeRate);
    }
    else{
      setAmountFrom((event.target.value / exchangeRate).toFixed(2));
    }

  }

  // follows the <select "from">
  function handleCurrencyFromChange(event) {

    setCurrencyFrom(event.target.value);
    setAmountFrom(0);
    setAmountTo(0);

  }

  // follows the <select "to">
  function handleCurrencyToChange(event) {
    setCurrencyTo(event.target.value);
    setAmountFrom(0);
    setAmountTo(0);
  }

  return (
      <div className="App">
        <h1 className="h1">Currency Converter</h1>
        <div>
          <label className="label">From:</label>
          <select className="select" value={currencyFrom} onChange={handleCurrencyFromChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="UAH">UAH</option>
          </select>
          <input type="number"  value={amountFrom} onChange={handleAmountFromChange} />
        </div>
        <div>
          <label className="label">To:&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <select className="select" value={currencyTo} onChange={handleCurrencyToChange}>
            <option value="UAH">UAH</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <input type="number" value={amountTo}  onChange={handleAmountToChange}  />
        </div>
      </div>
  );
}

// rending components the <Main>
ReactDOM.render(<Main />, document.getElementById('root'));

export default Main;




