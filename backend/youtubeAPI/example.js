const fs = require('fs');
const ytdl = require('ytdl-core');
const xml2js = require('xml2js');
const he = require('he');

async function getSubtitles(videoUrl) {
    try {
        const fetch = (await import('node-fetch')).default;
        const info = await ytdl.getInfo(videoUrl);
        const tracks = info.player_response.captions.playerCaptionsTracklistRenderer.captionTracks;
        if (tracks && tracks.length > 0) {
            const englishTrack = tracks.find(track => track.languageCode === 'en' || track.languageCode === 'en-US');
            if (englishTrack) {
                const subtitlesUrl = englishTrack.baseUrl;
                const subtitlesXml = await fetch(subtitlesUrl).then(res => res.text());

                // Convert XML to JSON
                const parser = new xml2js.Parser();
                const subtitlesJson = await parser.parseStringPromise(subtitlesXml);
                const subtitles = subtitlesJson.transcript.text.map(textObj => ({
                    start: textObj.$.start,
                    dur: textObj.$.dur,
                    text: he.decode(textObj._)
                }));


                fs.writeFileSync('subtitles.json', JSON.stringify(subtitles, null, 4), 'utf-8');
                console.log('Subtitles downloaded and saved as subtitles.json');
            } else {
                console.log('No English captions found for this video.');
            }
        } else {
            console.log('No captions available for this video.');
        }
    } catch (error) {
        console.error('Error downloading subtitles:', error);
    }
}

// Example video URL
const videoUrl = 'https://www.youtube.com/watch?v=T4CB5RPbtCk';
getSubtitles(videoUrl);