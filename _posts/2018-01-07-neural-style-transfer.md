---
layout: post
title: On neural style transfer
subtitle:
tags: code
author: pjl
banner: qwave.jpg
banner_alt: Myself in the style of Caspar David Friedrich
excerpt: >
    Neural Style Transfer is a technique for transforming an image (like this photo of the seascape in Qingdao) into the style of another image, typically a painting (here the style is of Hokusai's 'Great Wave off Kanagawa').
---


I've been playing around with _Neural Style Transfer_ (NST) for a while, and after sharing some creations with friends I got two questions: "how did you make this?" and "can you explain a bit about what is happening here?". So, this post will do both.

After explaining the [basic premise of NST](#what-is-neural-style-transfer), I'll give [some relevant background](#some-background) on neural networks, describe [the NST algorithm](#the-nst-algorithm), and outline [the specific steps for generating these](#what-specific-steps-did-i-take-to-make-the-images).

# What is Neural Style Transfer?

Neural Style Transfer is a technique for transforming an image called the _content image_ into the style of another image, typically a painting, called the _style image_. The banner above shows an example where the content image, a photo of the seascape in Qingdao, is

![image]({% link /images/qingdao.jpg %}){: .image .post_image}

and the style image is Hokusai's _The Great Wave off Kanagawa_

![image]({% link /images/wave.jpg %}){: .image .post_image}

Another example is

![image]({% link /images/ninja-wanderer.png %}){: .image .post_image}

where the content is this photo of myself (looking a bit like a ninja) hiking in Greenland in 2016

![image]({% link /images/ninja.jpg %}){: .image .post_image}

with the style of my favourite painting Wanderer above the Sea of Fog by Caspar David Friedrich (1818):

![image]({% link /images/wanderer.jpg %}){: .image .post_image}

This is the algorithm in progress:

![image]({% link /images/ninja.gif %}){: .image .post_image}

# Some background

I'll start this explanation with a bit of AI history (I got some historical details from this interesting article [The data that transformed AI research—and possibly the world](https://qz.com/1034972/the-data-that-changed-the-direction-of-ai-research-and-possibly-the-world/)).

In 2009 Fei-Fei Li, now the chief scientist at Google Cloud, released for free online a gigantic database of [3.2 million images](http://image-net.org/explore) called ImageNet. Each image also contained a label describing the contents of the image, specifically, specifying which category the image belonged to out of thousands of different categories, like "car mirror", "cello", "guacamole", "kimono", "prison" etc. This spawned the _ImageNet competition_.

From 2010, the ImageNet competition has been a yearly ritual to see which AI researchers can make an algorithm that _classifies_ images the best. The competition organisers take researchers' programs, asks each program to label the contents of some random images from the ImageNet database, and declares the winner to be the program which gives the correct label the highest fraction of the time (where "correct" means the label given by some poor humans on [Amazon's Mechanical Turk](https://www.mturk.com/)).[^2]

The winning submission of the 2012 competition, created by Geoffrey Hinton's team in Montréal, caused a sea-change in AI. It used deep convolutional neural networks, which is a variant of the relatively ancient idea (that is, from the 80's) of neural networks designed specifically for image data.

All neural networks involve taking some input, like an image, and smacking it with gigabytes of uninterpretable number crunching and hoping the output is something sensible, like a label saying what is the content of the image. The computations are done in layers, like in the following figure:

![image]({% link /images/fully_connected_nn.png %}){: .image .post_image}
Image credit: [^1]

Here, we read from left-to-right, that some input numbers get turned into different numbers in the "hidden layer 1", which get turned into another collection of number in "hidden layer 2", etc. The numbers are called "activations", since the original inventors of this technique stole the main idea and the terminology from neurobiologists (the neurons in our brains consider inputs, from our senses or other neurons, and "activate" sending an electric signal to other brain regions).

One main criticism of neural networks is that, while it's obvious they are _learning something_ (they win competitions like ImageNet), we have almost no idea about _what specifically are they learning_. The whole thing is a mysterious magical black-box with a punchy name. For example, at a conference in Barcelona last year I heard an AI researcher declare that he would never get into a self-driving car since he knew that no-one can possibly understand what the car's neural networks were thinking!

![image](https://imgs.xkcd.com/comics/machine_learning.png){: .image .post_image}

One solution is to try to understand what each individual neuron in the network is trying to learn. The idea is, if we see one neuron which has very large activations when the network fed pictures of dogs, then we conclude this neuron's task is to tell the network whether a dog is in the photo. Actually, it's not quite an on/off switch, but really the neuron gives a number (its "activation" level) which is the "dogginess" level of the photo being shown - dogs get a huge activation number, cats and other furry four-legged animals get a moderate-sized activation, kimono and cacti (and everything else that doesn't look like a dog) get a small activation.

This beautiful [Distill article](https://distill.pub/2017/feature-visualization/) explain some sophisticated methods for generating images which really excite one designated neuron. They interpret the neurons in a convolution neural network called _GoogLeNet_[^3] which has been trained to classify images from ImageNet.

The following images have been generated to excite neurons in level named "conv2d0":

![image]({% link /images/edges.png %}){: .image .post_image}

So, it looks like the neurons here are recognising if the input image has edges or lines in different angles. In the layer named "mixed3a" the stimulating images are:

![image]({% link /images/textures.png %}){: .image .post_image}

Now they're getting interesting! The neurons here look like they're finding whether the image has different textures in it. The images for the layer "mixed4a" are:

![image]({% link /images/patterns.png %}){: .image .post_image}

This layer is deciding whether the image has elements of these psychedelic patterns.

Eventually, wee see that neurons in layers "mixed4d" and "mixed4e" get stimulated by recognisable objects. This neuron appears to quantify the level of 'building-yness' in the image.

![image]({% link /images/object_building.png %}){: .image .post_image}

The next looks like it's recognising ants or bugs.

![image]({% link /images/object_ant.png %}){: .image .post_image}

And finally, the anticipated dog-iness neuron:

![image]({% link /images/object_dog.png %}){: .image .post_image}

The [appendix](https://distill.pub/2017/feature-visualization/appendix/) to that Distill article has more of these really funky generated images.

An important detail, is the general trend that layers in the network which are earlier (further to the left in the figure above) recognise simple features, and later layers (further to the right) recognise more complicated features.

# The NST algorithm

The style of a painting can be determined by feeding the painting's photo into a well-trained neural network, like that described above. The network will produce some output describing what it thinks the painting's contents are (e.g. it might output "dog" if the painting is a realistic depiction of a dog) but we simply ignore this. What we are interested in are the activations of the network at different layers.

At the early layers of the network, the neurons which correspond to smooth textures (like those produced by brushstrokes) will be highly activated, and neurons which respond to different colours will activate in response to the colours of the painting. Collectively, I'll call the activation levels for the painting to be the _style activations_. In the same way, we will find the _content activations_, which are the activations of the neurons of the network when the content image is inputted to it.

The NST algorithm tries to make an image whose activations are similar to both the style and the content activations.
It starts with an image where the pixels are set randomly (this looks like the "white noise" you see on an out-of-tune old-school television), then it calculates the activation levels for this initial image. Using the magic of neural networks (specifically, the back-propagation algorithm) we can generate a new image whose activations are slightly more similar to the content activations and the style activations. If we continue taking more and more of these small steps (about 1000 iterations), then we end up with an output image like those above!

To be honest, the details of how the style image's activations are used is not so simple. This is where the neural network's convolutional structure begins to be handy. Convolutional NN's work by scanning across the input image side-to-side and top-to-bottom, and producing activations for each subregion of the image. The NST algorithm considers each pair of neurons, over each subregion of the image, and calculates the correlation of their activations. This correlation is the _style_ which the algorithm attempts to mimic in the output image. The original paper can be read on [arXiv](https://arxiv.org/pdf/1508.06576v2.pdf).

# What specific steps did I take to make the images?

My first experience generating these transfers was during one of Andrew Ng's Coursera courses, called [Convolutional Neural Networks](https://www.coursera.org/learn/convolutional-neural-networks/). One of the assignments is to write an implementation of NST, so I generated the hiking style transfer above within the Jupyter notebook for this assignment. This was convenient, as I didn't need to install Tensorflow, Keras, and the other Python dependences for image manipulation (e.g. Pillow) which can take a little while.

However this method was phenomenally slow, since the Jupyter notebook was running just on a CPU. Also, this method required all images to be 400x300 resolution which is too small for 21st century sensibilities. I wanted to try training this on a GPU, so I followed this [remarkably clear guide](https://hackernoon.com/launch-a-gpu-backed-google-compute-engine-instance-and-setup-tensorflow-keras-and-jupyter-902369ed5272) on how to rent[^4] a virtual machine on Google Cloud which has access to an NVIDIA GPU.

Then I simply created the style transfers using this [Github repo](https://github.com/anishathalye/neural-style); I also needed to downloaded the 1.2 GB ImageNet-trained neural network to my Google Cloud virtual machine, but this only took about a minute.

Running on a GPU was about 40 times faster than on my laptop's CPU. This speed-up was essential, since it took a lot of failed attempts to find some settings for the algorithm to create good style transfers.

# Parameters for the algorithm

Admittedly, I'm spent a long time generating images with different settings to produce just a few decent style transfers. It seems there aren't many styles which are appropriate for the purpose; the best I could find were: the Great Wave, Starry Night, and Wanderer Above the Sea of Fog.

The number of iterations to give the algorithm is also difficult, since it's often the case that earlier iterations create a more striking image (100 to 300 iterations) which has some strange pixelation artifacts, whereas later iterations (1000 or more iterations) are very clean but with less of the desired style.

There is a parameter describing the relative importance of matching the style versus matching the content, but also inside the style component you need to specify the relative importance of the different layers. Trying combinations of this can be a tedious process.

One frustrating matter is that if you perform two NST's on the same pair of content & style, except the resolution of the two content images is different, then you'll get wildly different outputs for the same settings.

For example, when using a small resolution content image I get

![image]({% link /images/qwave_small.jpg %}){: .image .post_image}

but with a larger resolution

![image]({% link /images/qwave.jpg %}){: .image .post_image}

and with an even larger resolution

![image]({% link /images/qwave_large.jpg %}){: .image .post_image}

But anyway, I hope this was interesting for you! Let me know if you had a different experience in the comment section below.

# Footnotes

[^1]: This figure is from the free online book [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/chap6.html).
[^2]: Actually, it's a collection of challenges, and some require the programs to say exactly which part of the image contains the detected object.
[^3]: The meaning of this odd name is because the network was made by Google and inspired by an earlier net called _LeNet_ by Yann LeCun.
[^4]: For first-time users, you get <span>$</span>400 worth of credit for free, so I haven't need to pay for this so far. One thing the guide skipped was that you need to email Google to request the GPU for your VM, then load your account with about <span>$</span>40 of credit to prove you're serious about the request, and wait 1-2 days for a human to approve the request.