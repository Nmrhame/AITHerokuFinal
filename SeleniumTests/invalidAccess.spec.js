const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Invalid Access', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('Invalid Access', async function() {
    await driver.get("http://localhost:3000/mainfeed")
    await driver.manage().window().setRect({ width: 1269, height: 1032 })
    await driver.findElement(By.linkText("Mainfeed")).click()
    await driver.findElement(By.linkText("Games")).click()
    await driver.findElement(By.linkText("Mainfeed")).click()
    await driver.findElement(By.linkText("Nick")).click()
    await driver.findElement(By.linkText("Mainfeed")).click()
    await driver.findElement(By.linkText("Games")).click()
  })
})
