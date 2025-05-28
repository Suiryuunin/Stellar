import { Button, Word } from "./components.js";
import { Pos, TRect } from "./transform.js";

export class ScoreBoard
{
    constructor(reader,back)
    {
        this.back = new Button(()=>{back()}, ["<<"], new TRect(192, 1014, 64,64), 64);
        this.active = false;
        const score = reader.score;
        let grade = "";
        if (score == 1000000)
            grade = "P";
        else if (score >= 950000)
            grade = "S";
        else if (score >= 900000)
            grade = "A";
        else if (score >= 800000)
            grade = "B";
        else if (score >= 700000)
            grade = "C";
        else if (score >= 600000)
            grade = "D";
        else
            grade = "F";

        let comment = "";
        switch(grade)
        {
            case "P":
                comment = "P";
                break;
            case "S":
                comment = "igma";
                break;
            case "A":
                comment = "ur";
                break;
            case "B":
                comment = "ruh";
                break;
            case "C":
                comment = "rash IN";
                break;
            case "D":
                comment = "...";
                break;
            case "F":
                comment = "ailure";
                break;
        }

        let s = ("000000" + Math.ceil(reader.score)).slice(-7);
        s = s.substring(0,1)+""+s.substring(1,4)+""+s.substring(4,7);
        this.content =
        [
            new Word([grade], new Pos(288, 256+256), 128),
            new Word([s], new Pos(1632, 256+256), 128, new Pos(-1, -0.5)),
            new Word([comment], new Pos(352, 304+256), 64, new Pos(0, -0.5))
        ];

        this.deactivate();
    }

    activate()
    {
        this.active = true;
        this.back.activate();
    }

    deactivate()
    {
        this.active = false;
        this.back.deactivate();
    }

    update()
    {
    }

    render(rr)
    {
        for (const e of this.content)
        {
            e.render(rr);
        }
        this.back.render(rr);
    }
}