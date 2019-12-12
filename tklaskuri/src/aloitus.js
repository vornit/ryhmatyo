import React  from 'react';
import FadeIn from 'react-fade-in';
import logo from "./logo.png"






//Pääkomponentti Aloitukselle
const Aloitus = () => {

  
  
  

 
 
 return (
  // Bootstrapin pääcontainer

  
  <FadeIn>

  
  
  <div className="otsikko">   
      <img src={logo} alt="logo" width="30%"/>
      
      <br></br>
      </div>
      <div className="leipa"> 
      <br></br>
      <p> Sovellus on tarkoitettu eri toimialojen veromaksujen, päästöjen ja näistä lasketun hyötysuhteen
      tarkasteluun. Hyötusuhde on laskettu kaavalla:  <br /><em>(toimialan veromaksut koko Suomessa) <hr/> (toimialan päästöt koko Suomessa)</em></p>
      
      Tekijät: Aleksi, Joose, Pertti, Tuomo
      </div>

      
      

    
    </FadeIn>

        );
  }


export default Aloitus;