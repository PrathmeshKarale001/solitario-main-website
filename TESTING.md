# Testing Documentation - Solitario Website

## Overview

This document outlines the testing strategy and implementation for the Solitario e-commerce website. We follow the **Testing Pyramid** approach with multiple layers of tests.

```
        /\
       /  \     Manual Tests
      /----\
     /      \   E2E Tests (Playwright)
    /--------\
   /          \  Integration Tests
  /------------\
 /              \ Component Tests
/----------------\
      Unit Tests (Jest)
```

## Test Structure

```
solitario-website/
├── tests/
│   ├── setupTests.ts          # Jest setup and mocks
│   ├── unit/
│   │   ├── utils.test.ts      # Utility functions
│   │   ├── razorpay.test.ts   # Payment logic
│   │   ├── delhivery.test.ts  # Shipping logic
│   │   └── cart.test.ts       # Cart operations
│   ├── integration/
│   │   └── api.test.ts        # API route tests
│   ├── components/
│   │   └── checkout.test.tsx  # React component tests
│   └── mocks/
│       └── handlers.ts        # Mock API handlers
├── e2e/
│   ├── checkout.spec.ts       # Checkout flow E2E
│   └── api.spec.ts            # API endpoint E2E
├── jest.config.js             # Jest configuration
└── playwright.config.ts       # Playwright configuration
```

## Available Scripts

```bash
# Run all Jest tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:components    # Component tests only

# Run E2E tests (Playwright)
npm run test:e2e           # Headless mode
npm run test:e2e:ui        # Interactive UI mode
npm run test:e2e:headed    # With browser visible
npm run test:e2e:debug     # Debug mode

# Run all tests
npm run test:all           # Jest + Playwright
```

## Test Types

### 1. Unit Tests (`tests/unit/`)

**Purpose:** Test individual functions and modules in isolation.

**Coverage:**
- `utils.test.ts` - Utility functions (formatPrice, slugify, truncate, cn)
- `razorpay.test.ts` - Payment signature verification, order ID generation, amount conversion
- `delhivery.test.ts` - Pincode validation, shipment data formatting, tracking response parsing
- `cart.test.ts` - Cart calculations, item operations, validation

**Example:**
```typescript
describe('Payment Signature Verification', () => {
  it('should verify valid payment signature', () => {
    const isValid = verifySignature(orderId, paymentId, signature, secret);
    expect(isValid).toBe(true);
  });
});
```

### 2. Integration Tests (`tests/integration/`)

**Purpose:** Test API routes and external service integrations with mocked responses.

**Coverage:**
- Shipping API (pincode check)
- Razorpay API (order creation, payment verification)
- Products API (fetch, filter)
- Shopify order creation

**Example:**
```typescript
describe('Shipping API - Check Pincode', () => {
  it('should return serviceable for valid pincode', async () => {
    const response = await fetch('/api/shipping/check-pincode?pincode=411045');
    const data = await response.json();
    expect(data.serviceable).toBe(true);
  });
});
```

### 3. Component Tests (`tests/components/`)

**Purpose:** Test React components with user interactions.

**Coverage:**
- Checkout form validation
- Address validation
- Order summary calculations
- Pincode serviceability UI

**Example:**
```typescript
describe('Customer Information Validation', () => {
  it('should validate correct email format', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
});
```

### 4. E2E Tests (`e2e/`)

**Purpose:** Test complete user flows in a real browser.

**Coverage:**
- Full checkout flow (browse → cart → checkout → payment)
- Product browsing and filtering
- Navigation between pages
- Responsive design (mobile, tablet, desktop)
- Performance (page load times)
- API endpoint responses

**Example:**
```typescript
test('should complete full checkout flow', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-card"]');
  await page.click('button:has-text("Add to Cart")');
  await page.goto('/checkout');
  // Fill form and verify
});
```

## Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
```

### Playwright Configuration (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
});
```

## Mock Handlers

Located in `tests/mocks/handlers.ts`, these provide consistent mock responses for testing:

- `mockProducts` - Sample product data
- `mockPincodeResponse` - Pincode serviceability responses
- `mockRazorpayOrder` - Razorpay order creation response
- `mockShopifyOrder` - Shopify order response
- `setupMockFetch()` - Helper to setup global fetch mocking

## Running Tests

### Development Workflow

1. **During development:** Use watch mode
   ```bash
   npm run test:watch
   ```

2. **Before committing:** Run full test suite
   ```bash
   npm run test:all
   ```

3. **Check coverage:** Generate coverage report
   ```bash
   npm run test:coverage
   ```

### CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Run Tests
  run: |
    npm ci
    npm run test:coverage
    npx playwright install
    npm run test:e2e
```

## Test Data

### Test Pincode
- Serviceable: `411045` (Pune)
- Non-serviceable: `999999`

### Test Payment (Razorpay Test Mode)
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

### Test Customer
```json
{
  "firstName": "Test",
  "lastName": "Customer",
  "email": "test@example.com",
  "phone": "9876543210",
  "address1": "123 Test Street",
  "city": "Pune",
  "state": "Maharashtra",
  "pincode": "411045"
}
```

## Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Lines | 50% | - |
| Functions | 50% | - |
| Branches | 50% | - |
| Statements | 50% | - |

## Best Practices

1. **Write tests first** for new features (TDD)
2. **Keep tests isolated** - each test should be independent
3. **Use meaningful test names** - describe what is being tested
4. **Mock external services** - don't hit real APIs in tests
5. **Test edge cases** - empty inputs, invalid data, errors
6. **Keep tests fast** - unit tests should run in milliseconds
7. **Review test coverage** - aim for critical paths first

## Troubleshooting

### Common Issues

1. **Tests timeout:** Increase timeout in jest.config.js or playwright.config.ts
2. **Mock not working:** Ensure mock is set up before the test runs
3. **E2E tests fail:** Check if dev server is running on port 3000
4. **Import errors:** Verify moduleNameMapper paths in jest.config.js

### Debug Commands

```bash
# Debug Jest tests
npm run test -- --verbose

# Debug Playwright tests
npm run test:e2e:debug

# Run single test file
npm test -- tests/unit/razorpay.test.ts

# Run single E2E test
npx playwright test e2e/checkout.spec.ts
```

## Contributing

When adding new tests:
1. Place unit tests in `tests/unit/`
2. Place integration tests in `tests/integration/`
3. Place component tests in `tests/components/`
4. Place E2E tests in `e2e/`
5. Update this documentation if adding new test categories
