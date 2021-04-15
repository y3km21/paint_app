interface CanvasSize {
    width: number;
    height: number;
}

interface RGBAColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

interface PaletteColor extends RGBAColor {
    name: string;
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
    color: PaletteColor = { name: "black", red: 0, green: 0, blue: 0, alpha: 0 };
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

export { CanvasSize, RGBAColor, PaletteColor, ModeStatus, AppStatusInput, AppStatus };
