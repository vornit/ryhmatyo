import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut1"; 
import './App.css';
import datavaakunat from "./vaakunaKuvat"
import dataverot from "./verotietoja"
import datatoimialatKunnittain from "./toimialatKunnittain2"

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
    // toimialat ja niitä vastaavat indeksit
    const toimialatJaIndeksit = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category

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

function parsiKunnanToimialat(kunnanIndeksi, toimialat){
  var toimialojenLkm = Object.keys(toimialat).length
  var kunnanToimialojenLkmt = [];
  var alkuindeksi = kunnanIndeksi * toimialojenLkm;
  var alkuindeksi2;
  //console.log("kunnani: " + kunnanIndeksi)
  //console.log("alkui: " + alkuindeksi2)
  if (kunnanIndeksi == 1) alkuindeksi2 = 7 * toimialojenLkm
  else if (kunnanIndeksi > 1  && kunnanIndeksi < 8 ) alkuindeksi2 = alkuindeksi - toimialojenLkm
  else alkuindeksi2 = alkuindeksi
  //console.log("alkui: " + alkuindeksi2)


  for ( let i = alkuindeksi2; i < (alkuindeksi2 + toimialojenLkm); i++){
    kunnanToimialojenLkmt.push(toimialojenMaarat[i]);
  }
  return kunnanToimialojenLkmt;

}

function etsiSuurin(tAlaNimet, tAlaLkm, ohita){
  //console.log(tAlaLkm)
  let suurin = 0
  for (let i = 0; i < tAlaLkm.length; i++){
    if (tAlaLkm[i] >= ohita) continue;
    if (tAlaLkm[i] > suurin) {
      let s = tAlaNimet[i]
      let alkutunnus = s.substr(0, s.indexOf(' '))
      //console.log(alkutunnus)
      if (isNaN(parseInt(alkutunnus))) continue
      //console.log(alkutunnus)
      suurin = tAlaLkm[i]
    }
  }
  return suurin

}

function tulostaIsoin(toimialojenNimet, toimialojenLkm, eniten){
  //console.log(eniten)
  //let suurin = 0;
  //let toiseksiSuurin = etsiSuurin(toimialojenLkm, suurin)
  //let kolmas = etsiSuurin(toimialojenLkm, toiseksiSuurin)
  
  let suurimmanIndeksi = toimialojenLkm.indexOf(eniten)
  //let indeksi2 = toimialojenLkm.indexOf(toiseksiSuurin)
  //console.log(suurimmanIndeksi)
  //console.log(suurin)
  //console.log(toiseksiSuurin)
  //console.log(kolmas)
  let s = toimialojenNimet[suurimmanIndeksi] + " : " + eniten

  return s
  //return s.substr(s.indexOf(' ')+1).trim()
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

    //console.log("kuntien lkm: " + nimiTaulukko.length)

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

    var toimialojenNimet = []
    for (let x in toimialatJaIndeksit.label){
      toimialojenNimet.push(toimialatJaIndeksit.label[x])
    }


    var toimialojenIndeksit = []
    for (let x in toimialatJaIndeksit.index){
      toimialojenIndeksit.push(toimialatJaIndeksit.index[x])
    }

    var toimiAJaI = {}
    for (let i = 0; i < toimialojenNimet.length; i++){
      let avain = toimialojenIndeksit[i];
      let arvo = toimialojenNimet[i];
      toimiAJaI[avain] = arvo;
    }

    const toimiAlatJarj = {};
    // objektilistan järjestys avainarvon eli indeksin mukaan
    Object.keys(toimiAJaI).sort().forEach(function(key) {
    toimiAlatJarj[key] = toimiAJaI[key];
  });

    //console.log(toimiAlatJarj)
    var kunnantoimialat = parsiKunnanToimialat(counter, toimiAlatJarj);

    // Hakutoiminto, ottaa inputista valuen ja vertaa sitä selectin valueihin
    // piilottaa valuet, jotka eivät vastaa hakusanaa
    var select
    var haettava 
    const etsi = (hakusana) => {
    	
    	haettava = hakusana.target.value
    	//console.log(haettava)
 	  	select = document.getElementById("listaKunnista");
    	for (var i = 0; i < select.length; i++){
    		var txt = select[i].text
    		var include = txt.toLowerCase().startsWith(haettava.toLowerCase());
    		select.options[i].style.display = include ? 'item' : 'none';
    	} 

    } 

    var asukasLukuI;
    var listaI;
    //var kunnantoimialat = [];
    // ottaa selectistä valuen ja tulostaa sen
    const tulosta = (listaValittu) => {
    	
      listaI = listaValittu.target.value
      //console.log(listaIndex)
      setToValue(listaI)
      //asetaMuutosArvo(listaI)
      //console.log(counter)
      //console.log(muutosIndeksi)
      
      //console.log(kunnantoimialat)
    }

    // asukasluvut löytyvät taulukosta neljän indeksin välein ([0,4,8,...])
    //console.log(toimialojenNimet)
    var asukaslukuInd = 0;
    let eniten = etsiSuurin(toimiAlatJarj, kunnantoimialat, 9999999)
    //let toiseksiEniten = etsiSuurin(toimiAlatJarj, kunnantoimialat, eniten)
    //let kolmas = etsiSuurin(toimiAlatJarj, kunnantoimialat, toiseksiEniten)
    let enitenTulostus = tulostaIsoin(toimiAlatJarj, kunnantoimialat, eniten)
    //let toiseksiEnitenTulostus = tulostaIsoin(toimiAlatJarj, kunnantoimialat, toiseksiEniten)
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
      <li class="list-group-item"><small class="text-muted">Toimialoja eniten: </small> {enitenTulostus}</li>
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