import { CollisionSystem } from './CollisionSystem.js'; 
import { generateParticleGrid } from './generateParticleGrid.js'; 

const wall = {x1:0 ,x2:200, y1:0, y2:100};
const particles = generateParticleGrid(100, wall.x2, wall.y2, 2, 2);
const collisionSystem = new CollisionSystem(particles, wall); 

// VISUALIZATION INIT
d3.select("#system").selectAll("circle")
    .data(particles)
    .enter()
    .append("circle")
    .attr("id", function(d) {return d.id})
    .attr("cx", function(d) {return d.x;})
    .attr("cy", function(d) {return d.y;})
    .attr("r",  function(d) {return d.radius;});


// MAIN LOOP
window.setInterval(
    () => collisionSystem.simulate(),
    1);


