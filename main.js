var a = new Particle("particle1",6,50,1,1,5,5); 
var b = new Particle("particle2",94,50,-2,0,3,3);
var c = new Particle("particle3",50,5,0,0.5,7,7);
var d = new Particle("particle4",90,90,-1,-1,3,3);
var e = new Particle("particle5",90,5,2,2,2,2); 
var f = new Particle("particle6",6,30,0,1,3,3); 
var g = new Particle("particle7",6,60,1,0,4,4);

var wall = {x1:0 ,x2:100, y1:0, y2:100};

var particles = [a,b,c,d,e,f,g]; 
var collisionSystem = new CollisionSystem(particles, wall); 

d3.select("#system").selectAll("circle")
    .data(particles)
    .enter()
    .append("circle")
    .attr("id", function(d) {return d.id})
    .attr("cx", function(d) {return d.x;})
    .attr("cy", function(d) {return d.y;})
    .attr("r",  function(d) {return d.radius;});



var timer = d3.interval(
    function(duration) {
	collisionSystem.simulate(); 
    }, 10);


