const haveEvents = 'ongamepadconnected' in  window;

let knownMappings = {};
let controllers = {};
const registerController = ({gamepad}) => {
  controllers[gamepad.index] = gamepad;
  knownMappings[gamepad.id] = knownMappings[gamepad.id] || {};
  console.log(Object.keys(controllers), Object.keys(knownMappings));
}

const removeController = ({gamepad}) => {
  delete controllers[gamepad.index];
}


window.addEventListener("gamepadconnected", registerController);
window.addEventListener("gamepaddisconnected", removeController);
