require('dotenv').config();
const puppeteer = require('puppeteer-core');

async function login(page) {
  try {
    console.log('Attempting to log in...');
    await page.type('#email', process.env.EMAIL);
    await page.type('#password', process.env.PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error);
  }
}

async function fillResume(page) {
  try {
    console.log('Navigating to resume page...');
    await page.goto('https://internshala.com/student/resume', { waitUntil: 'networkidle2' });

    console.log('Filling resume details...');
    await page.waitForSelector('#name');
    await page.type('#name', 'Your Name');
    await page.type('#phone', '1234567890');
    await page.type('#address', 'Your Address');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Resume details filled');
  } catch (error) {
    console.error('Filling resume failed:', error);
  }
}

async function searchAndApplyForInternships(page) {
  try {
    console.log('Navigating to internships search page...');
    await page.goto('https://internshala.com/internships', { waitUntil: 'networkidle2' });

    console.log('Searching for internships...');
    await page.waitForSelector('#keywords');
    await page.type('#keywords', 'your-desired-keyword');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log('Fetching top 10 internships...');
    await page.waitForSelector('.internship_meta');

    const internships = await page.$$('.internship_meta');
    const topInternships = internships.slice(0, 10);
    console.log(`Found ${topInternships.length} internships`);

    for (const [index, internship] of topInternships.entries()) {
      try {
        console.log(`Applying for internship ${index + 1}`);
        const applyButton = await internship.$('button:contains("Apply Now")');
        if (applyButton) {
          await applyButton.click();
          await page.waitForTimeout(2000); // Wait for the modal to open

          const additionalDetailsTextarea = await page.$('#additionalDetails');
          if (additionalDetailsTextarea) {
            await additionalDetailsTextarea.type('Some additional details if required');
          }

          const finalApplyButton = await page.$('button:contains("Submit Application")');
          if (finalApplyButton) {
            await finalApplyButton.click();
            await page.waitForTimeout(2000); // Wait for the application to be submitted
            console.log(`Applied for internship ${index + 1}`);
          } else {
            console.log(`Submit Application button not found for internship ${index + 1}`);
          }
        } else {
          console.log(`Apply Now button not found for internship ${index + 1}`);
        }
      } catch (error) {
        console.error(`Failed to apply for internship ${index + 1}:`, error);
      }
    }
    console.log('Finished applying for internships');
  } catch (error) {
    console.error('Applying for internships failed:', error);
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe' // Replace with your Brave browser path
  });
  const page = await browser.newPage();

  try {
    console.log('Navigating to login page...');
    await page.goto('https://internshala.com/login', { waitUntil: 'networkidle2' });

    await login(page);

    await fillResume(page);

    await searchAndApplyForInternships(page);

  } catch (error) {
    console.error('Automation failed:', error);
  } finally {
    await browser.close();
  }
})();
