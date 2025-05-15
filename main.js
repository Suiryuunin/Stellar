import { Fetch } from "./Engine/fetcher.js";

let json;

await Fetch((result) => json = result, "../Assets/Charts/HeiligesRequiem/lead.json");
console.log(json)