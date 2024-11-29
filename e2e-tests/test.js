const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('E2E Test', function () {
  this.timeout(30000);
  let driver;
  let vars;

  beforeEach(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless'); // Run tests in headless mode (no UI)
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    driver.manage().setTimeouts({ implicit: 5000 }); // Implicit wait for element loading
    vars = {};
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should add a task', async function () {
    await driver.get('http://localhost:3000/');
    await driver.manage().window().setRect({ width: 1510, height: 871 });

    // Find the input field and enter a task
    const inputField = await driver.findElement(By.css('input'));
    await inputField.click();
    await inputField.sendKeys('this is a task');

    // Click the Add Task button
    const addTaskButton = await driver.findElement(By.css('button:nth-child(2)'));
    await addTaskButton.click();

    // Verify that the task is added to the task list
    const addedTask = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'this is a task')]")),
      5000
    );

    const taskText = await addedTask.getText();
    assert.strictEqual(taskText, 'this is a task', 'Task was not added correctly');

    // Interact with other buttons (if needed)
    const button3 = await driver.findElement(By.css('button:nth-child(3)'));
    await button3.click();

    const button4 = await driver.findElement(By.css('button:nth-child(4)'));
    await button4.click();
  });
});
