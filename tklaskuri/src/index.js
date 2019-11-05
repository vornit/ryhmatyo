import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut1"; 
import './App.css';
import datavaakunat from "./vaakunaKuvat"
import dataverot from "./verotietoja"
import datatoimialatKunnittain from "./toimialatKunnittain"

    //objektilista kuntien nimistä
    const kuntienNimet = data.dataset.dimension["Alue 2019"].category.label
    //objektilista asukasluvuista
    const pktiedot = data.dataset.value
    //objektilista kuntien indekseistä
    const kuntienIndeksit = data.dataset.dimension["Alue 2019"].category.index
    //vuodet 2005-2017 taulukossa indeksistä 0 alkaen
    const veroTietojenVuodet = Object.keys(dataverot.dataset.dimension.Vuosi.category.label)
    // objektilista verotietoihin koskevista kategorioista
    const verokategoriat = dataverot.dataset.dimension.Tiedot.category.label
    // verotiedot taulukossa
    const verotiedot = dataverot.dataset.value
    // lista eri toimialoista
    const toimialalista = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.label
    // toimialojen määrät taulukossa
    const toimialojenMaarat = datatoimialatKunnittain.dataset.value

/** Parsii paikkakuntadataa omiin taulukoihin sarakenumeron perusteella
*/
function luoPKtaulukko(sarakeNro){
  var taulukko = [];
  for (let i = sarakeNro, j = 0; i < pktiedot.length; i+=4, j++){
      taulukko[j] = pktiedot[i];
    }
    return taulukko;
}

/** Parsii verotiedot omaan taulukkoon sarakenumeron perusteella
*/
function luoVeroTaulukko(sarakeNro){
  var taulukko = [];
  const solujenLkmPerVuosi = Object.keys(kuntienNimet).length * Object.keys(verokategoriat).length
  var verodata2017indeksi = (veroTietojenVuodet.length - 1) * solujenLkmPerVuosi
  
  for (let i = verodata2017indeksi + sarakeNro, j = 0; i < solujenLkmPerVuosi*veroTietojenVuodet.length; i+=6, j++){
      taulukko[j] = verotiedot[i];
  }
  return taulukko;
}

function parsiKunnanToimialat(kunnanIndeksi){
  var toimialojenLkm = Object.keys(toimialalista).length
  var kunnanToimialojenLkmt = [];

  for ( let i = kunnanIndeksi * toimialojenLkm; i <= (i + toimialojenLkm); i++){
    kunnanToimialojenLkmt.push(toimialojenMaarat[i]);
  }
  return kunnanToimialojenLkmt;

}

const App = () => {
    
  //console.log(datatoimialatKunnittain)
  //console.log(toimialojenMaarat)
  
  const [ counter, setCounter ] = useState(1)

  const setToValue = (value) => setCounter(value)



    //paikkakuntatiedot parsittuna omiin taulukkoihin
    var kuntienAsLuvut = luoPKtaulukko(0);
    var vlMuutokset = luoPKtaulukko(1);
    var tyoAsteet = luoPKtaulukko(2);
    var tpLukumaarat = luoPKtaulukko(3);
    

    const vaakunat = datavaakunat.selection1

 
    var nimiTaulukko = [];
    var kuntienIit = [];
    var vaakunaTaulukko = [];

    
    
    // kuntien nimet taulukkoon
    for (var x in kuntienNimet) {
        nimiTaulukko.push(kuntienNimet[x]);
    }

    console.log("kuntien lkm: " + nimiTaulukko.length)

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

    // Kuntien nimien erotus järjestetystä objektilistasta taulukkoon
	var nimetJarjestyksessa = [];
	for (var x in jarjestetty) {
        nimetJarjestyksessa.push(jarjestetty[x]);
    }


    // verotiedot parsittuna omiin taulukoihin
    var tulonsaajat = luoVeroTaulukko(0);
    var veronalaisetTulotKeskimaarin = luoVeroTaulukko(1);
    var ansioTulotKeskimaarin = luoVeroTaulukko(2);
    var verotYhteensaKeskimaarin = luoVeroTaulukko(3);
    var valtionVeroKeskimaarin = luoVeroTaulukko(4);
    var kunnallisVeroKeskimaarin = luoVeroTaulukko(5);

    // Hakutoiminto, ottaa inputista valuen ja vertaa sitä selectin valueihin
    // piilottaa valuet, jotka eivät vastaa hakusanaa
    var select
    var haettava 
    const etsi = (hakusana) => {
    	
    	haettava = hakusana.target.value
    	console.log(haettava)
 	  	select = document.getElementById("listaKunnista");
    	for (var i = 0; i < select.length; i++){
    		var txt = select[i].text
    		var include = txt.toLowerCase().startsWith(haettava.toLowerCase());
    		select.options[i].style.display = include ? 'list-item' : 'none';
    	} 

    } 

    var asukasLukuI;
    var listaI;
    var kunnantoimialat = [0, 0];
    // ottaa selectistä valuen ja tulostaa sen
    const tulosta = (listaValittu) => {
    	
      listaI = listaValittu.target.value
      //console.log(listaIndex)
      setToValue(listaI)
      //asetaMuutosArvo(listaI)
      console.log(counter)
      //console.log(muutosIndeksi)
      kunnantoimialat = parsiKunnanToimialat(listaI);
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

          	<div>
        <input type="text" id="search" name="search" placeholder="Hae..." onKeyUp={etsi}/>
            </div>
        
            <select id="listaKunnista"className="form-control" size="28" onChange={tulosta} >

            {nimetJarjestyksessa.map(s => (<option value={asukaslukuInd++}>{s}</option>))} 
            </select>

          </div>

          <div className="col-10">

        

            

            <br />
            <div className="row">
            <div class="col jumbotron">

            <div className="tiedotheader">
              <h5>{nimetJarjestyksessa[counter]}</h5> 
              
              <img src={vaakunat[counter].image} alt="new" align="right"/>
            </div>

            <ul class="list-group list-group-horizontal">
  
            <ul class="list-group">

            <li class="list-group-item"><small class="text-muted">Kunnan asukasluku: </small>{kuntienAsLuvut[counter]}</li>
            <li class="list-group-item"><small class="text-muted">Väkiluvun muutos edellisestä vuodesta: </small> {vlMuutokset[counter] + "%"}</li>
            <li class="list-group-item"> <small class="text-muted">Työllisyysaste: </small> {tyoAsteet[counter] + "%"}</li>
            <li class="list-group-item"> <small class="text-muted">Työpaikkojen lukumäärä: </small> {tpLukumaarat[counter]}</li>
            <li class="list-group-item"><small class="text-muted">Tulonsaajia: </small> {tulonsaajat[counter]}</li>
            </ul>

            <ul class="list-group">

            <li class="list-group-item"><small class="text-muted">Veronalaiset tulot keskimäärin: </small> {veronalaisetTulotKeskimaarin[counter] + "€/vuosi"}</li>
            <li class="list-group-item"><small class="text-muted">Ansiotulot keskimäärin: </small> {ansioTulotKeskimaarin[counter]+ "€/vuosi"}</li>
            <li class="list-group-item"><small class="text-muted">Verot yhteensä keskimäärin: </small> {verotYhteensaKeskimaarin[counter]+ "€/vuosi"}</li>
            <li class="list-group-item"><small class="text-muted">Valtionvero keskimäärin: </small> {valtionVeroKeskimaarin[counter]+ "€/vuosi"}</li>
            <li class="list-group-item"><small class="text-muted">Kunnallisvero keskimäärin: </small> {kunnallisVeroKeskimaarin[counter]+ "€/vuosi"}</li>
            </ul>

            </ul>

            </div>
            </div>


            <div class="row">
    <div class="col jumbotron">
      1 of 2
      <li class="list-group-item"><small class="text-muted">Veronalaiset tulot keskimäärin: </small> {kunnantoimialat[1]}</li>
      <br></br>
      sq
      <br></br>
      sq
      <br></br>
      sq
      <br></br>
      sq
      sq
    </div>
    
  </div>

        </div>

        


        </div>		
      </div>
    )

    
 }

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)