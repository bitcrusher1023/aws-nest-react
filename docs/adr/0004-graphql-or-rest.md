# Endpoint style

- Status: accepted

## Context and Problem Statement

I need some RPC protocol for manipulate db record through web browser.

task I need to do

- Add game to user library
- Upload file for game box art
- Get all name with filter and pagination supported
- Get game by id

## Decision Drivers <!-- optional -->

- DX - do i easy to integrate and will boots my productivity?
- do i family enough on such protocol,
  so I don't have to spend a lot of time on googling ?

## Considered Options

- REST
  - Most family protocol and easily to implement
  - Product battle for very long time, it super stables
- GraphQL
  - Out of box schema generation
  - Some basic validator already included
  - More auto complete feature because schema generation
  - Play together with React context can save a lot of time.
  - Less family protocol

## Decision Outcome

- Graphql because project here is simple enough, the risk is acceptable
