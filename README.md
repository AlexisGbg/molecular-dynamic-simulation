# Molecular Collision Simulation

This JS package enables the simulation of particles moving in a client-specified 2D-space. The *CollisionSystem.js* script has to be loaded as a module; it will expose a constructor at window.CollisionSystem. Drawing an instance by providing the constructor an **svg id** and a **number of particles** will start the system. 

## API
- *CollisionSystem(id, n)*: [constructor] id must be the id of a rectangular svg element, with specified height and width. n is the number of particles to be created in the system.
- *simulate()*: increments the time by one.
- *addParticle(type, x, y, size)*: add a particle in the 2D-space. 1 is the minimal size, 3 the maximal size. 
- *removeParticle(id)*: remove the refered particle.

## Interaction
The package comes with build in interactions:
- *click on particle*: will delete the particle
- *click on system*: wil add a particle if possible (no overlapping with other particles).

## In action
The system starts with a big particle, called molecule here, surrounded by small particles, called atoms. By keeping simulating the system, you can observe the random walk of the molecule. 

![Alt text](img/screenshot1.png?raw=true "Screenshot1")

Click on some atoms an create a low pressure atmosphere. 

![Alt text](img/screenshot2.png?raw=true "Screenshot2")

If your interested in high pressure gas, add some atoms by clicking in the system. 

![Alt text](img/screenshot3.png?raw=true "Screenshot3")
