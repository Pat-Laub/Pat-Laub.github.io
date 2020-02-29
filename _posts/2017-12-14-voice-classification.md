---
layout: post
title: Who is it?
subtitle: Playing with machine learning to classify voices
tags: code math ml
author: pjl
banner: spectra.jpg
banner_alt: Spectra for a voice actor
excerpt: >
       Someone calls you on the phone, and within a few words you can work out who it is. Can a computer do this just as accurately? For a bit of fun, and to practice some machine learning, I made to program which does this. I give the program a few minutes of recorded speech from 13 people to learn from originally, and it can tell from a few seconds of speech who is speaking with an accuracy of 95% (using Mathematica) to 97% (using Python).
---

# Problem

Someone calls you on the phone, and within a few words you can work out who it is. Can a computer do this just as accurately? For a bit of fun, and to practice some machine learning, I made to program which does this. I give the program a few minutes of recorded speech from 13 people to learn from originally, and it can tell after a few seconds who is speaking with an accuracy of 95% (using Mathematica) to 97% (using Python). I like this problem since it's a task that humans (without the benefit of caller-id) often fail at.

# Input data

Since I am addicted to [audiobooks](http://www.audible.com), it seemed natural to use the first few minutes of different audiobooks for this experiment; specifically, I took:
- [The Elements of Eloquence](https://www.audible.com/pd/Self-Development/The-Elements-of-Eloquence-Audiobook/B00O1GCA5M) by Mark Forsyth, narrated by Don Hagen
- [Learn German with Paul Noble](https://www.audible.com/pd/Language-Instruction/Learn-German-with-Paul-Noble-Part-1-Audiobook/B00A2XEA0Q/) by Paul Noble
- [Homo Deus](https://www.audible.com/pd/Nonfiction/Homo-Deus-Audiobook/B01HH0PH6M) by Yuval Noah Harari, narrated by Derek Perkins
- [The Industrial Revolution](https://www.audible.com/pd/History/The-Industrial-Revolution-Audiobook/B00NMPA3P2) by Professor Patrick N. Allitt
- [On China](https://www.audible.com/pd/History/On-China-Audiobook/B0050ISJPA) by Henry Kissinger, narrated by Nicholas Hormann
- [Lolita](https://www.audible.com/pd/Fiction/Lolita-Audiobook/B0032N2TYC/) by Vladimir Nabokov, narrated by Jeremy Irons
- [Beyond Good and Evil](https://www.audible.com/pd/Nonfiction/Beyond-Good-and-Evil-Audiobook/B004TBQRKS) by Friedrich Nietzsche, narrated by Steven Crossley
- [Outliers](https://www.audible.com/pd/Nonfiction/Outliers-Audiobook/B002UZDRK8/) by Malcolm Gladwell
- [The Red Queen](https://www.audible.com/pd/Science-Technology/The-Red-Queen-Audiobook/B004J1CQC6) by Matt Ridley, narrated by Simon Prebble
- [William Shakespeare: Comedies, Histories, and Tragedies](https://www.audible.com/pd/Classics/William-Shakespeare-Comedies-Histories-and-Tragedies-Audiobook/B00DJ7ITC2) by Professor Peter Saccio
- [The Economics of Uncertainty](https://www.audible.com/pd/Self-Development/The-Economics-of-Uncertainty-Audiobook/B00XP35LM6) by Professor Connel Fullenkamp

This collection is somewhat eclectic --- I mainly chose these since they had narrators with distinctive voices (to make my task easier), and I took the chance to throw in some books I love (e.g. Elements of Eloquence, Homo Deus, and Peter Saccio's course on Shakespeare).

After I showed this to my partner-in-crime Vivian, she asked about two potential flaws: i) as voice actors, these samples are from people who are paid to speak very clearly, perhaps the program would break with normal people talking, ii) is the program somehow dependent on English to work. So, we recorded ourselves dictating from different books, Viv from the Mandarin edition of Homo Deus and myself from [Computer Age Statistical Inference](https://web.stanford.edu/~hastie/CASI/) by Efron & Hastie.

# Data wrangling: downgrading quality

After recording, I found it took 607 MB of space to store, so I downgraded the quality of the audio to match the quality of a telephone call (8 kHz) and converted everything from stereo to mono --- this reduced the space footprint to 54.2 MB. The following Mathematica code does this quality downgrading:

<details>
<summary>Show/hide code</summary>
{% gist Pat-Laub/41d7d5380a9693c37991e845ae15f3b9 down_sample.nb %}
</details>

Now the first 3 second chunk of each voice looks like:

![image]({% link /images/start_of_each.gif %}){: .image .post_image}

# Data wrangling: converting to spectral density estimates

More importantly, I transformed the input from the 3 second audio slices to their [spectral density estimates](https://en.wikipedia.org/wiki/Spectral_density_estimation). Since I wanted to separate voices, I didn't care really __what__ each person was saying, but just __how__ they were saying it, and the spectral density gives this information --- it tells us which frequencies a person's voice favours (e.g. do they have squeaky-high voice, or a deep rumble). Without this transformation, none of the algorithms had an accuracy greater than 11-12% (with 13 voices, simply guessing at random would given an accuracy of 7.69%).

<details>
<summary>Show/hide: how to read a spectral density graph</summary>
When we speak, we generate a lot of frequencies at once, and we tend to use some unique range of frequencies more than others. This is why we can say the same words as each other but sound different, it's our "voice fingerprint" if you like. A spectral density graph shows how much power (i.e. how loud) we give to all the available frequencies.

Imagine hearing two extreme voices: a loud and deep voice (e.g. Darth Vader), or a quiet and high-pitched voice (e.g. a squeaky librarian). If you recorded their voice, and looked at their spectral densities, you'd see something like:

<div markdown="1">
   ![image]({% link /images/cartoon_spectrum.jpg %}){: .image .post_image}
</div>

Which one is the red and which is the blue? Vader uses deeper tones, which means lower frequencies, so his spectral curve will have a peak on the left side. As he bellows louder than a librarian, we'd expect his spectral curve to be higher as a general fact. So, Vader would generate the red curve.
</details>

One 3 second chunk's spectral density looks like:

![image]({% link /images/individual_spectrum.gif %}){: .image .post_image}

All of the spectra for each 3 second chunk of Don Hagen's _The Elements of Eloquence_ plotted together looks like:

![image]({% link /images/eloquence_spectra.gif %}){: .image .post_image}

Similarly, the spectra of Paul Noble's _Learn German_ together looks like:

![image]({% link /images/german_spectra.gif %}){: .image .post_image}

My hypothesis was that a machine learning algorithm could tell the difference between the 13 plots like this.

<details>
<summary>Show/hide code</summary>
{% gist Pat-Laub/41d7d5380a9693c37991e845ae15f3b9 split_and_spectral_estimate.nb %}
</details>

To be honest, I thought the spectra shown above were far too spiky. Spectral density estimation is a fiddly business (as is probability density estimation --- see our [great new paper](https://arxiv.org/abs/1711.11218) on this :P), as you can choose how smooth you want the estimates to look (by setting the size of the rolling window used). I originally thought that the above spikiness was just noise, and used the following smoother spectra for _The Elements of Eloquence_ but found it didn't perform as well as the above plots:

![image]({% link /images/smooth_eloquence_spectra.gif %}){: .image .post_image}

Another avenue I considered, was stripping the pauses in speech from the input. This seemed to slightly reduce accuracy (though I should test this again with the final setup) --- then I realised there was useful information in the different ways the speakers paused (e.g. between sentences) that should not be thrown away.

# Preparing for a machine learning test

Next, I needed to split the data into a training and test set. This proved to be quite cumbersome --- and I'm a bit surprised Mathematica has nothing for this built-in.[^1] I split the 75% of the data into the training set, and the last 25% to the test set, with the split done randomly but also stratified across each different voice.

<details>
<summary>Show/hide code</summary>
{% gist Pat-Laub/41d7d5380a9693c37991e845ae15f3b9 train_test_stratified_split.nb %}
</details>

# Classifying

If we just run the most hands-free classification (the level of simplicity of this is very impressive) we do the following.

<details>
<summary>Show/hide code</summary>
{% gist Pat-Laub/41d7d5380a9693c37991e845ae15f3b9 simple_classifer.nb %}
</details>

This creates a classifier in 1.92 secs which has an accuracy of 94.54%. I got Mathematica to print some details of the fitted classifier, and of the confusion matrix over the test set:

![image]({% link /images/builtin_classifier_info.png %}){: .image .post_image}

![image]({% link /images/builtin_confusion.gif %}){: .image .post_image}

At first I thought: i) this could just be a lucky split of the data, and ii) "logistic regression is nothing fancy.."; so I tried all the different built-in methods and ran with 10 different random train-test splits of the data.

<details>
<summary>Show/hide code</summary>
{% gist Pat-Laub/41d7d5380a9693c37991e845ae15f3b9 multiple_classifiers.nb %}
</details>

Remarkably, logistic regression turns out to be best option (without playing with any of the method's hyper-parameters). The following box plots show the accuracies over the different test runs for each method:

![image]({% link /images/different_methods.gif %}){: .image .post_image}

In summary, logistic regression is the best options with an average of 95.76% accuracy, followed by a neural network (94.54%) and a random forest (91.88%).

# In Python

I tried to pry into the classifiers which Mathematica had created for me, but found it to be almost impossible. So, I exported the data so that I could compare with Python's ML options.

<details>
<summary>Show/hide code</summary>
{% gist Pat-Laub/41d7d5380a9693c37991e845ae15f3b9 export_data.nb %}
</details>

The resulting CSV file is [available here]({% link /data/audioData.csv %}) if you'd like to have a play with this.

The Python code to recreate these results is much simpler --- [scikit-learn](http://scikit-learn.org/) has a function which does the randomized shuffle training/test split which took 30 lines of Mathematica earlier:

<details>
<summary>Show/hide code</summary>
{% gist Pat-Laub/41d7d5380a9693c37991e845ae15f3b9 voices.py %}
</details>

This code reports an average accuracy of 97.21%, a slight improvement over the Mathematica.

# Conclusion

While this exercise didn't delve into great details of the available methods (we did quite well with just default hyper-parameters!), I did learn a few things in the process.

1. The quality of the input data is crucial to success.
2. Mathematica has very nice support for audio editing, and Python's support for routine ML operations is impressive.
3. Sometimes it's not the sexiest ML algorithm which wins.

I'll probably come back to this example when I get time to explore it further.

[^1]: Please get in touch if you know a better way to do this!
