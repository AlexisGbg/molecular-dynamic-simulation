/*
 * COLLISION SYSTEM PROTOTYPE
 *
 * This module contains the client API. This API is made up 
 * of a single method, simulate, which must be called 
 * to increment the simulation's time by one. 
 *
 * The variable prefix __ is used to simulate 
 * private attributes / methods
 * 
 */

import { PriorityQueue } from './PriorityQueue.js'; 
import { Event } from './Event.js'; 
import { Particle } from './Particle.js'; 

// CONSTUCTOR
function CollisionSystem(container_id, n_particles) {
    this.__id = container_id;
    this.__n = n_particles; 
    this.__width = document.getElementById(container_id)
	.viewBox
	.baseVal
	.width;
    this.__height = document.getElementById(container_id)
	.viewBox
	.baseVal
	.height; 
    this.__particles = this.__generateParticles();
    this.__pq = new PriorityQueue(2*Math.pow(this.__particles.length,2));
    this.__t = 0; 

    for (var i=0; i<this.__particles.length; i++) {
	this.__predict(this.__particles[i]); 
    }
    this.__draw();
    console.log(this.__pq); 
}


// API 
CollisionSystem.prototype.simulate = function() {
    this.__t++; 

    while (!this.__pq.min().isValid()) {
	this.__pq.delMin();
    }

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

// HELPER METHODS
CollisionSystem.prototype.__predict = function(particle) {
    if (particle == null) return;
    var dt; 
    var event; 
    for (var i=0; i<this.__particles.length; i++) {
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
 
CollisionSystem.prototype.__generateParticles = function() {
    // this function distributes the particles evenly in the
    // available space.
    const N = Math.floor(Math.sqrt(this.__n)); 
    const particles = new Array(Math.pow(N,2));
    const radius = Math.min(this.__width/(4*N), this.__height/(4*N));
    const mass = radius;
    for (var k=0; k<N; k++) {
	for (var l=0; l<N; l++) {
	    particles[k*N+l] = new Particle(
		"particle"+(k*N+l),
		"particle", 
		k*this.__width/N + this.__width/(2*N),
		l*this.__height/N + this.__height/(2*N),
		Math.random()*0.2 - 0.1, // steps must be small
		Math.random()*0.2 - 0.1,
		radius,
		mass);
	}
    }
    return particles; 
};

CollisionSystem.prototype.__draw = function() {
    d3.select("#"+this.__id).selectAll("circle")
        .data(this.__particles)
	.enter()
	.append("circle")
	.attr("class", function(d) {return d.class})
	.attr("id",    function(d) {return d.id;})
	.attr("cx",    function(d) {return d.x;})
	.attr("cy",    function(d) {return d.y;})
	.attr("r",     function(d) {return d.radius;});
};


CollisionSystem.prototype.__redraw = function() {
    for (var i=0; i<this.__particles.length; i++) {
	this.__particles[i].move();
	this.__particles[i].draw(); 
    }
};

window.CollisionSystem = CollisionSystem; 
