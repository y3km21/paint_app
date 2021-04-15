import { CanvasSize, RGBAColor, PaletteColor, ModeStatus, AppStatusInput, AppStatus } from "./common";

class ColorPalette {
    palette: HTMLDivElement;
    paletteColorArray: Array<PaletteColor>;
    pipetteColor: PaletteColor = { name: "pipetteColor", red: 255, green: 255, blue: 255, alpha: 255 };
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
            { name: "black", red: 0, green: 0, blue: 0, alpha: 0 },
            { name: "gray", red: 128, green: 128, blue: 128, alpha: 0 },
            { name: "light-gray", red: 211, green: 211, blue: 211, alpha: 0 },
            { name: "white", red: 255, green: 255, blue: 255, alpha: 0 },
            { name: "red", red: 255, green: 0, blue: 0, alpha: 0 },
            { name: "orange", red: 255, green: 165, blue: 0, alpha: 0 },
            { name: "yellow", red: 255, green: 255, blue: 0, alpha: 0 },
            { name: "lime", red: 0, green: 255, blue: 0, alpha: 0 },
            { name: "cyan", red: 0, green: 255, blue: 255, alpha: 0 },
            { name: "magenda", red: 255, green: 0, blue: 255, alpha: 0 },
            { name: "maroon", red: 80, green: 0, blue: 0, alpha: 0 },
            { name: "wheat", red: 245, green: 222, blue: 179, alpha: 0 },
            { name: "olive", red: 80, green: 80, blue: 0, alpha: 0 },
            { name: "green", red: 0, green: 80, blue: 0, alpha: 0 },
            { name: "blue", red: 0, green: 0, blue: 255, alpha: 0 },
            { name: "purple", red: 80, green: 0, blue: 80, alpha: 0 },
            { name: "indigo", red: 75, green: 0, blue: 130, alpha: 0 },

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

export { ColorPalette };