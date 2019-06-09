/* 
 * EVENT
 *
 * Each Event instance contains the time of collision for 
 * a given particle pair. 
 *
 * If one of the particle has collided with another particle
 * inbetween, the Event instance becomes invalid. 
 *
 * For simplification purposes, particleB = null refers to the 
 * horizontal walls, particleA = null refers to the vertical
 * walls 
 * 
 */


// CONSTRUCTOR
export function Event(t, particleA, particleB) {
    this.t = t;
    this.particleA = particleA;
    this.particleB = particleB;
    this.countA = (particleA == null ? null : particleA.count);
    this.countB = (particleB == null ? null : particleB.count); 
};

// METHODS
// valueOf is used when events are compared
Event.prototype.valueOf = function() {
    return this.t; 
};

Event.prototype.isValid = function() {
    var newCountA = (this.particleA == null ? null : this.particleA.count);
    var newCountB = (this.particleB == null ? null : this.particleB.count);

    if (newCountA == this.countA &&
	newCountB == this.countB) {
	return true;
    } else {
	return false;
    }
};
