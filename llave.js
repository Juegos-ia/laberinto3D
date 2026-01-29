// llave.js
export class Llave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.recogida = false;
        this.img = new Image();
        this.img.src = 'assets/llave.jpg';
        this.imgLoaded = false;
        this.img.onload = () => this.imgLoaded = true;
        this.floatOffset = 0;
    }

    update(player) {
        if (this.recogida) return false;
        this.floatOffset = Math.sin(Date.now() / 200) * 0.1;
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        if (Math.sqrt(dx * dx + dy * dy) < 0.4) {
            this.recogida = true;
            return true;
        }
        return false;
    }

    draw(ctx, player, canvas, zBuffer) {
        if (this.recogida) return;
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
                    ctx.drawImage(this.img, screenX - h/4, (canvas.height - h/2)/2 + (this.floatOffset * h), h/2, h/2);
                } else {
                    ctx.fillStyle = "gold";
                    ctx.fillRect(screenX - h/8, (canvas.height - h/4)/2, h/4, h/4);
                }
            }
        }
    }
}