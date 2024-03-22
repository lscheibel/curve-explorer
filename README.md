# [Chaikin Curve Explorer](https://curve-explorer.vercel.app)
> This project is part of the DD2258 Introduction to Visualization, Computer Graphics and Image/Video Processing course at the KTH university

This tool is meant as an educational resource for understanding the Chaikin Curve algorithm.

Notable Features:
- Move the shapes control points
- Insert new control points
- Remove control points
- Optionally close the shape
- Adjust the corner cutting ratio
- Adjust the number of iterations (and preview the next corner cutting iteration)
- Dynamic resolution: Don't adjust the number of iterations and instead automatically cut the curve until it is smooth!
  - This uses a home-brewed algorithm that during each iteration only cuts the corner if its angle is larger than the max angle.
  - Adjust the max angle to get smoother or choppier curves.
  - Max iterations is a safeguard for degenerate cases.
  - Tip: Try setting the ratio to 0.74, enable dynamic resolution and start increasing the max angle for some funky results.
- Display the resulting edge vertices as dots.
- Display a BSpline to compare the result of the algorithm to the curve it is approaching.
  - This is actually implemented without svgs Q command.
- QoL features:
  - Double-click a number in the controls to reset its value.
  - ~~Click and drag a number in the controls to easily set its value~~ TODO


_Link to live version: https://curve-explorer.vercel.app_

---

## Development

Install dependencies with `npm install`.
Use `npm run dev` to start the dev server.

### Setup Intellij IDEs

Settings > Languages & Frameworks > JavaScript > Prettier

Run for files: `{**/*,*}.{js,ts,jsx,tsx,cjs,mjs,html,json,css,scss,md,yml,yaml}`
And if you want check the "On save".

### NPM Scripts

| Script             | Description                   |
| ------------------ | ----------------------------- |
| `npm run dev`      | Start the development server  |
| `npm run test`     | Run the tests (in watch mode) |
| `npm run build`    | Build the project             |
| `npm run coverage` | View the test coverage        |
| `npm run preview`  | Preview the build             |
