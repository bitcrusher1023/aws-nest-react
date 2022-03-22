# Frontend SSR or CSR ? 

- Status: accepted
- Date: 2022-03-22

## Context and Problem Statement

I'm going to implement frontend page that show game gallery feature will include below

- List all of my game library
- Add new game to my library
- Add box art to game
- Read game detail

## Decision Drivers

- SEO 
- Will content facing to anonymous user?
- Deployment complexity 

## Considered Options

- Server side rendering
- Client side rendering

## Decision Outcome

Client side rendering without cross-origin 
because it would much easily setup and deploy