import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut"; 



const App = () => {
    
    
  const [ counter, setCounter ] = useState(0)

  const setToValue = (value) => setCounter(value)

  	//objektilista kuntien nimistä
    const kuntienNimet = data.dataset.dimension["Alue 2019"].category.label
    //objektilista asukasluvuista
    const asukasmaarat = data.dataset.value
    //objektilista kuntien indekseistä
    const kuntienIndeksit = data.dataset.dimension["Alue 2019"].category.index

    var nimiTaulukko = [];
    var kuntienIit = [];
    
    
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
    
    
    var indexLista = 0;
    // valintalista kunnista, indeksöi samalla 0->n
    return (
      <div>				

        <select id="listaKunnista" size="25" onChange={tulosta}>
        {nimetJarjestyksessa.map(s => (<option value={indexLista++}>{s}</option>))} 
        </select>

      <div>{asukasmaarat[counter]}</div>

      </div>
    )

    
 }

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)