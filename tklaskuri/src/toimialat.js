import React, { useState } from 'react';
import datatoimialatKunnittain from "./toimialatKunnittain2";
import dataToimialojenVerot from "./toimialojenVerot";
import dataPaastot from "./paastotToimialoittain";

// lista eri toimialoista
const toimialalista = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.label
const toimialaIndeksit = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.index
const toimialojenMaarat = datatoimialatKunnittain.dataset.value

const nimiJaIndeksi = dataToimialojenVerot.dataset.dimension.Toimiala.category.index
const toimialojenNimet = dataToimialojenVerot.dataset.dimension.Toimiala.category.label
const toimialojenVerot = dataToimialojenVerot.dataset.value

const toimialojenPaastot = dataPaastot.dataset.value
const toimialojenPaastotIndeksit = dataPaastot.dataset.dimension["Toimialat (TOL2008) ja kotitaloudet"].category.index;


console.log(datatoimialatKunnittain)
const Toimialat = () => {

//console.log(verotaulukko)
    // State joka pitää muistissa indeksiä 
  const [ counter, setCounter ] = useState(0)
  const setToValue = (value) => setCounter(value)
  

  var verotaulukko = [];
  var alataulukko = [];
  var maarataulukko = [];
  var value = [];
  var paastotaulukko = [];
  var toimialojenAvaimet = [];

  function toimialanPaikkakunnat(toimiala) {

    var toimialaInt = parseInt(toimiala)
    var toimialojenLkm = Object.keys(toimialalista).length
    console.log(toimialojenLkm)
    for (let i = toimialaInt; i < toimialojenMaarat.length; i = (i+toimialojenLkm)){
      value.push(toimialojenMaarat[i]);
    }
    
  }

  function etsiIsoin(){
    var enitenKunnassa = [];
    var kunnanAvain = [];
    var suurin = 0;
    var maxIndex = 0;

    for(let i = 1; i < value.length; i++){
      if(value[i] > suurin){
        maxIndex = i;
        suurin = value[i];
        if(enitenKunnassa.length < 5){
          enitenKunnassa.push(suurin)
          kunnanAvain.push(maxIndex)
        }
        if(enitenKunnassa.length == 5){
          enitenKunnassa[4] = enitenKunnassa[3]
          enitenKunnassa[3] = enitenKunnassa[2]
          enitenKunnassa[2] = enitenKunnassa[1]
          enitenKunnassa[1] = enitenKunnassa[0]
          enitenKunnassa[0] = suurin

          kunnanAvain[4] = kunnanAvain[3]
          kunnanAvain[3] = kunnanAvain[2]
          kunnanAvain[2] = kunnanAvain[1]
          kunnanAvain[1] = kunnanAvain[0]
          kunnanAvain[0] = maxIndex

        }
        
      }
      
      console.log("eniten kunnassa " + enitenKunnassa)
      console.log("kunnan avain " + kunnanAvain)
    }

  }

  function luoTaulukot() {
   // var toimialojenLkm = Object.keys(toimialat).length
    for (let key in toimialalista){
      if(key.length == 2){

     //   for (let i = key; i < toimialojenLkm; ()) {
      //    value.push(toimialojenMaarat[i]);
       // }
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
   toimialanPaikkakunnat(listaValittu.target.value)
   etsiIsoin(listaValittu.target.value)
   
   
 }


 function lukupilkuilla(x) {
  if (x == undefined) return "Ei tiedossa";
  else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
  console.log("maarataulukko 1 " + maarataulukko)

 return (
  // Bootstrapin pääcontainer
  <div className="container">   
  
      <div className="row">
            <div className="col-sm">
              
              <div>
              <input type="text" id="search" name="search" placeholder="Hae..." onKeyUp={etsiToimiala}/>
              </div>
          
              <select id="listaToimialoista"className="form-control" size="20 " onChange={tulostaToimiala} >
                
              {taulukkoToimialoista.map(s => (<option value={toimialaInd++}>{s}</option>))}
              </select>

              
           


      

            </div>

            <div className="col-6">


             


            <div className="row">
            <div className="col jumbotron">

            <p>Toimialan kokonaispäästöt: {lukupilkuilla(paastotaulukko[counter])}</p>
            <p>Toimialojen kokonaislukumäärä: {lukupilkuilla(maarataulukko[counter])}</p>
            <p>Toimialan verot yhteensä: {lukupilkuilla(verotaulukko[counter])} €</p>
            <p>value[counter]</p>
            
            </div>
            </div>

            <div className="row">




            <div className="col jumbotron">
              <div className="btn-group btn-group-toggle" data-toggle="buttons">
             <label class="btn btn-secondary active">
              <input type="radio" name="options" id="option1" autoComplete="off" checked/> Päästöt                  </label>
              <label class="btn btn-secondary">
              <input type="radio" name="options" id="option2" autoComplete="off"/> Suhdeluku
              </label>
              <label class="btn btn-secondary">
              <input type="radio" name="options" id="option3" autoComplete="off"/> Jöö
              </label>
            </div>
            <p>JOOOOO</p>

            <p>Parhaat kunnat toimialalla "{taulukkoToimialoista[counter]}": TÄHÄN KUNTA, JOLLA VÄHITEN PÄÄSTÖJÄ VERRATTUNA TULOIHIN 
              VALITULLA TOIMIALALLA</p>


            </div>
            </div>

            </div>



            

    </div>


    </div>

        );
  }


export default Toimialat;