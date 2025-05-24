import { inputTypes } from "../Engine/input.js";
import { Frame } from "./animator.js";
import { Sprite } from "./sprite.js";
import { TRect } from "./transform.js";

export class Player
{
    constructor()
    {
        this.sprites = {
            "up": new Sprite(new TRect(0,0,39*4,64*4), "Slash", 39,64, 8,
            [
                new Frame(0, 0.010),
                new Frame(1, 0.015),
                new Frame(2, 0.015),
                new Frame(3, 0.025),
                new Frame(4, 0.020),
                new Frame(5, 0.025),
                new Frame(6, 0.030),
                new Frame(7, 1.000)
            ], false),
            
            "down": new Sprite(new TRect(0,0,39*4,64*4), "Slash", 39,64, 8,
            [
                new Frame(0, 0.010),
                new Frame(1, 0.015),
                new Frame(2, 0.015),
                new Frame(3, 0.025),
                new Frame(4, 0.020),
                new Frame(5, 0.025),
                new Frame(6, 0.030),
                new Frame(7, 1.000)
            ], false),
            
            "slash": new Sprite(new TRect(0,0,39*4,64*4), "Slash", 39,64, 8,
            [
                new Frame(0, 0.010),
                new Frame(1, 0.015),
                new Frame(2, 0.015),
                new Frame(3, 0.025),
                new Frame(4, 0.020),
                new Frame(5, 0.025),
                new Frame(6, 0.030),
                new Frame(7, 1.000)
            ], false),
            
            "parry": new Sprite(new TRect(0,0,39*4,64*4), "Slash", 39,64, 8,
            [
                new Frame(0, 0.010),
                new Frame(1, 0.015),
                new Frame(2, 0.015),
                new Frame(3, 0.025),
                new Frame(4, 0.020),
                new Frame(5, 0.025),
                new Frame(6, 0.030),
                new Frame(7, 1.000)
            ], false)
        };
    }

    checkInput(input, time)
    {
        for (const type of inputTypes)
        {
            if (input.checkInput(type))
                this.sprites[type].play(time);
        }
    }

    update(time, input)
    {
        this.checkInput(input, time);

        for (const type of inputTypes)
        {
            this.sprites[type].update(time);
        }
    }

    render(rr)
    {
        for (const type of inputTypes)
        {
            this.sprites[type].render(rr);
        }
    }
}