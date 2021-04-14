import { memory } from "../wasm/pkg/index_bg.wasm";
import { WasmCanvas } from "wasm";

/**
 * interface : PascalCase
 * class : PascalCase
 * function : CamelCase
 * method : CamelCase
 * local variable : CamelCase
 * wasm method : SnakeCase
 */


interface CanvasSize {
    width: number;
    height: number;
}

interface RGBColor {
    red: number;
    green: number;
    blue: number;
}

interface PaletteColor extends RGBColor {
    name: string;
}

class ColorPalette {
    palette: HTMLDivElement;
    paletteColorArray: Array<PaletteColor>;
    pipetteColor: PaletteColor = { name: "pipetteColor", red: 255, green: 255, blue: 255 };
    getAppStatusCallback: () => AppStatus;
    setAppStatusCallback: (appStatus: AppStatusInput) => void;

    constructor(
        getAppStatusCallback: () => AppStatus,
        setAppStatusCallback: (appStatus: AppStatusInput) => void,
    ) {
        this.getAppStatusCallback = getAppStatusCallback;
        this.setAppStatusCallback = setAppStatusCallback;
        this.paletteColorArray = [
            this.pipetteColor,
            { name: "black", red: 0, green: 0, blue: 0 },
            { name: "gray", red: 128, green: 128, blue: 128 },
            { name: "light-gray", red: 211, green: 211, blue: 211 },
            { name: "white", red: 255, green: 255, blue: 255 },
            { name: "red", red: 255, green: 0, blue: 0 },
            { name: "orange", red: 255, green: 165, blue: 0 },
            { name: "yellow", red: 255, green: 255, blue: 0 },
            { name: "lime", red: 0, green: 255, blue: 0 },
            { name: "cyan", red: 0, green: 255, blue: 255 },
            { name: "magenda", red: 255, green: 0, blue: 255 },
            { name: "maroon", red: 80, green: 0, blue: 0 },
            { name: "wheat", red: 245, green: 222, blue: 179 },
            { name: "olive", red: 80, green: 80, blue: 0 },
            { name: "green", red: 0, green: 80, blue: 0 },
            { name: "blue", red: 0, green: 0, blue: 255 },
            { name: "purple", red: 80, green: 0, blue: 80 },
            { name: "indigo", red: 75, green: 0, blue: 130 },

        ]

        this.palette = document.createElement("div");
        this.palette.id = "palette"

        this.paletteColorArray.forEach(elem => {
            var paletteCell = document.createElement("div");
            paletteCell.id = elem.name;
            paletteCell.className = "paletteCell";
            paletteCell.setAttribute("style", `background-color: rgb(${elem.red}, ${elem.green},${elem.blue})`)
            paletteCell.addEventListener("click", e => {
                if (elem.name === "pipetteColor") {
                    this.setAppStatusCallback({ modeStatus: ModeStatus.DrawingWait, color: this.pipetteColor });
                } else {
                    this.setAppStatusCallback({ modeStatus: ModeStatus.DrawingWait, color: elem });
                }
            })
            this.palette.appendChild(paletteCell);

        });

    }

    get getPalette() {
        return this.palette;
    }

    set setPipetteColor(newcolor: PaletteColor) {
        this.pipetteColor = newcolor;
        this.setAppStatusCallback({ color: this.pipetteColor });
    }

    public currentColorPaletteCellHighlight(colorPaletteCellId: string) {
        this.palette.querySelectorAll("div[selectPaletteCell=true]").forEach(elem => elem.removeAttribute("selectPaletteCell"));
        let currentColorPaletteCellDiv = this.palette.querySelector(`#${colorPaletteCellId}`);
        currentColorPaletteCellDiv.setAttribute("selectPaletteCell", "true");
        if (colorPaletteCellId === "pipetteColor") {
            currentColorPaletteCellDiv.setAttribute("style", `background-color: rgb(${this.pipetteColor.red},${this.pipetteColor.green},${this.pipetteColor.blue})`);
        }
    }

    public update() {
        this.currentColorPaletteCellHighlight(this.getAppStatusCallback().color.name);
    }
}

enum ModeStatus {
    DrawingWait,
    Drawing,
    PipetteWait,
    Pipette,
}

interface AppStatusInput {
    modeStatus?: ModeStatus;
    color?: PaletteColor;
    x?: number;
    y?: number;
}

class AppStatus {
    modeStatus: ModeStatus = ModeStatus.DrawingWait;
    color: PaletteColor = { name: "black", red: 0, green: 0, blue: 0 };
    x: number = 0;
    y: number = 0;
    updateCallbacks: Array<() => void> = [];

    constructor() {
    }

    set setAppStatus(appStatusInput: AppStatusInput) {
        this.modeStatus = appStatusInput.modeStatus === undefined ? this.modeStatus : appStatusInput.modeStatus;
        this.x = appStatusInput.x === undefined ? this.x : appStatusInput.x;
        this.y = appStatusInput.y === undefined ? this.y : appStatusInput.y;
        this.color = appStatusInput.color === undefined ? this.color : appStatusInput.color;

        this.updateApp();

    }

    public updateApp() {
        this.updateCallbacks.forEach(elem => {
            elem();
        })
    }

    set addUpdateCallback(updateCallback: () => void) {
        this.updateCallbacks.push(updateCallback);
    }

    get getAppStatus() {
        return this;
    }

}

class ActionButtons {
    buttons: HTMLDivElement;
    getAppStatusCallback: () => AppStatus;
    setAppStatusCallback: (appStatus: AppStatusInput) => void;


    constructor(getAppStatusCallback: () => AppStatus, setAppStatusCallback: (appStatus: AppStatusInput) => void) {
        this.getAppStatusCallback = getAppStatusCallback;
        this.setAppStatusCallback = setAppStatusCallback;

        this.buttons = document.createElement("div");
        this.buttons.id = "actionButtons";
        /**
         * Brush Button
         */
        let brushButton = document.createElement("button");
        brushButton.id = "brushButton";
        brushButton.textContent = "Brush";
        brushButton.addEventListener("click", e => {
            this.changeBrushMode();
        });
        this.buttons.appendChild(brushButton);

        /**
         * Pipette Button
         */
        let pipetteButton = document.createElement("button");
        pipetteButton.textContent = "Pipette";
        pipetteButton.id = "pipetteButton"
        pipetteButton.addEventListener("click", e => {
            this.changePipetteMode();
        });
        this.buttons.appendChild(pipetteButton);

    }

    get getActionButtons() {
        return this.buttons;
    }

    public update() {
        console.log("aaa")
        this.currentModeHighlight();
    }

    public changeBrushMode() {
        this.setAppStatusCallback({ modeStatus: ModeStatus.DrawingWait });
        console.log("BrushMode");

    }

    public changePipetteMode() {
        this.setAppStatusCallback({ modeStatus: ModeStatus.PipetteWait });
        console.log("PipetteMode");
    }

    protected currentModeHighlight() {
        console.log(this.getAppStatusCallback());
        this.buttons.querySelectorAll("button[currentModeHighlight=true]").forEach(elem => elem.removeAttribute("currentModeHighlight"));
        switch (this.getAppStatusCallback().modeStatus) {
            case ModeStatus.DrawingWait:
            case ModeStatus.Drawing:
                this.buttons.querySelector("#brushButton").setAttribute("currentModeHighlight", "true");
                break;
            case ModeStatus.PipetteWait:
            case ModeStatus.Pipette:
                this.buttons.querySelector("#pipetteButton").setAttribute("currentModeHighlight", "true");
                break;
        }
    }
}
/**
 * 
 * 
 */
class PaintCanvas {
    width: number;
    height: number;
    wasmCanvas: WasmCanvas;
    canvas: HTMLCanvasElement;
    drawApp: HTMLDivElement;
    appStatus: AppStatus;

    constructor(canvasSize: CanvasSize) {
        this.width = canvasSize.width;
        this.height = canvasSize.height;
        this.wasmCanvas = WasmCanvas.new(this.width, this.height);

        /**
         * App Status
         */
        let updateDrawColorCallback = (): void => {
            this.updateDrawColor();
        }
        this.appStatus = new AppStatus();;
        this.appStatus.addUpdateCallback = updateDrawColorCallback;

        this.canvas = document.createElement("canvas");
        this.canvas.id = "draw_canvas";
        this.canvas.width = this.width;
        this.canvas.height = this.height;


        /**
         * App Status Callback
         */

        let getAppStatusCallback = (): AppStatus => {
            return this.appStatus.getAppStatus;
        }
        let setAppStatusCallback = (appStatusInput: AppStatusInput) => {
            this.appStatus.setAppStatus = appStatusInput;
        }

        /**
         * Action Buttons
         */
        let buttonsAndCanvas = document.createElement("div");
        buttonsAndCanvas.id = "buttonsAndCanvas";
        let actionButtons = new ActionButtons(getAppStatusCallback, setAppStatusCallback);
        let actionButtonsUpdateCallback = (): void => {
            actionButtons.update();
        }
        this.appStatus.addUpdateCallback = actionButtonsUpdateCallback;
        buttonsAndCanvas.appendChild(actionButtons.getActionButtons);
        buttonsAndCanvas.appendChild(this.canvas);

        /**
         *  Color Palette 
         */


        let palette = new ColorPalette(getAppStatusCallback, setAppStatusCallback);
        let paletteUpdateCallback = (): void => {
            palette.update();
        }
        this.appStatus.addUpdateCallback = paletteUpdateCallback;


        this.drawApp = document.createElement("div");
        this.drawApp.id = "drawApp";
        this.drawApp.appendChild(palette.getPalette);
        this.drawApp.appendChild(buttonsAndCanvas);

        this.appStatus.updateApp();
        this.updateCanvas();

        /**
         *  draw Events
         */
        this.canvas.addEventListener("mousedown", e => {
            if (e.button == 0) {

                if (this.appStatus.modeStatus === ModeStatus.DrawingWait) {
                    this.appStatus.setAppStatus = { modeStatus: ModeStatus.Drawing, x: clamp(e.offsetX, this.width), y: clamp(e.offsetY, this.height) };
                    this.wasmCanvas.draw(this.appStatus.x, this.appStatus.y);
                    this.updateCanvas();
                } else if (this.appStatus.modeStatus === ModeStatus.PipetteWait) {
                    this.appStatus.setAppStatus = { modeStatus: ModeStatus.Pipette, x: clamp(e.offsetX, this.width), y: clamp(e.offsetY, this.height) };
                    var pipetteColor = this.wasmCanvas.pipette(this.appStatus.x, this.appStatus.y);
                    delete pipetteColor.alpha;
                    pipetteColor.name = "pipetteColor"
                    palette.setPipetteColor = pipetteColor
                }
            }
        })

        this.canvas.addEventListener("mousemove", e => {
            if (this.appStatus.modeStatus === ModeStatus.Drawing) {
                this.wasmCanvas.draw_line(this.appStatus.x, this.appStatus.y, clamp(e.offsetX, this.width), clamp(e.offsetY, this.height));
                this.appStatus.setAppStatus = { modeStatus: this.appStatus.modeStatus, x: clamp(e.offsetX, this.width), y: clamp(e.offsetY, this.height) };

                this.updateCanvas();

            } else if (this.appStatus.modeStatus === ModeStatus.Pipette) {
                this.appStatus.setAppStatus = { modeStatus: ModeStatus.Pipette, x: clamp(e.offsetX, this.width), y: clamp(e.offsetY, this.height) };
                var pipetteColor = this.wasmCanvas.pipette(this.appStatus.x, this.appStatus.y);
                delete pipetteColor.alpha;
                pipetteColor.name = "pipetteColor"
                palette.setPipetteColor = pipetteColor;
            }
        })

        window.addEventListener("mouseup", e => {
            if (this.appStatus.modeStatus == ModeStatus.Drawing) {
                this.appStatus.setAppStatus = { modeStatus: ModeStatus.DrawingWait, x: 0, y: 0 };
            } else if (this.appStatus.modeStatus === ModeStatus.Pipette) {
                this.appStatus.setAppStatus = { modeStatus: ModeStatus.PipetteWait, x: 0, y: 0 };
            }
        })

    }

    get canvasElement(): HTMLCanvasElement {
        return this.canvas;
    }

    get getDrawApp(): HTMLDivElement {
        return this.drawApp;
    }

    get getWidth(): number {
        return this.width;
    }

    get getHeight(): number {
        return this.height;
    }

    public async updateCanvas() {
        const wasmCanvas_buf_ptr = this.wasmCanvas.pixels();
        const wasmCanvas_buf = new Uint8ClampedArray(memory.buffer, wasmCanvas_buf_ptr, this.width * this.height * 4);
        const cv_image_data = new ImageData(wasmCanvas_buf, this.width, this.height);
        this.canvas.getContext('2d').putImageData(cv_image_data, 0, 0);
    }

    public draw(x: number, y: number) {
        this.wasmCanvas.draw(clamp(x, this.width), clamp(y, this.height));
    }

    public drawLine(x: number, y: number, e_x: number, e_y: number) {
        this.wasmCanvas.draw_line(clamp(x, this.width), clamp(y, this.width), clamp(e_x, this.width), clamp(e_y, this.height));
    }


    public updateDrawColor() {
        let value = this.appStatus.color;
        this.wasmCanvas.draw_color_set(value.red, value.green, value.blue);
    }




}

function clamp(val: number, limit: number) {
    return Math.min(Math.max(0, val), limit - 1);
}

export { PaintCanvas, clamp };