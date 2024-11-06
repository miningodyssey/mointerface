export function disposeHero(create) {
    create.forEach((array) => {
        array.forEach((item) => {
            item.dispose()
        })
    })
}
