// bicho.js
export class Enemigo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 0.04; 
        this.img = new Image();
        this.img.src = 'assets/descarga.jpg'; // Esta es la misma textura del bicho
        this.imgLoaded = false;
        this.img.onload = () => this.imgLoaded = true;
        this.img.onerror = () => this.imgLoaded = false;

        this.sonidoSusto = new Audio('assets/Sonidos de gritos.mp3');
        this.sonidoSusto.volume = 1.0; 
    }

    update(player, map) {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // Si el bicho te toca
        if (dist < 0.3) {
            this.sonidoSusto.play().catch(() => {});
            return true; // <-- AVISAMOS QUE TE ATRAPÓ
        }

        let moveX = (dx / dist) * this.speed;
        let moveY = (dy / dist) * this.speed;

        if (map.data[Math.floor(this.y) * map.size + Math.floor(this.x + moveX)] === 0) {
            this.x += moveX;
        }
        if (map.data[Math.floor(this.y + moveY) * map.size + Math.floor(this.x)] === 0) {
            this.y += moveY;
        }
        return false;
    }

    draw(ctx, player, canvas, zBuffer) {
        let dx = this.x - player.x;
        let dy = this.y - player.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx) - player.dir;
        while (angle < -Math.PI) angle += Math.PI * 2;
        while (angle > Math.PI) angle -= Math.PI * 2;

        if (Math.abs(angle) < player.fov) {
            let screenX = (0.5 * (angle / (player.fov / 2)) + 0.5) * canvas.width;
            let h = canvas.height / dist;
            let ix = Math.floor(screenX);
            if (ix >= 0 && ix < canvas.width && zBuffer[ix] > dist) {
                if (this.imgLoaded) {
                    ctx.drawImage(this.img, screenX - h/2, (canvas.height - h)/2, h, h);
                } else {
                    ctx.fillStyle = "red";
                    ctx.fillRect(screenX - h/4, (canvas.height - h)/2, h/2, h);
                }
            }
        }
    }
}