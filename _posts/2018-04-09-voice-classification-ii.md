---
layout: post
title: Getting towards 100%
subtitle: Extensions to my voice classification project
tags: code math ml
author: pjl
banner: accuracy_gauge.png
banner_alt: Accuracy speedometer, adapted from https://github.com/siannce/HTML5-canvas-projects/tree/master/speedometer
excerpt: >
       The biggest difficulty, in my opinion, with machine learning problems is after you've got a working solution. You're staring at some accuracy figure, say 95%, and wondering 'how high can this go?' There are a huge number of options for that next step.
---

_If you haven't read my original post on this machine learning problem, quickly [__check it out first__]({{ site.baseurl }}{% post_url 2017-12-14-voice-classification %})._

The biggest difficulty, in my opinion, with machine learning problems is after you've got a working solution. You're staring at some accuracy figure, say 95%, and wondering 'how high can this go?' There are a huge number of options for that next step. For this specific voice classification problem, I could:
- Make the problem simpler: increase the duration of the input utterances, increase the quality of the inputs (increase the sampling frequency, make the recordings cleaner), increase the fraction of samples which go to the training set rather than the test set
- Change algorithms: swap out logistic regression for more sophisticated forms of neural networks (deep fully-connected perceptron, or a unidirectional or bidirectional sequence model)
- Perform error analysis: look at the failed cases and try to spot some patterns there, try to replicate the classification manually (_in vivo_ rather than _in silico_) to get an estimate of human-level error (an approximation of Bayes' error)
- Play with the optimiser: try out the latest fancy new momentum-based algorithms
- Massage the data a bit more: pull out more advanced features from the recordings to feed into the classifier, perform a different kind of spectral analysis

I had felt that conducting an error analysis was the most sensible next step, but I hesitated as it seemed like a rather tedious chore (and this project was done mainly for the fun of it). Also, I had thought an error analysis would be unfair to the classifier.

The classifier just views the utterances as a soup of different audio frequencies, whereas I could discern the meaning of the recorded words. Since each voice is talking on a distinct topic, I could probably identify many utterances based on _what the voices were saying_ rather than on _how they said it_ (for example, any utterance where I heard "Dolores" was probably from the voice actor for _Lolita_ whereas "Zhou Enlai" would be from the voice for _On China_). I'd thought that I could make the recordings play backwards to compensate for this, but then I had a better idea. Why not use some machine learning to try to understand the speech of each utterance?

For this, I converted the utterances into text, then the text into a quantitative form of 'meaning' using _word embeddings_.

# What are word embeddings?

A word embedding is a list of numbers which tries to capture the meaning of a word, and link it to related words.

As a toy example, let's invent a simple word embedding which gives two numbers to each word: a "big-ness" number (representing the size of the word), and a "human-ness" number (representing how human-like the word is).

The numbers won't correspond to any real 'units' or measurements, they just need to be large numbers or small numbers _relative to other word embeddings_ in a sensible way. A monster-truck is bigger than a scooter, so its "big-ness" number (80) is much larger than the scooter's (1). Both of these are not humans, so their "human-ness" numbers are small (5 and 0), whereas the adjectives slim and fat often refer to humans so their numbers are larger (95 and 85).


For example:

word | "big-ness" | "human-ness"
:---: | :---: | :---:
scooter | 1 | 5
monster-truck | 80 | 0 |
slim | 5 | 95
fat | 75 | 75

One can download a huge table like the one above, which covers millions of words (rows) and constructs word embeddings which have 300 numbers in them (columns). There are algorithms, like the GloVe algorithm, which construct these embeddings just by reading over huge amounts of text (like the entirety of Wikipedia) and the columns which are generated don't have any easily understandable meaning like "big-ness". It's the irony of this technique that we try to understand the _meaning_ of a word by turning it into a list of _meaningless_ (for a human) numbers.

# Results using Mozilla's deepspeech and Facebook Research's word embeddings

For my example, I took each short utterance and fed it into a [Mozilla's speech-to-text neural network](https://github.com/mozilla/DeepSpeech/) (an implementation of [Baidu's Deep Speech paper](https://arxiv.org/abs/1412.5567)), then collected the word embedding for each word that was spoken (excluding boring words like "the", "a", "it", so-called stop words), and just took an average of word embeddings. This created a vector of length 300 which roughly corresponds to the _meaning_ of the utterance, whether those few seconds of speech were talking about morality or genetics or poetry, etc.

I thought that, if I were to use these averaged embeddings as 300 input features for the original classification problem, then it would be superior to the original approach based on spectral densities. The results, as it turned out, were disappointing. When this process was complete the test accuracy was 40%, much better than the 7.7% (1 in 13) accuracy that purely guessing would give us, but far lower than the spectral approach's 95% accuracy.

Without much hope of success, I tried to fit a logistic regression to the original spectral features concatenated to the word embedding averages, and found that adding the embeddings did not appear to improve accuracy. I guess that a combined classifier is what is needed, where the word embedding classifier only used to classify the inputs which the spectral density classifier isn't confident about.

# Debugging the beautiful but failed approach

The overall error in this approach in two parts: i) in the process of generating the transcripts from the audio, and ii) in the prediction of the speaker from the transcripts (via word embeddings).

which are needed to calculate the word embeddings. The DeepSpeech algorithm provided _character-by-character_ output not _word-by-word_ output. As such, it would often misspell words, or put two words together. Since the utterances often began or ended during a spoken word, the first and last "words" in the transcripts were usually gibberish. Here are a randomly chosen transcript from each of the speakers:

- ikwerjuggout translated and adaptedfre
- so dont worry about it just let it go
- seeking to prolong their lives a little and somewhat
- an american puritan might say brother
- chase copyeditefthe manuscript with care
- i can come up a ton dress
- fact bring it about that the spirit would not so easily
- disease wolf desodded to invest
- and particularly andegety brand of this that is
- produce therefore free will itself is
- scription of an audience and a shakespeare pla
- lending and trading that connect people in us
- bocaseensisolishthopiolsolde

(This last transcript was from Vivian speaking Mandarin, and the DeepSpeech network was trained on English so from the beginning I obviously didn't expect her audio test cases to work at all.)

To check the accuracy of Deep Speech, I fed it the entire (roughly 4-5 minute) audio recording for the start of _The Elements of Eloquence_ audiobook and compared the generated transcript with one I corrected by hand. The following is the [wdiff](https://www.systutorials.com/docs/linux/man/1-wdiff/) output for about the first quarter of the full transcript:

_these formulas <span style="color:red">[-wehtoughtu-]</span> <span style="color:blue">{+were thought up+}</span> by the ancient greeks and then added to by the romans as shakespeare <span style="color:red">[-said-]</span> <span style="color:blue">{+set+}</span> to work england was busy having the <span style="color:red">[-renasance-]</span> <span style="color:blue">{+renaissance+}</span> everybody else had had the <span style="color:red">[-renesincea-]</span> <span style="color:blue">{+renaissance a+}</span> century or so before and we were running late so the classical works on <span style="color:red">[-redericwerejug-]</span> <span style="color:blue">{+rhetoric were dug+}</span> out translated and adapted for use in english but it wasnt the <span style="color:red">[-end theiansuerthe-]</span> <span style="color:blue">{+enthymemes or the+}</span> topics or even the <span style="color:red">[-bacilonsthat-]</span> <span style="color:blue">{+baculums that+}</span> the english <span style="color:red">[-light-]</span> <span style="color:blue">{+liked+}</span> we loved the figures the flowers of <span style="color:red">[-bretoricas-]</span> <span style="color:blue">{+rhetoric as+}</span> they were <span style="color:red">[-call-]</span> <span style="color:blue">{+called+}</span> hence the garden of eloquence because as a nation we were at the time rather obsessed with poetry so shakespeare learned and learned and got better and better and his lines became more and more striking and more and more memorable but most of his great and famous lines are simply examples of the ancient formulas i can smile and murder while i smile was not handed to shakespeare by god its just an example of <span style="color:red">[-diacapy-]</span> <span style="color:blue">{+diacope+}</span>_

Looking at the whole transcript, it has a [word error rate](https://martin-thoma.com/word-error-rate-calculation/) of 12.13% which isn't too bad. If I concatenate all the transcripts for each utterance and do the same comparison the result is a 17.50% word error rate, so the fact that we separate the utterances in the middle of a word being spoken adds a small but noticeable error.

The second main reason this approach failed is that a few seconds of transcript really doesn't contain enough information to tell the speakers apart. Perhaps changing which word embeddings I used would produce a tiny increased in accuracy, but I doubt this is worth the effort. I used the embeddings generated by [Facebook Research's fastText algorithm](https://github.com/facebookresearch/fastText) on the Wikipedia corpus, obtained by this [Python library](https://github.com/chakki-works/chakin),

# Finally doing the error analysis for the original spectral analysis approach

As it turned out, the error analysis was pretty painless and I found some obvious flaws. When I originally recorded the audiobooks, I hadn't always cropped the silence before the speakers began and after they finished properly. Simply removing the first and last utterances of each speaker from the training and test sets improved test accuracy by 1-2%.

The other simple adjustment was to handle long pauses that the voice actors put in between paragraphs. As some utterances were almost entirely silence, then the task of classifying which speaker they were generated by became nearly impossible. When writing the first post on this problem, I had tried to preprocess the audio recordings to remove stretches of silence, but found this didn't help with the accuracy (I also had thought the length of each pause may itself be predictive). It's tragic to think how close I was to the right solution! After some experimenting, it turned out that if I truncated every long pause over 0.75 secs long into a pause which was exactly 0.75 secs long, then test accuracy was again boosted slightly.

# Ideas for further improvements

While doing the error analysis I realised that when I rerecorded the audio I had almost certainly had the volume too high and clipped the sound waves.