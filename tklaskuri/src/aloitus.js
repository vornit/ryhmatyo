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
      
      <p> Sovellus on tarkoitettu eri toimialojen päästöjen, verojen ja näistä lasketun hyötysuhteen
      tarkasteluun. Hyötysuhteet on laskettu kaavalla: <br /><em>(toimialan verotulot koko Suomessa) / (toimialan päästöt koko Suomessa)</em></p>
      <br></br>
      Tekijät: Aleksi, Joose, Pertti, Tuomo
      </div>

      
      

    
    </FadeIn>

        );
  }


export default Aloitus;