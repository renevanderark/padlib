const padEvents = [
  "a", "b", "x", "y",
  "start", "select",
  "rt-shoulder", "rb-shoulder",
  "lt-shoulder", "lb-shoulder",
  "l-axis", "r-axis"
].reduce((acc, cur) => {
    acc[cur] = {
      pressed: `gamepad-${cur}-pressed`,
      released: `gamepad-${cur}-released`
    };
    return acc;
}, {});

const defaultMappings = {
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
  "15": "right"
};

const knownMappings = {
  "046d-c216-Logitech Dual Action": {
    ...defaultMappings
  }
};


let controllers = {};
let keymaps = {};
let buttonstates = {}

const initButtonStates = (keymap) =>
  Object.keys(keymap).reduce((acc, cur) => {
    acc[keymap[cur]] = false;
    return acc;
  }, {});

const registerController = (ev) => {
  controllers[ev.gamepad.index] = ev.gamepad;
  keymaps[ev.gamepad.index] = knownMappings[ev.gamepad.id] || defaultMappings;
  buttonstates[ev.gamepad.index] = initButtonStates(keymaps[ev.gamepad.index]);
}

const removeController = ({gamepad}) => {
  delete controllers[gamepad.index];
}

function dispatchPadEvents() {
  for (let idx in controllers) {
    const controller = controllers[idx];

    for (let i in controller.buttons) {
      const { pressed, value } = controller.buttons[i];
      const buttonMapping = keymaps[idx][i];

      if (buttonMapping && buttonstates[idx][buttonMapping] !== pressed) {
        buttonstates[idx][buttonMapping] = pressed;
        window.dispatchEvent(new CustomEvent(
          padEvents[buttonMapping][pressed ? "pressed" : "released"],
          {detail: {controllerIndex: idx}}
        ));
      }

      if (pressed && !buttonMapping) {
        console.log("unmapped", i)
      }
    }


  }

  requestAnimationFrame(dispatchPadEvents);
}

dispatchPadEvents();

window.addEventListener("gamepadconnected", registerController);
window.addEventListener("gamepaddisconnected", removeController);
Object.keys(padEvents).forEach((cur) => {
  window.addEventListener(`gamepad-${cur}-pressed`, (ev) => {
    console.log(`Controller ${ev.detail.controllerIndex} pressed: ${cur}`)
    console.log(JSON.stringify(controllers[0].buttons.map(b => b.pressed)))
  });
  window.addEventListener(`gamepad-${cur}-released`, (ev) =>
    console.log(`Controller ${ev.detail.controllerIndex} released: ${cur}`));
});
