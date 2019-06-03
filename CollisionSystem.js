/*
 * COLLISION SYSTEM PROTOTYPE
 */
import { PriorityQueue } from './PriorityQueue.js'; 
import { Event } from './Event.js'; 

// CONSTUCTOR
export function CollisionSystem(particles, wall) {
    this.particles = particles;
    this.pq = new PriorityQueue(5*Math.pow(particles.length,2));
    this.t = 0; 
    this.wall = wall;

    for (var i=0; i<this.particles.length; i++) {
	this.predict(particles[i]); 
    }
}


// METHODS
CollisionSystem.prototype.simulate = function() {
    this.t++; 

    while (!this.pq.min().isValid()) {
	this.pq.delMin();
    }

    var test = 0; 
    while ( this.pq.min().t < this.t &&
	    this.pq.min().isValid() ) {
	console.log(test++); 
	var nextEvent = this.pq.delMin();
	var a = nextEvent.particleA;
	var b = nextEvent.particleB;
	if (a != null && b == null) a.bounceOffVerticalWall();
	if (a == null && b != null) b.bounceOffHorizontalWall();
	if (a != null && b != null) a.bounceOff(b);
	this.predict(a);
	this.predict(b); 
    }
    this.redraw();
}

CollisionSystem.prototype.predict = function(particle) {
    if (particle == null) return;
    for (var i=0; i<this.particles.length; i++) {
	var dt = particle.timeToHit(this.particles[i]); 
	if(dt != Infinity){
	    var event = new Event(this.t + dt, particle, this.particles[i]);
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
