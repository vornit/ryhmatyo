import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut1"; 
import './App.css';
import datavaakunat from "./vaakunaKuvat"



const App = () => {
    
    
  const [ counter, setCounter ] = useState(0)

  const setToValue = (value) => setCounter(value)
  console.log(counter)

  	//objektilista kuntien nimistä
    const kuntienNimet = data.dataset.dimension["Alue 2019"].category.label
    //objektilista asukasluvuista
    const pktiedot = data.dataset.value
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

    
    var listaIndex;
    // ottaa selectistä valuen ja tulostaa sen
    const tulosta = (listaValittu) => {
    	
      listaIndex = listaValittu.target.value
      console.log(listaIndex)
      setToValue(listaIndex)
      console.log(counter)
    }
    
    // asukasluvut löytyvät taulukosta neljän indeksin välein ([0,4,8,...])
    var asukaslukuInd = -4;
    // väkiluvunmuutos löytyvät taulukosta kolmen indeksin välein
    var vakiluvunMuutos = -3;
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
          {nimetJarjestyksessa.map(s => (<option value={asukaslukuInd+=4}>{s}</option>))} 
          </select>
          </div>

          <div className="col-sm">
            
         Kunnan asukasluku: {pktiedot[counter]}

         <img 
      src={vaakunat[counter].image}
      alt="new"
      />

        </div>
        <div className="col-sm">
         Väkiluvun muutos edellisestä vuodesta prosentteina: {pktiedot[counter]}
        </div>

        </div>		
      </div>
    )

    
 }

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)