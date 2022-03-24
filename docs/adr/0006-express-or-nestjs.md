# Express Or NestJs

- Status: accepted

## Context and Problem Statement

I need library for writing HTTP API

## Decision Drivers <!-- optional -->

- Fast to setup
- Easily to test
- Production ready without spend so much time on setup

## Considered Options

- NestJS

Framework inspired from Spring and Angular ,
after setup correctly it would easily mock-out smaller part of system in test
and a lot of manually job like swagger doc / validation schema can auto generate

- Express

Production battled framework but need a lot of custom setup
because of unopinion nature

- Koa

Similar to express but have two-way middleware

## Decision Outcome

NestJs because i already have ready to run template and learn for how to deal with
that
