/* 
 * PARTICLE GENERATOR FUNCTION
 */

import { Particle } from './Particle.js';

export function generateParticleGrid(n, width, length) {
    const N = Math.floor(Math.sqrt(n)); 
    const particles = new Array(Math.pow(N,2));
    const radius = Math.min(width/(4*N), length/(4*N));
    const mass = radius;
    for (var k=0; k<N; k++) {
	for (var l=0; l<N; l++) {
	    particles[k*N+l] = new Particle(
		"particle"+(k*N+l),
		k*width/N + width/(2*N),
		l*length/N + length/(2*N),
		Math.random()*0.2 - 0.1,
		Math.random()*0.2 - 0.1,
		radius,
		mass);
	}
    }

    return particles; 
}
