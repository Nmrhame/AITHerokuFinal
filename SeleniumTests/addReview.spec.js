const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Add Review', function() {
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
  it('Add Review', async function() {
    await driver.get("http://localhost:3000/mainfeed")
    await driver.manage().window().setRect({ width: 1269, height: 1032 })
    await driver.findElement(By.linkText("Login")).click()
    await driver.findElement(By.name("username")).click()
    await driver.findElement(By.name("username")).sendKeys("Nick")
    await driver.findElement(By.css(".inner-wrap")).click()
    await driver.findElement(By.name("password")).click()
    await driver.findElement(By.name("password")).sendKeys("dumbylol")
    await driver.findElement(By.name("Sign Up")).click()
    await driver.findElement(By.linkText("My Profile")).click()
    await driver.findElement(By.id("title")).click()
    await driver.findElement(By.id("title")).sendKeys("This is a Selenium Test")
    await driver.findElement(By.id("game")).click()
    {
      const dropdown = await driver.findElement(By.id("game"))
      await dropdown.findElement(By.xpath("//option[. = 'Hollow Knight']")).click()
    }
    await driver.findElement(By.id("platform")).click()
    await driver.findElement(By.id("platform")).sendKeys("PC")
    await driver.findElement(By.id("reviewText")).click()
    await driver.findElement(By.id("reviewText")).sendKeys("Selenium is awesome.")
    await driver.findElement(By.id("rating")).click()
    {
      const dropdown = await driver.findElement(By.id("rating"))
      await dropdown.findElement(By.xpath("//option[. = '7']")).click()
    }
    await driver.findElement(By.css(".btn")).click()
    await driver.findElement(By.linkText("Mainfeed")).click()
    await driver.findElement(By.css(".navbar")).click()
    await driver.findElement(By.linkText("Games")).click()
    {
      const element = await driver.findElement(By.linkText("Games"))
      await driver.actions({ bridge: true}).doubleClick(element).perform()
    }
    await driver.findElement(By.linkText("My Profile")).click()
    await driver.findElement(By.linkText("Mainfeed")).click()
    await driver.findElement(By.linkText("Nick")).click()
    await driver.findElement(By.linkText("Games")).click()
  })
})
