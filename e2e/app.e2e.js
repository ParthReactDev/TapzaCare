describe('Tapza Healthcare E2E Flows', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate through Splash and render config-driven Home feed', async () => {
    await expect(element(by.text('TAPZA'))).toBeVisible();
    await element(by.text('Get Started →')).tap();

    // Verify GET /config served Home
    await expect(element(by.text('TAPZA'))).toBeVisible();
    await expect(element(by.text('🌿 Standard Care'))).toBeVisible();
  });

  it('should switch between Normal and Diwali festival configs seamlessly', async () => {
    await element(by.text('Get Started →')).tap();

    // Switch to Diwali
    await element(by.text('Switch to Diwali 🪔')).tap();
    await expect(element(by.text('Happy Diwali! 🪔 Deepavali Subhakankshalu'))).toBeVisible();

    // Switch back to Normal
    await element(by.text('Switch to Normal')).tap();
    await expect(element(by.text('Namaskaram, Alex 👋'))).toBeVisible();
  });

  it('should complete Doctor booking with slot selection (POST /bookings)', async () => {
    await element(by.text('Get Started →')).tap();

    // Open booking sheet from doctor
    await element(by.text('Book Slot')).atIndex(0).tap();
    await expect(element(by.text('Schedule Appointment'))).toBeVisible();

    // Pick slot and confirm
    await element(by.text('10:30 AM')).tap();
    await element(by.text('Confirm (POST /bookings)')).tap();

    // Expect 201 Created and success screen
    await expect(element(by.text('Booking Confirmed! (201 Created)'))).toBeVisible();
    await element(by.text('Back to Home')).tap();
  });

  it('should view prescription and mark morning dose taken', async () => {
    await element(by.text('Get Started →')).tap();

    // Navigate to Medicines
    await element(by.text('Medicines')).tap();
    await expect(element(by.text("Today's Medication Schedule"))).toBeVisible();

    // Open first prescription
    await element(by.text('View Schedule →')).atIndex(0).tap();
    await expect(element(by.text('Daily Dose Schedule'))).toBeVisible();

    // Mark dose as taken
    await element(by.text('Mark Taken')).atIndex(0).tap();
    await expect(element(by.text('✓ Taken'))).toBeVisible();
  });
});
