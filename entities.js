export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.speed = 0.02;
        this.size = 0.5; // Tamaño para colisiones
    }

    update(player, map) {
        if (!this.alive) return;

        // Calcular ángulo hacia el jugador
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // Si está muy cerca, "te mata" (puedes reiniciar posición)
        if (dist < 0.4) {
            alert("¡EL BICHO TE ATRAPÓ!");
            player.x = 1.5;
            player.y = 1.5;
            return;
        }

        // Movimiento simple hacia el jugador
        let moveX = (dx / dist) * this.speed;
        let moveY = (dy / dist) * this.speed;

        // Colisión básica con paredes para el bicho
        if (map.data[Math.floor(this.y) * map.size + Math.floor(this.x + moveX)] === 0) this.x += moveX;
        if (map.data[Math.floor(this.y + moveY) * map.size + Math.floor(this.x)] === 0) this.y += moveY;
    }
}