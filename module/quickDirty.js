// not to be include 
//               0 1  2  3 4 5 6 7 8 9 10
let SuccessTab=[-1,0,-1,-1,1,1,2,2,3,3,4]
// -1, Rien, 0 : Menace, 1 : Prix,  2 : une réussite, 3 : 2 Réussites, 4: 2 réussite et une carte

function SortieTexte(nbCard=0, nbSucces = 0, nbPrix = 0, nbMenaces =0, options={mode : 1}) {
    // retourne le texte Html correspondant au résultat du jet, en fonction du mode (pour l'instant 1)
    if(options.mode == undefined) {options.mode = 1};
    switch(options.mode){
        case 1: 
            return "Resultat, Success :" + nbSucces + "("+ nbCard+ " Cartes), Prix :" + nbPrix +", Menace :"+ nbMenaces+"<br>";
        case 2: // plus évolué 
            let RetText = "" ; let TextCmpl = "";
            if (nbSucces > 0) {
                if(nbMenaces > 0){
                    RetText = "<h1>Réussite avec menaces</h1>"
                    TextCmpl = "Vous avez aussi "+nbMenaces+" qui vous gênent."
                } 
                else RetText = "<h1>Réussite</h1>"
                if(nbCard>0) RetText += "<strong><i>Vous avez gagné un carte, pensez à la tirer!</i></strong><br>"
                if(nbPrix > 0) TextCmpl += ".<br>Vous disposez, en contre partie de menaces, de "+nbPrix+" Succès potentiels, les prendrez-vous ?<br>"
                RetText +="Vous avez "+nbSucces+" Choix disponible à votre tour."+TextCmpl+"<br>"; TextCmpl = "";
            } else if(nbPrix > 0)   {
                if(nbMenaces > 0){
                    RetText = "<h1>Juste raté avec menaces</h1>Vous avez "+nbMenaces+" menaces qui plannent sur votre tour.<br>"
                } else RetText = "<h1>Presque réussi</h1>"
                RetText += "Vous disposez, en contre partie de menaces, de "+nbPrix+" Succès potentiels, les prendrez-vous ?<br>"
            } else { // ici l'echec commence
                if(nbMenaces > 0){
                    RetText = "<h1>Raté avec menaces</h1>Vous avez "+nbMenaces+" menaces qui plannent sur votre tour.<br>Le MJ vous indiquera la conséquence de cet echec.<br>"
                } else RetText = "<h1>Echec simple</h1> Ce que vous avez entrepris n'arrive pas à se produire. Le MJ vous indiquera la conséquence de cet echec.<br>"
            }
            return RetText;
    }

}

function CalculResultat(val1=0, val2=3) {
// calcul la réussite avec des dés 6 et des dés 10 : le min est les D10, le max est le D6 
let D10 =  Math.min(val1,val2); // le minimum est le nombre de D10
let D6 = Math.max(val1,val2);
D6 = D6 - D10; // le reste est en D6
let R = new Roll(D10 + "D10+"+ D6+"D6");
R.evaluate({async :false });
// Forme de terms (array(3)) contient trois membre chacun avecs D10 et D6 resultat
console.log("Resultat",R);
let D6r = R.terms[2].results; // le tableau de résultat D6
let D10r = R.terms[0].results; // le trableau de résultat D10
let Rr = []; // tableau des résultats
for(let i = 0; i < D10; i++) {
    Rr.push(D10r[i].result);
}
for(let i = 0; i < D6; i++) {
    Rr.push(D6r[i].result);
}
console.log("Resultat Eval :",Rr);
//--- 
let Success = 0; let Menace = 0; let Prix = 0; let t = -1; let cardT = 0;
for(let i = 0; i < (D6+D10); i++) {
    t = SuccessTab[Rr[i]];
    switch(t) {
        case 0: Menace++;
            break;
        case 1: Prix++;
            break;
        case 4 :
            cardT++;
            t--; // pas de break
        default:
            Success += (t-1);
            break;
    }
}
let monTexte = SortieTexte(cardT, Success, Prix, Menace, { mode : 1})
//let speak = obj._uid?game.actors.get(obj._uid).name: ChatMessage.getSpeaker();
  let chatData = {
      user: game.user._id,
//      speaker: speak,
      flavor: monTexte,
      rollMode: game.settings.get("core", "rollMode"),
//      roll: R
  };
 R.toMessage(chatData);
}

//CalculResultat(2,3);
// combat CàC
CalculResultat(_token.actor.system.attributes.FOR.value,_token.actor.system.attributes.CMP.Combattant.value);