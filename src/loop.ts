class MockSystem {
  private name: string;
  private updateCount = 0;

  constructor(name: string) {
    this.name = name;
  }

  public update(timeStep: number): void {
    this.updateCount++;
    console.log(
      `[${this.name}] Updating system with time step: ${timeStep}. Update count: ${this.updateCount}`
    );
  }
}

const LOOP_CONFIG = {
  TIME_STEP: 1 / 144,
  MAX_UPDATES_PER_FRAME: 10,
  FPS_DECAY: 0.1,
  FPS_CAP: 10,
};

class SimpleGameLoop {
  private fps = 1 / LOOP_CONFIG.TIME_STEP;
  private lastTimestamp = 0;
  private animationFrameId: number | null = null;
  private running = false;

  private systems: MockSystem[] = [];

  public start(): void {
    if (!this.running) {
      console.log("Starting app loop and scheduleNextFrame");
      this.running = true;
      this.scheduleNextFrame();
    }
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.fps = 1 / LOOP_CONFIG.TIME_STEP;
    this.lastTimestamp = 0;
    this.running = false;
    console.log("Stopping game loop");
  }

  public addSystem(system: MockSystem): void {
    this.systems.push(system);
  }

  private calculateDelta(currentTimestamp: number): number {
    const firstFrame = this.lastTimestamp === 0;

    if (firstFrame) {
        this.lastTimestamp = currentTimestamp;
        return LOOP_CONFIG.TIME_STEP;
    }
    return (currentTimestamp - this.lastTimestamp) / 1000;
  }

  private update(currentTimestamp: number): void {
    const fpsCapped = LOOP_CONFIG.FPS_CAP > 0;
    const fpsCap = 1 / LOOP_CONFIG.FPS_CAP;
    const fpsCapMs = fpsCap * 1000;
    const fpsReached = currentTimestamp < this.lastTimestamp + fpsCapMs;

    if (fpsCapped && fpsReached) {
      console.log(`!!! FPS cap reached: ${LOOP_CONFIG.FPS_CAP}`);
      this.scheduleNextFrame();
      return;
    }

    let updates = 0;
    let dt = this.calculateDelta(currentTimestamp);
    console.log(`--- Delta time: ${dt}`);

    if (dt < LOOP_CONFIG.TIME_STEP) {
      console.log(`<<< Delta time: ${dt} lower then time step: ${LOOP_CONFIG.TIME_STEP}`);

      this.scheduleNextFrame();
      return;
    }

    this.fps =
      LOOP_CONFIG.FPS_DECAY * (1 / dt) + (1 - LOOP_CONFIG.FPS_DECAY) * this.fps;

    while (this.running && dt >= LOOP_CONFIG.TIME_STEP) {
      console.log(`>>> Delta time: ${dt} bigger or equal then time step: ${LOOP_CONFIG.TIME_STEP}`);

      this.simulate(LOOP_CONFIG.TIME_STEP);

      dt -= LOOP_CONFIG.TIME_STEP;
      updates++;

      if (updates >= LOOP_CONFIG.MAX_UPDATES_PER_FRAME) {
        console.error("Update loop can't keep up!");
        this.lastTimestamp = 0;
        break;
      }
    }

    this.lastTimestamp = currentTimestamp;

    if (this.running) {
      this.scheduleNextFrame();
    }

    console.log(
      `FPS: ${this.fps.toFixed(
        2
      )}, Updates: ${updates}, Current Time: ${currentTimestamp}`
    );
  }

  private scheduleNextFrame(): void {
    this.animationFrameId = requestAnimationFrame(this.update.bind(this));
    console.log("[ ] Scheduling next frame => ", this.animationFrameId);
  }

  private simulate(timeStep: number): void {
    // Simulate game logic here
    console.log(`* Simulating updates with time step: ${timeStep}`);

    // Update all systems
    for (const system of this.systems) {
      system.update(timeStep);
    }
  }
}

// Example usage:
const gameLoop = new SimpleGameLoop();

const system1 = new MockSystem("System1");
const system2 = new MockSystem("System2");
const system3 = new MockSystem("System3");

gameLoop.addSystem(system1);
gameLoop.addSystem(system2);
gameLoop.addSystem(system3);

gameLoop.start();

// To stop the game loop after 5 seconds for demonstration:
setTimeout(() => gameLoop.stop(), 5000);
