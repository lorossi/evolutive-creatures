# Evolutive Creatures

`A simple experiment in generating DNA-based genetic creatures.`

## Try it here https://lorossi.github.io/evolutive-creatures/

## What? Why?

I don't really know. But I liked the idea of toying around with evoulution and genetic alghoritms.

This concept did not work out as I imagined and I don't really want to fix this. I liked the idea but it's not really working.

## How to use this

Simply open the link to start the simulation. If you want to have some more informations about a certain creature, just click near it. In the console, you will see all its data.

## How does the evolution work?

Each creature has a DNA with 16 genomes. Each genome determines a different stat of the creature:

- its hue
- its radius
- its view range (how far can it see food or enemies)
- its view angle
- its speed
- its acceleration
- its infancy age (the number of frames before it starts moving)
- its distance bias (a parameter used to compute the most appetible food nearby)
- its diet (herbivore or carnivore)
- its split energy (the least energy before the creature can split, thus procreating)
- its min energy (the least energy that the creature has to keep after splitting)
- its eat radius (how far can it eat a food element)
- its aggressivity (how likely the creature is going to attack another of its species)
- its attack
- its defence
- its attack radius (how far can it attack)

The environment starts with a fixed amount of food and creatures with randomized genomes. After a while, the amount of available food steadily (but slowly) declines. When only 4 creatures are left, they are taken, their DNA is mutated and they are cloned to restore the initial number of creatures.

When a creature has enough energy (gained by eating food) it can split. The newborn's DNA will be mutated, in order to create a potentially better specie.

Each stat is balanced by an energy expense. It's really hard to balance these expenditures but not long after the simulation start (less that 3 resets) an equilibrium is reached with a predominant DNA.

## Observations

The carnivores don't last long and are not inclined to replicate. The same goes with the more aggressive creatures. Out of this, I can take out that either:

1. Carnivores and aggressive creatures are not inclined to survive
2. My simulation is completely wrong as it's missing some key details

I am strongly inclined to believe the second affirmation, but I am ready to be proved wrong (ironically, that would prove me right. English, am i right?).

The "most boring" creatures (herbivores, not aggressive, pretty slow with slow acceleration, small radius) usually come out on top. No "strange" (such as carnivore, highly aggressive) creatures survive long. Maybe I am missing some key elements in the environment simulation once again, but it doesn't really look too strange as the energy balancement really punishes big, fast creatures.

## And now?

It's been fun, honestly. I really wanted to play around with genetic algorithms for a long time but never actually dived into it. Even tho it doesn't work, I will take this out and replicate this concept in future projects. I am also expanding my [html canvas template](https://github.com/lorossi/empty-html5-canvas-project) to make a somewhat light but complete framework (à la p5js but less bloated).

The code isn't really commented but it's quite well organized. This said, I would not trust my own code (or myself). Double check before re-utilizing it.

## Credits

This project is distributed under Attribution 4.0 International (CC BY 4.0) license.

Whoever made the Arial font. I used it. Thank you.
