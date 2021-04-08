# Evolutive Creatures

`A simple experiment in generating DNA-based genetic creatures.`

## Try it here [lorossi.github.io/evolutive-creatures](https://lorossi.github.io/evolutive-creatures)

## What? Why?

I don't really know. But I liked the idea of toying around with evoulution and genetic alghoritms.

This concept did not work out as I imagined and I don't really want to fix this, mostly because I don't know why. I liked the idea but it's not really working. This script makes use of the session storage to save the current DNA and restart the simulation in a later moment.

## How do I use this?

Simply open the link to start the simulation.

If you want to have some more informations about a certain creature, just click near it. In the console, you will see all its data.

Press `enter` to restart the simulation, discarding the saved DNA.
Press `r` to reload the last saved DNA or `s` to save it.

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

The environment starts with a fixed amount of food and creatures with randomized genomes. After a while, the amount of available food steadily (but slowly) declines.When only 4 creatures are left, they are *"saved"*, as their DNA is mutated and they are cloned to restore the initial number of creatures.

When a creature has enough energy (gained by eating food) it can split. The newborn's DNA will be mutated, in order to create a potentially better specie.

Each stat is balanced by an energy expense. It's really hard to balance these expenditures but not long after the simulation start (less that 3 resets) an equilibrium is reached with a predominant DNA.

Carnivore creatures will discard food popping up in the environment and will only try to eat other creatures.

### Mutation

*Interesting, but how does DNA mutation work?* Each gene has a certain chanche of changing its value in a certain range. The DNA is simply an array of floats (genes) in range 0-1. Later on, these genomes are *unpacked* by each creatures and those numbers are converted into useful stats, such as the ones listed above.

## Observations

The carnivores don't last long and are not inclined to replicate. The same goes with the more aggressive creatures. Out of this, I can take out that either:

1. Carnivores and aggressive creatures are not inclined to survive
2. My simulation is completely wrong as it's missing some key details

I am strongly inclined to believe the second affirmation, but I am ready to be proved wrong (ironically, that would prove me right. *English, am i right?*).

The "most boring" creatures (herbivores, not aggressive, pretty slow with slow acceleration, small radius) usually come out on top. No *"strange"* (such as carnivore, highly aggressive) creatures survive long. Maybe I am missing some key elements in the environment simulation once again, but it doesn't really look too strange as the energy balancement really punishes big, fast creatures. I can't completely explain the carnivore exintion tho.

## And now?

It's been fun, honestly. I really wanted to play around with genetic algorithms for a long time but never actually dived into it. Even tho it doesn't work, I will take this out and replicate this concept in future projects. I am also expanding my [html canvas template](https://github.com/lorossi/empty-html5-canvas-project) to make a somewhat light but complete framework (à la p5js but less bloated).

The code isn't really commented but it's quite well organized. This said, I would not trust my own code (or myself). Double check before re-utilizing it, not that you should. I am not against it, but it's not very good code. Have some self-respect.

## Credits

This project is distributed under Attribution 4.0 International (CC BY 4.0) license.

Whoever made the Arial font. I used it. Thank you.
