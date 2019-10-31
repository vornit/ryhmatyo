import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut1"; 
import './App.css';
import datavaakunat from "./vaakunaKuvat"



const App = () => {
    
    
  const [ asindeksi, setCounter ] = useState(0)


  const setToValue = (value) =>
   { setCounter(value) }


  	//objektilista kuntien nimistä
    const kuntienNimet = data.dataset.dimension["Alue 2019"].category.label
    //objektilista asukasluvuista
    const pktiedot = data.dataset.value
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
            
            <select id="listaKunnista" className="form-control" size="24" onChange={tulosta}>
            {nimetJarjestyksessa.map(s => (<option value={indexLista++}>{s}</option>))} 
            </select>
            </div>

            <div className="col-sm">

            <div class="col-sm">

            <h3>{jarjestetty[asindeksi]}</h3>

            Kunnan asukasluku: <small class="text-muted"> {asukasmaarat[asindeksi]} </small>

            </div>


          
      
          

          <div class="col-sm">

          <h3>Vertailu</h3>
          </div>


          <select id="listaKunnista" className="form-control" size="25" onChange={tulosta}>
          {nimetJarjestyksessa.map(s => (<option value={asukaslukuInd+=4}>{s}</option>))} 
          </select>
          </div>

          <div className="col-sm">
         Kunnan asukasluku: {pktiedot[counter]}
        </div>
        <div className="col-sm">
         Väkiluvun muutos edellisestä vuodesta prosentteina: {pktiedot[counter]}
        </div>



          </div>

  </div>	

  <div class="footer">
  <p>TIEA207 kurssin projektityö</p>
</div>

</div>



    )

    
 }

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)