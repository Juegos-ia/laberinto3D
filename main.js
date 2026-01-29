// main.js - CAPÍTULO 1: EL LABERINTO
import { Enemigo } from './bicho.js';
import { Llave } from './llave.js';
import { MAPS } from './mapa.js';
import { Linterna } from './linterna.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const currentMap = MAPS.nivel1;

// Estado del Jugador
const player = {
    x: currentMap.spawnPlayer.x,
    y: currentMap.spawnPlayer.y,
    dir: 0,
    fov: Math.PI / 3,
    speed: 0.05,
    rotSpeed: 0.05
};

// Variables de Control
let juegoTerminado = false; // Para el susto
let zBuffer = new Array(canvas.width).fill(0);
const keys = {};

// Instancias de objetos
const linterna = new Linterna();
const bicho = new Enemigo(10.5, 10.5); // Aparece en el centro del mapa 20x20

// Función para poner la llave en un lugar aleatorio vacío
function getPosLibre(map) {
    let x, y;
    do {
        x = Math.floor(Math.random() * map.size);
        y = Math.floor(Math.random() * map.size);
    } while (map.data[y * map.size + x] !== 0);
    return { x: x + 0.5, y: y + 0.5 };
}

const posLlave = getPosLibre(currentMap);
const llave = new Llave(posLlave.x, posLlave.y);

// --- GESTIÓN DE AUDIO ---
const musicaFondo = new Audio('assets/ambiente.mp3');
musicaFondo.loop = true;
musicaFondo.volume = 0.2;

function iniciarAudio() {
    musicaFondo.play().catch(() => {});
    window.removeEventListener('keydown', iniciarAudio);
    window.removeEventListener('mousedown', iniciarAudio);
}
window.addEventListener('keydown', iniciarAudio);
window.addEventListener('mousedown', iniciarAudio);

// --- INPUTS ---
window.onkeydown = (e) => { keys[e.key.toLowerCase()] = true; };
window.onkeyup = (e) => { keys[e.key.toLowerCase()] = false; };

// --- LÓGICA ---
function update() {
    if (juegoTerminado) return; // Si moriste o ganaste, no te mueves

    // Velocidad (Shift para correr)
    let vel = keys['shift'] ? 0.09 : player.speed;
    let nextX = player.x;
    let nextY = player.y;

    if (keys['w'] || keys['arrowup']) {
        nextX += Math.cos(player.dir) * vel;
        nextY += Math.sin(player.dir) * vel;
    }
    if (keys['s'] || keys['arrowdown']) {
        nextX -= Math.cos(player.dir) * vel;
        nextY -= Math.sin(player.dir) * vel;
    }
    if (keys['a'] || keys['arrowleft']) player.dir -= player.rotSpeed;
    if (keys['d'] || keys['arrowright']) player.dir += player.rotSpeed;

    // Colisión simple con el mapa
    if (currentMap.data[Math.floor(nextY) * currentMap.size + Math.floor(nextX)] === 0) {
        player.x = nextX;
        player.y = nextY;
    }

    // Actualizar objetos
    llave.update(player);
    
    // Si el bicho nos atrapa, activamos jumpscare
    if (bicho.update(player, currentMap)) {
        juegoTerminado = true;
        setTimeout(() => { location.reload(); }, 1500); // Reiniciar tras el susto
        return;
    }

    // Condición de Victoria: Tener llave y estar en la salida
    if (llave.recogida) {
        let dx = player.x - currentMap.exit.x;
        let dy = player.y - currentMap.exit.y;
        let distSalida = Math.sqrt(dx * dx + dy * dy);

        if (distSalida < 0.6) {
            juegoTerminado = true; // Bloqueamos el juego
            alert("¡LLAVE ENCONTRADA! Escapando a la Oficina...");
            // REDIRECCIÓN AL CAPÍTULO 2
            window.location.href = "../Capitulo2_Oficina/index.html";
        }
    }
}

// --- RENDERIZADO ---
function render() {
    // Si perdimos, dibujar textura de jumpscare a pantalla completa
    if (juegoTerminado && !llave.recogida) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (bicho.imgLoaded) {
            ctx.drawImage(bicho.img, 0, 0, canvas.width, canvas.height);
        }
        return;
    }

    // Dibujar Suelo y Techo
    ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, canvas.width, canvas.height/2);
    ctx.fillStyle = "#101010"; ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);

    // Raycasting de Paredes
    for (let i = 0; i < canvas.width; i++) {
        const rayAngle = (player.dir - player.fov / 2) + (i / canvas.width) * player.fov;
        let dist = 0;
        let hit = false;
        
        while (!hit && dist < 25) {
            dist += 0.05;
            let tx = Math.floor(player.x + Math.cos(rayAngle) * dist);
            let ty = Math.floor(player.y + Math.sin(rayAngle) * dist);
            
            if (tx < 0 || tx >= currentMap.size || ty < 0 || ty >= currentMap.size) {
                hit = true; dist = 25;
            } else if (currentMap.data[ty * currentMap.size + tx] === 1) {
                hit = true;
                let correctedDist = dist * Math.cos(rayAngle - player.dir);
                zBuffer[i] = correctedDist;
                let wallH = canvas.height / correctedDist;
                let col = Math.max(0, 190 - (correctedDist * 10));
                ctx.fillStyle = `rgb(${col},${col},${col})`;
                ctx.fillRect(i, (canvas.height - wallH)/2, 1, wallH);
            }
        }
    }

    // Dibujar Sprites (Bicho y Llave)
    llave.draw(ctx, player, canvas, zBuffer);
    bicho.draw(ctx, player, canvas, zBuffer);

    // Dibujar Efecto de Linterna
    linterna.draw(ctx, canvas);

    // Indicador de Llave
    if (llave.recogida) {
        ctx.fillStyle = "gold";
        ctx.font = "20px Arial";
        ctx.fillText("OBJETIVO: VE A LA SALIDA", 20, 40);
    }
}

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

loop();