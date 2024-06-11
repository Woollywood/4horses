import "./assets/styles/tailwind.css";
import "./assets/styles/common.css";
import "./assets/styles/animation.css";

import { setupRunningField } from "./scripts/animation";
import { observerInit } from "./scripts/scroll";

document.addEventListener("DOMContentLoaded", () => {
  setupRunningField();
  observerInit();
});
