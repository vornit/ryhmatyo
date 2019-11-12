import React from 'react';
import datatoimialatKunnittain from "./toimialatKunnittain2";

// lista eri toimialoista
const toimialalista = datatoimialatKunnittain.dataset.dimension.Toimiala2008.category.label



const Toimialat = () => {


  
    function luoToimialaTaulukko() {
      var taulukko = [];
        for (let key in toimialalista){
          taulukko.push(toimialalista[key])
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
    console.log(taulukkoToimialoista)
    const etsiToimiala = (hakusana) => {
   
   haettava = hakusana.target.value
   console.log(haettava)
   select = document.getElementById("listaToimialoista");
   for (var i = 0; i < select.length; i++){
     var txt = select[i].text
     var include = txt.toLowerCase().startsWith(haettava.toLowerCase());
     select.options[i].style.display = include ? '' : 'none';
     
   }
 }
 
 
   var listaI;
   const tulosta = (listaValittu) => {
   
   listaI = listaValittu.target.value
   //console.log(listaIndex)
   
   //asetaMuutosArvo(listaI)
   
   console.log(listaI)
   
   //console.log(kunnantoimialat)
 }




 return (
  // Bootstrapin pääcontainer
  <div className="container">   
  
  
  
      <div className="row">
        <div className="col-sm">
           
          <div>
      <input type="text" id="search" name="search" placeholder="Hae..." onKeyUp={etsiToimiala}/>
          </div>
      
          <select id="listaToimialoista"className="form-control" size="28" onChange={tulosta} >
             
          {taulukkoToimialoista.map(s => (<option value={toimialaInd++}>{s}</option>))}
          </select>
  
        </div>
    </div>
    </div>
        );
  }


export default Toimialat;