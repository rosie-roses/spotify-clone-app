export function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (
        seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
}

export function formatFollowers(followers) {
    if (followers >= 1_000_000_000) {
        return (followers / 1_000_000_000).toFixed(1) + 'B';
    } else if (followers >= 1_000_000) {
        return (followers / 1_000_000).toFixed(1) + 'M'; 
    } else if (followers >= 1_000) {
        return (followers / 1_000).toFixed(1) + 'K'; 
    } else {
        return followers.toString();
    }
}

export function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}