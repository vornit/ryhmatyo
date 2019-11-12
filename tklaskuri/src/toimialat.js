import React, { useState } from 'react';
import datatoimialatKunnittain from "./toimialatKunnittain2";

// lista eri toimialoista
const toimialalista = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.label


const Toimialat = () => {

    // State joka pitää muistissa indeksiä 
  const [ counter, setCounter ] = useState(0)
  const setToValue = (value) => setCounter(value)
  

  function luoToimialaTaulukko() {

    var taulukko = [];
      for (let key in toimialalista){
        if(key.length == 2){
          taulukko.push(toimialalista[key])
        }
          continue;
        } 
        return taulukko;
    }
    

    function parsiTaulukko(taulukko){

      for(let x in taulukko){
        taulukko[x] = taulukko[x].replace(/^[\s\d]+/, '');
      }
    }
 
    
    var toimialaInd = 0;
    var haettava;
    var select;
    var taulukkoToimialoista = luoToimialaTaulukko();
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
   console.log(listaValittu.target.value)
   
 }




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

              
            <div className="col jumbotron">

            <p>Tietoja toimialasta</p>
            
            <p>JOOOOOOO</p>
            
            <p>JOOOOOOO</p>
            
            <p>JOOOOOOO</p>
            
            <p>JOOOOOOO</p>
            

            </div>


      

            </div>

            <div className="col-6">


             


            <div className="row">
            <div className="col jumbotron">

            <p>JAAAA</p>
            <p>JAAAA</p>
            <p>JAAAA</p>
            <p>JAAAA</p>
            <p>JAAAA</p>

            </div>
            </div>

            <div className="row">




            <div className="col jumbotron">
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-secondary active">
                <input type="radio" name="options" id="option1" autocomplete="off" checked/> Päästöt
                </label>
                <label class="btn btn-secondary">
                <input type="radio" name="options" id="option2" autocomplete="off"/> Suhdeluku
                </label>
                <label class="btn btn-secondary">
                <input type="radio" name="options" id="option3" autocomplete="off"/> Jöö
                </label>
            </div>
            <p>JOOOOO</p>
            <p>Parhaat kunnat toimialalla "{taulukkoToimialoista[counter]}": TÄHÄN KUNTA, JOLLA VÄHITEN PÄÄSTÖJÄ VALITULLA TOIMIALALLA</p>

            </div>
            </div>

            </div>



            

    </div>


    </div>

        );
  }


export default Toimialat;