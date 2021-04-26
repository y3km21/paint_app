import { memory } from "../../wasm/pkg/index_bg.wasm";
import { WasmCanvas } from "wasm";
import { CanvasSize, RGBAColor, PaletteColor, ModeStatus, AppStatusInput, AppStatus } from "./common";
import { ColorPalette } from "./colorPalette";
import { ActionButtons } from "./actionButtons";

/**
 * interface : PascalCase
 * class : PascalCase
 * function : CamelCase
 * method : CamelCase
 * local variable : CamelCase
 * wasm method : SnakeCase
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

export { PaintCanvas };