import { inputTypes } from "../Engine/input.js";
import { Frame } from "./animator.js";
import { Sprite } from "./sprite.js";
import { Pos, TRect } from "./transform.js";

export class Player
{
    constructor(P=new Pos(0,0))
    {
        this.T = new TRect(P.x,P.y,256,256);
        this.invert = "";
        const w = 256;
        const h = 256;

        this.sprites = {
            "character": new Sprite(new TRect(P.x,P.y,w,h), "Character", 42,42, 4,
            [
                new Frame(0,0.2),
                new Frame(1,0.2),
                new Frame(2,0.2),
                new Frame(3,0.2)
            ], true, true),
            "Icharacter": new Sprite(new TRect(P.x,P.y,w,h), "Character/i", 42,42, 4,
            [
                new Frame(0,0.2),
                new Frame(1,0.2),
                new Frame(2,0.2),
                new Frame(3,0.2)
            ], true, true),

            "slash": new Sprite(new TRect(P.x,P.y,w,h), "Slash", 39,64, 8,
            [
                new Frame(0, 0.010),
                new Frame(1, 0.015),
                new Frame(2, 0.015),
                new Frame(3, 0.025),
                new Frame(4, 0.020),
                new Frame(5, 0.025),
                new Frame(6, 0.030),
                new Frame(7, 1.000)
            ], false, false),

            "Islash": new Sprite(new TRect(P.x,P.y,w,h), "Slash/i", 39,64, 8,
            [
                new Frame(0, 0.010),
                new Frame(1, 0.015),
                new Frame(2, 0.015),
                new Frame(3, 0.025),
                new Frame(4, 0.020),
                new Frame(5, 0.025),
                new Frame(6, 0.030),
                new Frame(7, 1.000)
            ], false, false),
            
            "parry": new Sprite(new TRect(P.x,P.y,w,h), "Slash", 39,64, 8,
            [
                new Frame(0, 0.010),
                new Frame(1, 0.015),
                new Frame(2, 0.015),
                new Frame(3, 0.025),
                new Frame(4, 0.020),
                new Frame(5, 0.025),
                new Frame(6, 0.030),
                new Frame(7, 1.000)
            ], false, false),

            "up": undefined,
            
            "down": undefined
        };
    }

    checkInput(input, clearedNoteType, time)
    {
        for (const type of inputTypes)
        {
            if (clearedNoteType == type && input.checkInput(type))
            {
                if (type == "up")
                {
                    this.T.y = 64;
                    this.invert = "I";
                }
                else if (type == "down")
                {
                    this.T.y = 1080-this.T.h-64;
                    this.invert = "";
                }
                if (this.sprites[this.invert+type] != undefined) this.sprites[this.invert+type].play(time);
            }
        }
    }

    update(time, input, clearedNoteType)
    {
        if (clearedNoteType != "") this.checkInput(input, clearedNoteType, time);

        for (const type of inputTypes)
        {
            if (this.sprites[this.invert+type] != undefined) this.sprites[this.invert+type].update(time, this.T);
        }
        this.sprites[this.invert+"character"].update(time, this.T);
    }

    render(rr)
    {
        for (const type of inputTypes)
        {
            if (this.sprites[this.invert+type] != undefined) this.sprites[this.invert+type].render(rr);
        }

        this.sprites[this.invert+"character"].render(rr);
    }
}