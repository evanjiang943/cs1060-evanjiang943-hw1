# 2048 Game - CS1060 Homework 1

## Contributors
- **Evan Jiang**
  - GitHub: [@evanjiang943](https://github.com/evanjiang943)
  - Harvard Email: evanjiang943@harvard.edu

## Project URLs
- **GitHub Repository**: [https://github.com/evanjiang943/cs1060-evanjiang943-hw1](https://github.com/evanjiang943/cs1060-evanjiang943-hw1)
- **Netlify Deployment**: [To be added after deployment]

## Project Description
This project is a web-based implementation of the popular 2048 puzzle game. The game features a 4x4 grid where players combine tiles with the same numbers to reach the 2048 tile.

## What I Worked On
- **Game Logic Implementation**: Created a complete 2048 game engine with proper tile movement, merging mechanics, and scoring system
- **User Interface**: Designed a clean, responsive UI that matches the original 2048 game aesthetic
- **Game Features**:
  - 4x4 grid with smooth tile animations
  - Score tracking with local storage for best score persistence
  - Win/lose detection with appropriate game over screens
  - New game and restart functionality
  - Responsive design for mobile devices
- **Controls**: 
  - Keyboard arrow key support for desktop
  - Touch/swipe gestures for mobile devices
- **Visual Design**: 
  - Color-coded tiles based on their values
  - Smooth transitions and animations
  - Mobile-responsive layout

## Technical Implementation
- **HTML**: Semantic structure with game grid and UI elements
- **CSS**: 
  - Grid-based layout for the game board
  - Responsive design with media queries
  - Color scheme matching the original 2048 game
  - Smooth animations and transitions
- **JavaScript**: 
  - Object-oriented game class structure
  - Event handling for keyboard and touch inputs
  - Local storage integration for score persistence
  - Game state management (win/lose conditions)

## Issues Encountered
1. **Touch Controls**: Initially had difficulty implementing smooth swipe gestures for mobile. Resolved by calculating touch distance and direction properly.
2. **Tile Merging Logic**: Ensuring tiles only merge once per move required careful array manipulation and state tracking.
3. **Animation Timing**: Coordinating tile movements with visual updates to prevent flickering during rapid moves.
4. **Responsive Design**: Adjusting tile sizes and fonts for smaller screens while maintaining playability.

## Time Investment
**Total Time**: Approximately 4 hours
- Planning and setup: 1 hour
- Core game logic implementation: 1 hours
- UI design and styling: 0.5 hours
- Mobile responsiveness and touch controls: 0.5 hour
- Testing and debugging: 1 hour

## How to Play
1. Use arrow keys (desktop) or swipe (mobile) to move tiles
2. When two tiles with the same number touch, they merge into one
3. Try to create a tile with the number 2048 to win
4. The game ends when no more moves are possible

## Features
- Complete 2048 game mechanics
- Score tracking with persistent best score
- Responsive design for all devices
- Touch and keyboard controls
- Win/lose detection
- Smooth animations and transitions
- Clean, modern UI design
