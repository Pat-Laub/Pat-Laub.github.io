---
layout: post
title: Chaos theory meets C++
subtitle: What I've been working on recently, and a request for code review
tags: [code, math]
mathjax: true
author: pjl
banner: edm-youtube.png
banner_alt: A screenshot from the Sugihara youtube video showing off the Lorenz butterfly attractor
excerpt: >
    I've been working on a plugin for Stata which implements [Empirical Dynamic Modelling](https://www.researchgate.net/publication/317339714_Empirical_dynamic_modeling_for_beginners), a stats tool with the funnily misleading acronym EDM. Have you ever heard the line "correlation does not equal causation"? Well EDM aims to fix that.
---

Since starting at Uni Melbourne, I've been working on a plugin for Stata which implements [Empirical Dynamic Modelling](https://jinjingli.github.io/edm), a stats tool with the funnily misleading acronym EDM.
Have you ever heard the line "correlation does not equal causation"?
Well EDM aims to fix that.
It looks at data and can actually determine that some $X$ thing is causally influencing some other thing $Y$ in a potentially nonlinear & complicated way.
There are some pretty nice Youtube videos outlining the method:

<p>
<iframe width="560" height="315" class="image" src="https://www.youtube.com/embed/fevurdpiRYg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>
<p>
<iframe width="560" height="315" class="image" src="https://www.youtube.com/embed/NrFdIz-D2yM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>
<p>
<iframe width="560" height="315" class="image" src="https://www.youtube.com/embed/QQwtrWBwxQg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>


The opportunities created with such a tool are pretty impressive.
In the [Stata journal paper](https://jinjingli.github.io/edm/edm-wp.pdf) we wrote, there's an example linking the effect of the weather on the amount of crime.
Also, we have quite a lot of data on people's emotions measured over a few weeks or so (participants answered a survey which popped up on their phone frequently).
We're going to try to analyse this, to look at what's causing a person's mood to change, and how one might nudge them into a better/happier mental state.
This gif shows some of this data animated; it plots some combination of overall postive feelings on the $x$ axis (PA = "positive affect") and some summary of the negative feelings on the $y$ axis for some person over time.
It's quite hypnotising to watch these animations; some of them show really bimodal distributions, which may possibly be a manifestation of bipolar disorder.

![image]({% link /images/emotions.gif %}){: .image .post_image}

The plugin's [homepage](https://jinjingli.github.io/edm/) hosts installation instructions & some documentation.
While our Stata Journal paper really goes into detail about the method, there's another paper [EDM for beginners](https://www.researchgate.net/publication/317339714_Empirical_dynamic_modeling_for_beginners) which is also a good place to start.

If you're a software developer, I'd be interested in hearing any feedback or suggestions for this codebase!
The plugin is written in C++, and was recently made public on [Github](https://github.com/EDM-Developers/EDM).

To describe the computational side of EDM, I'll butcher this beautiful theory (it is based on chaos theory & geometry, things I don't fully understand myself) to give you a basic programmer-friendly overview. Say we have some data measured every day, e.g. daily temperature, or the number of crimes committed each day. EDM takes this raw data, which let's say looks like

$$ [1, 2, 3, 4, 5, 6] $$

and breaks it into little overlapping chunks using a rolling window, for example

$$
\begin{align*}
&[1,2,3], \\
&[2,3,4], \\
&[3,4,5], \\
&[4,5,6].
\end{align*}
$$

This collection is call the time-delayed or reconstructed manifold.
The main computational part of EDM is to calculate the nearest neighbours between combination of rows in this manifold, i.e. between each of these mini-trajectories.
Sometimes, after finding the neighbours, we throw these into a matrix and solve a classic $A \mathbf{x} = \mathbf{b}$ linear system of equations (using SVD), but most of the time this is quite fast compared to the nearest neighbour search.

The plugin is working well, and the performance is pretty good since it is multi-threaded. The plugin is a dynamically linked library, and Stata provides us a crude C API to read data from & save data to itself.

We support Mac OS, Windows, and Linux (tested on Ubuntu) on x86 and also ARM on Mac. So when Stata installs the plugin, it downloads 3 binaries for Mac (a universal binary), Windows & Linux, and loads the correct one given the current OS. If, for any reason, these binaries can't load, then there's a pure-Stata backup implementation which will kick in; this is much slower and it is only single-threaded.

This setup, and some of our own UX goals, provides some difficult restrictions on the codebase:

- any change to the C++ output must exactly match the pure-Stata backup implementation,
- crashes like segfaults are particularly terrible, since our code runs inside the original Stata process, so a crash will wipe out any data and results inside the current Stata process,
- we stick to header-only libraries for our dependencies; if we relied on dynamically-loaded dependencies then we'd have to distribute a huge bunch of DLLs for each OS & instruction set & etc; also, the build process of Apple Universal Binaries is significantly harder with DLL dependencies,
- we try not to have any dependencies at all for the user; e.g. we don't want to force users of the package to go install the Visual Studio C runtime, or tell them to open a terminal and run "brew install libomp" something or other,
- we want the Stata interface to not freeze while the calculations progress, and to see some visual indication of the progress inside Stata,
- we want the main compilers, clang, gcc & msvc, to all handle the code without issues.

This leads to some compromises in the code which I fear is a bit ugly. For example, to add multi-threading I would have hoped to just use OpenMP. We're sharing a process with Stata and Stata itself has loaded a version of OpenMP, and if you try to initialise OpenMP twice (probably two different versions) in one process then everything goes to hell:

_OMP: Error #15: Initializing libomp.dylib, but found libomp.dylib already initialized.
OMP: Hint This means that multiple copies of the OpenMP runtime have been linked into the program. That is dangerous, since it can degrade performance or cause incorrect results. The best thing to do is to ensure that only a single OpenMP runtime is linked into the process, e.g. by avoiding static linking of the OpenMP runtime in any library. As an unsafe, unsupported, undocumented workaround you can set the environment variable KMP_DUPLICATE_LIB_OK=TRUE to allow the program to continue to execute, but that may cause crashes or silently produce incorrect results. For more information, please see http://openmp.llvm.org_

My solution was to adapt some simple [thread pool implementation](https://github.com/jhasse/ThreadPool/blob/master/ThreadPool.hpp) which directly manages C++11 std::threads, though this just feels a bit hacky to me.

Another trouble I had was just creating a matrix in C++ as these aren't built-in. E.g. I would like to be able to write something like:

{% highlight c++ %}
double[] data = { ... };

std::matrix A(data, numRows, numCols);

for (int i = 0; i < A.numRows; i++) {
  for (int j = 0; j < A.numCols; j++) {
    A[i, j] += A[j, i];
  }
}
{% endhighlight %}

This is impossible due to a design flaw in the C++ language, where this "[ ]" indexing can't take two arguments.

Even having a data structure which just holds a pointer to matrix data, and stored the dimensions of the matrix, and provides 'A(i, j)' indexing is slightly a pain. I found that there's proposal for future C++ versions to support an 'mdspan' for this case, and the Kokkos team has an [reference implementation](https://github.com/kokkos/mdspan) which I used. However this mdspan is a bit clunky, adds a lot of files which need to be compiled, and it makes any OpenACC versions of the code fail to compile with "[variableName] referenced in target region does not have a mappable type".

It'd be ideal to have the plugin use a GPU if it is found to be attached, or to run using SIMD vector instructions on those CPUs which have this capability. However, if we compile a binary which has some fancy SIMD instructions and a user runs it on their older machine, we'll crash both the plugin & Stata with an "illegal instruction" error. The only way around this which I can imagine is to JIT-compile the plugin after it is downloaded, though this sounds like it'd be a nightmare to implement...
