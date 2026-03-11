// ------------------- ESCENA INICIO -------------------
class Inicio extends Phaser.Scene {

constructor(){
super("Inicio");
}

preload(){
this.load.image("fondoInicio","fondoInicio.jpg");
this.load.image("boton","boton.jpg");
}

create(){

// fondo de la pantalla de inicio
let fondo = this.add.image(450,300,"fondoInicio");
fondo.setDisplaySize(900,600);

let boton=this.add.image(450,450,"boton")
.setScale(0.5)
.setInteractive();

this.add.text(340,540,"Bienvenidx",{
fontSize:"48px",
color:"#000000"//cambio de color 
});

boton.on("pointerdown",()=>{
this.scene.start("Juego");
});
}
}

// ------------------- ESCENA JUEGO -------------------
class Juego extends Phaser.Scene {

constructor(){
super("Juego");
}

//cambio de nombre de los premios
preload(){

this.load.image("raspado","raspado.jpg");
this.load.image("brush","brush.png");

// fondo del juego
this.load.image("fondojuego","fondojuego.jpg");

this.load.image("pez","pez.png");
this.load.image("estrella","estrella.png");
this.load.image("pino","pino.png");
this.load.image("mano","mano.png");

}

create(){

// ---------------- FONDO ----------------
// se coloca centrado para no alterar coordenadas
this.add.image(450,300,"fondojuego")
.setDisplaySize(900,600)
.setDepth(-1);

// --------------------------------------

this.premios= ["pez","estrella","pino","mano"];

this.resultados=[];
this.tarjetas=[];
this.descubiertas=0;

//moneda que sigue el mouse
this.raspador = this.add.image(0,0,"brush")
.setDisplaySize(60,60)
.setDepth(10);

this.input.on("pointermove",(pointer)=>{

this.raspador.x = pointer.x;
this.raspador.y = pointer.y;

});

// contador circular
this.grafica=this.add.graphics();

this.textoPorcentaje=this.add.text(420,70,"0%",{
fontSize:"28px",
color:"#ffffff"
});

let posiciones = [200,450,700];

// probabilidad de ganar
if(Math.random() < 0.3){

let premio = Phaser.Utils.Array.GetRandom(this.premios);

this.resultados = [premio,premio,premio];

}else{

this.resultados = [

Phaser.Utils.Array.GetRandom(this.premios),
Phaser.Utils.Array.GetRandom(this.premios),
Phaser.Utils.Array.GetRandom(this.premios)

];

}

// crear tarjetas
for(let i=0; i<3; i++){

let premio = this.resultados[i];

// premio debajo del raspado
this.add.image(posiciones[i],350,premio)
.setDisplaySize(200,200);

// capa que se raspa
let rt = this.add.renderTexture(
posiciones[i],
350,
200,
200
);

rt.setOrigin(0.5);
rt.draw("raspado",-100,-100);

this.tarjetas.push({

rt:rt,
porcentaje:0,
descubierta:false

});

}

// lógica de raspado
this.input.on("pointermove",(pointer)=>{

if(pointer.isDown){

this.tarjetas.forEach(t=>{

if(t.descubierta) return;

let localX = pointer.x - (t.rt.x - 100);
let localY = pointer.y - (t.rt.y - 100);

if(localX>0 && localX<200 && localY>0 && localY<200){

t.rt.erase("brush",localX,localY);

// aumento de porcentaje
t.porcentaje = Math.min(t.porcentaje + 0.2, 100);

this.actualizarCirculo(t.porcentaje);

if(t.porcentaje>=100){

t.descubierta=true;

t.rt.clear();

this.descubiertas++;

if(this.descubiertas===3){
this.verificarPremio();
}

}

}

});

}

});

// raspado al hacer click
this.input.on("pointerdown",(pointer)=>{
this.input.emit("pointermove",pointer);
});

}

// contador circular
actualizarCirculo(p){

this.grafica.clear();

this.grafica.lineStyle(10,0x00ff00);

this.grafica.beginPath();

this.grafica.arc(
450,
80,
40,
Phaser.Math.DegToRad(270),
Phaser.Math.DegToRad(270 + p * 3.6),
false
);

this.grafica.strokePath();

this.textoPorcentaje.setText(Math.floor(p)+"%");

}

// verificar premios
verificarPremio(){

let mensaje="";

if(
this.resultados[0]===this.resultados[1] &&
this.resultados[1]===this.resultados[2]
){

mensaje="Ganaste el oro ";

}else{

mensaje="Intenta otra vez";

}

this.add.text(360,200,mensaje,{
fontSize:"40px",
color:"#ffff00"
});

this.botonReiniciar();

}

// boton reiniciar
botonReiniciar(){

let boton=this.add.text(380,520,"Prueba suerte",{

fontSize:"32px",
backgroundColor:"#0051ff",
padding:10

})
.setInteractive();

boton.on("pointerdown",()=>{
this.scene.restart();
});

}

}

// ------------------- CONFIGURACION -------------------

const config={

type:Phaser.AUTO,

width:900,
height:600,

scale:{
mode:Phaser.Scale.FIT,
autoCenter:Phaser.Scale.CENTER_BOTH
},

parent:"game",

scene:[Inicio,Juego]

};

const game = new Phaser.Game(config);

