import concurrently from 'concurrently'

// NOTE: this might cause issues, builds should be started sequentially

concurrently(['npm run dev:watch:css-module-types', 'npm run dev:watch:build', 'npm run dev:watch:server'], {
    raw: true,
})
