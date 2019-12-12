import React, { useState, Component } from 'react';
import datatoimialatKunnittain from "./toimialatKunnittain2";
import dataToimialojenVerot from "./toimialojenVerot";
import dataPaastot from "./paastotToimialoittain";
import FadeIn from 'react-fade-in';
import toPage from './index';

// asetetaan dataa jsoneista muuttujiin

const toimialalista = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.label
const toimialaIndeksit = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.index
const toimialojenMaarat = datatoimialatKunnittain.dataset.value
const kuntienIndeksit = datatoimialatKunnittain.dataset.dimension.Kunta.category.index
const kuntienNimet = datatoimialatKunnittain.dataset.dimension.Kunta.category.label

const nimiJaIndeksi = dataToimialojenVerot.dataset.dimension.Toimiala.category.index
//const toimialojenNimet = dataToimialojenVerot.dataset.dimension.Toimiala.category.label
const toimialojenVerot = dataToimialojenVerot.dataset.value

const toimialojenPaastot = dataPaastot.dataset.value
const toimialojenPaastotIndeksit = dataPaastot.dataset.dimension["Toimialat (TOL2008) ja kotitaloudet"].category.index;



//console.log(datatoimialatKunnittain)

//Pääkomponentti toimialoille
const Toimialat = () => {

  // Counter pitää tiedossa valitun toimialan indeksin
  const [counter, setCounter] = useState(0)
  const setToValue = (value) => setCounter(value)

  //iso läjä listoja
  var enitenKunnassa = [];
  // var kuntienNimetTop = [];
  //var kunnanAvain = [];
  var verotaulukko = [];
  var alataulukko = [];
  var maarataulukko = [];
  var kuntienToimialaLkm = [];
  var paastotaulukko = [];
  var toimialojenAvaimet = [];
  //var toimialojenVerotuloKA = [];
  //var toimialojenPaastotKA = [];
  //var kuntienToimialaSL = [];
  var toimialaSL = [];
  var kunnanNimiAvain;
  var kuntienKaikkiToimialat = [];
  var toimialojenLkm = Object.keys(toimialalista).length
  var toimialojenSLtaulukko = [];



  /*Jokaisen kunnan kaikki toimialat ovat peräkkäin listassa ositettuna 
  (n kpl koko suomen toimialoja, n kpl seuraavan kunnan toimialoja...)
  Saadaksesi kunnan x kaikki toimialat, aloita ensimmäisestä kyseisen toimialan indeksistä
  ja hyppää toimialojen lukumäärän verran eteenpäin. 
  */
  function toimialanPaikkakunnat(counter) {
    var haettavaIndeksi = toimialojenAvaimet[counter]
    var ekaToimialanArvo = toimialaIndeksit[haettavaIndeksi]

    for (let i = ekaToimialanArvo; i < toimialojenMaarat.length; i = (i + toimialojenLkm)) {

      kuntienToimialaLkm.push(toimialojenMaarat[i])
    }

    etsiEniten();
    kunnanNimiAvain = haeAvain(kuntienIndeksit, enitenKunnassa[1])

  }

  //laskee toimialoille suhdeluvut
  function jarjestaToimialojenSL() {
    for (let i = 0; i < verotaulukko.length; i++) {
      toimialojenSLtaulukko[i] = {slIndeksi: i, suhde: (verotaulukko[i]/paastotaulukko[i])}
      if (isNaN(toimialojenSLtaulukko[i].suhde)) {
        toimialojenSLtaulukko[i].suhde = 0;
        continue;
      }
      //toimialaSL[i] = { slIndeksi: i, suhde: toimialojenSLtaulukko[i] }

    }
    console.log("toimialojensltaulukko " , toimialojenSLtaulukko)
    let suhdeluvutJarj = toimialojenSLtaulukko
    console.log("suhdeluvut epäjärj " ,suhdeluvutJarj)
    suhdeluvutJarj.sort(function (a, b) {
      return b.suhde - a.suhde;
    })
    for(let i = 0; i < suhdeluvutJarj.length; i++){
      if(suhdeluvutJarj[i].suhde == 0){
        suhdeluvutJarj.splice(i, suhdeluvutJarj.length - i)
        break;
      }
    }
    
    console.log("suhdeluvut jarj " , suhdeluvutJarj)
    return suhdeluvutJarj;
  }

  //Annetaan value, jolle etsitään ja palautetaan sitä vastaava key
  function haeAvain(lista, value) {

    return Object.keys(lista).find(key => lista[key] === value);

  }

  //Hakee jokaisen kunnan toimialojen määrän listaan. Kokomaa = 0, Akaa = 1...
  function KunnanKaikkiToimialatLkm() {

    for (let key in kuntienIndeksit) {

      kuntienKaikkiToimialat[kuntienIndeksit[key]] = toimialojenMaarat[(toimialojenLkm * kuntienIndeksit[key])]

    }


  }

  //pitää järjestettyä listaa eniten valittua toimialaa sisältävien kuntien indekseistä
  function etsiEniten() {

    //    var suurin = 0;
    //   var maxIndex = 0;

    for (let i = 0; i < kuntienToimialaLkm.length; i++) {

      enitenKunnassa.push(i);
      enitenKunnassa.sort(function (a, b) { return kuntienToimialaLkm[b] - kuntienToimialaLkm[a]; });

    }

    KunnanKaikkiToimialatLkm();
  }


  //Luo ison läjän keyn mukaan indeksöityjä listoja
  //listasta valittaessa saadaan samalla indeksillä muista listoista oikeita arvoja
  function luoTaulukot() {

    for (let key in toimialalista) {
      if (key.length === 2) {
        
        toimialojenAvaimet.push(key)
        alataulukko.push(toimialalista[key])
        maarataulukko.push(toimialojenMaarat[toimialaIndeksit[key]])
        paastotaulukko.push(toimialojenPaastot[toimialojenPaastotIndeksit[key]])
        if (toimialojenVerot[nimiJaIndeksi[key]] == null) {

          verotaulukko.push("Ei tiedossa")
        }
        else {

          verotaulukko.push(toimialojenVerot[nimiJaIndeksi[key]])
        }
        
      }
    }

    return alataulukko;
  }
  //Korvaa toimialojen nimissä olevat numerot ja alun välit tyhjällä
  function parsiTaulukko(taulukko) {

    for (let x in taulukko) {
      taulukko[x] = taulukko[x].replace(/^[\s\d]+/, '');
    }
  }

  var toimialaInd = 0;
  var haettava;
  var select;
  var taulukkoToimialoista = luoTaulukot();
  parsiTaulukko(taulukkoToimialoista);

  //Hakupalkki, joka vertaa hakupalkin sisältöä select -listan sisältöön ja näyttää vain matchaavat
  const etsiToimiala = (hakusana) => {

    haettava = hakusana.target.value
    select = document.getElementById("listaToimialoista");
    for (var i = 0; i < select.length; i++) {
      var txt = select[i].text
      var include = txt.toLowerCase().startsWith(haettava.toLowerCase());
      select.options[i].style.display = include ? '' : 'none';

    }
  }



  //asettaa countteriin valitun indeksin, josta sitä voi sitten käyttää kaikkialla
  const tulostaToimiala = (listaValittu) => {
    setToValue(listaValittu.target.value)

  }

  //tämä pitää olla täällä, koska counter
  toimialanPaikkakunnat(counter)

  var suhdeluvutJarj = jarjestaToimialojenSL();
  console.log(suhdeluvutJarj)

  var mediaaniIndeksi = Math.floor(suhdeluvutJarj.length / 2)
  console.log("mediaaniindeksi ", mediaaniIndeksi)
  // jakaa hienosti regexillä luvut kolmen sarjoihin
  function lukupilkuilla(x) {
    if (x === undefined) return "Ei tiedossa";
    else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  let paastoTulostus = "Ei tiedossa";
  if (lukupilkuilla(paastotaulukko[counter]) !== "Ei tiedossa") {
    paastoTulostus = lukupilkuilla(paastotaulukko[counter]) + " tonnia/vuosi";
  }
  let veroTulostus = "Ei tiedossa";
  if (lukupilkuilla(verotaulukko[counter]) !== "Ei tiedossa") {
    veroTulostus = lukupilkuilla(verotaulukko[counter]) + " €/vuosi";
  }
  let sijaTulostus = "Ei tiedossa";
  if (toimialojenSLtaulukko[counter] !== "Ei tiedossa"){
    for ( let i = 0; i < suhdeluvutJarj.length; i++){
      if (suhdeluvutJarj[i].slIndeksi == counter){
        sijaTulostus = i + 1;
      }
    }
  }
  let mediaaniTulostus = "";
  if (toimialojenSLtaulukko[counter] !== "Ei tiedossa" && sijaTulostus !== "Ei tiedossa"){
    for (let i = 0; i < suhdeluvutJarj.length; i++){
      if (suhdeluvutJarj[i].slIndeksi == counter){
        mediaaniTulostus = (suhdeluvutJarj[i].suhde/suhdeluvutJarj[suhdeluvutJarj.length/2].suhde).toFixed(2) + "% mediaanista"
      }
    }
  }


  const Maara = () => {
    let monesko = "";
    let monesko2 = 1;
    var lista = [];

    for (let i = 1; i < enitenKunnassa.length; i++) {

      let kunta = kuntienNimet[haeAvain(kuntienIndeksit, enitenKunnassa[i])]
      if (kuntienToimialaLkm[enitenKunnassa[i]] === 0) {
        break;
      }
      lista.push(<li class="list-group-item"><small class="text-muted">{monesko} Eniten paikkakunnalla: </small> {kunta}
        <small class="text-muted"> Määrä: </small>{kuntienToimialaLkm[enitenKunnassa[i]]} </li>)

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

    let monesko = "";
    let monesko2 = 1;
    var lista = [];

    for (let i = 0; i < suhdeluvutJarj.length; i++) {

      let prosentti = suhdeluvutJarj[i].suhde / suhdeluvutJarj[mediaaniIndeksi].suhde
      let kunta = kuntienNimet[haeAvain(kuntienIndeksit, suhdeluvutJarj[i].kunnanindeksi)]
      if (typeof suhdeluvutJarj[0].suhde === 'undefined') {
        lista.push(<li class="list-group-item"><small class="text-muted"> Ei voida laskea </small></li>)
        break;
      }
      
      prosentti *= 100
      if (prosentti < 100) {
        prosentti = ((100 / prosentti) - 1) * 100
        prosentti *= -1 
        prosentti = prosentti.toFixed(2)
        prosentti += "% pienempi kuin mediaani"
      }

      else if (prosentti > 100) {
        prosentti -= 100
        prosentti = prosentti.toFixed(2)
        prosentti += "% korkeampi kuin mediaani"
      }

      else {
        prosentti = "Mediaani"
      }

      lista.push(<li class="list-group-item"><small class="text-muted">{monesko} Paras hyötysuhde: </small> {kunta}
        <small class="text-muted">: </small>{prosentti} </li>)

      monesko2++
      monesko = monesko2 + "."

    }

    return (
      <div>
        {lista}
      </div>
    )
  }

  const [page, setPage] = useState('maara')

  const toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }



  const content = () => {
    if (page === 'suhdeluku') {
      return <Suhdeluku />
    } else if (page === 'maara') {
      return <Maara />
    }
  }

  return (
    // Bootstrapin pääcontainer
    <FadeIn>
      <div className="container">



        <div className="row">
          <div className="col-sm">

            <div>
              <input type="text" id="search" className="form-control" name="search" placeholder="Hae..." onKeyUp={etsiToimiala} />
            </div>

            <select id="listaToimialoista" className="form-control" size="30" onChange={tulostaToimiala} >

              {taulukkoToimialoista.map(s => (<option value={toimialaInd++}>{s}</option>))}
            </select>


          </div>

          <div className="col-6">


            <div className="row">
              <div className="col jumbotron">

                <ul class="list-group">

                  <li class="list-group-item"><small class="text-muted">Toimialan kokonaispäästöt: </small>{paastoTulostus}</li>
                  <li class="list-group-item"><small class="text-muted">Toimialojen kokonaislukumäärä: </small> {lukupilkuilla(maarataulukko[counter])} kpl</li>
                  <li class="list-group-item"> <small class="text-muted">Toimialan verot yhteensä: </small> {veroTulostus}</li>
                  <li class="list-group-item"> <small class="text-muted">Toimialaa eniten paikkakunnalla: </small> {kuntienNimet[kunnanNimiAvain]} Lkm: {kuntienToimialaLkm[kuntienIndeksit[kunnanNimiAvain]]} kpl</li>
                  <li class="list-group-item"> <small class="text-muted">Toimialan sijoitus ekologisuuden mukaan: </small> {sijaTulostus}. / 86. {mediaaniTulostus}</li>

                </ul>

              </div>
            </div>

            <div className="row">

              <div className="col jumbotron">

                <div className="btn-group btn-group-sm">
                  <button type="button" className="btn btn-secondary pikku2" aria-pressed="true" onClick={toPage('maara')}>Määrä</button>
                  <button type="button" className="btn btn-secondary pikku2" aria-pressed="true" onClick={toPage('suhdeluku')}>Suhdeluku</button>
                </div>
                <div>
                  <div class="oikeala2">
                    {content()}
                  </div>
                </div>
                <p></p>

              </div>
            </div>

          </div>
        </div>

      </div>
    </FadeIn>

  );
}


export default Toimialat;
