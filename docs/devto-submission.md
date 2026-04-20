*This is a submission for [Weekend Challenge: Earth Day Edition](https://dev.to/challenges/weekend-2026-04-16)*

# I built an Earth Day app around Malaysian daily habits

## What I Built

I built **EcoHabit.my**, a lightweight Earth Day web app that turns climate intent into small, realistic actions people can actually do today.

The starting point was simple: a lot of eco apps feel interchangeable. They talk about sustainability in broad global language, but they are not grounded in the way people actually move, eat, buy takeaway, or use energy in Malaysia.

So instead of building another carbon calculator, I built a **low-friction daily action picker** with local context and globally readable English.

Some of the actions are deliberately specific:

- take `LRT/MRT` instead of solo Grab
- tapau lunch in your own `bekas`
- bring a tumbler for `kopi` or `teh`
- carry a reusable bag for a `pasar` run
- set the AC to `25°C` instead of overcooling the room

The app includes:

- a welcome modal so first-time visitors do not hit an empty state
- a feed of practical actions with category filters and local nouns
- a lightweight personalized prompt so users can describe their situation and get a realistic next move
- points and streak tracking
- an anonymous community pledge wall with seeded entries
- a poster-style share card with a QR code back to the live app

Everything runs client-side with `localStorage`, so there is no login, database, or setup friction.

## Demo

Live demo:

`https://eco-habit-my-earth-day-mvp.vercel.app`

Happy path:

1. Open the app and dismiss the welcome modal
2. Use the personalized prompt or browse the action feed
3. Complete 2-3 actions
4. Add a pledge to the community wall
5. End on the share card and QR-enabled export

## Code

GitHub repo:

`https://github.com/LeonalSigar/EcoHabit.my-Earth-Day-MVP`

Built with:

- React
- TypeScript
- Vite
- plain CSS

I kept the stack intentionally small because this was built as a fast challenge MVP and needed to stay reliable during demo time.

## How I Built It

I optimized for **clarity, speed, and shareability** over technical breadth.

Some of the most important decisions were:

- keep the app frontend-only so nothing can fail on auth, database setup, or external APIs
- seed both actions and community pledges so the experience feels alive immediately
- treat impact as **indicative, not scientific**
- design around Malaysian daily habits, while keeping the UI understandable to global judges
- make the share card part of the product itself, not just a screenshot afterthought

The hardest problem was balancing local identity with legibility. I wanted the product to feel recognizably Malaysian without making international readers feel locked out. That is why the interface stays in English, but local terms like `tapau`, `kopitiam`, `pasar`, and `TNB` are embedded in context rather than dropped in unexplained.

## Prize Categories

I am submitting this as an overall challenge entry and not targeting a sponsor-specific category.

## Closing Thought

The question behind this project was:

**How do you make climate action feel closer, lighter, and more locally real?**

EcoHabit.my is my attempt at that answer: small choices, local context, and momentum over perfection.
