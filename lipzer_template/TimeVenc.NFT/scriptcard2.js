import countdown from "./tempoVnft.js";
const tempoParaVencimento = new countdown("28 january 2022 22:19:00 GMT-0300");
const tempos = document.querySelectorAll("[data-time2]");

function mostrartempo(){
    tempos.forEach((tempo, index) => {
        tempo.innerHTML = tempoParaVencimento.total[index]
    });
}
mostrartempo();
setInterval(mostrartempo, 1000);

