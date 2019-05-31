/*
 * PARTICLE PROTOTYPE 
 */


// CONSTRUCTOR
function Particle(id,x,y,vx,vy,radius,mass) {
    this.id = id;

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
}

// METHODS
// Physics
Particle.prototype.timeToHit = function(particleB) {
    if (particleB == this) return Infinity;
    var dx = particleB.x - this.x;
    var dy = particleB.y - this.y;
    var dvx = particleB.vx - this.vx;
    var dvy = particleB.vy - this.vy;
    var dvdr = dx*dvx + dy*dvy;
    if (dvdr > 0) return Infinity;
    var dvdv = dvx*dvx + dvy*dvy;
    var drdr = dx*dx+dy*dy;
    var sigma = particleB.radius + this.radius;
    var d = (dvdr*dvdr) - dvdv * (drdr - sigma*sigma);
    if (d < 0) return Infinity;
    return -(dvdr + Math.sqrt(d)) / dvdv; 
}

Particle.prototype.timeToHitVerticalWall = function(wall) {
    if (this.vx == 0) return Infinity;
    if (this.vx > 0) return (wall.x2-this.x-this.radius) / this.vx;
    else return (wall.x1 - this.x+this.radius) / this.vx; 
}

Particle.prototype.timeToHitHorizontalWall = function(wall) {
    if (this.vy == 0) return Infinity;
    if (this.vy > 0) return (wall.y2-this.y-this.radius) / this.vy;
    else return (wall.y1 - this.y+this.radius) / this.vy; 
}

Particle.prototype.bounceOff = function(particleB) {
    // Newton's second law
    var dx = particleB.x - this.x;
    var dy = particleB.y - this.y;
    var dvx = particleB.vx - this.vx;
    var dvy = particleB.vy - this.vy;
    var dvdr = dx*dvx + dy*dvy;
    var dist = particleB.radius + this.radius; 
    var J = 2 * this.mass * particleB.mass * dvdr /
	((this.mass + particleB.mass) * dist);
    var Jx = J * dx / dist;
    var Jy = J * dy / dist;
    this.vx += Jx / this.mass;
    this.vy += Jy / this.mass;
    particleB.vx -= Jx / particleB.mass;
    particleB.vy -= Jy / particleB.mass;
    this.count++;
    particleB.count++; 
}

Particle.prototype.bounceOffVerticalWall = function() {
    this.vx = -this.vx;
    this.count++;
}

Particle.prototype.bounceOffHorizontalWall = function() {
    this.vy = -this.vy;
    this.count++;
}

Particle.prototype.move = function() {
    var dt = 1; 
    this.x = this.x + this.vx*dt;
    this.y = this.y + this.vy*dt; 
}


// display
Particle.prototype.draw = function() {
    d3.select("#"+this.id)
	.attr("cx",this.x)
	.attr("cy",this.y);
}



