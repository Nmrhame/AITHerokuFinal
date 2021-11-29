const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('User Function', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {RR
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('User Function', async function() {
    await driver.get("http://localhost:3000/addGames/mainfeed")
    await driver.manage().window().setRect({ width: 1269, height: 1032 })
    await driver.findElement(By.linkText("Login")).click()
    await driver.findElement(By.name("username")).click()
    await driver.findElement(By.name("username")).sendKeys("Dumbledore")
    await driver.findElement(By.css(".inner-wrap")).click()
    await driver.findElement(By.name("password")).click()
    await driver.findElement(By.name("password")).sendKeys("dumbylol")
    await driver.findElement(By.name("Sign Up")).click()
    await driver.findElement(By.linkText("My Profile")).click()
    await driver.findElement(By.linkText("Mainfeed")).click()
    await driver.findElement(By.linkText("Nick")).click()
    await driver.findElement(By.linkText("My Profile")).click()
    await driver.findElement(By.id("title")).click()
    await driver.findElement(By.id("title")).sendKeys("This game is sweet ")
    await driver.findElement(By.id("game")).click()
    {
      const dropdown = await driver.findElement(By.id("game"))
      await dropdown.findElement(By.xpath("//option[. = 'Hollow Knight']")).click()
    }
    await driver.findElement(By.id("platform")).click()
    await driver.findElement(By.id("platform")).sendKeys("Switch")
    await driver.findElement(By.id("reviewText")).click()
    await driver.findElement(By.id("reviewText")).sendKeys("I am a wizard and I don\'t think there are many wizards in this game. ")
    await driver.findElement(By.id("rating")).click()
    {
      const dropdown = await driver.findElement(By.id("rating"))
      await dropdown.findElement(By.xpath("//option[. = '5']")).click()
    }
    await driver.findElement(By.css(".btn")).click()
    await driver.findElement(By.linkText("Games")).click()
    await driver.findElement(By.linkText("Edit")).click()
    await driver.findElement(By.name("description")).click()
    await driver.findElement(By.name("description")).sendKeys("I am a new User. I have not created a personal description yet! I am a wizard lol.")
    await driver.findElement(By.name("avatar")).click()
    await driver.findElement(By.name("avatar")).sendKeys("C:\\fakepath\\Crash.png")
    await driver.findElement(By.name("havePlayed")).click()
    await driver.findElement(By.name("havePlayed")).sendKeys("23")
    await driver.findElement(By.id("favoriteGame")).click()
    {
      const dropdown = await driver.findElement(By.id("favoriteGame"))
      await dropdown.findElement(By.xpath("//option[. = 'Death\'s Gambit: Afterlife']")).click()
    }
    await driver.findElement(By.name("editProfile")).click()
    await driver.findElement(By.linkText("My Profile")).click()
  })
})
