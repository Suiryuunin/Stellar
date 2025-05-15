let sound = true;

function A_Normal(i)
{
    if (!sound) return;

    const audio = new Audio(`Assets/Notes/${i}.mp3`);
    audio.play();
}
function A_Destroy(i)
{
    if (!sound) return;
    
    const audio = new Audio(`Assets/Notes/Destroy/${i}.mp3`);
    audio.play();
}
function A_Crash(i)
{
    if (!sound) return;
    
    const audio = new Audio(`Assets/Notes/Crash/${i}.mp3`);
    audio.play();
}

function A_Play()
{
    if (!sound) return;
    
    const audio = new Audio(`Assets/Notes/play.mp3`);
    audio.play();
}