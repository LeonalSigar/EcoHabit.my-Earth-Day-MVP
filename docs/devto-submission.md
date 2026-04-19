*This is a submission for [Weekend Challenge: Earth Day Edition](https://dev.to/challenges/weekend-2026-04-16)*

# EcoHabit.my: An Earth Day App Built Around Malaysian Daily Habits

## What I Built

I built **EcoHabit.my**, a lightweight Earth Day web app that helps people turn climate intent into small, realistic daily actions.

The core problem I wanted to solve was this: a lot of sustainability apps feel generic. They talk about carbon in broad global language, but they are not grounded in how people actually move, eat, buy takeaway, or use energy in Malaysia.

So instead of building a complex carbon calculator, I built a **low-friction daily action picker** for actions people can realistically do today.

What makes it different is the local framing. The app uses familiar Malaysian examples like:

- taking `LRT/MRT` instead of solo Grab
- tapau lunch in your own `bekas`
- bringing a tumbler for `kopi` or `teh`
- carrying reusable bags for a `pasar` run
- setting AC to `25°C` instead of blasting it all day

At the same time, I kept the UI and copy readable for a global audience, since this is a global challenge.

The app includes:

- a welcome modal so first-time visitors never hit an empty state
- an action picker with category filters, local nouns, and impact labels
- progress tracking with points and streak logic
- a screenshot-ready share card
- an anonymous community pledge wall with seeded entries and localStorage persistence

Everything runs client-side and uses `localStorage`, so there is no login, backend, or setup friction.

## Demo

Local demo flow:

1. Open the app
2. Dismiss the welcome modal
3. Filter by a category like `Commute` or `Food`
4. Mark 2-3 actions as completed
5. Watch the point total and streak update instantly
6. Add a pledge to the community wall
7. End on the share card / copy pledge flow

If I deploy this, I will add the live URL here.

## Code

The project is built with:

- React
- TypeScript
- Vite
- plain CSS

The code is intentionally small and flat because this was built as a fast hackathon MVP with no backend.

GitHub repo:

`[add your GitHub repo link here]`

## How I Built It

I optimized for **clarity, speed, and demo impact** instead of technical breadth.

A few decisions shaped the build:

- I chose a frontend-only architecture so the app could not fail on auth, database, or API setup.
- I used seeded action data and seeded community pledges so the product would feel alive on first load.
- I treated impact as **indicative, not scientific**. The point is to motivate practical action, not pretend to produce perfect carbon accounting.
- I added a social layer with an anonymous pledge wall because this challenge also rewards reaction and engagement on the DEV post.

The hardest design problem was balancing local identity with global readability. I wanted the product to feel Malaysian without making international judges feel excluded or confused. That is why the UI stays in English, but local references like `tapau`, `kopitiam`, `pasar`, and `TNB` are embedded in ways that stay understandable from context.

## Prize Categories

I am submitting this as an overall challenge entry and not targeting a sponsor-specific category.

## Closing Thought

For this challenge, I kept returning to one question:

**How do you make climate action feel closer, lighter, and more locally real?**

EcoHabit.my is my answer to that: a small product built around practical choices, local context, and momentum over perfection.
