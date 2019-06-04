import { CollisionSystem } from './CollisionSystem.js'; 

const collisionSystem = new CollisionSystem("system", 50); 

// MAIN LOOP
window.setInterval(
    () => collisionSystem.simulate(),
    1);


