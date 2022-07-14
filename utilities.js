/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
const {Queue, Track} = require('discord-player');
const {MessageEmbed} = require('discord.js');

const MINUTES_TO_SECONDS = 60;
const HOURS_TO_SECONDS = MINUTES_TO_SECONDS * 60;
const DAYS_TO_SECONDS = HOURS_TO_SECONDS * 24;

/**
 * It parses 00:00:00 into seconds
 * @param {String} timestamp
 * @return {number}
 */
function timeStampToSeconds(timestamp) {
  const semiCount = (timestamp.match(/:/g) || []).length;
  const splits = timestamp.split(':');

  let seconds = parseInt(splits[semiCount]);
  if (semiCount >= 1) {
    const minutes = parseInt(splits[semiCount - 1]);
    seconds += minutes * MINUTES_TO_SECONDS;
    if (semiCount >= 2) {
      const hours = parseInt(splits[semiCount - 2]);
      seconds += hours * HOURS_TO_SECONDS;
      if (semiCount >= 3) {
        const days = parseInt(splits[semiCount - 3]);
        seconds += days * DAYS_TO_SECONDS;
      }
    }
  }
  return seconds;
}

/**
 * It returns number into 00:00:00 or 00:00 format
 * @param {number} endTime
 * @param {number} seconds
 * @return {string}
 */
function secondsToTimeStamp(endTime, seconds) {
  if (endTime >= HOURS_TO_SECONDS) {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  } else {
    return new Date(seconds * 1000).toISOString().slice(14, 19);
  }
}

/**
 * Get wait time of newest Track
 * @param {Queue} queue
 * @return {string}
 */
function waitTime(queue) {
  const totalQueueTime = queue.totalTime / 1000;
  const currentTrackCurrentTime = timeStampToSeconds(queue.getPlayerTimestamp().current);
  const currentTrackEndTime = timeStampToSeconds(queue.getPlayerTimestamp().end);
  const currentTrackPlayTime = currentTrackEndTime - currentTrackCurrentTime;
  const newestTrack = queue.tracks.at(-1);
  const newestTrackDuration = newestTrack.durationMS / 1000;
  const waitTime = totalQueueTime + currentTrackPlayTime - newestTrackDuration;
  console.log(waitTime);

  return secondsToTimeStamp(waitTime, waitTime);
}
/**
 * Gets total duration time of track array
 * @param {Track[]} tracks
 * @return {string}
 */
function playlistDuration(tracks) {
  let totalTime = 0;
  tracks.forEach((element) => {
    totalTime += element.durationMS;
  });
  totalTime /= 1000;

  return secondsToTimeStamp(totalTime, totalTime);
}

module.exports = {
  timeStampToSeconds,
  secondsToTimeStamp,
  waitTime,
  playlistDuration,
};
