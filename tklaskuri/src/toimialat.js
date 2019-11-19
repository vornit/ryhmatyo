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




const Toimialat = () => {

console.log(datatoimialatKunnittain)
    
  const [ counter, setCounter ] = useState(0)
  const setToValue = (value) => setCounter(value)
  

  var verotaulukko = [];
  var alataulukko = [];
  var maarataulukko = [];
  var paastotaulukko = [];

  function luoTaulukot() {
    
    for (let key in toimialalista){
      if(key.length == 2){
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
            
            </div>
            </div>

            <div className="row">




            <div className="col jumbotron">

            <div className="btn-group btn-group-sm">
                <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={console.log('tietoja')}>Tietoja</button>
                <button type="button" className="btn btn-secondary" aria-pressed="true" onClick={console.log('suhdeluku')}>Suhdeluku</button>
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