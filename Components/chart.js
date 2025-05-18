import { Fetch } from "./fetcher.js";

export class Chart
{
    constructor(title)
    {
        this.title = title;

        this.chart;
        this.track = new Audio();
    }

    async FetchChart(path)
    {
        await Fetch((result) => this.chart = result, "../Assets/Charts/"+path+"/chart.json");
        this.chart[0].y = 1;
        this.track.src = "../Assets/Charts/"+path+"/track.wav";
        this.track.currentTime = 0;
    }

    start()
    {
        this.track.play();
    }
}