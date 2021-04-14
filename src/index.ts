import * as _ from "lodash";
import "./style/reset.scss";
import "./style/main.scss";

import { PaintCanvas } from "./ts/canvas"

const hoge = require("./ts/description");

const heading_div = document.createElement("div");
heading_div.id = "heading";
heading_div.textContent = "TS Template!";

const wrapper = document.createElement("div");
wrapper.className = "wrapper";
wrapper.appendChild(heading_div);
wrapper.appendChild(hoge.addDiv());



const pcanvas = new PaintCanvas({ width: 500, height: 500 });

/**
 *  
 */
const status_point = document.createElement("span");
status_point.id = "status_point"
status_point.textContent = "None,None";
const status = document.createElement("div");
status.id = "status";

/**
 *  append Child
 */
status.appendChild(status_point);
const cv_wrapper = pcanvas.getDrawApp;
cv_wrapper.appendChild(status);
wrapper.appendChild(cv_wrapper);
document.body.appendChild(wrapper);
