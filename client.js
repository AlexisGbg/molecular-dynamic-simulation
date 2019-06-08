
const collisionSystem = new window.CollisionSystem("system", 50); 

// MAIN LOOP
window.setInterval(
    () => collisionSystem.simulate(),
    1);



