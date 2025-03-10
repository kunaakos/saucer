# Saucer 🛸

This repo implements some elements of a design *as discussed*, and exists solely for the purpose of demonstrating those and the underlying Hybrid SSR rendering. It uses a personal project to render components.

Components are styled using CSS Modules, with CSS variable based theming.

Components stay as close to HTML elements as possible, and are written to be composable. `Input` and `useDateInputState`/`useSearchInputState` are a good example of this, where a UI component is combined with different behaviors for a consistent look, but flexibility during implementation.

## The rest in a nutshell

`Saucer` is *very lightweight* toolkit that can replace a massive meta-framework like next.js. It's called Saucer because that sounds like **SSR**.

**It's very much in progress, currently being refactored from an app to a library, and was ripped out from a private monorepo to be published here.**

Instead of being a framework, it's a toolkit composed of *express middleware* that render pages, serve static files and serve the API endpoints needed by `Saucer` itself. It:
- doesn't do file-based routing, allowing one to structure their project as they wish
- is unopinionated when it comes to file structure
- is opinionated when it comes to file naming, TypeScript use and module formats 
- doesn't render static pages
- can't handle React Server Components, and it might in the future (despite the poor documentation), or it might take a different route altogheter and swap React for Preact, and ditch async components entirely

### GOALS

Client bundles should be emitted automatically, and on the server side, `Saucer` needs to be mounted to an express(-like) app:

```ts
const app = express()
app.use(saucer.middleWare({ pages }))
app.listen(3000)
```

Since the app itself needs to run through webpack, the config for which is handled by `Saucer`, this will most likely be done by a CLI:

```
npx run saucer myServer.ts
```

### Current implementation

```ts
const app = express()
initStatic({ app })
initApi({ app, pages })
initPageRenderer({ app, pages })
app.listen(3000)
```

Pages are defined like so:

```ts
const eventsPage: PageDefinition<EventsPageData> = {
    path: '/events',
    loader: eventsPageLoader,
    component: EventsPage,
    layout: PageLayout,
}
```

The page will be mounted at `path`. `loader` is an async function that **is not included in the client bundle**,and will be called server-side only, whenever its page is rendered.

The data returned by the `loader` is added to `PageContext`, from where it's read on the client-side.
`PageContext` will also load data for pages during client-side navigation by calling `/api/pd/events` in this ecample, which will return the data fetched by the `loader` as JSON. This is cached on the client.

`Suspense`-d lazy loaded components should be supported (not part of this example and could be broken at the time)

Overall, this works similarly to how next.js approaches the issue, but the resulting bundle is much smaller: **64k compressed** using `react`, but `preact` might be used in the final version for an even smaller bundle size, roughly half of this.

## deps

[Wouter](https://github.com/molefrog/wouter) is used for routing
[faker.js](https://fakerjs.dev/) is used for faking data - **this is an example of a massive module that is not loaded client-side**
[day.js](https://day.js.org/) is used for time-related things - **this module is included in the client bundle**

[webpack](https://webpack.js.org/) handles bundling, transpiling, module replacement, style processing and much more.
[CSS Modules](https://github.com/css-modules/css-modules) are used for styles because of the perf benefits of this approach. **CSS class identifiers are im dev mode everywhere, they will be much shorter in production builds**, further reducing bundle sizes.
[typed-css-modules](https://github.com/Quramy/typed-css-modules) creates type definitions for CSS files, which brings this approach up to be almost on par with **css-in-ts** solutions.

## Running

`npm i` to install

`npm run dev:watch` to develop
`npm run prod:build && npm run prod:server` to create and run a production build
