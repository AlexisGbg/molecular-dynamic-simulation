function loadScript(url) {
   return new Promise((resolve, reject) => {
	const head   = document.head;
	const script = document.createElement('script');
	script.type = 'module';
	script.src = url;
        script.onload = () => {resolve();}; 
	head.appendChild(script);
    });
};
		      
loadScript('./CollisionSystem.js')
    .then((elt) =>
    	  {console.log(window.CollisionSystem); 
    	   var collisionSystem = new window.CollisionSystem("system", 50);
    	   window.setInterval(
    	       () => collisionSystem.simulate(),
    	       1);
    	  }); 
