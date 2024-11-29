const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('E2E Test', function () {
  this.timeout(30000); // Global test timeout

  let driver;
  let vars;

  beforeEach(async function () {
    console.log('Initializing Chrome Driver...');
    const options = new chrome.Options();
    options.addArguments('--headless'); // Run tests in headless mode (no UI)
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    driver.manage().setTimeouts({ implicit: 5000 }); // Implicit wait for element loading
    console.log('Driver initialized successfully.');
    vars = {};
  });

  afterEach(async function () {
    if (driver) {
      console.log('Closing Chrome Driver...');
      await driver.quit();
      console.log('Driver closed successfully.');
    }
  });

  it('Should add a task', async function () {
    try {
      console.log('Navigating to the application...');
      await driver.get('http://localhost:3000/');
      await driver.manage().window().setRect({ width: 1510, height: 871 });

      console.log('Finding the input field...');
      const inputField = await driver.wait(
        until.elementLocated(By.css('input')),
        10000
      );
      console.log('Input field found. Entering task...');
      await inputField.click();
      await inputField.sendKeys('this is a task');

      console.log('Clicking the Add Task button...');
      const addTaskButton = await driver.wait(
        until.elementLocated(By.css('button:nth-child(2)')),
        10000
      );
      console.log('Add Task button found. Clicking it...');
      await addTaskButton.click();

      console.log('Waiting for the task to appear in the list...');
      // Locate by class and verify innerText
      const taskElements = await driver.findElements(By.css('.plant'));
      console.log(`Found ${taskElements.length} tasks. Verifying...`);
      let taskFound = false;
      for (const taskElement of taskElements) {
        const text = await taskElement.getText();
        console.log(`Task text: "${text.trim()}"`);
        if (text.trim() === '🌱 this is a task') {
          taskFound = true;
          break;
        }
      }
      assert(taskFound, 'Task was not added to the list!');

      console.log('Task was added successfully!');

      console.log('Clicking button 3...');
      const button3 = await driver.wait(
        until.elementLocated(By.css('button:nth-child(3)')),
        10000
      );
      console.log('Button 3 located. Clicking...');
      await button3.click();

      console.log('Clicking button 4...');
      const button4 = await driver.wait(
        until.elementLocated(By.css('button:nth-child(4)')),
        10000
      );
      console.log('Button 4 located. Clicking...');
      await button4.click();

      console.log('Test completed successfully!');
    } catch (error) {
      console.error('Test failed at:', error.message);

      // Debugging step: Output the current page source
      const pageSource = await driver.getPageSource();
      console.log('Current Page Source:', pageSource);

      // Debugging step: Take a screenshot
      const screenshot = await driver.takeScreenshot();
      require('fs').writeFileSync('screenshot.png', screenshot, 'base64');
      console.log('Screenshot saved as screenshot.png');

      throw error; // Rethrow to ensure the test fails
    }
  });
});
