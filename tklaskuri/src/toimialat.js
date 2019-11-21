import React, { useState } from 'react';
import datatoimialatKunnittain from "./toimialatKunnittain2";
import dataToimialojenVerot from "./toimialojenVerot";
import dataPaastot from "./paastotToimialoittain";



// lista eri toimialoista
const toimialalista = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.label
const toimialaIndeksit = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.index
const toimialojenMaarat = datatoimialatKunnittain.dataset.value
const kuntienIndeksit = datatoimialatKunnittain.dataset.dimension.Kunta.category.index
const kuntienNimet = datatoimialatKunnittain.dataset.dimension.Kunta.category.label

const nimiJaIndeksi = dataToimialojenVerot.dataset.dimension.Toimiala.category.index
const toimialojenNimet = dataToimialojenVerot.dataset.dimension.Toimiala.category.label
const toimialojenVerot = dataToimialojenVerot.dataset.value

const toimialojenPaastot = dataPaastot.dataset.value
const toimialojenPaastotIndeksit = dataPaastot.dataset.dimension["Toimialat (TOL2008) ja kotitaloudet"].category.index;



console.log(datatoimialatKunnittain)
console.log(kuntienIndeksit)

const Toimialat = () => {

    
  const [ counter, setCounter ] = useState(0)
  const setToValue = (value) => setCounter(value)
  
  var enitenKunnassa = [];
  var kuntienNimetTop = [];
  var kunnanAvain = [];
  var verotaulukko = [];
  var alataulukko = [];
  var maarataulukko = [];
  var kuntienToimialaLkm = [];
  var paastotaulukko = [];
  var toimialojenAvaimet = [];
  var kunnanNimiIndeksi;

  function toimialanPaikkakunnat(counter) {
    var haettavaIndeksi = parseInt(toimialojenAvaimet[counter])
    var ekaToimialanArvo = toimialaIndeksit[haettavaIndeksi]

    var toimialojenLkm = Object.keys(toimialalista).length
    
    for (let i = ekaToimialanArvo; i < toimialojenMaarat.length; i = (i+toimialojenLkm)){
      
      kuntienToimialaLkm.push(toimialojenMaarat[i]);
    }
    etsiIsoin();
    kunnanNimiIndeksi = haeAvain(kuntienIndeksit, enitenKunnassa[1])
    
  }

  function haeAvain(lista, value){
  	return Object.keys(lista).find(key => lista[key] === value);
  }

  function etsiIsoin(){
    
    var suurin = 0;
    var maxIndex = 0;

    for (let i = 0; i < kuntienToimialaLkm.length; i++){
    	enitenKunnassa.push(i);
    	if(enitenKunnassa.length > 5){
    		enitenKunnassa.sort(function(a,b) { return kuntienToimialaLkm[b] - kuntienToimialaLkm[a];});
    		enitenKunnassa.pop();
    	}
    }
       
  }
  
      
  function luoTaulukot() {
    
    for (let key in toimialalista){
      if(key.length == 2){

        toimialojenAvaimet.push(key)
        alataulukko.push(toimialalista[key])
        maarataulukko.push(toimialojenMaarat[toimialaIndeksit[key]])
        paastotaulukko.push(toimialojenPaastot[toimialojenPaastotIndeksit[key]])
        if (toimialojenVerot[nimiJaIndeksi[key]] == null){
          
          verotaulukko.push("Ei tiedossa")
        } 
        else {
          
         verotaulukko.push(toimialojenVerot[nimiJaIndeksi[key]])
        }
      } 

    }           
    
    return alataulukko;
  }

    function parsiTaulukko(taulukko){

      for(let x in taulukko){
        taulukko[x] = taulukko[x].replace(/^[\s\d]+/, '');
      }
    }

    var toimialaInd = 0;
    var haettava;
    var select;
    var taulukkoToimialoista = luoTaulukot();
    parsiTaulukko(taulukkoToimialoista);
    
    

    const etsiToimiala = (hakusana) => {
   
   haettava = hakusana.target.value
   select = document.getElementById("listaToimialoista");
   for (var i = 0; i < select.length; i++){
     var txt = select[i].text
     var include = txt.toLowerCase().startsWith(haettava.toLowerCase());
     select.options[i].style.display = include ? '' : 'none';
     
   }
 }
 
 
   const tulostaToimiala = (listaValittu) => {
   
   setToValue(listaValittu.target.value)
 
 }

  toimialanPaikkakunnat(counter)

 function lukupilkuilla(x) {
  if (x == undefined) return "Ei tiedossa";
  else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
 
 return (
  // Bootstrapin pääcontainer
  <div className="container">   
  
      <div className="row">
            <div className="col-sm">
              
              <div>
              <input type="text" id="search" className="form-control" name="search" placeholder="Hae..." onKeyUp={etsiToimiala}/>
              </div>
          
              <select id="listaToimialoista"className="form-control" size="30" onChange={tulostaToimiala} >
                
              {taulukkoToimialoista.map(s => (<option value={toimialaInd++}>{s}</option>))}
              </select>


            </div>

            <div className="col-6">


            <div className="row">
            <div className="col jumbotron">



            <p>eniten paikkakunta: {kuntienNimet[kunnanNimiIndeksi]} LKM: {kuntienToimialaLkm[kuntienIndeksit[kunnanNimiIndeksi]]}</p>



            <ul class="list-group">

      <li class="list-group-item"><small class="text-muted">Toimialan kokonaispäästöt: </small>{lukupilkuilla(paastotaulukko[counter])}</li>
      <li class="list-group-item"><small class="text-muted">Toimialojen kokonaislukumäärä: </small> {lukupilkuilla(maarataulukko[counter])}</li>
      <li class="list-group-item"> <small class="text-muted">Toimialan verot yhteensä: </small> {lukupilkuilla(verotaulukko[counter])}%</li>
      <li class="list-group-item"> <small class="text-muted">eniten paikkakunta: </small> {kuntienNimet[kunnanNimiIndeksi]} LKM: {kuntienToimialaLkm[kuntienIndeksit[kunnanNimiIndeksi]]}</li>    
            </ul>

            

            
            </div>
            </div>

            <div className="row">




            <div className="col jumbotron">

            <div className="btn-group btn-group-sm">
                <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={console.log('tietoja')}>Tietoja</button>
                <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={console.log('suhdeluku')}>Suhdeluku</button>
              </div>

            <p></p>

            <p>Parhaat kunnat toimialalla "{taulukkoToimialoista[counter]}": TÄHÄN KUNTA {kuntienNimet[haeAvain(kuntienIndeksit, enitenKunnassa[1])]} , JOLLA VÄHITEN PÄÄSTÖJÄ VERRATTUNA TULOIHIN 
              VALITULLA TOIMIALALLA</p>


            </div>
            </div>

            </div>



            

    </div>


    </div>

        );
  }


export default Toimialat;