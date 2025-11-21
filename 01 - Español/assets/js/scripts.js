
document.addEventListener("DOMContentLoaded", () => {
    const cuadricula = document.querySelector(".cuadricula");
    const doodler = document.createElement("div");
    let terminoElJuego = false;
    let velocidad = 3;
    let conteoDePlataformas = 5;
    let plataformas = [];
    let puntaje = 0;
    let espacioIzquierdoDoodler = 50;
    let puntoDeInicio = 150;
    let espacioInferiorDoodler = puntoDeInicio;
    const gravedad = 0.9;
    let temporizadorAscendenteID;
    let temporizadorDescendenteID;
    let estaSaltando = true;
    let vaALaIzquierda = false;
    let vaALaDerecha = false;
    let temporizadorIzquierdoID;
    let temporizadorDerechoID;

    class Plataforma {
        constructor(nuevaPlataformaBaja) {
            this.izquierda = Math.random() * 315;
            this.abajo = nuevaPlataformaBaja;
            this.visual = document.createElement("div");
            
            const visual = this.visual;
            visual.classList.add("plataforma");
            visual.style.left = this.izquierda + "px";
            visual.style.bottom = this.abajo + "px";
            cuadricula.appendChild(visual); 
        }
    }

    function crearPlataformas() {
        for (let i = 0; i < conteoDePlataformas; i++) {
            let brechaDePlataforma = 600 / conteoDePlataformas;
            let nuevaPlataformaBaja = 100 + i * brechaDePlataforma;
            let nuevaPlataforma = new Plataforma(nuevaPlataformaBaja);
            plataformas.push(nuevaPlataforma);
            console.log(plataformas);
        }
    }

    function moverPlataformas() {
        if (espacioInferiorDoodler > 200) {
            plataformas.forEach(plataforma => {
                plataforma.abajo -= 4;
                let visual = plataforma.visual;
                visual.style.bottom = plataforma.abajo + "px";

                if (plataforma.abajo < 10) {
                    let primeraPlataforma = plataformas[0].visual;
                    primeraPlataforma.classList.remove("plataforma");
                    plataformas.shift();
                    console.log(plataformas);
                    puntaje++;
                    var nuevaPlataforma = new Plataforma(600);
                    plataformas.push(nuevaPlataforma);
                }
            })
        }
    }

    function crearDoodler() {
        cuadricula.appendChild(doodler);
        doodler.classList.add("doodler");
        espacioIzquierdoDoodler = plataformas[0].izquierda;
        doodler.style.left = espacioIzquierdoDoodler + "px";
        doodler.style.bottom = espacioInferiorDoodler + "px";
    }

    function caida() {
        estaSaltando = false;
        clearInterval(temporizadorAscendenteID);
        temporizadorDescendenteID = setInterval(function () {
            espacioInferiorDoodler -= 5;
            doodler.style.bottom = espacioInferiorDoodler + "px";
            if (espacioInferiorDoodler <= 0) {
                finDelJuego();
            }
            plataformas.forEach(plataforma => {
                if (
                    (espacioInferiorDoodler >= plataforma.abajo) &&
                    (espacioInferiorDoodler <= (plataforma.abajo + 15)) &&
                    ((espacioIzquierdoDoodler + 60) >= plataforma.izquierda) &&
                    (espacioIzquierdoDoodler <= (plataforma.izquierda + 85)) &&
                    !estaSaltando 
                ) {
                    console.log("Tick");
                    puntoDeInicio = espacioInferiorDoodler;
                    saltar();
                    console.log("Inciar", puntoDeInicio);
                    estaSaltando = true;
                }
            });
        }, 20);
    }

    function saltar() {
        clearInterval(temporizadorDescendenteID);
        estaSaltando = true;
        temporizadorAscendenteID = setInterval(function () {
            console.log(puntoDeInicio);
            console.log("1", espacioInferiorDoodler);
            espacioInferiorDoodler += 20;
            doodler.style.bottom = espacioInferiorDoodler + "px";
            console.log("2", espacioInferiorDoodler);
            console.log("s", puntoDeInicio);
            if (espacioInferiorDoodler > (puntoDeInicio + 200)) {
                caida();
                estaSaltando = false;
            }
        }, 30);
    }

    function moverIzquierda() {
        if (vaALaDerecha) {
            clearInterval(temporizadorDerechoID);
            vaALaDerecha = false;
        }
        vaALaIzquierda = true;
        temporizadorIzquierdoID = setInterval(function () {
            if (espacioIzquierdoDoodler >= 0) {
                console.log("Va a la Izquierda");
                espacioIzquierdoDoodler -=5;
                doodler.style.left = espacioIzquierdoDoodler + "px";
            } else moverDerecha();
        }, 20);
    }

    function moverDerecha() {
        if (vaALaIzquierda) {
            clearInterval(temporizadorIzquierdoID);
            vaALaIzquierda = false;
        }
        vaALaDerecha = true;
        temporizadorDerechoID = setInterval(function () {
            if (espacioIzquierdoDoodler <= 313) {
                console.log("Va a la Derecha");
                espacioIzquierdoDoodler += 5;
                doodler.style.left = espacioIzquierdoDoodler + "px"; 
            } else moverIzquierda();
        }, 20);
    }

    function moverRecto() {
        vaALaIzquierda = false;
        vaALaDerecha = false;
        clearInterval(temporizadorIzquierdoID);
        clearInterval(temporizadorDerechoID);
    }

    // Asignar Funciones a Códigos de Teclas - Assign Functions To keyCodes
    function control(e) {
        doodler.style.bottom = espacioInferiorDoodler + "px";
        if (e.key === "ArrowLeft") {
            moverIzquierda();
        } else if (e.key === "ArrowRight") {
            moverDerecha();
        } else if (e.key === "ArrowUp") {
            moverRecto();
        }
    }

    function finDelJuego() {
        terminoElJuego = true;
        while (cuadricula.firstChild) {
            console.log("remove");
            cuadricula.removeChild(cuadricula.firstChild);
        }
        cuadricula.innerHTML = puntaje;
        clearInterval(temporizadorAscendenteID);
        clearInterval(temporizadorDescendenteID);
        clearInterval(temporizadorIzquierdoID);
        clearInterval(temporizadorDerechoID);
    }

    function iniciar() {
        if (!terminoElJuego) {
            crearPlataformas();
            crearDoodler();
            setInterval(moverPlataformas, 30);
            saltar(puntoDeInicio);
            document.addEventListener("keyup", control);
        }
    }

    iniciar();

});
