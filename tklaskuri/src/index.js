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

//console.log(dataPaastot)
//console.log(dataToimialojenVerot)


const lukupilkuilla = (x) => {
  if (x === undefined) return "Ei tiedossa";
  else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


// objektilista kuntien nimistä
const kuntienNimet = data.dataset.dimension["Alue 2019"].category.label
// objektilista asukasluvuista
const pktiedot = data.dataset.value
// objektilista kuntien indekseistä
const kuntienIndeksit = data.dataset.dimension["Alue 2019"].category.index
// vuodet 2005-2017 taulukossa indeksistä 0 alkaen
const veroTietojenVuodet = Object.keys(dataverot.dataset.dimension.Vuosi.category.label)
// objektilista verotietoihin koskevista kategorioista
const verokategoriat = dataverot.dataset.dimension.Tiedot.category.label
// verotiedot taulukossa
const verotiedot = dataverot.dataset.value
// lista eri toimialoista
//const toimialalista = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.label
// toimialojen määrät taulukossa
const toimialojenMaarat = datatoimialatKunnittain.dataset.value
// toimialat ja niitä vastaavat indeksit
const toimialatJaIndeksit = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category




/** Parsii paikkakuntadataa omiin taulukoihin sarakenumeron perusteella.
* @param {number} sarakeNro Paikkakuntadatan sarakenumero; kuntien as. luvut: 0, väkiluvunmuutokset: 1, työasteet: 2, työpaikkojen lkm: 3.
* @returns Taulukko haluttua paikkakuntadataa
*/
function luoPKtaulukko(sarakeNro) {
  var taulukko = [];
  for (let i = sarakeNro, j = 0; i < pktiedot.length; i += 4, j++) {
    taulukko[j] = pktiedot[i];
  }
  return taulukko;
}

/** Parsii verotiedot omaan taulukkoon sarakenumeron perusteella
* @param {number} sarakeNro Verodatan sarakenumero; tulonsaajat: 0, veronalaiset tulot keskimäär: 1, ansiotulot km: 2, verot yhteensä km: 3,
*                                                   valtion vero km: 4, kunnallisvero km: 5.
* @returns Taulukko haluttua verodataa
*/
function luoVeroTaulukko(sarakeNro) {
  var taulukko = [];
  const solujenLkmPerVuosi = Object.keys(kuntienNimet).length * Object.keys(verokategoriat).length
  var verodata2017indeksi = (veroTietojenVuodet.length - 1) * solujenLkmPerVuosi

  for (let i = verodata2017indeksi + sarakeNro, j = 0; i < solujenLkmPerVuosi * veroTietojenVuodet.length; i += 6, j++) {
    taulukko[j] = verotiedot[i];
  }
  return taulukko;
}

/** Parsii sovelluksessa valitun kunnan toimialatiedot yhteen taulukkoon.
* Toimialojen määrät -datasetistä lasketaan oikea aloitusindeksi kunnan indeksin avulla.
* @param {number} kunnanIndeksi Käyttäjän valitseman kunnan indeksi (koko maan toimialat indeksissä 0)
* @param {list} toimialat Lista kaikista toimialoista
* @returns Valitun kunnan toimialojen lukumäärät taulukossa
*/
function parsiKunnanToimialat(kunnanIndeksi, toimialat) {

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



  for (let i = alkuindeksi; i < (alkuindeksi + toimialojenLkm); i++) {
    kunnanToimialojenLkmt.push(toimialojenMaarat[i]);
  }
  return kunnanToimialojenLkmt;

}

/** Etsii toimialan indeksin, jota löytyy eniten valitusta kunnasta.
* Ohittaa parametrina annetun alkion ja sitä suuremmat, jotta funktiota voi käyttää myös
* toiseksi suurimman etsintään (jne).
* @param {list} tAlaNimet Toimialojen nimet järjestetyssä listassa
* @param {array} tAlaLkm Valitun kunnan toimialojen lukumäärät taulukossa
* @param {number} ohita Alkion indeksi, joka ja jota suuremmat ohitetaan
* @returns Suurimman alkion indeksi, pl. ohitetut alkiot
*/
/*function etsiSuurimmanI(tAlaNimet, tAlaLkm, ohita) {
  //console.log(tAlaNimet)
  let suurin = -1
  let suurimmanI = ohita
  for (let i = 0; i < tAlaLkm.length; i++) {
    if (tAlaLkm[i] > tAlaLkm[ohita] || i === ohita) continue;
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

}*/

/** Muotoilee ja palauttaa merkkijonona annettua indeksiä vastaavan toimialan 
* nimen ja lukumäärän.
* @param {list} toimialojenNimet Toimialat ja niiden indeksit listassa avain-arvo pareina.
* @param {array} toimialojenLkm Valitun kunnan toimialojen lukumäärät taulukossa.
* @param {number} i Toimialan indeksi
* @returns Merkkijono muotoa "[toimialan nimi] : [toimialan lkm valitussa kunnassa]"
*/
/*function tulostaToimialat(toimialojenNimet, toimialojenLkm, i) {
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
  return s.substr(s.indexOf(' ') + 1).trim()
  //return toimialojenNimet[i] + " : " + toimialojenLkm[i] + " "
}*/

/** Järjestää annetun datasetin indeksien perusteella suuruusjärjestykseen.
* @param {list} datasetti Lista-pari labeleista ja indekseistä
* @returns Avain-arvo lista indekseistä ja labeleista
*/
function jarjestaIndekseittain(datasetti) {
  var labelit = []
  for (let x in datasetti.label) {
    labelit.push(datasetti.label[x])
  }

  var indeksit = []
  for (let x in datasetti.index) {
    indeksit.push(datasetti.index[x])
  }

  var labelitJaIndeksit = {}
  for (let i = 0; i < Object.keys(datasetti.label).length; i++) {
    let avain = indeksit[i];
    let arvo = labelit[i];
    labelitJaIndeksit[avain] = arvo;
  }

  //toimialat ja niiden indeksit avain-arvo pareina listassa
  let jarjestetty = {};
  // objektilistan järjestys avainarvon eli indeksin mukaan
  Object.keys(labelitJaIndeksit).sort().forEach(function (key) {
    jarjestetty[key] = labelitJaIndeksit[key];
  });
  return jarjestetty

}

/** Parsii jokaisen toimialan päästöt tietyltä vuodelta.
* @param {number} vuodenIndeksi Halutun vuoden indeksi, alkaen 0: 2008, 1: 2009, 2:2010 etc.
* @returns Taulukko toimialojen päästöarvoista (pelkät arvot)
*/
function parsiPaastotVuodelta(vuodenIndeksi) {
  var paastoTaulukko = dataPaastot.dataset.value
  let toimialojenLkm = Object.keys(dataPaastot.dataset.dimension["Toimialat (TOL2008) ja kotitaloudet"].category.label).length
  var vuodenPaastot = []
  let alkuindeksi = vuodenIndeksi * toimialojenLkm

  for (let i = alkuindeksi; i < alkuindeksi + toimialojenLkm; i++) {
    vuodenPaastot.push(paastoTaulukko[i])
  }
  return vuodenPaastot

}

/** Etsii indeksiä vastaavan toimialan päästöarvon, ja laskee toimialan keskimääräiset päästöt
* valitussa kunnassa.
* @param {list} toimialat Lista toimialoista ja niiden indekseistä avain-arvo pareina
* @param {list} toimialojenPaastot Lista-pari toimialojen päästöistä ja niiden indekseistä
* @param {array} toimialojenLkmSuomessa Taulukko toimialojen lukumääristä koko suomessa
* @param {array} toimialojenLkmKunnalla Taulukko toimialojen lukumääristä käyttäjän valitsemassa kunnassa
* @param {number} i Indeksi jolla valitaan haluttu toimiala
* @returns Toimialan keskimääräiset päästöt kunnassa, NaN jos ei saatavilla
*/
function etsiPaastot(toimialojenPaastot, toimialatJaLkmtSuomessa, toimialaJaLkm) {
  //console.log(toimialojenLkmKunnalla)

  let toimialanLkmSuomessa;
  //let toimialanLkmKunnassa = toimialanLkmKunnalla[i]

  //console.log("asd: " +  toimialanLkmKunnassa)
  let toimiala = toimialaJaLkm.toimiala
  //console.log(toimiala)
  let alkutunnus = toimiala.substr(0, toimiala.indexOf(' ')).trim()
  for (let i = 0; i < toimialatJaLkmtSuomessa.length; i++) {
    let tAla = toimialatJaLkmtSuomessa[i].toimiala
    let s = tAla.substr(0, tAla.indexOf(' ')).trim()
    if (alkutunnus === s) toimialanLkmSuomessa = toimialatJaLkmtSuomessa[i].lkm
  }
  let toimialanPaastot = toimialojenPaastot[alkutunnus]
  //console.log(alkutunnus + " : " + toimialanPaastot)
  let toimialanPaastotKM = toimialanPaastot / toimialanLkmSuomessa
  //console.log(alkutunnus + " : " + toimialanPaastotKM)
  //console.log(alkutunnus + " : " + toimialanLkmSuomessa)
  let kokonaisPaastotKunnassa = toimialanPaastotKM * toimialaJaLkm.lkm
  //console.log(alkutunnus + " : " + kokonaisPaastotKunnassa)
  //console.log(kokonaisPaastotKunnassa)
  //console.log("asdf: " +  kokonaisPaastotKunnassa)
  if (isNaN(kokonaisPaastotKunnassa)) return -1
  return kokonaisPaastotKunnassa
}

/** Etsii indeksiä vastaavan toimialan verotiedot, ja laskee toimialan keskimääräiset verotulot
* valitussa kunnassa.
* @param {list} toimialat Lista toimialoista ja niiden indekseistä avain-arvo pareina
* @param {array} toimialojenLkmKunnalla Taulukko toimialojen lukumääristä käyttäjän valitsemassa kunnassa
* @param {number} i Indeksi jolla valitaan haluttu toimiala
* @returns Toimialan keskimääräiset veromaksut kunnassa, NaN jos ei saatavilla
*/

function etsiVerot(toimialaJaLkmKunnalla, kokoSuomenToimialatJaLkmt) {
  let toimialanLkmSuomessa;
  let toimiala = toimialaJaLkmKunnalla.toimiala

  let alkutunnus = toimiala.substr(0, toimiala.indexOf(' ')).trim()
  for (let i = 0; i < kokoSuomenToimialatJaLkmt.length; i++) {
    let tAla = kokoSuomenToimialatJaLkmt[i].toimiala
    let s = tAla.substr(0, tAla.indexOf(' ')).trim()
    if (alkutunnus === s) toimialanLkmSuomessa = kokoSuomenToimialatJaLkmt[i].lkm
  }
  const veroToimialat = dataToimialojenVerot.dataset.dimension.Toimiala.category
  let toimialojenLkm = Object.keys(veroToimialat.label).length
  let toimialojenVeroarvot = dataToimialojenVerot.dataset.value
  let vuoden2017Indeksi = 3
  let solujenLkmPerToimiala = 2
  let aloitusindeksi2017 = toimialojenLkm * vuoden2017Indeksi * solujenLkmPerToimiala
  let toimialojenVerot2017 = []
  for (let j = aloitusindeksi2017; j < aloitusindeksi2017 + toimialojenLkm; j++) {
    toimialojenVerot2017.push(toimialojenVeroarvot[j])
  }

  //console.log(veroToimialat.index[alkutunnus])
  let valitunToimialanIndeksi = aloitusindeksi2017 + veroToimialat.index[alkutunnus] * solujenLkmPerToimiala
  //console.log(valitunToimialanIndeksi)
  let toimialanVerotYhteensa = toimialojenVeroarvot[valitunToimialanIndeksi]
  let toimialanVerotKM = toimialanVerotYhteensa / toimialanLkmSuomessa
  //console.log(alkutunnus + " : " + toimialanVerotKM)
  let toimialanLkm = toimialaJaLkmKunnalla.lkm
  //console.log(alkutunnus + " : " + toimialanLkm)
  let toimialanVerotPerKunta = toimialanLkm * toimialanVerotKM
  //console.log(toimialanVerotPerKunta)
  return toimialanVerotPerKunta
}

function laskeToimialanTiedot(toimialatYhteensaKunnassa, toimialatJaLkmPerKunta, TAtunnuksetJaPaastoarvot, kokoSuomenToimialatJaLkmt) {
  //var indeksi; //etsiSuurimmanI(toimiAlatJarj, kunnantoimialat, -1)
  var toimialanPaastot //= etsiPaastot(toimiAlatJarj, TAtunnuksetJaPaastoarvot, kokoSuomenToimialojenLkmt, kunnantoimialat, indeksi)
  var toimialanVerot //= etsiVerot(toimiAlatJarj, kunnantoimialat, indeksi)
  // var ohita = -1;
  var toimialaTiedot = []
  var suhdelukuKokoSuomi = -1 //jos suhdelukua ei voi laskea

  //let toimialatYhteensaKunnassa = kunnantoimialat[0]

  //console.log(kunnantoimialat)


  for (let i = 0; i < toimialatJaLkmPerKunta.length; i++) {
    let suhdelukuKunta = -1

    //indeksi = etsiSuurimmanI(toimiAlatJarj, kunnantoimialat, ohita)
    //console.log(toimiAlatJarj[indeksi])
    let toimialanLkmKunnassa = toimialatJaLkmPerKunta[i].lkm
    let toimialanOsuusPerKunta = toimialanLkmKunnassa / toimialatYhteensaKunnassa


    //console.log("indeksi" + indeksi)

    toimialanPaastot = etsiPaastot(TAtunnuksetJaPaastoarvot, kokoSuomenToimialatJaLkmt, toimialatJaLkmPerKunta[i])
    //console.log(toimialatJaLkmPerKunta)
    toimialanVerot = etsiVerot(toimialatJaLkmPerKunta[i], kokoSuomenToimialatJaLkmt)
    //console.log(verot)

    if ((!isNaN(toimialanPaastot) && !isNaN(toimialanVerot)) && (toimialanPaastot > 0)) {
      suhdelukuKokoSuomi = toimialanVerot / toimialanPaastot
      suhdelukuKunta = suhdelukuKokoSuomi * toimialanOsuusPerKunta
    }

    //console.log(suhdeluku)
    /*if (suhdeluku < 0){
      ohita = indeksi
      continue;
    }*/

    toimialaTiedot.push({
      toimiala: toimialatJaLkmPerKunta[i].toimiala,
      suhde: suhdelukuKunta,
      lkm: toimialanLkmKunnassa,
      verot: toimialanVerot,
      paastot: toimialanPaastot
    })


    //ohita = indeksi
  }
  //console.log(suhdeluvut)

  return toimialaTiedot
}


function luoToimialatJaLkmt(toimialojenNimet, toimialojenLkmt) {
  //console.log(toimialojenNimet)
  //console.log(toimialojenLkmt)
  let toimialatJaLkmt = []

  for (let i = 0; i < toimialojenLkmt.length; i++) {
    let s = toimialojenNimet[i]
    let alkutunnus = s.substr(0, s.indexOf(' ')).trim()
    //console.log(alkutunnus)
    //console.log(isNaN(parseInt(alkutunnus)))
    if (isNaN(parseInt(alkutunnus)) || alkutunnus.length > 2) continue
    toimialatJaLkmt.push({ toimiala: toimialojenNimet[i], lkm: toimialojenLkmt[i] })
  }

  let jarjestetty = toimialatJaLkmt.sort(function (a, b) {
    return b.lkm - a.lkm;
  });
  //console.log(toimialatJaLkmt)
  return jarjestetty

}


const App = () => {

  const [page, setPage] = useState('paikkakunnat')

  const toPage = (page) => (event) => {
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
          <button type="button" className="btn btn-primary" aria-pressed="true" onClick={toPage('paikkakunnat')}>Paikkakunnat</button>
          <button type="button" className="btn btn-primary" aria-pressed="true" onClick={toPage('toimialat')}>Toimialat</button>

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

  const toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }



  const content = () => {
    if (page === 'tietoja') {
      return <Tietoja />
    } else if (page === 'suhdeluku') {
      return <Suhdeluku />
    }
    else if (page === 'verot') {
      return <Verot />
    }
    else if (page === 'paastot') {
      return <Paastot />
    }
  }




  // State joka pitää muistissa indeksiä 
  const [counter, setCounter] = useState(0)
  const setToValue = (value) => setCounter(value)


  //paikkakuntatiedot parsittuna omiin taulukkoihin
  var kuntienAsLuvut = luoPKtaulukko(0);
  var vlMuutokset = luoPKtaulukko(1);
  var tyoAsteet = luoPKtaulukko(2);
  var tpLukumaarat = luoPKtaulukko(3);


  const vaakunat = datavaakunat.selection1



  var nimiTaulukko = [];
  var kuntienIit = [];
  //var vaakunaTaulukko = [];




  // kuntien nimet taulukkoon
  for (var x in kuntienNimet) {
    nimiTaulukko.push(kuntienNimet[x]);
  }

  var toimialojenNimet = []
  for (let x in toimialatJaIndeksit.label) {
    toimialojenNimet.push(toimialatJaIndeksit.label[x])
  }

  var toimialojenIndeksit = []
  for (let x in toimialatJaIndeksit.index) {
    toimialojenIndeksit.push(toimialatJaIndeksit.index[x])
  }

  var toimiAJaI = {}
  for (let i = 0; i < toimialojenNimet.length; i++) {
    let avain = toimialojenIndeksit[i];
    let arvo = toimialojenNimet[i];
    toimiAJaI[avain] = arvo;
  }

  //toimialat ja niiden indeksit avain-arvo pareina listassa
  const toimiAlatJarj = {};
  // objektilistan järjestys avainarvon eli indeksin mukaan
  Object.keys(toimiAJaI).sort().forEach(function (key) {
    toimiAlatJarj[key] = toimiAJaI[key];
  });

  var toimialatYlaotsikot = []
  for (let i = 0; i < Object.keys(toimiAlatJarj).length; i++) {
    let tAla = toimiAlatJarj[i]
    let alkutunnus = tAla.substr(0, tAla.indexOf(' ')).trim()
    if (isNaN(parseInt(alkutunnus)) || alkutunnus.length > 2) continue
    toimialatYlaotsikot.push(toimiAlatJarj[i])
  }
  //console.log(toimialatYlaotsikot)

  var paastotToimialat = dataPaastot.dataset.dimension["Toimialat (TOL2008) ja kotitaloudet"].category
  //var toimialatJaTunnukset = paastotToimialat.label

  var paastojenToimialatJarj = jarjestaIndekseittain(paastotToimialat)

  var paastotToimialoittain2008 = parsiPaastotVuodelta(0)
  var TAtunnuksetJaPaastoarvot = {}
  for (let i = 0; i < Object.keys(paastojenToimialatJarj).length; i++) {
    let s = paastojenToimialatJarj[i]
    let avain = s.substr(0, s.indexOf(' ')).trim()
    let arvo = paastotToimialoittain2008[i]
    TAtunnuksetJaPaastoarvot[avain] = arvo
  }
  //console.log(TAtunnuksetJaPaastoarvot)


  var kokoSuomenToimialojenLkmt = parsiKunnanToimialat(0, toimiAlatJarj)
  var kokoSuomenToimialatJaLkmt = luoToimialatJaLkmt(toimiAlatJarj, kokoSuomenToimialojenLkmt)
  //console.log(kokoSuomenToimialatJaLkmt)

  //console.log(toimiAlatJarj)
  // käyttäjän valitseman kunnan toimialatiedot taulukossa 
  var kunnantoimialat = parsiKunnanToimialat(counter, toimiAlatJarj);

  var toimialatJaLkmPerKunta = luoToimialatJaLkmt(toimiAlatJarj, kunnantoimialat)
  //console.log(kunnantoimialat)
  var kaikkiTAtiedot = laskeToimialanTiedot(kunnantoimialat[0], toimialatJaLkmPerKunta, TAtunnuksetJaPaastoarvot, kokoSuomenToimialatJaLkmt);
  //console.log(kunnanSuhdeluvut)




  // kuntien indeksit taulukkoon
  for (let x in kuntienIndeksit) {
    kuntienIit.push(kuntienIndeksit[x]);
  }







  var avain;
  var arvo;
  var nimetJaIndeksit = {};


  // valintalista kunnista, indeksöi samalla 0->n



  // kuntien nimet ja indeksit mapitettuna yhteen objektilistaan
  for (var i = 0; i < nimiTaulukko.length; i++) {
    avain = kuntienIit[i];
    arvo = nimiTaulukko[i];
    nimetJaIndeksit[avain] = arvo;
  }

  const jarjestetty = {};
  // objektilistan järjestys avainarvon eli indeksin mukaan
  Object.keys(nimetJaIndeksit).sort().forEach(function (key) {
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
    for (var i = 0; i < select.length; i++) {
      var txt = select[i].text
      var include = txt.toLowerCase().startsWith(haettava.toLowerCase());
      select.options[i].style.display = include ? '' : 'none';
    }

  }

  //var asukasLukuI;
  var listaI;

  // ottaa selectistä valuen ja asettaa sen countteriin
  const tulosta = (listaValittu) => {

    listaI = listaValittu.target.value
    setToValue(listaI)

  }

  // asukasluvut löytyvät taulukosta neljän indeksin välein ([0,4,8,...])
  var asukaslukuInd = 0;

  //alustetaan muuttujat
  var monesko = ""
  var monesko2 = 1
  var lista = []
  var tulostus

  //console.log(toimiAlatJarj)



  const Tietoja = () => {
    monesko = ""
    monesko2 = 1

    let lkmJarj = kaikkiTAtiedot.sort(function (a, b) {
      return b.lkm - a.lkm
    })
    let paastotTulostus

    for (let i = 0; i < lkmJarj.length; i++) {

      if (lkmJarj[i].paastot >= 0) {
        paastotTulostus = lkmJarj[i].paastot.toFixed(0) + " tonnia kasvihuonekaasuja/vuosi"
      }
      else {
        paastotTulostus = "Päästötietoja ei saatavilla"
      }

      let s = lkmJarj[i].toimiala + " : " + lkmJarj[i].lkm
      tulostus = s.substr(s.indexOf(' ') + 1).trim()


      lista.push(<li class="list-group-item">
        <small class="text-muted">Toimialoja {monesko} eniten: </small> {tulostus}<small class="text-muted"> kpl</small>
        <br></br> <small class="text-muted">Toimialan päästöt kunnalla keskimäärin: </small>{paastotTulostus}
        <br></br> <small class="text-muted">Toimialan verot kunnalla keskimäärin: </small>{lukupilkuilla(lkmJarj[i].verot.toFixed(0)) + "€/vuosi"}
      </li>)

      monesko2++
      monesko = monesko2 + "."


    }





    return (
      <div>
        {lista}
      </div>
    )
  }


  const Suhdeluku = () => {

    monesko = ""
    monesko2 = 1

    //lista = []
    let suhdeluvutJarj = kaikkiTAtiedot.sort(function (a, b) {
      return b.suhde - a.suhde
    })

    for (let i = 0; i < suhdeluvutJarj.length; i++) {

      if (suhdeluvutJarj[i].suhde < 0) break;
      /*indeksi = etsiSuurimmanI(toimiAlatJarj, kunnantoimialat, ohita)
      paastot = etsiPaastot(toimiAlatJarj, TAtunnuksetJaPaastoarvot, kokoSuomenToimialojenLkmt, kunnantoimialat, indeksi)
      verot = etsiVerot(toimiAlatJarj, kunnantoimialat, indeksi)*/

      let s = suhdeluvutJarj[i].toimiala
      tulostus = s.substr(s.indexOf(' ') + 1).trim()

      

      lista.push(<li class="list-group-item"><small class="text-muted">{monesko} Paras hyötysuhde: </small> {tulostus}
        <small class="text-muted"> Suhdeluku: </small>{suhdeluvutJarj[i].suhde} </li>)


      monesko2++
      monesko = monesko2 + "."

    }

    //console.log("jaa", kunnanSuhdeluvut)

    //console.log(suhdeluvutJarj)

    //console.log(lista)


    return (
      <div>
        {lista}
      </div>
    )
  }

  const Verot = () => {

    monesko = ""
    monesko2 = 1

    //lista = []
    let verotJarj = kaikkiTAtiedot.sort(function (a, b) {
      return b.verot - a.verot
    })
    let paastotTulostus

    for (let i = 0; i < verotJarj.length; i++) {

      if (verotJarj[i].paastot >= 0) {
        paastotTulostus = verotJarj[i].paastot.toFixed(0) + " tonnia kasvihuonekaasuja/vuosi"
      }
      else {
        paastotTulostus = "Päästötietoja ei saatavilla"
      }

      let s = verotJarj[i].toimiala + " : " + lukupilkuilla(verotJarj[i].verot.toFixed(0)) + "€/vuosi"
      tulostus = s.substr(s.indexOf(' ') + 1).trim()


      lista.push(<li class="list-group-item">
        <small class="text-muted">Veroja {monesko} eniten: </small> {tulostus}
        <br></br> <small class="text-muted">Toimialan lkm kunnalla: </small>{verotJarj[i].lkm + " kpl"}
        <br></br> <small class="text-muted">Toimialan päästöt kunnalla keskimäärin: </small>{paastotTulostus}
      </li>)

      monesko2++
      monesko = monesko2 + "."
    }


    return (
      <div>
        {lista}
      </div>
    )
  }

  const Paastot = () => {
    monesko = ""
    monesko2 = 1

    //lista = []
    let paastotJarj = kaikkiTAtiedot.sort(function (a, b) {
      return b.paastot - a.paastot
    })
    let paastotTulostus

    console.log(paastotJarj)

    for (let i = 0; i < paastotJarj.length; i++) {

      if (!isNaN(paastotJarj[i].paastot)) {
        paastotTulostus = paastotJarj[i].paastot.toFixed(0) + " tonnia kasvihuonekaasuja/vuosi"
      }
      else {
        paastotTulostus = "Päästötietoja ei saatavilla"
      }

      let s = paastotJarj[i].toimiala + " : " + lukupilkuilla(paastotJarj[i].verot.toFixed(0)) + "€/vuosi"
      tulostus = s.substr(s.indexOf(' ') + 1).trim()


      lista.push(<li class="list-group-item">
        <small class="text-muted">Veroja {monesko} eniten: </small> {tulostus}
        <br></br> <small class="text-muted">Toimialan lkm kunnalla: </small>{paastotJarj[i].lkm + " kpl"}
        <br></br> <small class="text-muted">Toimialan päästöt kunnalla keskimäärin: </small>{paastotTulostus}
      </li>)

      monesko2++
      monesko = monesko2 + "."
    }


    return (
      <div>
        {lista}
      </div>
    )
  }


  return (
    // Bootstrapin pääcontainer
    <div className="container">



      <div className="row">
        <div className="col-sm">

          <div>

            <input type="text" className="form-control" id="search" name="search" placeholder="Hae..." onKeyUp={etsiPaikkakunta} />
          </div>

          <select id="listaKunnista" className="form-control" size="30" onChange={tulosta} >

            {nimetJarjestyksessa.map(s => (<option value={asukaslukuInd++}>{s}</option>))}
          </select>

        </div>

        <div className="col-10">






          <div className="row">
            <div class="col jumbotron">

            <div className="row">

              
              <div className="col-md-auto jumboton">
              <ul class="list-group list-group-horizontal list-group-flush">

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

              <div className="col jumbotron tiedotheader">
                <h4>{nimetJarjestyksessa[counter]}</h4>
                <br></br>
                <img src={vaakunat[counter].image} alt="new" />
                
              </div>

              </div>

            </div>
          </div>


          <div class="row">
            <div class="col jumbotron">


              <div className="btn-group btn-group-sm pikkunapit">
                <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={toPage('tietoja')}>Tietoja</button>
                <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={toPage('verot')}>Verot</button>
                <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={toPage('paastot')}>Päästöt</button>
                <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={toPage('suhdeluku')}>Hyötysuhteet</button>
              </div>

              <div class="oikeala">
                {content()}
              </div>


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