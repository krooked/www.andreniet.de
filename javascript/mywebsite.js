/*
 * Personal website of André Niet
 * hello@andreniet.de 
 * Modified to use boid agents for animation with fading trails
 */

/* Boid class */
class Boid {
    constructor(x, y) {
        this.position = { x, y };
        this.velocity = {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1
        };
        this.acceleration = { x: 0, y: 0 };
        this.maxForce = 0.2;
        this.maxSpeed = 3;
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.velocity.x = Math.min(Math.max(this.velocity.x, -this.maxSpeed), this.maxSpeed);
        this.velocity.y = Math.min(Math.max(this.velocity.y, -this.maxSpeed), this.maxSpeed);
        this.acceleration = { x: 0, y: 0 };
    }

    align(boids) {
        let perceptionRadius = 50;
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.x += other.velocity.x;
                steering.y += other.velocity.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            let mag = Math.hypot(steering.x, steering.y);
            steering.x = (steering.x / mag) * this.maxSpeed;
            steering.y = (steering.y / mag) * this.maxSpeed;
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            steering.x = Math.min(Math.max(steering.x, -this.maxForce), this.maxForce);
            steering.y = Math.min(Math.max(steering.y, -this.maxForce), this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 50;
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.x += other.position.x;
                steering.y += other.position.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            steering.x -= this.position.x;
            steering.y -= this.position.y;
            let mag = Math.hypot(steering.x, steering.y);
            steering.x = (steering.x / mag) * this.maxSpeed;
            steering.y = (steering.y / mag) * this.maxSpeed;
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            steering.x = Math.min(Math.max(steering.x, -this.maxForce), this.maxForce);
            steering.y = Math.min(Math.max(steering.y, -this.maxForce), this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = 50;
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
            if (other != this && d < perceptionRadius) {
                let diff = {
                    x: this.position.x - other.position.x,
                    y: this.position.y - other.position.y
                };
                diff.x /= d;
                diff.y /= d;
                steering.x += diff.x;
                steering.y += diff.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            let mag = Math.hypot(steering.x, steering.y);
            steering.x = (steering.x / mag) * this.maxSpeed;
            steering.y = (steering.y / mag) * this.maxSpeed;
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            steering.x = Math.min(Math.max(steering.x, -this.maxForce), this.maxForce);
            steering.y = Math.min(Math.max(steering.y, -this.maxForce), this.maxForce);
        }
        return steering;
    }

    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        
        this.acceleration.x += alignment.x + cohesion.x + separation.x;
        this.acceleration.y += alignment.y + cohesion.y + separation.y;
    }

    edges(width, height) {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }
}

/* Website */
const Website = {
    initWebsite() {
        this.initCanvas();
        document.body.classList.add('show');
    },

    initCanvas() {
        const canvas = document.querySelector('canvas');
        canvas.width = window.innerWidth + 100;
        canvas.height = window.innerHeight + 100;
        const ctx = canvas.getContext("2d");
        
        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 1;
        ctx.globalCompositeOperation = 'destination-out';

        const boids = Array.from({ length: 50 }, () => new Boid(Math.random() * canvas.width, Math.random() * canvas.height));

        let pauseDrawing = false;

        const draw = () => {
            if (pauseDrawing) return;

            ctx.strokeStyle = 'rgba(51, 51, 51, 0.3)';
            ctx.lineWidth = Math.floor(Math.random() * 3) + 1;
            
            for (let boid of boids) {
                boid.flock(boids);
                boid.update();
                boid.edges(canvas.width, canvas.height);

                ctx.beginPath();
                ctx.arc(boid.position.x, boid.position.y, 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();
            }
        }

        const onWindowResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.fillStyle = "#333";
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        };

        document.getElementById("toggle_drawing_button").addEventListener("click", () => pauseDrawing = !pauseDrawing);

        setInterval(draw, 25);
        // window.addEventListener('resize', onWindowResize);
    }
};

window.onload = () => Website.initWebsite();