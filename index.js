const express = require('express');

const soap = require('soap');


async function checkVat(vat) {

  const vat_url = 'https://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl';

  const vat_client = await soap.createClientAsync(vat_url);
  console.log(vat_client.describe());

  const countryCode = vat.substring(0, 2)
  const vatNumber = vat.substring(2);

  const result = await vat_client.checkVatAsync({
    countryCode: countryCode,
    vatNumber: vatNumber
  });

  const obj_result = result[0];
  return obj_result;
}


const app = express()
const port = 3001

app.get('/', (req, res) => {	
  res.send("test");
})

app.get('/checkVat/:vat', async (req, res) => {
  var vat = req.params.vat;
  try{
    var result = await checkVat(vat);
  } catch(err) {
    if (err.message.includes("INVALID_INPUT")) {
      result = {
        countryCode: '',
        vatNumber: '',
        valid: false,
        name: '---',
        address: '---'
       };
     } else {
       throw err;
     }
  }
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
