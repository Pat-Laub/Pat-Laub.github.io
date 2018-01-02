---
layout: post
title: Cross-entropy example
subtitle: Minimising Rastrigin’s function
tags: [math, monte carlo]
author: pjl
banner: math6006/rast.gif
banner_alt: Rastrigin's function
excerpt: >
    Cross-entropy, when used for optimization, is almost like a genetic algorithm.
    It creates a sequence of distributions which describe the location and certainty of
    the unknown minimum.
---
Problem
=======

Consider minimising the test function – named Rastrigin’s function –
defined by

$$S(x) = 20 + x_1^2 + x_2^2 - 10\cos(2\pi x_1) - 10\cos(2\pi x_2).$$

This is how it looks:
![image](/images/math6006/rastrigin.png){: .image .post_image}

One cross-entropy approach could be as follows.


Formulation
===========

State that

$$S(x^*) = \gamma^* = \max_{ x\in {\mathbb{R}}^2} S(x).$$

Consider a family of pdfs
$\\{ f(\cdot\,; v) : v \in \mathcal{V} \\}$ on
${\mathbb{R}}^2$. We will construct a sequence of pdfs

$$(f(\cdot\,; u), f(\cdot\,; v_1), f(\cdot\,; v_2), \dots, f(\cdot\,; v_N))$$

which start with parameter $u=v_0$ and aim
to converge on the zero-variance distribution whose mass is on the point
$x^*$. In order to do this, we need to be able to solve
the program:

$$\boldsymbol{v}_t = \underset{ v}{\arg\max} \, \frac{1}{N} \sum_{i=1}^N I_{\\{S(X_i) \geq \hat{\gamma}_t\\}} \ln f(X_i; v) $$

where the $\{ X_i \}  {\overset{\text{iid}}{\sim}} f(\cdot\,; v_{t-1})$.

Though this is simpler when $v_t$ is viewed as the
maximum likelihood estimates (MLEs) of $\\{ X_i \\}$, which
is known analytically for many distributions.
In this case we’ve chosen $f$ to be of family of bivariate normal
distributions, i.e.

$$f(x; v_i) = f(x; (\mu_i, \Sigma_i)) = (2\pi)^{-1} \Sigma_i^{-1/2} \exp \left\{ -\frac{1}{2} (x-\mu_i)^t \Sigma_i^{-1} (x-\mu_i) \right\}.$$

The MLEs for $\mu_i$ and $\Sigma_i$ given some data
$\\{ X_i\\}$ is simply the sample mean and the sample
covariance matrix respectively.

Implementation
==============

These are the samples evolving over time.
![image](/images/math6006/rast.gif){: .image .post_image}

For those samples, these are the multivariate normal distributions which are fitted to the elite samples.
![image](/images/math6006/rastImpDens.gif){: .image .post_image}

The objective function drops across iterations.
![image](/images/math6006/progress.jpg){: .image .post_image}

This is the same plot as above but on a log scale.
![image](/images/math6006/progress2.jpg){: .image .post_image}