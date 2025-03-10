import { faker } from '@faker-js/faker'

import { Event } from './events.loader'

export const fakeEvent = (): Event => {
    return {
        id: faker.string.uuid(),
        name: `${faker.music.artist()} at ${faker.location.city()}`,
        description: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
        date: faker.date.soon({ days: 30 }).valueOf(),
        isCanceled: faker.datatype.boolean({ probability: 0.1 }),
        isSoldOut: faker.datatype.boolean({ probability: 0.2 }),
        price: faker.number.int({ min: 999, max: 200000 }),
    }
}

export const fakeEvents = (amount: number) =>
    Array.apply(null, Array(amount))
        .map(() => fakeEvent())
        .sort((a, b) => a.date - b.date)
