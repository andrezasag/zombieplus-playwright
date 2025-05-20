const { test, expect } = require('../support')
const data = require('../support/fixture/tvshow.json')
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
    await executeSQL(`DELETE from tvshows`)
})

test('deve poder cadastrar uma nova série', async ({ page }) => {

    const tvshow = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshow.create(tvshow)
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)

})

test('deve poder remover uma série', async ({ page, request }) => {
    const tvshow = data.to_remove
    await request.api.postTvshow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    //td[text()="A Noite dos Mortos-Vivos"]/..//button

    await page.tvshow.remove(tvshow.title)
    await page.popup.haveText('Série removida com sucesso.')
})

test('não deve cadastrar título duplicado', async ({ page, request }) => {
    const tvshow = data.duplicate
    await request.api.postTvshow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshow.create(tvshow)
    await page.popup.haveText(`O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)

})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {

    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.login.isLoggedIn('Admin')

    await page.tvshow.goForm()
    await page.tvshow.submit()

    await page.tvshow.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])
})

test('deve realizar busca pelo termo seriado', async ({ page, request }) => {
    const tvshow = data.search
    tvshow.data.forEach(async (m) =>{
        await request.api.postTvshow(m)
    })
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshow.search(tvshow.input)

    await page.tvshow.tableHave(tvshow.outputs)
})