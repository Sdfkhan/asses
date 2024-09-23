import { test, expect } from '@playwright/test';

test.describe('Sauce Demo Sorting Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
  });

  test('Verify Z-A sorting order', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'za');
    const items = await page.$$eval('.inventory_item_name', items => items.map(item => item.textContent));

    const sortedItems = [...items].sort().reverse();
    expect(items).toEqual(sortedItems);
  });

  test('Verify high-low price sorting order', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'hilo');
    const prices = await page.$$eval('.inventory_item_price', items => items.map(item => parseFloat(item.textContent.replace('$', ''))));

    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('Add items to cart and validate checkout', async ({ page }) => {
    await page.click('#add-to-cart-sauce-labs-backpack');
    await page.click('#add-to-cart-sauce-labs-bike-light');

    await page.click('.shopping_cart_link');
    const cartItems = await page.$$eval('.cart_item', items => items.length);
    expect(cartItems).toBe(2);

    await page.click('#checkout');
    await page.fill('#first-name', 'Test');
    await page.fill('#last-name', 'User');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    await page.click('#finish');

    const completeText = await page.textContent('.complete-header');
    expect(completeText).toBe('Thank you for your order!');
  });
});

