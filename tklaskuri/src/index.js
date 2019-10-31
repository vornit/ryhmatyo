import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut1"; 
import './App.css';
import datavaakunat from "./vaakunaKuvat"
import dataverot from "./verotietoja"



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

    const verotiedot = dataverot.dataset.value

    

    const vaakunat = datavaakunat.selection1

    console.log(vaakunat[5].image)

    var nimiTaulukko = [];
    var kuntienIit = [];
    var vaakunaTaulukko = [];


    
    
    // kuntien nimet taulukkoon
    for (var x in kuntienNimet) {
        nimiTaulukko.push(kuntienNimet[x]);
    }

    const verokategoriat = dataverot.dataset.dimension.Tiedot.category.label 
    const solujenLkmPerVuosi = nimiTaulukko.length * Object.keys(verokategoriat).length
    console.log(solujenLkmPerVuosi)
    //vuodet 2005-2017 taulukossa indeksistä 0 alkaen
    const veroTietojenVuodet = Object.keys(dataverot.dataset.dimension.Vuosi.category.label)
    console.log(veroTietojenVuodet)

    var verodata2017indeksi = (veroTietojenVuodet.length - 1) * solujenLkmPerVuosi
    console.log(verodata2017indeksi)

    var tulonsaajat = [];
    for (let i = verodata2017indeksi, j = 0; i < solujenLkmPerVuosi*veroTietojenVuodet.length; i+=6, j++){
      tulonsaajat[j] = verotiedot[i];
    }
    //console.log(tulonsaajat)

    var veronalaisetTulotKeskimaarin = [];
    for (let i = verodata2017indeksi + 1, j = 0; i < solujenLkmPerVuosi*veroTietojenVuodet.length; i+=6, j++){
      veronalaisetTulotKeskimaarin[j] = verotiedot[i];
    }

     var ansioTulotKeskimaarin = [];
    for (let i = verodata2017indeksi + 2, j = 0; i < solujenLkmPerVuosi*veroTietojenVuodet.length; i+=6, j++){
      ansioTulotKeskimaarin[j] = verotiedot[i];
    }

     var verotYhteensaKeskimaarin = [];
    for (let i = verodata2017indeksi + 3, j = 0; i < solujenLkmPerVuosi*veroTietojenVuodet.length; i+=6, j++){
      verotYhteensaKeskimaarin[j] = verotiedot[i];
    }

    var valtionVeroKeskimaarin = [];
    for (let i = verodata2017indeksi + 4, j = 0; i < solujenLkmPerVuosi*veroTietojenVuodet.length; i+=6, j++){
      valtionVeroKeskimaarin[j] = verotiedot[i];
    }

    var kunnallisVeroKeskimaarin = [];
    for (let i = verodata2017indeksi + 5, j = 0; i < solujenLkmPerVuosi*veroTietojenVuodet.length; i+=6, j++){
      kunnallisVeroKeskimaarin[j] = verotiedot[i];
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
    // Bootstrapin pääcontainer
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

          <div className="col-sm jumbotron">

            <div className="tiedotheader">
              <h4>{nimetJarjestyksessa[counter]}</h4> 
              <br></br>
              <img src={vaakunat[counter].image} alt="new"/>
            </div>

            <br />
            <small class="text-muted">Kunnan asukasluku: </small>{kuntienAsLuvut[counter]}
            <br />
            <small class="text-muted">Väkiluvun muutos edellisestä vuodesta: </small> {vlMuutokset[counter] + "%"}
            <br />
            <small class="text-muted">Työllisyysaste: </small> {tyoAsteet[counter] + "%"}
            <br />
            <small class="text-muted">Työpaikkojen lukumäärä: </small> {tpLukumaarat[counter]}
            <br />
            <small class="text-muted">Tulonsaajia: </small> {tulonsaajat[counter]}
            <br />
            <small class="text-muted">Veronalaiset tulot keskimäärin: </small> {veronalaisetTulotKeskimaarin[counter] + "€/vuosi"}
            <br />
            <small class="text-muted">Ansiotulot keskimäärin: </small> {ansioTulotKeskimaarin[counter]+ "€/vuosi"}
            <br />
            <small class="text-muted">Verot yhteensä keskimäärin: </small> {verotYhteensaKeskimaarin[counter]+ "€/vuosi"}
            <br />
            <small class="text-muted">Valtionvero keskimäärin: </small> {valtionVeroKeskimaarin[counter]+ "€/vuosi"}
            <br />
            <small class="text-muted">Kunnallisvero keskimäärin: </small> {kunnallisVeroKeskimaarin[counter]+ "€/vuosi"}

        </div>
        </div>		
      </div>
    )

    
 }

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)