export class Input
{
    constructor()
    {
        this.inputs = {};
        this.held = {};

        this.keydown = window.addEventListener("keydown", (e) =>
        {
            this.held[e.code] = true;
            if (!this.held[e.code]) this.inputs[e.code] = true;
        });
        this.keyup = window.addEventListener("keyup", (e) =>
        {
            delete this.held[e.code];
        })

        this.mousedown = window.addEventListener("mousedown", (e) =>
        {
            this.inputs[e.button] = true;
        });
    }

    checkInput(type = "slash")
    {
        for (let i = 0; i < keyBinds[type].length; i++)
        {
            if (this.inputs[keyBinds[type][i]]) return true;
        }
        return false;
    }

    clear()
    {
        this.inputs = {};
    }
}

export const inputTypes = ["up", "down", "slash", "parry"];

export let keyBinds =
{
    "up": ["ShiftLeft", "KeyW"],
    "down": ["Space", "KeyS"],
    "slash": [0],
    "parry": [2]
}