import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut1"; 
import './App.css';
import datavaakunat from "./vaakunaKuvat"
import dataverot from "./verotietoja"
import datatoimialatKunnittain from "./toimialatKunnittain2"
import ToimialatValilehti from './toimialat'
import dataPaastot from "./paastotToimialoittain"
import dataToimialojenVerot from "./toimialojenVerot2"



const lukupilkuilla = (x) => {
  if (x == undefined) return "Ei tiedossa";
  else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


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
//function luoPaastot

/** Parsii sovelluksessa valitun kunnan toimialatiedot yhteen taulukkoon.
* Parametreina ovat valitun kunnan indeksi ja toimialojen nimet järjestetyssä listassa.
* Toimialojen määrät -datasetistä lasketaan oikea aloitusindeksi kunnan indeksin avulla.
*/
function parsiKunnanToimialat(kunnanIndeksi, toimialat){
  var toimialojenLkm = Object.keys(toimialat).length
  var kunnanToimialojenLkmt = [];
  var alkuindeksi = kunnanIndeksi * toimialojenLkm;
  //var alkuindeksi2;
  //console.log("kunnani: " + kunnanIndeksi)
  //console.log("alkui: " + alkuindeksi2)
  //if (kunnanIndeksi == 1) alkuindeksi2 = 7 * toimialojenLkm
  //else if (kunnanIndeksi > 1  && kunnanIndeksi < 8 ) alkuindeksi2 = alkuindeksi - toimialojenLkm
  //else alkuindeksi2 = alkuindeksi
  //console.log("alkui: " + alkuindeksi2)



  for ( let i = alkuindeksi; i < (alkuindeksi + toimialojenLkm); i++){
    kunnanToimialojenLkmt.push(toimialojenMaarat[i]);
  }
  return kunnanToimialojenLkmt;

}

/** Etsii annetusta kunnan toimialojen lkm -taulukosta suurimman alkion indeksin.
* Ohittaa parametrina annetun alkion ja sitä suuremmat, jotta funktiota voi käyttää myös
* toiseksi suurimman etsintään (jne)
* param1(tAlaNimet): toimialojen nimet järjestetyssä listassa
* param2(tAlaLkm): valitun kunnan toimialojen lukumäärät taulukossa
* param3(ohita): Alkion indeksi, joka ja jota suuremmat ohitetaan
*/
function etsiSuurimmanI(tAlaNimet, tAlaLkm, ohita){
  //console.log(tAlaLkm)
  let suurin = 0
  let suurimmanI = 0
  for (let i = 0; i < tAlaLkm.length; i++){
    if (tAlaLkm[i] >= ohita) continue;
    if (tAlaLkm[i] > suurin) {
      let s = tAlaNimet[i]
      let alkutunnus = s.substr(0, s.indexOf(' ')).trim()
      //console.log(alkutunnus)
      //console.log(isNaN(parseInt(alkutunnus)))
      if (isNaN(parseInt(alkutunnus)) || alkutunnus.length > 2) continue
      //console.log(alkutunnus)
      suurin = tAlaLkm[i]
      suurimmanI = i
      //console.log("suurin: " + suurin)
    }
  }
  return suurimmanI

}

/** Muotoilee ja palauttaa merkkijonona annettua indeksiä vastaavan toimialan 
* nimen ja lukumäärän
*/ 
function tulostaToimialat(toimialojenNimet, toimialojenLkm, i){
  //console.log(eniten)
  //let suurin = 0;
  //let toiseksiSuurin = etsiSuurin(toimialojenLkm, suurin)
  //let kolmas = etsiSuurin(toimialojenLkm, toiseksiSuurin)
  
  //let suurimmanIndeksi = toimialojenLkm.indexOf(eniten)
  //let indeksi2 = toimialojenLkm.indexOf(toiseksiSuurin)
  //console.log(suurimmanIndeksi)
  //console.log(suurin)
  //console.log(toiseksiSuurin)
  //console.log(kolmas)
  let s = toimialojenNimet[i] + " : " + toimialojenLkm[i]
  return s.substr(s.indexOf(' ')+1).trim()
  //return toimialojenNimet[i] + " : " + toimialojenLkm[i] + " "
}

function jarjestaIndekseittain(datasetti){
  var labelit = []
    for (let x in datasetti.label){
      labelit.push(datasetti.label[x])
    }

    var indeksit = []
    for (let x in datasetti.index){
      indeksit.push(datasetti.index[x])
    }

    var labelitJaIndeksit = {}
    for (let i = 0; i < Object.keys(datasetti.label).length; i++){
      let avain = indeksit[i];
      let arvo = labelit[i];
      labelitJaIndeksit[avain] = arvo;
    }

    //toimialat ja niiden indeksit avain-arvo pareina listassa
    let jarjestetty = {};
    // objektilistan järjestys avainarvon eli indeksin mukaan
    Object.keys(labelitJaIndeksit).sort().forEach(function(key) {
    jarjestetty[key] = labelitJaIndeksit[key];
  });
    return jarjestetty

}

function parsiPaastotVuodelta(vuodenIndeksi){
  var paastoTaulukko = dataPaastot.dataset.value
  let toimialojenLkm = Object.keys(dataPaastot.dataset.dimension["Toimialat (TOL2008) ja kotitaloudet"].category.label).length
  var vuodenPaastot = []
  let alkuindeksi = vuodenIndeksi *  toimialojenLkm

  for (let i = alkuindeksi; i < alkuindeksi + toimialojenLkm; i++){
    vuodenPaastot.push(paastoTaulukko[i])
  }
  return vuodenPaastot

}

function etsiPaastot(toimialat, toimialojenPaastot, toimialojenLkmSuomessa, toimialojenLkmKunnalla, i){
  let toimialanLkmSuomessa = toimialojenLkmSuomessa[i]
  let toimialanLkmKunnassa = toimialojenLkmKunnalla[i]
  //console.log("asd: " +  toimialanLkmKunnassa)
  let toimiala = toimialat[i]
  let alkutunnus = toimiala.substr(0, toimiala.indexOf(' ')).trim()
  let toimialanPaastot = toimialojenPaastot[alkutunnus]
  let toimialanPaastotKM = toimialanPaastot/toimialanLkmSuomessa
  let kokonaisPaastotKunnassa = toimialanPaastotKM * toimialanLkmKunnassa
  //console.log("asdf: " +  kokonaisPaastotKunnassa)
  if (isNaN(toimialanPaastot)) return "Päästötietoja ei saatavilla"
  return Math.ceil(kokonaisPaastotKunnassa) + " tonnia kasvihuonepäästöjä"
}

function etsiVerot(toimialat, toimialojenLkmKunnalla, i){
  let toimiala = toimialat[i]
  let alkutunnus = toimiala.substr(0, toimiala.indexOf(' ')).trim()
  const veroToimialat = dataToimialojenVerot.dataset.dimension.Toimiala.category
  let toimialojenLkm = Object.keys(veroToimialat.label).length
  let toimialojenVeroarvot = dataToimialojenVerot.dataset.value
  let vuoden2017Indeksi = 3
  let solujenLkmPerToimiala = 2
  let aloitusindeksi2017 = toimialojenLkm * vuoden2017Indeksi * solujenLkmPerToimiala
  let toimialojenVerot2017 = []
  for (let j = aloitusindeksi2017; j < aloitusindeksi2017 + toimialojenLkm; j++){
    toimialojenVerot2017.push(toimialojenVeroarvot[j])
  }

  console.log(veroToimialat.index[alkutunnus])
  let valitunToimialanIndeksi = + aloitusindeksi2017 + veroToimialat.index[alkutunnus] * solujenLkmPerToimiala
  console.log(valitunToimialanIndeksi)
  let toimialanVerotYhteensa = toimialojenVeroarvot[valitunToimialanIndeksi]
  let toimialanVerotKM = toimialojenVeroarvot[valitunToimialanIndeksi + 1]
  let toimialanLkm = toimialojenLkmKunnalla[i]
  let toimialanVerotPerKunta = toimialanLkm * toimialanVerotKM
  return toimialanVerotPerKunta + "€"
  
}

const App = () => {

  const [page, setPage] = useState('paikkakunnat')

  const  toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }

  
    
  

  const content = () => {
    if (page === 'paikkakunnat') {
      return <Paikkakunnat />
    } else if (page === 'toimialat') {
      return <ToimialatValilehti />
    }
  }

 



    return (


      <div>
      
      <div className="row justify-content-md-center">
         
        <div className="btn-group btn-group-lg">
        <button type="button" className="btn btn-primary" aria-pressed="true" onClick={toPage('toimialat')}>Toimialat</button>
        <button type="button" className="btn btn-primary" aria-pressed="true" onClick={toPage('paikkakunnat')}>Paikkakunnat</button>
        </div>
        
        
        </div>
        {content()}
        </div>
       )
    

  }

 
 //HUOM PAIKKAKUNNAT
 //KOMPONENTTI JOKA piirtää PAIKKAKUNNAT sivulle kaiken
 const Paikkakunnat = () => {



  

  const [page, setPage] = useState('tietoja')

  const  toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }

  

  const content = () => {
    if (page === 'tietoja') {
      return <Tietoja />
    } else if (page === 'suhdeluku') {
      return <Suhdeluku />
    }
  }




  // State joka pitää muistissa indeksiä 
  const [ counter, setCounter ] = useState(0)
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

    //toimialat ja niiden indeksit avain-arvo pareina listassa
    const toimiAlatJarj = {};
    // objektilistan järjestys avainarvon eli indeksin mukaan
    Object.keys(toimiAJaI).sort().forEach(function(key) {
    toimiAlatJarj[key] = toimiAJaI[key];
  });

    //console.log(toimiAlatJarj)
    // käyttäjän valitseman kunnan toimialatiedot taulukossa 
    var kunnantoimialat = parsiKunnanToimialat(counter, toimiAlatJarj);
    

    
    var kokoSuomenToimialojenLkmt = parsiKunnanToimialat(0, toimiAlatJarj)
    //console.log(kokoSuomenToimialatLkm)
  

   


 // kuntien indeksit taulukkoon
 for (let x in kuntienIndeksit) {
     kuntienIit.push(kuntienIndeksit[x]);
 }

 var paastotToimialat = dataPaastot.dataset.dimension["Toimialat (TOL2008) ja kotitaloudet"].category
 var toimialatJaTunnukset = paastotToimialat.label

 var paastojenToimialatJarj = jarjestaIndekseittain(paastotToimialat)


 var paastotToimialoittain2008 = parsiPaastotVuodelta(0)
 var TAtunnuksetJaPaastoarvot = {}
 for (let i = 0; i < Object.keys(paastojenToimialatJarj).length; i++){
  let s = paastojenToimialatJarj[i]
  let avain = s.substr(0, s.indexOf(' ')).trim()
  let arvo = paastotToimialoittain2008[i]
  TAtunnuksetJaPaastoarvot[avain] = arvo
 }




 var avain;
 var arvo;
 var nimetJaIndeksit = {};

    
    let enitenI = etsiSuurimmanI(toimiAlatJarj, kunnantoimialat, 9999999)
    let enitenPaastot = etsiPaastot(toimiAlatJarj, TAtunnuksetJaPaastoarvot, kokoSuomenToimialojenLkmt, kunnantoimialat, enitenI)
    let enitenVerot   = etsiVerot(toimiAlatJarj, kunnantoimialat, enitenI)

    let toiseksiEnitenI = etsiSuurimmanI(toimiAlatJarj, kunnantoimialat, kunnantoimialat[enitenI])
    let toinenPaastot = etsiPaastot(toimiAlatJarj, TAtunnuksetJaPaastoarvot, kokoSuomenToimialojenLkmt, kunnantoimialat, toiseksiEnitenI)
    let toinenVerot   = etsiVerot(toimiAlatJarj, kunnantoimialat, toiseksiEnitenI)

    let kolmasI = etsiSuurimmanI(toimiAlatJarj, kunnantoimialat, kunnantoimialat[toiseksiEnitenI])
    let kolmasPaastot = etsiPaastot(toimiAlatJarj, TAtunnuksetJaPaastoarvot, kokoSuomenToimialojenLkmt, kunnantoimialat, kolmasI)
    let kolmasVerot   = etsiVerot(toimiAlatJarj, kunnantoimialat, kolmasI)

    let neljasI = etsiSuurimmanI(toimiAlatJarj, kunnantoimialat, kunnantoimialat[kolmasI])
    let neljasPaastot = etsiPaastot(toimiAlatJarj, TAtunnuksetJaPaastoarvot, kokoSuomenToimialojenLkmt, kunnantoimialat, neljasI)
    let neljasVerot   = etsiVerot(toimiAlatJarj, kunnantoimialat, neljasI)

    let viidesI = etsiSuurimmanI(toimiAlatJarj, kunnantoimialat, kunnantoimialat[neljasI])
    let viidesPaastot = etsiPaastot(toimiAlatJarj, TAtunnuksetJaPaastoarvot, kokoSuomenToimialojenLkmt, kunnantoimialat, viidesI)
    let viidesVerot   = etsiVerot(toimiAlatJarj, kunnantoimialat, viidesI)
    //let kolmas = etsiSuurin(toimiAlatJarj, kunnantoimialat, toiseksiEniten)
    let enitenTulostus = tulostaToimialat(toimiAlatJarj, kunnantoimialat, enitenI)
    let toiseksiEnitenTulostus = tulostaToimialat(toimiAlatJarj, kunnantoimialat, toiseksiEnitenI)
    let kolmasTulostus = tulostaToimialat(toimiAlatJarj, kunnantoimialat, kolmasI)
    let neljasTulostus = tulostaToimialat(toimiAlatJarj, kunnantoimialat, neljasI)
    let viidesTulostus = tulostaToimialat(toimiAlatJarj, kunnantoimialat, viidesI)

    
    // valintalista kunnista, indeksöi samalla 0->n
  


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
for (let x in jarjestetty) {
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


 const etsiPaikkakunta = (hakusana) => {
   
   haettava = hakusana.target.value
    select = document.getElementById("listaKunnista");
   for (var i = 0; i < select.length; i++){
     var txt = select[i].text
     var include = txt.toLowerCase().startsWith(haettava.toLowerCase());
     select.options[i].style.display = include ? '' : 'none';
   } 

 }

 var asukasLukuI;
 var listaI;

 // ottaa selectistä valuen ja asettaa sen countteriin
 const tulosta = (listaValittu) => {
   
   listaI = listaValittu.target.value
   setToValue(listaI)
  
 }

 // asukasluvut löytyvät taulukosta neljän indeksin välein ([0,4,8,...])
 var asukaslukuInd = 0;

 const Suhdeluku = () => {
   return "suhdelukuhommia"
 }

 const Tietoja = () => {

  return (

    <div>
     <li class="list-group-item">
       <small class="text-muted">Toimialoja eniten: </small> {enitenTulostus} 
     <br></br> <small class="text-muted">Toimialan päästöt kunnalla keskimäärin: </small>{enitenPaastot} 
     <br></br> <small class="text-muted">Toimialan verot kunnalla keskimäärin: </small>{lukupilkuilla(enitenVerot)}</li>

      <li class="list-group-item">
        <small class="text-muted">Toimialoja toiseksi eniten: </small> {toiseksiEnitenTulostus} 
      <br></br> <small class="text-muted">Toimialan päästöt kunnalla keskimäärin: </small> {toinenPaastot}
      <br></br> <small class="text-muted">Toimialan verot kunnalla keskimäärin: </small>{lukupilkuilla(toinenVerot)}</li>

      <li class="list-group-item">
        <small class="text-muted">Toimialoja 3. eniten: </small> {kolmasTulostus} 
      <br></br> <small class="text-muted">Toimialan päästöt kunnalla keskimäärin: </small> {kolmasPaastot}
      <br></br> <small class="text-muted">Toimialan verot kunnalla keskimäärin: </small>{lukupilkuilla(kolmasVerot)}</li>

      <li class="list-group-item">
        <small class="text-muted">Toimialoja 4. eniten: </small> {neljasTulostus} 
      <br></br> <small class="text-muted">Toimialan päästöt kunnalla keskimäärin: </small> {neljasPaastot}
      <br></br> <small class="text-muted">Toimialan verot kunnalla keskimäärin: </small>{lukupilkuilla(neljasVerot)}</li>

      <li class="list-group-item">
        <small class="text-muted">Toimialoja 5. eniten: </small> {viidesTulostus} 
      <br></br> <small class="text-muted">Toimialan päästöt kunnalla keskimäärin: </small> {viidesPaastot}
      <br></br> <small class="text-muted">Toimialan verot kunnalla keskimäärin: </small>{lukupilkuilla(viidesVerot)}</li>

    </div>
  )
 }



 return (
 // Bootstrapin pääcontainer
 <div className="container">	



     <div className="row">
       <div className="col-sm">

         <div>

     <input type="text" className="form-control" id="search" name="search" placeholder="Hae..." onKeyUp={etsiPaikkakunta}/>
         </div>
     
         <select id="listaKunnista"className="form-control" size="30" onChange={tulosta} >

         {nimetJarjestyksessa.map(s => (<option value={asukaslukuInd++}>{s}</option>))} 
         </select>

       </div>

       <div className="col-10">

     

         

         <br />
         <div className="row">
         <div class="col jumbotron">

         <div className="tiedotheader">
           <h4 align="center">{nimetJarjestyksessa[counter]}</h4> 
           
           <img src={vaakunat[counter].image} alt="new" align="center"/>
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

         <li class="list-group-item"><small class="text-muted">Veronalaiset tulot keskimäärin: </small> {veronalaisetTulotKeskimaarin[counter]}<small class="text-muted"> €/vuosi </small> </li>
         <li class="list-group-item"><small class="text-muted">Ansiotulot keskimäärin: </small> {ansioTulotKeskimaarin[counter]}<small class="text-muted"> €/vuosi </small></li>
         <li class="list-group-item"><small class="text-muted">Verot yhteensä keskimäärin: </small> {verotYhteensaKeskimaarin[counter]}<small class="text-muted"> €/vuosi </small></li>
         <li class="list-group-item"><small class="text-muted">Valtionvero keskimäärin: </small> {valtionVeroKeskimaarin[counter]}<small class="text-muted"> €/vuosi </small></li>
         <li class="list-group-item"><small class="text-muted">Kunnallisvero keskimäärin: </small> {kunnallisVeroKeskimaarin[counter]}<small class="text-muted"> €/vuosi </small></li>
         </ul>

         </ul>

         </div>
         </div>


         <div class="row">
    <div class="col jumbotron">


    <div className="btn-group btn-group-sm">
        <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={toPage('tietoja')}>Tietoja</button>
        <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={toPage('suhdeluku')}>Suhdeluku</button>
        </div>

      {content()}

      
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