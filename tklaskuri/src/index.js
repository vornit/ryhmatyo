import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut1"; 
import './App.css';
import datavaakunat from "./vaakunaKuvat"



const App = () => {
    
    
  const [ counter, setCounter ] = useState(0)
  const [ muutosIndeksi, asetaMuutos ] = useState(0)

  const setToValue = (value) => setCounter(value)

  const asetaMuutosArvo = (value) => asetaMuutos(value)

  	//objektilista kuntien nimistä
    const kuntienNimet = data.dataset.dimension["Alue 2019"].category.label
    //objektilista asukasluvuista
    const pktiedot = data.dataset.value

    var kuntienAsLuvut = [];
    for (let i = 0, j = 0; i < pktiedot.length; i+=4, j++){
      kuntienAsLuvut[j] = pktiedot[i];
    }
    var vlMuutokset = [];
    for (let i = 1, j = 0; i < pktiedot.length; i+=4, j++){
      vlMuutokset[j] = pktiedot[i];
    }
    var tyoAsteet = [];
    for (let i = 2, j = 0; i < pktiedot.length; i+=4, j++){
      tyoAsteet[j] = pktiedot[i];
    }
    var tpLukumaarat = [];
    for (let i = 3, j = 0; i < pktiedot.length; i+=4, j++){
      tpLukumaarat[j] = pktiedot[i];
    }
    //objektilista kuntien indekseistä
    const kuntienIndeksit = data.dataset.dimension["Alue 2019"].category.index

    const vaakunat = datavaakunat.selection1

    console.log(vaakunat[5].image)

    var nimiTaulukko = [];
    var kuntienIit = [];
    var vaakunaTaulukko = [];


    
    
    // kuntien nimet taulukkoon
    for (var x in kuntienNimet) {
        nimiTaulukko.push(kuntienNimet[x]);
    }

 

    // kuntien indeksit taulukkoon
    for (var x in kuntienIndeksit) {
        kuntienIit.push(kuntienIndeksit[x]);
    }

    var avain;
    var arvo;
    var nimetJaIndeksit = {};

    // kuntien nimet ja indeksit mapitettuna yhteen objektilistaan
    for (var i = 0; i < nimiTaulukko.length; i++){
    	avain = kuntienIit[i];
    	arvo = nimiTaulukko[i];
    	nimetJaIndeksit[avain] = arvo;
    }

    const jarjestetty = {};
    // objektilistan järjestys avainarvon eli indeksin mukaan
    Object.keys(nimetJaIndeksit).sort().forEach(function(key) {
  	jarjestetty[key] = nimetJaIndeksit[key];
	});

    // Kuntien nimien erotus järjestetystä objektilistasta
	var nimetJarjestyksessa = [];
	for (var x in jarjestetty) {
        nimetJarjestyksessa.push(jarjestetty[x]);
    }

    
    var asukasLukuI;
    var listaI;
    // ottaa selectistä valuen ja tulostaa sen
    const tulosta = (listaValittu) => {
    	
      listaI = listaValittu.target.value
      //console.log(listaIndex)
      setToValue(listaI)
      asetaMuutosArvo(listaI)
      console.log(counter)
      console.log(muutosIndeksi)
    }

    
    // asukasluvut löytyvät taulukosta neljän indeksin välein ([0,4,8,...])
    var asukaslukuInd = 0;

    // valintalista kunnista, indeksöi samalla 0->n
    return (
      <div className="container">	


<div class="row justify-content-md-center">
    

<div class="btn-group btn-group-lg">
    <button type="button" class="btn btn-primary" aria-pressed="true">Toimialat</button>
    <button type="button" class="btn btn-primary" aria-pressed="true">Paikkakunnat</button>
    
  </div>
  
  </div>

        <div className="row">
        <div className="col-sm">
          
          <select id="listaKunnista" className="form-control" size="25" onChange={tulosta}>
          {nimetJarjestyksessa.map(s => (<option value={asukaslukuInd++}>{s}</option>))} 
          </select>
          </div>

          <div className="col-sm">
         Kunnan asukasluku: {kuntienAsLuvut[counter]}
            

         <img 
      src={vaakunat[counter].image}
      alt="new"
      />

        </div>
        <div className="col-sm">
         Väkiluvun muutos edellisestä vuodesta prosentteina: {vlMuutokset[counter]}
        </div>

        </div>		
      </div>
    )

    
 }

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)