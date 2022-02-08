---
layout: post
title: Hunting for a Bluey episode with AI
subtitle: Looking for a throw-away TV recommendation in a prolific podcast
tags: [code]
mathjax: false
author: pjl
banner: bluey.png
banner_alt: A frame from the Bluey episode 'Chest' (S3E11). Bluey, Bingo and Bandit are setting up a chess board, and Bingo had just asked 'Where's the dice?', and Bandit's resigned internal sigh cracks me up every time... 
excerpt: >
    I've been listening to the Syntax podcast for the last few months, and I was very surprised that in one episode they recommended a great Bluey episode.
    Though I forgot which episode contained the recommendation.
    As I'm teaching deep-learning later in the year, I thought I'd use this as an example of using Python & ML to side-step a long and tedious manual search for it.
---

## Problem

I've been enjoying listening to the [Syntax Web Development](https://syntax.fm) podcast in the last few months, and I was very surprised that in one episode the hosts went way off-track to recommended a great [Bluey](https://www.imdb.com/title/tt7678620/) episode. Bluey is a phenomenal kids show, and it's even based in the part of Australia that I used to lived in (Brisbane, Queensland) so I enjoy all the background references to Brisbane that pop up in the show.

About a month after the podcast episode, I decided to watch that recommended Bluey episode.
But I couldn't remember which Bluey episode was recommended, nor could I remember which Syntax episode the hosts went on this tangent about children's TV.
The podcast releases new episodes at a furious rate, and the episodes go for about 30 mins to an hour.
I couldn't find any transcripts of the episodes provided by the hosts, and after a few days of intermittently relistening to old episodes to find that section, I gave up.

As I'm teaching deep-learning later in the year, I thought I'd use this as an example of using Python & machine learning to side-step a long and tedious manual search for this information.

## Downloading the podcast episodes

Python has a package for everything, so my first reaction was to Google "Python package to download podcast episodes", and this returned a bunch of libraries focusing on this specific task.
However, none of them worked as intended.
After testing a few different packages, and variously getting some kind of HTTP or file-system errors, I gave up on this approach (I think either the packages were tested on Mac while I am currently stuck on Windows, or my anti-virus was intercepting the requests).

Eventually, I remembered that podcasts are just defined as RSS feeds, which are just text files which have links to where to find each episode as an MP3.
So, I just opened up the podcast homepage and found the [RSS link](http://feed.syntax.fm/rss) and searched for ".mp3" to manually download the last few episodes.

For example, here is a chunk of the RSS file:

```html
...
<enclosure length="58157223" type="audio/mpeg" url="https://traffic.libsyn.com/secure/syntax/Syntax_-_428.mp3?dest-id=532671" />
<itunes:duration>01:00:31</itunes:duration>
...
```

## Trying various free Speech-To-Text solutions

### Got some rough transcript using Mozilla's DeepSpeech

In the past I used [Mozilla's DeepSpeech](https://deepspeech.readthedocs.io/en/r0.9/?badge=latest) software to convert speech to text for free.
This is a pre-trained neural network model which can process the podcast audio files and generate transcripts for the episodes.
I didn't want to run the conversion on my local computer, so I found an [example Jupyter Notebook on Google Colab](https://colab.research.google.com/github/tugstugi/dl-colab-notebooks/blob/master/notebooks/MozillaDeepSpeech.ipynb) which did something similar (it transcribed YouTube videos with DeepSpeech) and adapted it.

After a few quick adjustments to the example notebook (using '!wget <url/to/podcast>.mp3' instead of the YouTube video downloading, and updating the DeepSpeech version numbers to the latest pre-trained models) I could get some automatically generated transcripts.

However the output was so error-prone rate that is was mostly garbage.
For example, episode 428 starts with (here I am transcribing manually):

```
You're listening to Syntax, the podcast with the tastiest web development treats out there. Strap yourself in and get ready, here is Scott Tolinski and Wes Bos.
```

whereas the auto-generated transcript for this introduction was:

```
resorting to santa bianca with its tastes we toiletries out there strap yourself in and get ready personality and west boss egadean as ...
```

Admittedly, this introduction is played over the top of some music and in an unusual delivery, so I wouldn't expect too much for this section.
And later, for the technical discussions about Javascript and Typescript etc., I hadn't expected a generic speech-to-text method to work well on those parts of the episodes.

### Looking for nearly-perfect transcripts, a la YouTube's auto-captions

When recording lectures for my students in 2020, I found that YouTube's auto-captioning worked miracles.
I would simply upload my lecture recording to YouTube, wait until their machines got around to auto-generating the captions (usually within a few hours), download the AI transcripts and adjust the infrequent error if needed.
The DeepSpeech output was nowhere near the level of accuracy that YouTube could do.

Presumably, YouTube was running [Google's Speech API](https://cloud.google.com/speech-to-text/) in the background.
As Google (and the comparable offers from Microsoft and Amazon) only allowed a relatively short amount of audio to be transcribed for free as part of a trial period, I couldn't use this to solve my podcast problem.

I did use [ffmpeg](https://www.ffmpeg.org/) to turn one of the podcast episodes from an audio file to a video file, which I uploaded to YouTube (as a private video, now deleted) in order to [download the auto-captions](https://support.google.com/youtube/answer/2734705?hl=en#); this created one transcript with almost no errors.
For example, the subtitle file (in the '.srt' file format) for episode 427 starts with:

```
1
00:00:01,120 --> 00:00:07,120
monday monday monday open wide dev fans

2
00:00:04,720 --> 00:00:09,519
get ready to stuff your face with

3
00:00:07,120 --> 00:00:11,679
javascript css node modules barbecue

4
00:00:09,519 --> 00:00:14,080
tips get workflows break dancing soft

5
00:00:11,679 --> 00:00:16,800
skills web development the hastiest the

6
00:00:14,080 --> 00:00:19,680
craziest the tastiest web development

7
00:00:16,800 --> 00:00:24,240
treats coming in hot here is wes
```

Even though this worked very well, I dared not repeat this process for the month's worth of podcasts in case YouTube banned me for breaking some terms of service (or in case the Syntax guys sued me or something).
In any case, it wouldn't be a great example of utilising deep learning for my future students.
While converting the audio to video, I did try the auto-captioning available in [Camtasia](https://www.techsmith.com/video-editor.html) (since I just coincidentally installed the software). This generated garbage outputs, potentially worse than Deep Speech.

### Taking another go at DeepSpeech

Upon returning to DeepSpeech, I thought that the obvious next step would be to _fine-tune_ the model so that it would become great at recognising just the voices of the two hosts on the Syntax podcast.
The DeepSpeech documentation has [a guide to fine-tuning](https://deepspeech.readthedocs.io/en/v0.9.3/TRAINING.html#fine-tuning-same-alphabet) the speech models.
So I manually transcribed the first few minutes of the latest Syntax episode, with the idea of feeding in the audio & transcript to the fine-tuning process.
However, I found this really great [discussion about fine-tuning with a small dataset](https://discourse.mozilla.org/t/fine-tuning-with-limited-data-questions-on-fine-tuning-in-general/68014) and basically abandoned this direction; I didn't have the patience to produce hours of transcripts that appeared necessary for this approach to pay-off.
Other parts of the Mozilla forums did mention that [Coqui STT](https://stt.readthedocs.io/en/latest/index.html) may be a better alternative to DeepSpeech, though I didn't want to give up on it just yet.

Looking around the Mozilla forums a bit more gave me an important insight.
I didn't need a speech model that recognised _every word_ the podcasts hosts spoke, but in fact I just needed something that would find the word "Bluey" in a long audio file.
Alexa, Cortana, and Siri act in exactly this way.
They are always listening to us, but normally they are just listening for their specific _wake words_ like "Hey Siri, ..." or "Alexa, ...".
If I could add "Bluey" as a kind of wake-word, I'd be set, and the newest DeepSpeech versions have a similar concept called [hot word boosting](https://deepspeech.readthedocs.io/en/master/HotWordBoosting-Examples.html) which appears to make the model more sensitive to picking up specific words.

After all of this reading and mucking around, I thought I better just try the obvious thing first, and just run the unaltered/vanilla DeepSpeech on the last month's worth of podcasts and check that "Bluey" didn't already appear in the mostly gibberish auto-generated transcripts.
Here is the [Jupyter Notebook]({%link /notebooks/Using_DeepSpeech_on_Podcasts.ipynb %}) I wrote to run this process.

From the example Jupyter notebook I was really happy/shocked to find that the Jupyter exclamation mark syntax, which is used to call Linux command-line programs, could be integrated into Python code.
So to download and transcribe the latest batch of episodes, I could simply run:

``` python
for episodeNumber in range(427, 406, -1):
  podName = f"Syntax_-_{episodeNumber}"
  if not exists(podName + ".mp3"):
    url = f"https://traffic.libsyn.com/secure/syntax/{podName}.mp3"
    !wget {url}
    !ffmpeg -i {podName}.mp3 {podName}.wav
    !deepspeech --model deepspeech-0.9.3-models.pbmm --scorer deepspeech-0.9.3-models.scorer --audio {podName}.wav
```

I left Google Colab to feed the recent podcast episodes into DeepSpeech in reverse order, and after I returned from lunch I found Colab had kicked me off due to inactivity, but beforehand it had processed 14 episodes:

```
Inference took 366.552s for 1359.543s audio file.
Inference took 1305.095s for 3634.286s audio file.
Inference took 276.029s for 1119.660s audio file.
Inference took 449.628s for 1574.165s audio file.
Inference took 1329.048s for 3324.264s audio file.
Inference took 34.462s for 164.963s audio file.
Inference took 344.598s for 1372.630s audio file.
Inference took 82.053s for 24347.887s audio file.
Inference took 468.245s for 1808.327s audio file.
Inference took 1119.990s for 3788.669s audio file.
Inference took 272.974s for 1148.056s audio file.
Inference took 1129.176s for 3481.417s audio file.
Inference took 532.887s for 1995.677s audio file.
Inference took 1180.540s for 3843.344s audio file.
```

Searching for "blue" in the sludge of error-filled text that was generated, I did find 

```
... like one example is bluely or kissed favours the world is blue and bethabara characters is a buoy oh i intoshes know that my kids go bananas for it mykenai's very cute were ...
```

towards the end of episode 417. After relistening to that part of the episode, I found this is exactly what I was looking for! 
It was the [Flat Pack episode](https://blueypedia.fandom.com/wiki/Flat_Pack) that was recommended (S2E24).
Now that I just watched it, I agree it was quite a good episode!
It should have been a 'sick pick' haha.

## Conclusions

What did I learn from this experience?

- I need to remember to solve the simplest version of the problem (here I needed to find the word "Bluey", not get perfect transcripts for the episodes).
- That we get used to great machine-learning algorithms, like the YouTube automatic captioning system, and forget that problems like speech-to-text are _really hard_ to solve.
- I should be sceptical of small Python packages which are just dumped on the Python package index.
- That the 'automated'/AI solution can be slower than the manual version (here, I certainly could have relistened to a month's worth of podcasts faster than solving this problem with software; heck, I probably could have watched all of Bluey in this time!).