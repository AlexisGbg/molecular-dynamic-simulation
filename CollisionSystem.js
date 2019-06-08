/*
 * COLLISION SYSTEM PROTOTYPE
 *
 * Contains the following API:
 * - simulate: increments the time by one unit.  
 * - addParticle: add one particle to the system (if possible)
 * - removeParticle: remove a particle
 *
 * ====COMMENTS====
 * The variable prefix __ is used to simulate 
 * the private keyword
 * 
 */

import { PriorityQueue } from './PriorityQueue.js'; 
import { Event } from './Event.js'; 
import { Particle } from './Particle.js'; 

// CONSTUCTOR
function CollisionSystem(container_id, n_particles) {
    this.__id = container_id;
    this.__width = document.getElementById(container_id)
	.viewBox
	.baseVal
	.width;
    this.__height = document.getElementById(container_id)
	.viewBox
	.baseVal
	.height;
    this.__particle_radius = Math.min(this.__height, this.__width) * 0.05; 
    
    this.__particles = Array();
    this.__pq = new PriorityQueue(2*Math.pow(n_particles,2));
    this.__t = 0; 

    this.__generateParticles(n_particles);
    this.__setHandling(); 
};


// API 
CollisionSystem.prototype.simulate = function() {
    this.__t++; 

    // Remove invalid events
    while (!this.__pq.min().isValid()) {
	this.__pq.delMin();
    }

    // Execute mature events
    while ( this.__pq.min().t < this.__t &&
	    this.__pq.min().isValid() ) {
	var nextEvent = this.__pq.delMin();
	var a = nextEvent.particleA;
	var b = nextEvent.particleB;
	if (a != null && b == null) a.bounceOffVerticalWall();
	if (a == null && b != null) b.bounceOffHorizontalWall();
	if (a != null && b != null) a.bounceOff(b);
	this.__predict(a);
	this.__predict(b); 
    }
    this.__redraw();
};

CollisionSystem.prototype.addParticle = function(css_class, x, y, size) {
    if (!(size >= 1 || size <= 100)) return;  
    const radius = this.__particle_radius * size; 
    const mass = radius; 
    
    // Don't add the particle if it overlaps another element
    for (let particle of this.__particles) {
	let dx = particle.x - x;
	let dy = particle.y - y;
	let d = Math.sqrt(dx*dx+dy*dy);
	if (d < particle.radius + radius) {
	    return; 
	}
    }

    // Instanciate the new particle
    let particle = new Particle(
	this, x, y,
	(Math.random()*radius - radius/2)*0.1,
	(Math.random()*radius - radius/2)*0.1,
	radius,
	mass,
	css_class);
    
    
    // Draw it
    particle.draw(this.__id);
  
};

CollisionSystem.prototype.removeParticle = function(id) {
    const particle = this.__particles.filter(p => {return p.id == id;})[0];
    particle.remove(); 
};

// HELPER METHODS
CollisionSystem.prototype.__registerParticle = function(particle) {
    this.__particles.push(particle);
    this.__predict(particle); 
};

CollisionSystem.prototype.__removeParticle = function(particle) {
    this.__particles = this.__particles.filter(p => {return p.id != particle.id;}); 
    particle.count++; // Invalidates all future events involving this particle
};

CollisionSystem.prototype.__predict = function(particle) {
    if (particle == null) return;
    let dt; 
    let event; 
    for (let i=0; i<this.__particles.length; i++) {
	dt = particle.timeToHit(this.__particles[i]); 
	if(dt != Infinity){
	    event = new Event(this.__t + dt, particle, this.__particles[i]);
	    this.__pq.insert(event);
	}
    }
    dt = particle.timeToHitVerticalWall(this.__width);
    if (dt != Infinity) {
	event = new Event(this.__t + dt, particle, null); 
	this.__pq.insert(event);
    }
    dt = particle.timeToHitHorizontalWall(this.__height);
    if (dt != Infinity) {
	event = new Event(this.__t + dt, null, particle);
	this.__pq.insert(event); 
    }
};
 
CollisionSystem.prototype.__generateParticles = function(n) {
    // This function initialize a system of particles
    const N = Math.floor(Math.sqrt(n)); 
    const grid_x = this.__width/N;
    const grid_y = this.__height/N; 

    // Add a molecule in the middle of the system
    this.addParticle(
	"molecule",
	this.__width/2,
	this.__height/2,
	3); 

    // Add small atoms all around
    for (let k=0; k<N; k++) {
	for (let l=0; l<N; l++) {
	    this.addParticle(
		"atom",
		k*grid_x + grid_x/2,
		l*grid_y + grid_y/2,
		1);
	}
    }
};

CollisionSystem.prototype.__draw = function() {
    for (let particle of this.__particles) {
	particle.draw(this.__id); 
    }
};

CollisionSystem.prototype.__redraw = function() {
    for (let particle of this.__particles) {
	particle.move();
	particle.redraw(); 
    }
};

// Interaction Handling
CollisionSystem.prototype.__setHandling = function() {
    const sys = document.getElementById(this.__id);
    sys.addEventListener(
	"mousedown",
	() => {window.lastCollisionSystemPress = Date.now();});
    sys.addEventListener(
	"mouseup",
	() => {window.lastCollisionSystemUnpress = Date.now();});
    sys.addEventListener(
	"click",
	(e) => {
	    let pt = sys.createSVGPoint();
	    pt.x = e.clientX;
	    pt.y = e.clientY;
	    pt = pt.matrixTransform(sys.getScreenCTM().inverse());  
	    let pressTime = (window.lastCollisionSystemUnpress -
	 		     window.lastCollisionSystemPress)/1000;
	    let size; 
	    if (pressTime < 0.3) size = 1; 
	    else size = Math.min(3, pressTime/0.5); 
 	    this.addParticle("atom", pt.x, pt.y, size);
	}); 
  };


// Expose the API through the window object
window.CollisionSystem = CollisionSystem; 
