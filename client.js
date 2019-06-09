function loadScript(url, type) {
   return new Promise((resolve, reject) => {
	const head   = document.head;
	const script = document.createElement('script');
	script.type = type;
	script.src = url;
        script.onload = () => {resolve();}; 
	head.appendChild(script);
    });
};


// Ensure the needed scripts are loaded before simulating
Promise.all([
    loadScript('https://d3js.org/d3.v4.min.js', 'text/javascript'),
    loadScript('https://alexis-guibourge.blog:9090/CollisionSystem.js', 'module')])
    .then((elt) =>
    	  {
    	      window.collisionSystem = new window.CollisionSystem('system', 50);
    	      window.collisionSystemTimer = setInterval(() => collisionSystem.simulate(),1);
	      window.collisionSystemOn = true; 
	      window.dispatchEvent(new Event("wheel")); // Force to check the initial position of the system.
	      window.dispatchEvent(new Event("touchmove")); 
	  }
	 ); 

// Stops the simulation if the system is not on the screen
window.addEventListener("wheel", checkCollisionSystem); 
window.addEventListener("touchmove", checkCollisionSystem);

function checkCollisionSystem() {
	const containerPos = document.getElementById("system").getBoundingClientRect();
	const top = containerPos.top;
	const bottom = containerPos.bottom;
	const screenHeight = window.innerHeight;
	if ((top < 0 || bottom > screenHeight) && collisionSystemOn) {
	    clearInterval(collisionSystemTimer);
	    window.collisionSystemOn = false; 
	} else if ((top > 0 && bottom < screenHeight) && !collisionSystemOn) {
    	    window.collisionSystemTimer = setInterval(() => collisionSystem.simulate(),1);
	    window.collisionSystemOn = true; 
	}
    }; 






