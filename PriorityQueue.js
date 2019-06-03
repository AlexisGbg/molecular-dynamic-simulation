/*
 * PRIORITY QUEUE PROTOTYPE
 */


// CONSTRUCTOR
export function PriorityQueue(capacity) {
    this.__pq = new Array(capacity); 
    this.__N = 0; 
}


// API IMPLEMENTATION
PriorityQueue.prototype.isEmpty = function() {
    return this.__N == 0; 
}

PriorityQueue.prototype.insert = function(elt) {
    this.__pq[this.__N++] = elt; // index begins at zero
    this.__swim(this.__N); 
    
}

PriorityQueue.prototype.delMin = function() {
    var min = this.__pq[0];
    this.__exch(1,this.__N);
    this.__pq[this.__N-1] = null;
    this.__N--;
    this.__sink(1); 
    return min; 
    
}

PriorityQueue.prototype.min = function() {
    return this.__pq[0];
}


// HELPER METHODS
PriorityQueue.prototype.__sink = function(k) {
    while (2*k <= this.__N) {
	if (2*k+1 <= this.__N) {
	    if (this.__pq[2*k-1] > this.__pq[2*k] &&
	       this.__pq[k-1] > this.__pq[2*k]) {
		// right child smaller
		this.__exch(k, 2*k+1);
		k = 2*k+1; 
	    } else if (this.__pq[k-1] > this.__pq[2*k-1]) {
		// left child smaller
		this.__exch(k, 2*k);
		k = 2*k; 
	    } else {
		break;
	    }
	} else {
	    if (this.__pq[k-1] > this.__pq[2*k-1]) {
		this.__exch(k, 2*k);
		k = 2*k; 
	    } else {
		break;
	    }
	}
	    
    }
}

PriorityQueue.prototype.__swim = function(k) {
    while(k > 1) {
	if(this.__pq[k-1] < this.__pq[Math.floor(k/2)-1]) {
	    this.__exch(k,Math.floor(k/2));
	    k = Math.floor(k/2);  
	} else {
	    break;
	}
    }
}

PriorityQueue.prototype.__exch = function(i,j) {
    var swap = this.__pq[i-1];
    this.__pq[i-1] = this.__pq[j-1];
    this.__pq[j-1] = swap;
}
