export class Input
{
    constructor()
    {
        this.inputs = {};
        this.held = {};

        this.keydown = window.addEventListener("keydown", (e) =>
        {
            if (!this.held[e.code]) this.inputs[e.code] = true;
            this.held[e.code] = true;
            console.log(this.inputs)
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

export const inputTypes = ["slash", "parry", "up", "down"];

export const typeIndex =
{
    "slash" :0,
    "parry" :1,
    "up"    :2,
    "down"  :3
};

export let keyBinds =
{
    "up": ["Space", "KeyW"],
    "down": ["ShiftLeft", "KeyS"],
    "slash": [0, "KeyJ"],
    "parry": [2, "KeyK"]
}