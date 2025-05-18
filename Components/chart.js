import { Fetch } from "./fetcher.js";

export class Chart
{
    constructor(title)
    {
        this.title = title;

        this.lead;
        this.bass;
        this.track = new Audio();
    }

    async FetchChart(path)
    {
        await Fetch((result) => this.lead = result, "../Assets/Charts/"+path+"/lead.json");
        await Fetch((result) => this.bass = result, "../Assets/Charts/"+path+"/bass.json");
        this.track.src = "../Assets/Charts/"+path+"/track.wav";
        this.track.currentTime = 0;
    }

    start()
    {
        this.track.play();
    }
}