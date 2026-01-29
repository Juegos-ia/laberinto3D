// linterna.js
export class Linterna {
    constructor() {
        this.flicker = 0;
    }

    draw(ctx, canvas) {
        // Creamos un pequeño parpadeo aleatorio
        this.flicker = Math.random() * 0.07;

        // Creamos un gradiente radial (un círculo de luz)
        // Los parámetros son: (x centro, y centro, radio interno, x centro, y centro, radio externo)
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, canvas.height * 0.1, 
            canvas.width / 2, canvas.height / 2, canvas.height * 0.8
        );

        // Centro transparente (donde hay luz)
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        // Borde negro (oscuridad total) con el parpadeo
        gradient.addColorStop(1, `rgba(0,0,0,${0.95 + this.flicker})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}