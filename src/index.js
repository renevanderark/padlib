/*
const padEvents = initPadEvents();
console.log(padEvents);

Object.keys(padEvents).forEach((cur) => {
  window.addEventListener(`gamepad-${cur}-pressed`, (ev) => {
    console.log(`Controller ${ev.detail.controllerIndex} pressed: ${cur}`)
    console.log(JSON.stringify(controllers[0].buttons.map(b => b.pressed)))
  });
  window.addEventListener(`gamepad-${cur}-released`, (ev) =>
    console.log(`Controller ${ev.detail.controllerIndex} released: ${cur}`));
});
*/
const initPadEvents = (
  onUnmappedButton = i => console.warn("unmapped button index", i),
  defaultMappings = {
    "0": "x",
    "1": "a",
    "2": "b",
    "3": "y",
    "9": "start",
    "8": "select",
    "5": "rt-shoulder",
    "7": "rb-shoulder",
    "4": "lt-shoulder",
    "6": "lb-shoulder",
    "10": "l-axis",
    "11": "r-axis",
    "12": "up",
    "13": "down",
    "14": "left",
    "15": "right"}) => {

  const padEvents = [
    "a", "b", "x", "y",
    "start", "select",
    "rt-shoulder", "rb-shoulder",
    "lt-shoulder", "lb-shoulder",
    "l-axis", "r-axis",
    "l-axis-left", "l-axis-right",
    "l-axis-up", "l-axis-down",
    "r-axis-left", "r-axis-right",
    "r-axis-up", "r-axis-down"
  ].reduce((acc, cur) => {
      acc[cur] = {
        pressed: `gamepad-${cur}-pressed`,
        released: `gamepad-${cur}-released`
      };
      return acc;
  }, {});

  let controllers = {};
  let keymaps = {};
  let buttonstates = {};
  let axisStates = {};
  let axisCalibrations = {};

  const initButtonStates = (keymap) =>
    Object.keys(keymap).reduce((acc, cur) => {
      acc[keymap[cur]] = false;
      return acc;
    }, {});

  const roundOffAxisValue = (axis) =>
    Math.round(axis * 100);

  const calibrateAxisValue = (axis, calib) =>
    axis === 1.0 ? 100 :
      axis === -1.0 ? -100 :
       roundOffAxisValue(axis) - calib;

  const registerController = (ev) => {
    controllers[ev.gamepad.index] = ev.gamepad;
    keymaps[ev.gamepad.index] = Object.assign({}, defaultMappings);
    buttonstates[ev.gamepad.index] = initButtonStates(keymaps[ev.gamepad.index]);
    axisStates[ev.gamepad.index] = ev.gamepad.axes.map(axis => roundOffAxisValue(axis));
    axisCalibrations[ev.gamepad.index] = [];
  }

  const removeController = ({gamepad}) => {
    delete controllers[gamepad.index];
    delete keymaps[gamepad.index];
    delete buttonstates[gamepad.index];
    delete axisStates[gamepad.index];
    delete axisCalibrations[gamepad.index];
  }

  function dispatchPadEvents() {
    for (let idx in controllers) {
      const controller = controllers[idx];

      if (axisCalibrations[idx].length === 0) {
        axisCalibrations[idx] = controller.axes.map(axis => roundOffAxisValue(axis))
        axisStates[idx] = controller.axes.map((axis, j) =>
          calibrateAxisValue(axis,  axisCalibrations[idx][j]));

      }

      for (let i in controller.buttons) {
        const { pressed } = controller.buttons[i];
        const buttonMapping = keymaps[idx][i];

        if (buttonMapping && buttonstates[idx][buttonMapping] !== pressed) {
          buttonstates[idx][buttonMapping] = pressed;
          window.dispatchEvent(new CustomEvent(
            padEvents[buttonMapping][pressed ? "pressed" : "released"],
            {detail: {controllerIndex: idx}}
          ));
          console.log(axisStates[idx],
            controller.axes.map((axis, j) =>
             calibrateAxisValue(axis,  axisCalibrations[idx][j])));
        }

        if (onUnmappedButton && pressed && !buttonMapping) {
          onUnmappedButton(i);
        }
      }
    }

    requestAnimationFrame(dispatchPadEvents);
  }

  dispatchPadEvents();


  window.addEventListener("gamepadconnected", registerController);
  window.addEventListener("gamepaddisconnected", removeController);
  return padEvents;
}

module.exports = { initPadEvents: initPadEvents }
