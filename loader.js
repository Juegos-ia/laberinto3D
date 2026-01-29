// loader.js
export class Assets {
    constructor() {
        this.textures = {};
        this.loaded = false;
    }

    // Método para cargar todas tus texturas
    async loadAll() {
        const sources = {
            wall: 'assets/wall.png',    // Tu textura de pared
            floor: 'assets/floor.png',  // Tu textura de suelo
            ceiling: 'assets/ceiling.png' // Tu textura de techo
        };

        const promises = Object.keys(sources).map(key => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = sources[key];
                img.onload = () => {
                    this.textures[key] = img;
                    resolve();
                };
                // Si la imagen falla (no existe aún), creamos una de reemplazo
                img.onerror = () => {
                    console.warn(`No se halló ${sources[key]}, usando textura provisoria.`);
                    this.textures[key] = this.createDummyTexture();
                    resolve();
                };
            });
        });

        await Promise.all(promises);
        this.loaded = true;
    }

    // Crea una textura de 16x16 color magenta para que sepas que falta el PNG
    createDummyTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff00ff'; // Magenta (clásico de error de textura)
        ctx.fillRect(0, 0, 16, 16);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(0, 0, 16, 16);
        return canvas;
    }
}