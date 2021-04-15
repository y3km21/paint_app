import { CanvasSize, RGBAColor, PaletteColor, ModeStatus, AppStatusInput, AppStatus } from "./common";


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

export { ActionButtons };