/*
 * PARTICLE PROTOTYPE 
 * 
 * Particles "observe" the collisions system
 *
 */


// CONSTRUCTOR
export function Particle(sys,x,y,vx,vy,radius,mass,css_class) {
    this.sys = sys; // Collision system
    this.id = sys.__id + "-particle" + ++Particle.counter;
    this.css_class = css_class;
    
    // Position & velocity
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    // Dimensions
    this.radius = radius;
    this.mass = mass;

    // Number of collisions
    this.count = 0;

    // Observe the collision system
    this.sys.__registerParticle(this); 
};

// METHODS
// Physics
Particle.prototype.timeToHit = function(particleB) {
    if (particleB == this) return Infinity;
    let dx = particleB.x - this.x;
    let dy = particleB.y - this.y;
    let dvx = particleB.vx - this.vx;
    let dvy = particleB.vy - this.vy;
    let dvdr = dx*dvx + dy*dvy;
    if (dvdr > 0) return Infinity;
    let dvdv = dvx*dvx + dvy*dvy;
    if (dvdv == 0) return Infinity; 
    let drdr = dx*dx+dy*dy;
    let sigma = particleB.radius + this.radius;
    let d = (dvdr*dvdr) - dvdv * (drdr - sigma*sigma);
    if (d < 0) return Infinity;
    return -(dvdr + Math.sqrt(d)) / dvdv; 
};

Particle.prototype.timeToHitVerticalWall = function(width) {
    if (this.vx == 0) return Infinity;
    if (this.vx > 0) return (width-this.x-this.radius) / this.vx;
    else return ( -this.x+this.radius) / this.vx; 
};

Particle.prototype.timeToHitHorizontalWall = function(height) {
    if (this.vy == 0) return Infinity;
    if (this.vy > 0) return (height-this.y-this.radius) / this.vy;
    else return (-this.y+this.radius) / this.vy; 
};

Particle.prototype.bounceOff = function(particleB) {
    // Newton's second law
    let dx = particleB.x - this.x;
    let dy = particleB.y - this.y;
    let dvx = particleB.vx - this.vx;
    let dvy = particleB.vy - this.vy;
    let dvdr = dx*dvx + dy*dvy;
    let dist = particleB.radius + this.radius; 
    let J = 2 * this.mass * particleB.mass * dvdr /
	((this.mass + particleB.mass) * dist);
    let Jx = J * dx / dist;
    let Jy = J * dy / dist;
    this.vx += Jx / this.mass;
    this.vy += Jy / this.mass;
    particleB.vx -= Jx / particleB.mass;
    particleB.vy -= Jy / particleB.mass;
    this.count++;
    particleB.count++; 
};

Particle.prototype.bounceOffVerticalWall = function() {
    this.vx = -this.vx;
    this.count++;
};

Particle.prototype.bounceOffHorizontalWall = function() {
    this.vy = -this.vy;
    this.count++;
};

Particle.prototype.move = function() {
    let dt = 1; 
    this.x = this.x + this.vx*dt;
    this.y = this.y + this.vy*dt; 
};


// Particle Counter
Particle.counter = 0; 


// Display & Handling
Particle.prototype.draw = function(container_id) {
    // wrap the collision system in a closure
    const handler = () => {
	d3.event.stopPropagation();
	this.sys.removeParticle(d3.event.target.id);
    };
	    
    const border_size = 0.3; 
    d3.select("#"+container_id)
	.append("circle")
	.attr("id",           this.id)
    	.attr("class",        this.css_class)
	.attr("cx",           this.x)
	.attr("cy",           this.y)
	.attr("r",            this.radius*(1-border_size/2))
	.attr("stroke-width", this.radius*border_size)
	.attr("stroke",       "black")
        .on("click",          handler);
};

Particle.prototype.redraw = function() {
    d3.select("#"+this.id)
	.attr("cx",this.x)
	.attr("cy",this.y);
};

Particle.prototype.remove = function() {
    // Unsuscribe the particle from the Collision system
    this.sys.__removeParticle(this);

    // Erase it visually
    d3.select("#"+this.id)
	.remove(); 
};
