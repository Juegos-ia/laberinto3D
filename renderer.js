// Cargar texturas
const wallTex = new Image();
wallTex.src = 'assets/wall.png'; 

function render() {
    // 1. Dibujar Suelo y Techo con color sólido (o podrías usar gradientes)
    ctx.fillStyle = "#050505"; // Techo casi negro
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
    ctx.fillStyle = "#1a120c"; // Suelo tierra oscura
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    const fov = Math.PI / 3;
    const rayCount = canvas.width;

    for (let i = 0; i < rayCount; i++) {
        const rayAngle = (player.dir - fov / 2) + (i / rayCount) * fov;
        let dist = 0;
        let hit = false;
        let step = 0.02; // Paso más fino para mayor precisión de textura

        while (!hit && dist < 15) {
            dist += step;
            let tx = Math.floor(player.x + Math.cos(rayAngle) * dist);
            let ty = Math.floor(player.y + Math.sin(rayAngle) * dist);

            if (map.data[ty * map.size + tx] === 1) {
                hit = true;
                
                // --- CÁLCULO DE TEXTURA ---
                let hitX = player.x + Math.cos(rayAngle) * dist;
                let hitY = player.y + Math.sin(rayAngle) * dist;
                
                // Determinar si el impacto fue horizontal o vertical para el offset
                let texOffset = (hitX % 1 + hitY % 1); // Simplificado
                let wallX = texOffset * wallTex.width; 

                let correctedDist = dist * Math.cos(rayAngle - player.dir);
                let wallHeight = canvas.height / correctedDist;
                let yPos = (canvas.height - wallHeight) / 2;

                // Dibujar la "tira" de la textura
                ctx.drawImage(
                    wallTex, 
                    wallX % wallTex.width, 0, 1, wallTex.height, // Fuente (1px de ancho)
                    i, yPos, 1, wallHeight                      // Destino
                );

                // --- EFECTO DE TERROR (NIEBLA) ---
                // Dibujamos un rectángulo negro encima con opacidad según distancia
                let opacity = Math.min(1, correctedDist / 10); 
                ctx.fillStyle = `rgba(0,0,0,${opacity})`;
                ctx.fillRect(i, yPos, 1, wallHeight);
            }
        }
    }
}