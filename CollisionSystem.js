/*
 * COLLISION SYSTEM PROTOTYPE
 */


// CONSTUCTOR
function CollisionSystem(particles, wall) {
    this.particles = particles;
    this.pq = new PriorityQueue(2*Math.pow(particles.length,2));
    this.t = 0; 
    this.wall = wall;

    for (var i=0; i<this.particles.length; i++) {
	this.predict(particles[i]); 
    }
}


// METHODS
CollisionSystem.prototype.simulate = function() {
    this.t++; 
    while(!this.pq.min().isValid()){
	this.pq.delMin();
    };
    var nextEvent = this.pq.min(); 
    if (nextEvent.t > this.t) {
	this.redraw();
    } else {
	var a = nextEvent.particleA;
	var b = nextEvent.particleB;
	if (a != null && b == null) a.bounceOffVerticalWall();
	if (a == null && b != null) b.bounceOffHorizontalWall();
	if (a != null && b != null) a.bounceOff(b);
	this.predict(a);
	this.predict(b); 
	this.redraw(); 
    }
}

CollisionSystem.prototype.predict = function(particle) {
    if (particle == null) return;
    for (var i=0; i<this.particles.length; i++) {
	var dt = particle.timeToHit(particles[i]); 
	if(dt != Infinity){
	    var event = new Event(this.t + dt, particle, particles[i]);
	    this.pq.insert(event);
	}
    }
    var dt = particle.timeToHitVerticalWall(this.wall);
    if (dt != Infinity) {
	var event = new Event(this.t + dt, particle, null); 
	this.pq.insert(event);
    }
    dt = particle.timeToHitHorizontalWall(this.wall);
    if (dt != Infinity) {
	var event = new Event(this.t + dt, null, particle);
	this.pq.insert(event); 
    }
}

CollisionSystem.prototype.redraw = function() {
    for (var i=0; i<this.particles.length; i++) {
	this.particles[i].move();
	this.particles[i].draw(); 
    }
}
