import { Button } from "./components.js";
import { ControlMenu } from "./controls.js";
import { LevelSelection } from "./levelSelect.js";
import { Pos, TRect } from "./transform.js";

export class Menu
{
    constructor()
    {
        this.active = false;
        this.reader = undefined;

        this.state = 0;

        this.back = () =>
        {
            if (this.state == 1) this.levelSelect.deactivate();
            else if (this.state == 2) this.control.deactivate();
            else if (this.state == 3) this.scoreboard.deactivate();
            this.state = 0;
            this.activate();
        }
        this.levelSelect = new LevelSelection(this.back);
        this.control = new ControlMenu(this.back);
        this.scoreboard;

        this.elements =
        [
            new Button(() => {this.state = 1;this.levelSelect.activate();this.deactivateButtons();this.elements[0].activate();}, ["Jouer"], new TRect(960, 508, 208, 64), 64),
            new Button(() => {this.state = 2;this.control.activate();this.deactivateButtons();this.elements[1].activate();}, ["Contrôles"], new TRect(960, 672, 352, 64), 64)
        ];

        this.pauseMenu =
        [
            new Button(()=>{this.back()}, ["<<"], new TRect(192, 1014, 64,64), 64),
            new Button(()=>{this.resume()}, ["Continuer ->"], new TRect(960, 540, 64,64),64)
        ];

            for (const e of this.pauseMenu)
                e.deactivate();

        this.esc = (e) =>
        {
            if (e.code == "Escape")
            {
                this.back();
            }
        }

        this.resume = () =>
        {
            this.active = false;
            this.reader.chart.track.play();

            for (const e of this.pauseMenu)
                e.deactivate();

            this.state = 0;
        }

        this.pause = (e) =>
        {
            if (e.code == "Escape")
            {
                if (!this.active)
                {
                    this.active = true;
                    console.log(this.reader)
                    this.reader.chart.track.pause();

                    for (const e of this.pauseMenu)
                        e.activate();
                    
                    this.state = 4;
                }
                else
                {
                    this.resume();
                }
            }
        };
    }

    deactivateButtons()
    {
        for (const e of this.elements)
        {
            if (e.deactivate) e.deactivate();
        }
    }

    activate()
    {
        this.active = true;
        this.state = 0;
        for (const e of this.elements)
        {
            if (e.activate) e.activate();
        }
        window.addEventListener("keydown", this.esc);
        window.removeEventListener("keydown", this.pause);
    }

    deactivate()
    {
        this.active = false;
        this.levelSelect.deactivate();
        this.deactivateButtons();
        window.removeEventListener("keydown", this.esc);
        window.addEventListener("keydown", this.pause);
    }

    render(rr, reader, chart)
    {
        switch (this.state)
        {
            case 0:
                for (const e of this.elements)
                {
                    e.render(rr);
                }
                break;
            case 1:
                if (reader == undefined)
                {
                    if (chart.fresh && chart.fetching)
                    {
                        rr.write(["loading..."], "white", new Pos(960,540), 64, new Pos(-0.5,-0.5));
                    }
                    else
                    {
                        this.levelSelect.render(rr);
                    }
                }
                break;
            case 2:
                this.control.render(rr);
                break;
            case 3:
                this.scoreboard.render(rr);
                break;
            case 4:
                for (const e of this.pauseMenu)
                    e.render(rr);
                break;
        }
    }
}