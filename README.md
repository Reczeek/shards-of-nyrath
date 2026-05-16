# Shards of Nyrath

Shards of Nyrath is a browser-based combat game built with HTML, CSS, and JavaScript.  
The game focuses on timing-based combat mechanics and turn-based decision making.

---

## Features

- Turn-based combat system
- Timing-based attacks and parry mechanics
- Skill-based actions with different behaviors
- Simple enemy AI system
- Modular code structure (combat, UI, systems)
- Lightweight browser gameplay (no engine required)

---

## Gameplay

The core gameplay loop:

1. Select an action (attack, skill, block, parry)
2. Execute the action using a timing system
3. Enemy performs its turn
4. Repeat until one side loses all HP

Performance in timing windows affects damage, defense, and outcomes.

---

## Combat System

- **Attack**: Timing-based damage output
- **Parry**: Precise timing reduces or negates damage
- **Block**: Reduces incoming damage
- **Skills**: Special actions with unique mechanics

---

## Project Structure


/css Stylesheets
/js Game logic
/combat Combat system (core logic, AI, skills)
/systems Timing, damage, and parry systems
/ui Menu and HUD logic
/assets Game assets (audio, images, UI elements)
/data Game configuration files (enemies, skills, balance)
index.html Main entry point


---

## Installation

1. Clone the repository:

git clone https://github.com/your-username/shards-of-nyrath.git


2. Open `index.html` in a browser.

No build tools or dependencies are required.

---

## Development Goals

- Build a responsive timing-based combat system
- Keep the code modular and easy to extend
- Expand enemy variety and skill interactions over time

---

## Status

This project is currently in early development.

Core combat systems are being implemented and iterated.
