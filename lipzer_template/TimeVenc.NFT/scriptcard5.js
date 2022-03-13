import countdown from "./tempoVnft.js";
const tempoParaVencimento = new countdown("06 February 2022 19:19:00 GMT-0300");
const tempos = document.querySelectorAll("[data-time5]");

function mostrartempo(){
    tempos.forEach((tempo, index) => {
        tempo.innerHTML = tempoParaVencimento.total[index]
    });
    
}

mostrartempo();
setInterval(mostrartempo, 1000);
